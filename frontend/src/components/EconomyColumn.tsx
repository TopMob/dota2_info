import React from 'react'
import { EconomyAnalytics, RoshanAnalytics, ItemPredictorAnalytics, FarmCoachAnalytics } from '../types/game'
import { RoshanCard } from './RoshanCard'
import { NextItemPredictor } from './NextItemPredictor'
import { FarmCoachWidget } from './FarmCoachWidget'
import { ShieldCheck, ShieldAlert, Coins, TrendingUp, Crosshair, BarChart3, AlertCircle } from 'lucide-react'

interface EconomyColumnProps {
  economy: EconomyAnalytics
  roshan: RoshanAnalytics
  prediction?: ItemPredictorAnalytics
  farmCoach?: FarmCoachAnalytics
  clockTime: number
}

export const EconomyColumn: React.FC<EconomyColumnProps> = ({
  economy,
  roshan,
  prediction,
  farmCoach,
  clockTime,
}) => {
  const isBuybackReady = economy.buyback_status === 'READY'
  const isDeficit = economy.buyback_status === 'NO_GOLD'

  return (
    <div className="flex flex-col gap-3.5">
      <NextItemPredictor
        prediction={prediction}
        gpm={economy.gpm}
      />

      <div
        className={`p-4 rounded-2xl border transition-all ${
          isBuybackReady
            ? 'glass-panel-glow border-emerald-500/40 shadow-glow-cyan'
            : isDeficit
            ? 'glass-panel-urgent border-rose-500/50 shadow-glow-red'
            : 'glass-panel border-amber-500/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isBuybackReady ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : isDeficit ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Buyback Guardian
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Cost: {economy.buyback_cost}g
              </span>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-xl text-xs font-black font-mono tracking-wider border shadow-md ${
              isBuybackReady
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isDeficit
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isBuybackReady
              ? 'READY'
              : isDeficit
              ? `DEFICIT -${economy.gold_deficit}G`
              : `COOLDOWN ${economy.buyback_cooldown}S`}
          </span>
        </div>

        <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Safe Spendable Surplus
            </span>
            <p className="text-xs text-slate-300 leading-tight">
              Gold you can spend in shop right now without losing buyback
            </p>
          </div>
          <span
            className={`text-xl font-black font-mono tracking-tight ${
              economy.gold_surplus >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {economy.gold_surplus >= 0 ? `+${economy.gold_surplus}g` : `${economy.gold_surplus}g`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-white/5 text-xs font-mono">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Reliable Gold</span>
            <span className="text-sm font-bold text-amber-300 mt-0.5">{economy.gold_reliable}g</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase">Unreliable Gold</span>
            <span className="text-sm font-bold text-amber-400/80 mt-0.5">{economy.gold_unreliable}g</span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-tight text-white">Farm & Economy Pacing</h3>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
            {economy.net_worth.toLocaleString()} Net Worth
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
            <Coins className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase">Current Gold</span>
            <span className="text-base font-black text-amber-300 mt-0.5">{economy.gold}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase">GPM / XPM</span>
            <span className="text-base font-black text-cyan-200 mt-0.5">
              {economy.gpm} / {economy.xpm}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase">CS / Denies</span>
            <span className="text-base font-black text-emerald-300 mt-0.5">
              {economy.last_hits} / {economy.denies}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex flex-col items-center">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase">CS / Min</span>
            <span className="text-base font-black text-indigo-300 mt-0.5">{economy.cs_per_min}</span>
          </div>
        </div>
      </div>

      <FarmCoachWidget coach={farmCoach} clockTime={clockTime} />

      <RoshanCard roshan={roshan} clockTime={clockTime} />
    </div>
  )
}
