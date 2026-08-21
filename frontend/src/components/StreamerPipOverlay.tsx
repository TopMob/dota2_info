import React from 'react'
import { ProcessedGameState } from '../types/game'
import { ShieldCheck, ShieldAlert, Clock, Swords, Target, Heart, Zap } from 'lucide-react'

interface StreamerPipOverlayProps {
  gameState: ProcessedGameState
}

export const StreamerPipOverlay: React.FC<StreamerPipOverlayProps> = ({ gameState }) => {
  const { hero, economy, timers, damage, item_prediction, formatted_clock } = gameState
  const isBuybackReady = economy.buyback_status === 'READY'
  const isDeficit = economy.buyback_status === 'NO_GOLD'

  const activeTimers = timers.slice(0, 3)

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 p-4 bg-slate-950/90 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl">
      {/* Top compact bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center font-black text-lg text-cyan-300">
            {hero.hero_display_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{hero.hero_display_name}</h3>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 rounded font-bold">
                LVL {hero.level}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400">
                <Heart className="w-3 h-3 fill-current" /> {hero.health}/{hero.max_health}
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Zap className="w-3 h-3 fill-current" /> {hero.mana}/{hero.max_mana}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase">Match Clock</span>
            <span className="text-base font-black text-amber-300">{formatted_clock}</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 ${
              isBuybackReady
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-cyan'
                : isDeficit
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isBuybackReady ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            <span>BB: {isBuybackReady ? 'READY' : isDeficit ? `DEFICIT -${economy.gold_deficit}g` : 'CD'}</span>
          </div>
        </div>
      </div>

      {/* Grid of Compact Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Next Item Prediction */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
              <Target className="w-3 h-3 text-cyan-400" /> Next Slot Target
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {item_prediction?.next_core_item ? `${item_prediction.next_core_item.cost}g` : '--'}
            </span>
          </div>

          <h4 className="text-xs font-black text-white truncate">
            {item_prediction?.next_core_item?.display_name || 'No Target Item'}
          </h4>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300 pt-1 border-t border-white/5">
            <span>ETA: <strong className="text-cyan-300">{item_prediction?.next_core_item?.eta_formatted || '--'}</strong></span>
            <span>{item_prediction?.next_core_item?.progress_pct || 0}%</span>
          </div>
        </div>

        {/* Combat Damage & DPM */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
              <Swords className="w-3 h-3 text-rose-400" /> Total Damage
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {damage?.dpm ? `${Math.round(damage.dpm)} DPM` : '0 DPM'}
            </span>
          </div>

          <h4 className="text-base font-black text-amber-300 font-mono">
            {damage?.total_hero_damage.toLocaleString() || '0'}
          </h4>

          <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-white/5">
            <span className="text-rose-400">Phys: {damage?.breakdown.physical_pct}%</span>
            <span className="text-cyan-400">Mag: {damage?.breakdown.magical_pct}%</span>
            <span className="text-amber-400">Pure: {damage?.breakdown.pure_pct}%</span>
          </div>
        </div>

        {/* Tactical Timers mini list */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 flex flex-col justify-between gap-1">
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-400" /> Upcoming Timers
          </span>

          <div className="flex flex-col gap-1">
            {activeTimers.map((t) => (
              <div key={t.id} className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-300 truncate max-w-[120px]">{t.name}</span>
                <span
                  className={`font-black px-1.5 py-0.2 rounded ${
                    t.urgency === 'critical_10s' || t.urgency === 'active'
                      ? 'bg-rose-500/30 text-rose-300 animate-pulse'
                      : t.urgency === 'warning_30s'
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'text-cyan-300'
                  }`}
                >
                  {t.remaining_seconds}s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
