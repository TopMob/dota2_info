import React from 'react'
import { TacticalTimer, NeutralAdvisorAnalytics, TormentorAnalytics } from '../types/game'
import { NeutralAdvisorWidget } from './NeutralAdvisorWidget'
import { TormentorWidget } from './TormentorWidget'
import { Timer, Droplets, Coins, Zap, BookOpen, Flower2, Shield, Skull, SunMedium, Trees, AlertTriangle } from 'lucide-react'

interface TimersColumnProps {
  timers: TacticalTimer[]
  clockTime: number
  neutralAdvisor?: NeutralAdvisorAnalytics
  tormentor?: TormentorAnalytics
}

const getTimerIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'water':
      return <Droplets className="w-4 h-4 text-cyan-400" />
    case 'bounty':
      return <Coins className="w-4 h-4 text-amber-400" />
    case 'powerup':
      return <Zap className="w-4 h-4 text-indigo-400" />
    case 'wisdom':
      return <BookOpen className="w-4 h-4 text-purple-400" />
    case 'lotus':
      return <Flower2 className="w-4 h-4 text-pink-400" />
    case 'neutral':
      return <Shield className="w-4 h-4 text-emerald-400" />
    case 'tormentor':
      return <Skull className="w-4 h-4 text-rose-400" />
    case 'day':
    case 'night':
      return <SunMedium className="w-4 h-4 text-amber-300" />
    case 'stack':
      return <Trees className="w-4 h-4 text-blue-400" />
    default:
      return <Timer className="w-4 h-4 text-slate-400" />
  }
}

const formatSeconds = (sec: number) => {
  if (sec <= 0) return 'NOW'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return `${s}s`
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const TimersColumn: React.FC<TimersColumnProps> = ({
  timers,
  clockTime,
  neutralAdvisor,
  tormentor,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-200">
            Tactical Timers
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded-md">
          {timers.length} Active
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {timers.map((timer) => {
          const isCritical = timer.urgency === 'critical_10s' || timer.urgency === 'active'
          const isWarning = timer.urgency === 'warning_30s'

          let containerStyle = 'glass-panel hover:border-white/20'
          let badgeStyle = 'bg-slate-800/80 text-slate-300 border-white/5'

          if (isCritical) {
            containerStyle = 'glass-panel-urgent border-rose-500/60 shadow-glow-red animate-pulse-fast'
            badgeStyle = 'bg-rose-500/30 text-rose-200 border-rose-500/50'
          } else if (isWarning) {
            containerStyle = 'glass-panel border-amber-500/40 shadow-glow-gold'
            badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }

          return (
            <div
              key={timer.id}
              className={`p-3 rounded-xl transition-all duration-300 flex flex-col gap-1.5 ${containerStyle}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-900/90 border border-white/5 flex items-center justify-center">
                    {getTimerIcon(timer.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white tracking-tight">
                        {timer.name}
                      </span>
                      {isCritical && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans leading-tight line-clamp-1">
                      {timer.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`font-mono text-base font-black px-2.5 py-0.5 rounded-lg border tracking-wider ${badgeStyle}`}
                  >
                    {formatSeconds(timer.remaining_seconds)}
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-1000 ${
                    isCritical
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                      : isWarning
                      ? 'bg-gradient-to-r from-amber-400 to-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                  }`}
                  style={{
                    width: `${Math.max(5, Math.min(100, 100 - (timer.remaining_seconds / 300) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )
        })}

        {timers.length === 0 && (
          <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-xs font-mono">
            Waiting for match clock synchronization...
          </div>
        )}
      </div>

      <NeutralAdvisorWidget advisor={neutralAdvisor} clockTime={clockTime} />
      <TormentorWidget tormentor={tormentor} clockTime={clockTime} />
    </div>
  )
}
