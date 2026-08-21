import React from 'react'
import { RoshanAnalytics } from '../types/game'
import { Skull, ShieldAlert, Sparkles, CheckCircle2, Clock } from 'lucide-react'

interface RoshanCardProps {
  roshan: RoshanAnalytics
  clockTime: number
}

const formatClock = (seconds?: number | null) => {
  if (seconds == null) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const RoshanCard: React.FC<RoshanCardProps> = ({ roshan, clockTime }) => {
  const isAegisHeld = roshan.status === 'aegis_held'
  const isRespawnWindow = roshan.status === 'respawn_window'
  const isGuaranteed = roshan.status === 'respawn_guaranteed'

  let statusBadge = (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
      <CheckCircle2 className="w-3.5 h-3.5" /> ALIVE
    </span>
  )

  if (isAegisHeld) {
    statusBadge = (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse">
        <ShieldAlert className="w-3.5 h-3.5" /> AEGIS ACTIVE
      </span>
    )
  } else if (isRespawnWindow || isGuaranteed) {
    statusBadge = (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold animate-pulse-fast">
        <Clock className="w-3.5 h-3.5" /> RESPAWN WINDOW
      </span>
    )
  }

  const aegisRemaining = roshan.aegis_expires_clock ? Math.max(0, roshan.aegis_expires_clock - clockTime) : 0

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Skull className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">Roshan Command</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Kill #{roshan.death_count} recorded
            </p>
          </div>
        </div>
        {statusBadge}
      </div>

      {isAegisHeld && (
        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-amber-300 font-bold">Aegis of the Immortal</span>
            <span className="text-amber-200">{aegisRemaining}s left</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-1000"
              style={{ width: `${Math.max(0, Math.min(100, (aegisRemaining / 300) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {(isRespawnWindow || isGuaranteed) && (
        <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase">Min Window (8m)</span>
            <p className="text-sm font-bold text-white mt-0.5">{formatClock(roshan.min_respawn_clock)}</p>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/80 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase">Max Guaranteed (11m)</span>
            <p className="text-sm font-bold text-rose-400 mt-0.5">{formatClock(roshan.max_respawn_clock)}</p>
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Next Drop Forecast
        </span>
        <div className="flex flex-wrap gap-1.5">
          {roshan.expected_drops.map((drop, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-200 border border-white/10"
            >
              {drop}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
