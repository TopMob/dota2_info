import React from 'react'
import { MapPin, Shield, Skull, Flower2, BookOpen, Eye } from 'lucide-react'

interface MinimapProps {
  heroX?: number | null
  heroY?: number | null
  heroName?: string
  isDaytime: boolean
}

export const Minimap: React.FC<MinimapProps> = ({ heroX, heroY, heroName, isDaytime }) => {
  const normX = heroX != null ? Math.max(5, Math.min(95, ((heroX + 8000) / 16000) * 100)) : 22
  const normY = heroY != null ? Math.max(5, Math.min(95, 100 - ((heroY + 8000) / 16000) * 100)) : 78

  return (
    <div className="glass-panel p-3 rounded-2xl flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Tactical Map & Vision Grid
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Radiant
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Dire
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-square bg-[#0c1017] rounded-xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <defs>
            <radialGradient id="radiantGlow" cx="15%" cy="85%" r="35%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="direGlow" cx="85%" cy="15%" r="35%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#0369a1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          <rect width="400" height="400" fill="#0c111c" />
          <rect width="400" height="400" fill="url(#radiantGlow)" />
          <rect width="400" height="400" fill="url(#direGlow)" />

          <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
            <line x1="100" y1="0" x2="100" y2="400" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="300" y1="0" x2="300" y2="400" />
            <line x1="0" y1="100" x2="400" y2="100" />
            <line x1="0" y1="200" x2="400" y2="200" />
            <line x1="0" y1="300" x2="400" y2="300" />
          </g>

          <path
            d="M 20 180 Q 180 200 220 220 T 380 220"
            fill="none"
            stroke="url(#riverGrad)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M 60 340 L 60 70 Q 60 60 70 60 L 340 60"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            strokeDasharray="3 3"
          />

          <path
            d="M 60 340 L 340 60"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            strokeDasharray="3 3"
          />

          <path
            d="M 60 340 L 330 340 Q 340 340 340 330 L 340 60"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="4"
            strokeDasharray="3 3"
          />

          <circle cx="60" cy="340" r="24" fill="#065f46" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />
          <text x="60" y="344" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">RAD</text>

          <circle cx="340" cy="60" r="24" fill="#881337" fillOpacity="0.4" stroke="#ef4444" strokeWidth="2" />
          <text x="340" y="64" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DIR</text>

          <circle
            cx={isDaytime ? 55 : 345}
            cy={isDaytime ? 175 : 225}
            r="12"
            fill="#7f1d1d"
            stroke="#f87171"
            strokeWidth="2"
            className="animate-pulse"
          />
          <text
            x={isDaytime ? 55 : 345}
            y={isDaytime ? 179 : 229}
            textAnchor="middle"
            fill="#fca5a5"
            fontSize="9"
            fontWeight="bold"
          >
            R
          </text>

          <circle cx="20" cy="80" r="7" fill="#831843" stroke="#ec4899" strokeWidth="1.5" />
          <circle cx="380" cy="320" r="7" fill="#831843" stroke="#ec4899" strokeWidth="1.5" />

          <circle cx="25" cy="375" r="7" fill="#581c87" stroke="#a855f7" strokeWidth="1.5" />
          <circle cx="375" cy="25" r="7" fill="#581c87" stroke="#a855f7" strokeWidth="1.5" />

          <circle cx="30" cy="290" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="370" cy="110" r="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>

        <div
          className="absolute z-20 transition-all duration-700 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${normX}%`, top: `${normY}%` }}
        >
          <div className="relative">
            <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#22d3ee] flex items-center justify-center animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-60"></div>
          </div>
          <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-950/90 text-cyan-200 border border-cyan-500/40 whitespace-nowrap mt-0.5 shadow-md">
            {heroName ? heroName.replace('npc_dota_hero_', '') : 'Hero'}
          </span>
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-white/10 text-[9px] font-mono text-slate-300">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>CV Vision Grid Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-white/5">
          <Skull className="w-3 h-3 text-rose-400" />
          <span>Roshan</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-white/5">
          <Flower2 className="w-3 h-3 text-pink-400" />
          <span>Lotus</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-white/5">
          <BookOpen className="w-3 h-3 text-purple-400" />
          <span>Wisdom</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/40 p-1.5 rounded-lg border border-white/5">
          <Shield className="w-3 h-3 text-sky-400" />
          <span>Tormentor</span>
        </div>
      </div>
    </div>
  )
}
