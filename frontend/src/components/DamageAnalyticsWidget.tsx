import React from 'react'
import { DamageAnalytics } from '../types/game'
import { Swords, Flame, Sparkles, Wand2, Shield, Activity } from 'lucide-react'

interface DamageAnalyticsWidgetProps {
  damage?: DamageAnalytics
}

export const DamageAnalyticsWidget: React.FC<DamageAnalyticsWidgetProps> = ({ damage }) => {
  if (!damage) return null

  const { total_hero_damage, dpm, breakdown, defense } = damage
  const { physical_damage, physical_pct, magical_damage, magical_pct, pure_damage, pure_pct } = breakdown

  const getDpmPaceColor = (val: number) => {
    if (val >= 800) return 'text-rose-400 bg-rose-950/40 border-rose-500/30'
    if (val >= 500) return 'text-amber-300 bg-amber-950/40 border-amber-500/30'
    return 'text-cyan-300 bg-cyan-950/40 border-cyan-500/30'
  }

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3.5 border border-white/10 shadow-xl">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600/30 to-amber-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-md">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Damage Breakdown
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Combat Output &amp; Type Profile
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${getDpmPaceColor(dpm)}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{Math.round(dpm)} DPM</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-900/90 border border-white/15 text-xs font-black text-white shadow-inner">
            <span className="text-slate-400 font-normal mr-1">Total:</span>
            <span className="text-amber-300 font-mono">{total_hero_damage.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Multi-segment Damage Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
          <span className="flex items-center gap-1 text-rose-400">
            <Flame className="w-3 h-3 fill-current" /> Phys {physical_pct}%
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Wand2 className="w-3 h-3" /> Mag {magical_pct}%
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3 h-3" /> Pure {pure_pct}%
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-950/80 p-0.5 border border-white/10 flex overflow-hidden gap-0.5">
          <div
            className="h-full bg-gradient-to-r from-rose-600 to-orange-500 rounded-l-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(2, physical_pct)}%` }}
            title={`Physical Damage: ${physical_damage.toLocaleString()} (${physical_pct}%)`}
          />
          <div
            className="h-full bg-gradient-to-r from-cyan-600 via-sky-500 to-indigo-500 transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(2, magical_pct)}%` }}
            title={`Magical Damage: ${magical_damage.toLocaleString()} (${magical_pct}%)`}
          />
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-r-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.max(2, pure_pct)}%` }}
            title={`Pure Damage: ${pure_damage.toLocaleString()} (${pure_pct}%)`}
          />
        </div>
      </div>

      {/* 3 Metric Cards for Types */}
      <div className="grid grid-cols-3 gap-2 font-mono text-center">
        <div className="p-2.5 rounded-xl bg-gradient-to-b from-rose-950/30 to-slate-900/60 border border-rose-500/20 flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Physical
          </span>
          <span className="text-sm font-black text-white mt-1">{physical_damage.toLocaleString()}</span>
          <span className="text-[10px] text-rose-300/80 font-bold">{physical_pct}% share</span>
        </div>

        <div className="p-2.5 rounded-xl bg-gradient-to-b from-cyan-950/30 to-slate-900/60 border border-cyan-500/20 flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1">
            <Wand2 className="w-3 h-3" /> Magical
          </span>
          <span className="text-sm font-black text-white mt-1">{magical_damage.toLocaleString()}</span>
          <span className="text-[10px] text-cyan-300/80 font-bold">{magical_pct}% share</span>
        </div>

        <div className="p-2.5 rounded-xl bg-gradient-to-b from-amber-950/30 to-slate-900/60 border border-amber-500/20 flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Pure
          </span>
          <span className="text-sm font-black text-white mt-1">{pure_damage.toLocaleString()}</span>
          <span className="text-[10px] text-amber-300/80 font-bold">{pure_pct}% share</span>
        </div>
      </div>

      {/* Defense & Resistance Matrix */}
      <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" /> Defense &amp; Mitigation Matrix
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Armor (Phys Red.)</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="font-bold text-slate-200">{defense.armor}</span>
              <span className="text-[11px] font-bold text-emerald-400">-{defense.physical_reduction_pct}%</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Magic Resist</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="font-bold text-slate-200">Base+Items</span>
              <span className="text-[11px] font-bold text-cyan-400">{defense.magic_resistance_pct}%</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Pure Damage</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="font-bold text-slate-200">Direct HP</span>
              <span className="text-[11px] font-bold text-amber-400">100% (True)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
