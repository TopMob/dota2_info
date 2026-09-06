import React from 'react'
import { NeutralAdvisorAnalytics } from '../types/game'
import { Sparkles, Clock, Compass } from 'lucide-react'
import { DotaImage } from './common/DotaImage'
import { getItemAsset } from '../utils/dotaAssets'

interface NeutralAdvisorWidgetProps {
  advisor?: NeutralAdvisorAnalytics
  clockTime: number
}

const formatSeconds = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const NeutralAdvisorWidget: React.FC<NeutralAdvisorWidgetProps> = ({ advisor }) => {
  if (!advisor) return null

  const {
    current_tier,
    target_tier,
    seconds_to_next_tier,
    equipped_item_name,
    has_neutral_equipped,
    tier_statuses,
    top_suggestions,
  } = advisor

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3.5 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Neutral Items Advisor
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Tier Timings &amp; Hero Synergy Ranking
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/90 text-emerald-300 border border-emerald-500/20">
            {current_tier > 0 ? `Tier ${current_tier} Active` : 'Tier 1 Prep'}
          </span>
        </div>
      </div>

      {/* Tier Timeline Progress Bubbles */}
      <div className="grid grid-cols-5 gap-1.5 font-mono text-center">
        {tier_statuses.map((ts) => {
          const isCurrent = ts.tier === target_tier
          return (
            <div
              key={ts.tier}
              className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                ts.is_unlocked
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 shadow-glow-amber animate-pulse'
                  : 'bg-slate-950/50 border-white/5 text-slate-600'
              }`}
            >
              <span className="text-[10px] font-black uppercase">T{ts.tier}</span>
              <span className="text-[9px] font-bold mt-0.5">
                {ts.is_unlocked ? 'UNLOCKED' : formatSeconds(ts.seconds_remaining)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Equipped Item & Next Tier Countdown Banner */}
      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Equipped:</span>
          {has_neutral_equipped && (
            <div className="w-6 h-5 rounded overflow-hidden border border-emerald-500/40 flex-shrink-0">
              <DotaImage
                asset={getItemAsset(equipped_item_name)}
                className="w-full h-full object-cover"
                aspectRatio="item"
              />
            </div>
          )}
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              has_neutral_equipped
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {equipped_item_name}
          </span>
        </div>

        {seconds_to_next_tier > 0 && (
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3 text-cyan-400" />
            Next Tier in: <strong className="text-cyan-300">{formatSeconds(seconds_to_next_tier)}</strong>
          </span>
        )}
      </div>

      {/* Top Suggestions for Hero */}
      <div className="pt-1 flex flex-col gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" /> Top Tier {target_tier} Picks For Your Hero
        </span>

        <div className="flex flex-col gap-2">
          {top_suggestions.map((item) => (
            <div
              key={item.item_id}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col gap-1 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px] flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
                    #{item.rank}
                  </span>
                  <div className="w-7 h-5 rounded overflow-hidden border border-white/10 flex-shrink-0 bg-slate-950">
                    <DotaImage
                      asset={getItemAsset(item.item_id, item.name)}
                      className="w-full h-full object-cover"
                      aspectRatio="item"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                  {item.stat_bonus}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug font-sans pl-7">
                {item.synergy_reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
