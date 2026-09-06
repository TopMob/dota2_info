import { useState } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import { Header } from './components/Header'
import { TimersColumn } from './components/TimersColumn'
import { HeroCenterColumn } from './components/HeroCenterColumn'
import { EconomyColumn } from './components/EconomyColumn'
import { InAppAlertToast } from './components/InAppAlertToast'
import { StreamerPipOverlay } from './components/StreamerPipOverlay'
import { SoundSettingsModal } from './components/SoundSettingsModal'
import { PostGameDebriefModal } from './components/PostGameDebriefModal'
import { LayoutDashboard, History, Sparkles, Shield, Cpu, Tv2 } from 'lucide-react'

export function App() {
  const { gameState, isSocketConnected, alerts, dismissAlert } = useWebSocket()
  const [activeTab, setActiveTab] = useState<'live' | 'pip' | 'analytics'>('live')
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false)
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        gameState={gameState}
        isSocketConnected={isSocketConnected}
        onOpenSoundSettings={() => setIsSoundModalOpen(true)}
        onOpenDebrief={() => setIsDebriefModalOpen(true)}
      />

      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 pb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'live'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Live Battle HUD
            </button>
            <button
              onClick={() => setActiveTab('pip')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pip'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Tv2 className="w-3.5 h-3.5" />
              Streamer PIP Mode
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Match Telemetry
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-white/5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Valve GSI Protocol
            </span>
          </div>
        </div>

        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <TimersColumn
                timers={gameState.timers}
                clockTime={gameState.clock_time}
                neutralAdvisor={gameState.neutral_advisor}
                tormentor={gameState.tormentor}
              />
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <HeroCenterColumn
                hero={gameState.hero}
                items={gameState.items}
                abilities={gameState.abilities}
                damage={gameState.damage}
                isDaytime={gameState.is_daytime}
              />
            </div>

            <div className="lg:col-span-4 order-3">
              <EconomyColumn
                economy={gameState.economy}
                roshan={gameState.roshan}
                prediction={gameState.item_prediction}
                farmCoach={gameState.farm_coach}
                clockTime={gameState.clock_time}
              />
            </div>
          </div>
        )}

        {activeTab === 'pip' && (
          <div className="py-6">
            <StreamerPipOverlay gameState={gameState} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-bold text-white">Computer Vision (CV) Modular Adapter</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The architecture is pre-configured with coordinate normalization (-8000 to +8000) and layer hooks for screen analysis. When enemy heroes are clicked in-game, the CV engine can capture item matrices and publish them directly to this dashboard without memory injection.
              </p>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5 font-mono text-xs text-slate-400 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Vision Capture Driver:</span>
                  <span className="text-cyan-300">DXGI Desktop Duplication</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Overhead:</span>
                  <span className="text-emerald-400">&lt; 3ms per template frame</span>
                </div>
                <div className="flex justify-between">
                  <span>VAC Safety Status:</span>
                  <span className="text-emerald-400">100% External / Clean OS Capture</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Live Match Telemetry Stream</h2>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-white/5 font-mono text-xs text-slate-300 flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Match ID:</span>
                  <span className="text-white font-bold">{gameState.match_id || 'Waiting for Game'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">State:</span>
                  <span className="text-cyan-300">{gameState.game_state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Game Clock:</span>
                  <span className="text-amber-300">{gameState.formatted_clock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Tactical Timers:</span>
                  <span className="text-emerald-300">{gameState.timers.length} Timers Registered</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <InAppAlertToast alerts={alerts} onDismiss={dismissAlert} />

      <SoundSettingsModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
      />

      <PostGameDebriefModal
        isOpen={isDebriefModalOpen}
        debrief={gameState.post_game || {
          match_id: gameState.match_id || 'Active Match',
          duration_formatted: gameState.formatted_clock,
          overall_score: 85,
          radiant_score: gameState.radiant_score,
          dire_score: gameState.dire_score,
          total_hero_damage: gameState.damage?.total_hero_damage || 0,
          dpm: gameState.damage?.dpm || 0,
          gpm: gameState.economy.gpm,
          xpm: gameState.economy.xpm,
          net_worth: gameState.economy.net_worth,
          last_hits: gameState.economy.last_hits,
          denies: gameState.economy.denies,
          highlights: ['High farming pace and strong buyback discipline'],
          improvement_areas: ['Watch camp stack timings in early game'],
        }}
        onClose={() => setIsDebriefModalOpen(false)}
      />
    </div>
  )
}
