import React from 'react'
import { MapPin, Shield, Skull, Flower2, Compass, Sun, Moon, Eye } from 'lucide-react'
import { DotaImage } from './common/DotaImage'
import { getHeroAsset } from '../utils/dotaAssets'

interface MinimapProps {
  heroX?: number | null
  heroY?: number | null
  heroName?: string
  isDaytime: boolean
}

export const Minimap: React.FC<MinimapProps> = ({ heroX, heroY, heroName, isDaytime }) => {
  // In Dota 2 coordinate space (approx -8000 to +8000 on both axes):
  // X: -8000 is West, +8000 is East
  // Y: -8000 is South, +8000 is North
  const normX = heroX != null ? Math.max(3, Math.min(97, ((heroX + 8000) / 16000) * 100)) : 22
  const normY = heroY != null ? Math.max(3, Math.min(97, 100 - ((heroY + 8000) / 16000) * 100)) : 78

  // 7.37 Roshan pits:
  // Daytime: Roshan is in the South-East (Radiant side) pit
  // Nighttime: Roshan is in the North-West (Dire side) pit
  const roshanPitNorth = { left: '11%', top: '11%' }
  const roshanPitSouth = { left: '89%', top: '89%' }
  const activePit = isDaytime ? 'south' : 'north'

  return (
    <div className="glass-panel p-3.5 rounded-2xl flex flex-col gap-2.5 border border-white/10 shadow-xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            Tactical Map 7.37
          </h3>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-2 py-0.5 rounded-md border border-white/10 text-slate-300">
            {isDaytime ? (
              <span className="flex items-center gap-1 text-amber-300">
                <Sun className="w-3.5 h-3.5" /> Day Cycle
              </span>
            ) : (
              <span className="flex items-center gap-1 text-indigo-300">
                <Moon className="w-3.5 h-3.5" /> Night Cycle
              </span>
            )}
          </div>
          <span className="text-slate-500 font-mono text-[10px]">
            {heroX != null ? `(${Math.round(heroX)}, ${Math.round(heroY ?? 0)})` : 'Standby'}
          </span>
        </div>
      </div>

      {/* Actual Map Container */}
      <div className="relative w-full aspect-square bg-[#0a0d13] rounded-xl overflow-hidden border border-white/15 shadow-2xl">
        {/* Real 7.37 High-Res Dota Map Texture */}
        <img
          src="/dota_assets/dota_map.png"
          alt="Official Dota 2 7.37 Minimap"
          className="w-full h-full object-cover select-none pointer-events-none filter contrast-[1.05] brightness-95"
          loading="eager"
        />

        {/* Subtle grid lines for tactical depth */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full grid grid-cols-4 grid-rows-4 border border-white/10">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-white/5" />
            ))}
          </div>
        </div>

        {/* Roshan Pits on 7.37 Map */}
        {/* North-West Pit (Dire side) */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 rounded-full flex items-center justify-center transition-all ${
            activePit === 'north'
              ? 'bg-rose-950/90 border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-black/60 border border-white/20 opacity-40'
          }`}
          style={roshanPitNorth}
          title={`North Roshan Pit (${activePit === 'north' ? 'ACTIVE - Night' : 'Inactive during Day'})`}
        >
          <Skull className={`w-3.5 h-3.5 ${activePit === 'north' ? 'text-rose-300' : 'text-slate-500'}`} />
        </div>

        {/* South-East Pit (Radiant side) */}
        <div
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 rounded-full flex items-center justify-center transition-all ${
            activePit === 'south'
              ? 'bg-rose-950/90 border-2 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-black/60 border border-white/20 opacity-40'
          }`}
          style={roshanPitSouth}
          title={`South Roshan Pit (${activePit === 'south' ? 'ACTIVE - Day' : 'Inactive during Night'})`}
        >
          <Skull className={`w-3.5 h-3.5 ${activePit === 'south' ? 'text-rose-300' : 'text-slate-500'}`} />
        </div>

        {/* Tormentor Markers (20:00 objective) */}
        {/* Radiant Tormentor */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 rounded-md bg-purple-950/80 border border-purple-400/50 flex items-center justify-center shadow-md"
          style={{ left: '7%', top: '56%' }}
          title="Radiant Tormentor Spawn (20:00+)"
        >
          <Shield className="w-2.5 h-2.5 text-purple-300" />
        </div>

        {/* Dire Tormentor */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-1 rounded-md bg-purple-950/80 border border-purple-400/50 flex items-center justify-center shadow-md"
          style={{ left: '93%', top: '44%' }}
          title="Dire Tormentor Spawn (20:00+)"
        >
          <Shield className="w-2.5 h-2.5 text-purple-300" />
        </div>

        {/* Lotus Pools */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-0.5 rounded-full bg-pink-950/70 border border-pink-400/40 flex items-center justify-center"
          style={{ left: '12%', top: '23%' }}
          title="North Lotus Pool (every 3 min)"
        >
          <Flower2 className="w-2.5 h-2.5 text-pink-300" />
        </div>
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 p-0.5 rounded-full bg-pink-950/70 border border-pink-400/40 flex items-center justify-center"
          style={{ left: '88%', top: '77%' }}
          title="South Lotus Pool (every 3 min)"
        >
          <Flower2 className="w-2.5 h-2.5 text-pink-300" />
        </div>

        {/* Player Hero Position Indicator */}
        <div
          className="absolute z-30 transition-all duration-700 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${normX}%`, top: `${normY}%` }}
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_#22d3ee] flex items-center justify-center bg-slate-950">
              <DotaImage
                asset={getHeroAsset(heroName)}
                className="w-full h-full object-cover rounded-full"
                aspectRatio="square"
              />
            </div>
            <div className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-40 pointer-events-none" />
          </div>

          <span className="text-[9px] font-black font-mono px-1.5 py-0.2 rounded bg-slate-950/95 text-cyan-200 border border-cyan-500/50 whitespace-nowrap mt-1 shadow-lg">
            {heroName ? heroName.replace('npc_dota_hero_', '') : 'You'}
          </span>
        </div>

        {/* Bottom map overlay indicator */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-slate-950/90 px-2 py-0.5 rounded-md border border-white/10 text-[9px] font-mono text-slate-300 backdrop-blur-sm">
          <Eye className="w-3 h-3 text-cyan-400" />
          <span>Real-time GPS Tracking</span>
        </div>
      </div>

      {/* Tactical Map Legend */}
      <div className="grid grid-cols-4 gap-1.5 text-[10px] text-slate-300 font-mono">
        <div className="flex items-center gap-1 bg-slate-900/70 px-2 py-1.5 rounded-lg border border-white/5">
          <Skull className="w-3 h-3 text-rose-400" />
          <span className="truncate">Roshan</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/70 px-2 py-1.5 rounded-lg border border-white/5">
          <Shield className="w-3 h-3 text-purple-400" />
          <span className="truncate">Tormentor</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/70 px-2 py-1.5 rounded-lg border border-white/5">
          <Flower2 className="w-3 h-3 text-pink-400" />
          <span className="truncate">Lotus</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/70 px-2 py-1.5 rounded-lg border border-white/5">
          <Compass className="w-3 h-3 text-cyan-400" />
          <span className="truncate">Twin Gate</span>
        </div>
      </div>
    </div>
  )
}
