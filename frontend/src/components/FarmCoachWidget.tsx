import React from 'react'
import { FarmCoachAnalytics } from '../types/game'
import { TrendingUp, Clock, Lightbulb } from 'lucide-react'

interface FarmCoachWidgetProps {
  coach?: FarmCoachAnalytics
  clockTime: number
}

export const FarmCoachWidget: React.FC<FarmCoachWidgetProps> = ({ coach }) => {
  if (!coach) return null

  const {
    grade,
    efficiency_pct,
    target_cs,
    cs_delta,
    target_net_worth,
    net_worth_delta,
    is_stack_window,
    stack_countdown_seconds,
    tactical_tips,
  } = coach

  const getGradeStyle = (g: string) => {
    switch (g) {
      case 'S+':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-glow-amber'
      case 'S':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-cyan'
      case 'A':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      case 'B':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
    }
  }

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3.5 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Farm Velocity Coach
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Immortal Benchmark Pacing
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Grade:</span>
          <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider border shadow-md ${getGradeStyle(grade)}`}>
            {grade} PACE ({efficiency_pct}%)
          </span>
        </div>
      </div>

      {/* Target Comparison Grid */}
      <div className="grid grid-cols-2 gap-2 font-mono text-center">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase">Target CS (Immortal)</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-slate-300">{target_cs} CS</span>
            <span className={`text-xs font-black ${cs_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {cs_delta >= 0 ? `+${cs_delta}` : `${cs_delta}`}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/5 flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase">Target Net Worth</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-slate-300">{target_net_worth.toLocaleString()}g</span>
            <span className={`text-xs font-black ${net_worth_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {net_worth_delta >= 0 ? `+${net_worth_delta}g` : `${net_worth_delta}g`}
            </span>
          </div>
        </div>
      </div>

      {/* Camp Stacking Alert Window */}
      {is_stack_window ? (
        <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 flex items-center justify-between text-xs font-mono animate-pulse shadow-glow-amber">
          <span className="font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> STACK WINDOW ACTIVE (:53 PULL)
          </span>
          <span className="font-black">PULL CAMPS NOW</span>
        </div>
      ) : (
        stack_countdown_seconds > 0 && (
          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-[10px] uppercase">Next Camp Stack Window:</span>
            <span className="text-cyan-300 font-bold">in {stack_countdown_seconds}s (:53 mark)</span>
          </div>
        )
      )}

      {/* Tactical Tips */}
      {tactical_tips && tactical_tips.length > 0 && (
        <div className="pt-1 border-t border-white/5 flex flex-col gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" /> Tactical Pacing Notes
          </span>
          {tactical_tips.map((tip, idx) => (
            <p key={idx} className="text-xs text-slate-300 leading-relaxed font-sans pl-1 border-l-2 border-indigo-500/40">
              {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
