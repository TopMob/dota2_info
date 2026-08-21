import React from 'react'
import { HeroStatusInfo, ItemSlotData, AbilitySlotData, DamageAnalytics } from '../types/game'
import { Minimap } from './Minimap'
import { DamageAnalyticsWidget } from './DamageAnalyticsWidget'
import { Heart, Zap, Sparkles, Navigation } from 'lucide-react'

interface HeroCenterColumnProps {
  hero: HeroStatusInfo
  items: Record<string, ItemSlotData>
  abilities: Record<string, AbilitySlotData>
  damage?: DamageAnalytics
  isDaytime: boolean
}

const formatItemName = (rawName?: string) => {
  if (!rawName || rawName === 'empty') return 'Empty'
  return rawName
    .replace('item_', '')
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const formatAbilityName = (rawName?: string) => {
  if (!rawName) return 'Skill'
  const parts = rawName.split('_')
  return parts[parts.length - 1].toUpperCase()
}

export const HeroCenterColumn: React.FC<HeroCenterColumnProps> = ({
  hero,
  items,
  abilities,
  damage,
  isDaytime,
}) => {
  const mainSlots = ['slot0', 'slot1', 'slot2', 'slot3', 'slot4', 'slot5']
  const backpackSlots = ['slot6', 'slot7', 'slot8']
  const tpSlot = items['teleport0']
  const neutralSlot = items['neutral0']

  return (
    <div className="flex flex-col gap-3.5">
      <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 flex items-center justify-center font-black text-xl text-cyan-300 shadow-md">
                {hero.hero_display_name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] font-mono px-1.5 py-0.2 rounded-md border border-amber-300 shadow">
                LVL {hero.level}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight text-white">
                  {hero.hero_display_name}
                </h2>
                {!hero.alive && (
                  <span className="text-[10px] font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full animate-pulse">
                    Dead ({hero.respawn_seconds}s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {hero.hero_name.replace('npc_dota_hero_', '')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
            {hero.active_debuffs.map((debuff, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
              >
                {debuff}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-current" /> HP
              </span>
              <span className="text-slate-200">
                {hero.health} / {hero.max_health} ({hero.health_percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-950/80 h-3 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, hero.health_percent))}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="flex items-center gap-1 text-sky-400 font-semibold">
                <Zap className="w-3.5 h-3.5 fill-current" /> MANA
              </span>
              <span className="text-slate-200">
                {hero.mana} / {hero.max_mana} ({hero.mana_percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-950/80 h-3 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, hero.mana_percent))}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex flex-col gap-1.5">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Abilities & Spells
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {Object.entries(abilities).map(([key, ability]) => {
              const isOnCd = (ability.cooldown || 0) > 0
              return (
                <div
                  key={key}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center relative overflow-hidden transition-all ${
                    isOnCd
                      ? 'bg-slate-950/80 border-slate-700/50 text-slate-500'
                      : ability.ultimate
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-200 shadow-glow-purple'
                      : 'bg-slate-900/80 border-white/10 text-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold truncate max-w-full">
                    {formatAbilityName(ability.name)}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1 rounded-sm ${
                          i < (ability.level || 0) ? 'bg-cyan-400' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  {isOnCd && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center font-mono font-black text-xs text-rose-400">
                      {ability.cooldown}s
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Inventory & Items
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {mainSlots.map((slotKey) => {
              const item = items[slotKey]
              const isEmpty = !item || item.name === 'empty'
              return (
                <div
                  key={slotKey}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center h-14 relative overflow-hidden transition-all ${
                    isEmpty
                      ? 'bg-slate-950/40 border-dashed border-white/10 text-slate-600'
                      : 'bg-slate-900/90 border-white/15 text-slate-200 shadow-md'
                  }`}
                >
                  <span className="text-[10px] font-semibold tracking-tight line-clamp-2">
                    {formatItemName(item?.name)}
                  </span>
                  {(item?.charges || 0) > 0 && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-amber-500/30 text-amber-300 px-1 rounded border border-amber-500/50">
                      x{item?.charges}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            <div className="col-span-3 grid grid-cols-3 gap-1.5 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
              {backpackSlots.map((slotKey) => {
                const item = items[slotKey]
                const isEmpty = !item || item.name === 'empty'
                return (
                  <div
                    key={slotKey}
                    className={`p-1 rounded-lg border text-center text-[9px] flex items-center justify-center h-8 ${
                      isEmpty
                        ? 'border-dashed border-slate-800 text-slate-700'
                        : 'bg-slate-900 border-white/10 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{formatItemName(item?.name)}</span>
                  </div>
                )
              })}
            </div>

            <div className="p-1.5 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono uppercase text-slate-500 flex items-center gap-0.5">
                <Navigation className="w-2.5 h-2.5 text-cyan-400" /> TP
              </span>
              <span className="text-[9px] font-bold text-cyan-300 truncate">
                {tpSlot && tpSlot.name !== 'empty' ? `TP (${tpSlot.charges || 1})` : 'No TP'}
              </span>
            </div>

            <div className="p-1.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono uppercase text-emerald-400">Neutral</span>
              <span className="text-[9px] font-bold text-emerald-200 truncate">
                {formatItemName(neutralSlot?.name)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DamageAnalyticsWidget damage={damage} />

      <Minimap
        heroX={undefined}
        heroY={undefined}
        heroName={hero.hero_name}
        isDaytime={isDaytime}
      />
    </div>
  )
}
