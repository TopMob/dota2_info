import React from 'react'
import { TormentorAnalytics } from '../types/game'
import { Zap, Clock, CheckCircle2, ShoppingBag } from 'lucide-react'

interface TormentorWidgetProps {
  tormentor?: TormentorAnalytics
  clockTime: number
}

const formatSeconds = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

export const TormentorWidget: React.FC<TormentorWidgetProps> = ({ tormentor }) => {
  if (!tormentor) return null

  const { status, remaining_seconds, has_shard, shard_advice, should_buy_from_shop } = tormentor
  const isAlive = status === 'alive'

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 border border-white/10 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600/30 to-rose-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              Tormentor &amp; Shard Strategy
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Objective Timing &amp; Gold Optimization
            </span>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono tracking-wider border shadow-md ${
            isAlive
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple'
              : 'bg-slate-900/80 text-slate-400 border-white/5'
          }`}
        >
          {isAlive ? 'ALIVE (20:00+)' : `SPAWN IN ${formatSeconds(remaining_seconds)}`}
        </span>
      </div>

      <div
        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
          should_buy_from_shop
            ? 'bg-amber-950/30 border-amber-500/40'
            : has_shard
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : 'bg-slate-950/70 border-white/5'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {has_shard ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : should_buy_from_shop ? (
            <ShoppingBag className="w-4 h-4 text-amber-400 flex-shrink-0" />
          ) : (
            <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
          )}
          <p className="text-xs text-slate-200 leading-tight">
            {shard_advice}
          </p>
        </div>
      </div>
    </div>
  )
}
