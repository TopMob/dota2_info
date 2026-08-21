import { useState, useEffect, useRef, useCallback } from 'react'
import { ProcessedGameState, WSMessage, InAppAlertItem } from '../types/game'
import { soundEngine } from '../audio/soundEngine'

const INITIAL_STATE: ProcessedGameState = {
  is_connected: false,
  match_id: null,
  game_time: 0,
  clock_time: 0,
  formatted_clock: '00:00',
  game_state: 'DOTA_GAMERULES_STATE_INIT',
  is_daytime: true,
  is_paused: false,
  radiant_score: 0,
  dire_score: 0,
  hero: {
    hero_id: null,
    hero_name: 'Unknown',
    hero_display_name: 'Waiting for Match',
    level: 1,
    alive: true,
    respawn_seconds: 0,
    health: 0,
    max_health: 0,
    health_percent: 100,
    mana: 0,
    max_mana: 0,
    mana_percent: 100,
    active_debuffs: [],
  },
  economy: {
    gold: 0,
    gold_reliable: 0,
    gold_unreliable: 0,
    net_worth: 0,
    gpm: 0,
    xpm: 0,
    last_hits: 0,
    denies: 0,
    cs_per_min: 0,
    buyback_cost: 0,
    buyback_cooldown: 0,
    buyback_status: 'READY',
    gold_surplus: 0,
    gold_deficit: 0,
  },
  roshan: {
    status: 'alive',
    state_end_seconds: 0,
    death_count: 0,
    expected_drops: ['Aegis of the Immortal'],
  },
  timers: [],
  damage: {
    total_hero_damage: 0,
    dpm: 0,
    breakdown: {
      physical_damage: 0,
      physical_pct: 60,
      magical_damage: 0,
      magical_pct: 35,
      pure_damage: 0,
      pure_pct: 5,
    },
    defense: {
      armor: 3.0,
      physical_reduction_pct: 15.0,
      magic_resistance_pct: 25.0,
      pure_vulnerability_pct: 100.0,
    },
  },
  item_prediction: {
    game_stage: 'Early Game / Laning',
    next_core_item: null,
    situational_items: [],
  },
  items: {},
  abilities: {},
}

export function useWebSocket(url: string = 'ws://127.0.0.1:4000/ws/live-feed') {
  const [gameState, setGameState] = useState<ProcessedGameState>(INITIAL_STATE)
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)
  const [alerts, setAlerts] = useState<InAppAlertItem[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const pingIntervalRef = useRef<number | null>(null)

  const addAlert = useCallback((title: string, label: string, urgency: 'normal' | 'warning' | 'critical') => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const newAlert: InAppAlertItem = {
      id,
      title,
      label,
      urgency,
      timestamp: Date.now(),
    }
    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)])
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id))
    }, 6000)
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        setIsSocketConnected(true)
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('ping')
          }
        }, 10000)
      }

      ws.onmessage = (event) => {
        if (event.data === 'pong') return

        try {
          const msg: WSMessage = JSON.parse(event.data)

          if (msg.type === 'INITIAL_STATE' || msg.type === 'GAME_STATE_UPDATE') {
            setGameState(msg.payload as ProcessedGameState)
          } else if (msg.type === 'SOUND_CUE') {
            const cue = msg.payload as { sound_id: string; label: string; urgency: string }
            soundEngine.playCue(cue.sound_id)
            addAlert('TACTICAL ALERT', cue.label, (cue.urgency as 'normal' | 'warning' | 'critical') || 'warning')
          } else if (msg.type === 'TIMER_ALERT') {
            const timerAlert = msg.payload as { name: string; label: string }
            addAlert('TIMER WARNING', timerAlert.label || timerAlert.name, 'warning')
          }
        } catch {
        }
      }

      ws.onclose = () => {
        setIsSocketConnected(false)
        wsRef.current = null
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect()
        }, 2000)
      }

      ws.onerror = () => {
        ws.close()
      }
    } catch {
      setIsSocketConnected(false)
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect()
      }, 3000)
    }
  }, [url, addAlert])

  useEffect(() => {
    connect()
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  return {
    gameState,
    isSocketConnected,
    alerts,
    dismissAlert,
  }
}
