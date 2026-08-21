import React from 'react'
import { ItemPredictorAnalytics } from '../types/game'
import { Clock, Target, ShieldCheck, ShieldAlert, Layers } from 'lucide-react'

interface NextItemPredictorProps {
  prediction?: ItemPredictorAnalytics
  gpm: number
}

export const NextItemPredictor: React.FC<NextItemPredictorProps> = ({
  prediction,
  gpm,
}) => {
  if (!prediction || !prediction.next_core_item) return null

  const { game_stage, next_core_item, situational_items } = prediction
  const isReady = next_core_item.remaining_gold === 0

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3.5 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-600/30 to-indigo-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Next Slot Advisor
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Build Pacing &amp; Predictive Timing
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-slate-900/80 text-cyan-300 border border-cyan-500/20">
          {game_stage}
        </span>
      </div>

      {/* Main Core Target Item */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col gap-2.5 transition-all ${
          isReady
            ? 'bg-emerald-950/30 border-emerald-500/40 shadow-glow-cyan'
            : 'bg-slate-950/70 border-white/10'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center font-black text-sm text-cyan-300 shadow-md flex-shrink-0">
              {next_core_item.display_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Core Recommendation
                </span>
              </div>
              <h4 className="text-base font-black text-white leading-tight">
                {next_core_item.display_name}
              </h4>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 font-mono">
            <span className="text-xs font-black text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
              {next_core_item.cost.toLocaleString()}g
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              {next_core_item.is_safe_with_buyback ? (
                <span className="text-emerald-400 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> Safe BB
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-0.5">
                  <ShieldAlert className="w-3 h-3" /> Uses BB Gold
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar & ETA */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {isReady ? (
                <span className="text-emerald-400 font-bold">READY TO PURCHASE</span>
              ) : (
                <span>
                  ETA: <strong className="text-cyan-300">{next_core_item.eta_formatted}</strong>{' '}
                  <span className="text-slate-400">(@ {gpm} GPM)</span>
                </span>
              )}
            </span>
            <span className="text-slate-300 font-bold">
              {isReady ? '100%' : `${next_core_item.progress_pct}% (${next_core_item.remaining_gold}g left)`}
            </span>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isReady
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                  : 'bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500'
              }`}
              style={{ width: `${Math.max(3, next_core_item.progress_pct)}%` }}
            />
          </div>
        </div>

        {/* Reason Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {next_core_item.reason}
        </p>

        {/* Tags */}
        {next_core_item.tags && next_core_item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {next_core_item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Situational Counters Section */}
      {situational_items && situational_items.length > 0 && (
        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-400" /> Situational Counters &amp; Pivots
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {situational_items.map((alt) => (
              <div
                key={alt.item_id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between gap-1.5 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200">{alt.display_name}</span>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-2 mt-0.5">
                      {alt.reason}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 ml-2">
                    {alt.cost}g
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
                  <span className="text-cyan-300">{alt.eta_formatted}</span>
                  <div className="flex gap-1">
                    {alt.tags.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[9px] text-slate-300 bg-slate-800/80 px-1.5 py-0.2 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
