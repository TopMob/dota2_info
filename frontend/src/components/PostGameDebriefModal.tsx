import React from 'react'
import { PostGameDebrief } from '../types/game'
import { Trophy, CheckCircle2, AlertTriangle, X, TrendingUp, Swords, Coins, ShieldCheck } from 'lucide-react'

interface PostGameDebriefModalProps {
  isOpen: boolean
  debrief?: PostGameDebrief | null
  onClose: () => void
}

export const PostGameDebriefModal: React.FC<PostGameDebriefModalProps> = ({ isOpen, debrief, onClose }) => {
  if (!isOpen || !debrief) return null

  const {
    match_id,
    duration_formatted,
    overall_score,
    radiant_score,
    dire_score,
    total_hero_damage,
    dpm,
    gpm,
    xpm,
    net_worth,
    last_hits,
    denies,
    highlights,
    improvement_areas,
  } = debrief

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-white/15 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-glow-amber">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Match Debrief &amp; AI Performance Score
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Match ID: {match_id} • Duration: {duration_formatted}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Tactical Mastery Rating
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-amber-300 font-mono">{overall_score}</span>
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Match Score</span>
            <div className="text-base font-black text-white">
              <span className="text-emerald-400">{radiant_score}</span> : <span className="text-rose-400">{dire_score}</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
              <Swords className="w-3 h-3 text-rose-400" /> Damage
            </span>
            <span className="text-sm font-bold text-white mt-0.5">{total_hero_damage.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400">{Math.round(dpm)} DPM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" /> Net Worth
            </span>
            <span className="text-sm font-bold text-white mt-0.5">{net_worth.toLocaleString()}g</span>
            <span className="text-[10px] text-slate-400">{gpm} GPM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" /> CS / Denies
            </span>
            <span className="text-sm font-bold text-white mt-0.5">{last_hits} / {denies}</span>
            <span className="text-[10px] text-slate-400">{xpm} XPM</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Objective
            </span>
            <span className="text-sm font-bold text-emerald-300 mt-0.5">Completed</span>
            <span className="text-[10px] text-slate-400">Recorded</span>
          </div>
        </div>

        {/* Highlights & Improvements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col gap-2">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 font-mono uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Match Highlights
            </span>
            <div className="flex flex-col gap-1.5">
              {highlights.map((h, i) => (
                <p key={i} className="text-xs text-slate-200 leading-snug">
                  • {h}
                </p>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-mono uppercase">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Tactical Focus Areas
            </span>
            <div className="flex flex-col gap-1.5">
              {improvement_areas.map((imp, i) => (
                <p key={i} className="text-xs text-slate-200 leading-snug">
                  • {imp}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider hover:bg-cyan-500/30 transition-all shadow-glow-cyan"
          >
            Close Debrief
          </button>
        </div>
      </div>
    </div>
  )
}
