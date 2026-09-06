import React from 'react'
import { HeroStatusInfo, ItemSlotData, AbilitySlotData, DamageAnalytics } from '../types/game'
import { Minimap } from './Minimap'
import { DamageAnalyticsWidget } from './DamageAnalyticsWidget'
import { Heart, Zap, Sparkles, Navigation } from 'lucide-react'
import { DotaImage } from './common/DotaImage'
import { getHeroAsset, getItemAsset, getAbilityAsset } from '../utils/dotaAssets'

interface HeroCenterColumnProps {
  hero: HeroStatusInfo
  items: Record<string, ItemSlotData>
  abilities: Record<string, AbilitySlotData>
  damage?: DamageAnalytics
  isDaytime: boolean
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
              <DotaImage
                asset={getHeroAsset(hero.hero_name, hero.hero_display_name)}
                className="w-16 h-11 rounded-xl border border-white/20 shadow-md object-cover"
                aspectRatio="hero"
              />
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
              const abilityAsset = getAbilityAsset(ability.name)
              const maxLvl = ability.ultimate ? 3 : 4
              return (
                <div
                  key={key}
                  className={`p-1.5 rounded-xl border flex flex-col items-center justify-between text-center relative overflow-hidden transition-all ${
                    isOnCd
                      ? 'bg-slate-950/90 border-slate-700/50 text-slate-500'
                      : ability.ultimate
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 shadow-glow-purple'
                      : 'bg-slate-900/80 border-white/15 text-slate-200 hover:border-cyan-500/40'
                  }`}
                  title={abilityAsset.displayName}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative shadow-inner">
                    <DotaImage
                      asset={abilityAsset}
                      className="w-full h-full object-cover"
                      aspectRatio="square"
                    />
                    {isOnCd && (
                      <div className="absolute inset-0 bg-black/85 backdrop-blur-[1px] flex items-center justify-center font-mono font-black text-xs text-rose-400">
                        {ability.cooldown}s
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {Array.from({ length: maxLvl }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1 rounded-sm ${
                          i < (ability.level || 0) ? 'bg-cyan-400 shadow-sm' : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
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
              const itemAsset = getItemAsset(item?.name)
              const isOnCd = (item?.cooldown || 0) > 0
              return (
                <div
                  key={slotKey}
                  className={`rounded-xl border flex flex-col items-center justify-center text-center h-14 relative overflow-hidden transition-all ${
                    isEmpty
                      ? 'bg-slate-950/40 border-dashed border-white/10'
                      : 'bg-slate-900/90 border-white/15 shadow-md hover:border-cyan-500/40'
                  }`}
                  title={isEmpty ? 'Empty Slot' : itemAsset.displayName}
                >
                  {isEmpty ? (
                    <span className="text-[10px] text-slate-600 font-mono select-none">Empty</span>
                  ) : (
                    <>
                      <DotaImage
                        asset={itemAsset}
                        className="w-full h-full object-cover"
                        aspectRatio="item"
                      />
                      {(item?.charges || 0) > 0 && (
                        <span className="absolute bottom-1 right-1 text-[9px] font-mono font-black bg-black/85 text-amber-300 px-1 rounded border border-amber-500/50 shadow-sm">
                          x{item?.charges}
                        </span>
                      )}
                      {isOnCd && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center font-mono font-black text-xs text-rose-400">
                          {item?.cooldown}s
                        </div>
                      )}
                    </>
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
                const itemAsset = getItemAsset(item?.name)
                return (
                  <div
                    key={slotKey}
                    className={`rounded-lg border text-center h-8 relative overflow-hidden flex items-center justify-center ${
                      isEmpty
                        ? 'border-dashed border-slate-800 bg-slate-950/30 text-slate-700'
                        : 'bg-slate-900 border-white/10 shadow-sm'
                    }`}
                    title={isEmpty ? 'Empty Backpack' : itemAsset.displayName}
                  >
                    {isEmpty ? (
                      <span className="text-[8px] font-mono text-slate-700">BP</span>
                    ) : (
                      <DotaImage
                        asset={itemAsset}
                        className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
                        aspectRatio="item"
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div
              className="p-1 rounded-xl bg-slate-950/50 border border-white/10 flex flex-col items-center justify-center text-center overflow-hidden relative group"
              title={tpSlot && tpSlot.name !== 'empty' ? 'Town Portal Scroll' : 'No TP'}
            >
              {tpSlot && tpSlot.name !== 'empty' ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <DotaImage
                    asset={getItemAsset(tpSlot.name || 'tpscroll')}
                    className="w-full h-7 object-cover rounded-lg"
                    aspectRatio="item"
                  />
                  {(tpSlot.charges || 0) > 0 && (
                    <span className="absolute bottom-0 right-0 text-[8px] font-mono font-black bg-black/80 text-cyan-300 px-0.5 rounded">
                      x{tpSlot.charges}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Navigation className="w-3 h-3 text-slate-600 mb-0.5" />
                  <span className="text-[8px] font-mono text-slate-600 uppercase">No TP</span>
                </div>
              )}
            </div>

            <div
              className="p-1 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col items-center justify-center text-center overflow-hidden relative"
              title={neutralSlot && neutralSlot.name !== 'empty' ? getItemAsset(neutralSlot.name).displayName : 'No Neutral Item'}
            >
              {neutralSlot && neutralSlot.name !== 'empty' ? (
                <DotaImage
                  asset={getItemAsset(neutralSlot.name)}
                  className="w-full h-7 object-cover rounded-lg"
                  aspectRatio="item"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-mono uppercase text-emerald-600">Neutral</span>
                  <span className="text-[8px] font-mono text-slate-600">Empty</span>
                </div>
              )}
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
