import React, { useState } from 'react'
import { ProcessedGameState } from '../types/game'
import { Volume2, VolumeX, Sun, Moon, Play, Square, FastForward, Sliders, Trophy } from 'lucide-react'
import { soundEngine } from '../audio/soundEngine'

interface HeaderProps {
  gameState: ProcessedGameState
  isSocketConnected: boolean
  onOpenSoundSettings?: () => void
  onOpenDebrief?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  isSocketConnected,
  onOpenSoundSettings,
  onOpenDebrief,
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted())
  const [isMockRunning, setIsMockRunning] = useState(false)
  const [mockSpeed, setMockSpeed] = useState(2.0)

  const toggleSound = () => {
    const nextState = !isMuted
    soundEngine.setMuted(nextState)
    setIsMuted(nextState)
    if (!nextState) {
      soundEngine.playTone(660, 0.15, 'sine', 0.2)
    }
  }

  const startMockSimulation = async () => {
    try {
      await fetch('http://127.0.0.1:4000/api/v1/mock/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed: mockSpeed, start_time: -30 }),
      })
      setIsMockRunning(true)
    } catch {
    }
  }

  const stopMockSimulation = async () => {
    try {
      await fetch('http://127.0.0.1:4000/api/v1/mock/stop', { method: 'POST' })
      setIsMockRunning(false)
    } catch {
    }
  }

  return (
    <header className="glass-panel sticky top-0 z-40 px-5 py-3.5 mb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black tracking-widest text-lg shadow-glow-cyan">
          D2
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              DOTA 2 INSIGHT
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              v1.5 PRO
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            {gameState.is_connected ? `Match: ${gameState.match_id || 'Active'}` : 'Offline • Push Protocol Standby'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-sm">
          {gameState.is_daytime ? (
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
          <span className="font-bold text-white tracking-wider">{gameState.formatted_clock}</span>
          <span className="text-slate-500 text-xs">|</span>
          <span className="text-xs font-bold text-emerald-400">{gameState.radiant_score}</span>
          <span className="text-xs text-slate-500">:</span>
          <span className="text-xs font-bold text-rose-400">{gameState.dire_score}</span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-white/5">
          {isMockRunning ? (
            <button
              onClick={stopMockSimulation}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Mock
            </button>
          ) : (
            <button
              onClick={startMockSimulation}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Mock
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono px-1.5">
            <FastForward className="w-3 h-3 text-slate-500" />
            <select
              value={mockSpeed}
              onChange={(e) => setMockSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-slate-300 outline-none cursor-pointer"
            >
              <option value="1.0" className="bg-slate-900">1x</option>
              <option value="2.0" className="bg-slate-900">2x</option>
              <option value="5.0" className="bg-slate-900">5x</option>
              <option value="10.0" className="bg-slate-900">10x</option>
            </select>
          </div>
        </div>

        {onOpenDebrief && (
          <button
            onClick={onOpenDebrief}
            title="Open Post-Match Debrief"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-xs font-mono font-bold"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Debrief</span>
          </button>
        )}

        {onOpenSoundSettings && (
          <button
            onClick={onOpenSoundSettings}
            title="Open Audio Deck Settings"
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-white/5 transition-all"
          >
            <Sliders className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute Audio Cues' : 'Mute Audio Cues'}
          className={`p-2.5 rounded-xl border transition-all ${
            isMuted
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 shadow-glow-cyan'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isSocketConnected
                ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]'
                : 'bg-rose-500 animate-ping shadow-[0_0_10px_#f43f5e]'
            }`}
          />
          <span className="text-xs font-mono text-slate-300">
            {isSocketConnected ? (gameState.is_connected ? 'LIVE GSI' : 'STANDBY') : 'DISCONNECTED'}
          </span>
        </div>
      </div>
    </header>
  )
}
