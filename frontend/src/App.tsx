import { useState } from 'react'
import './profile.css'
import { useWebSocket } from './hooks/useWebSocket'
import { Header } from './components/Header'
import { TimersColumn } from './components/TimersColumn'
import { HeroCenterColumn } from './components/HeroCenterColumn'
import { EconomyColumn } from './components/EconomyColumn'
import { InAppAlertToast } from './components/InAppAlertToast'
import { StreamerPipOverlay } from './components/StreamerPipOverlay'
import { SoundSettingsModal } from './components/SoundSettingsModal'
import { PostGameDebriefModal } from './components/PostGameDebriefModal'
import { MatchReviewPanel } from './components/MatchReviewPanel'
import { PlayerProfilePanel } from './components/PlayerProfilePanel'
import { LanguageProvider, useI18n } from './i18n'
import { LayoutDashboard, History, ShieldCheck, Tv2, UserRound } from 'lucide-react'

type Tab = 'live' | 'pip' | 'analytics' | 'profile'
function Dashboard() {
  const { gameState, isSocketConnected, alerts, dismissAlert } = useWebSocket()
  const [activeTab, setActiveTab] = useState<Tab>('live')
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false)
  const [isDebriefModalOpen, setIsDebriefModalOpen] = useState(false)
  const { locale, setLocale, t } = useI18n()
  const tabs: { id: Tab; label: string; Icon: typeof LayoutDashboard }[] = [{ id: 'live', label: 'live', Icon: LayoutDashboard }, { id: 'pip', label: 'pip', Icon: Tv2 }, { id: 'analytics', label: 'review', Icon: History }, { id: 'profile', label: 'profile', Icon: UserRound }]
  return <div className="min-h-screen app-shell text-slate-100 flex flex-col selection:bg-amber-400/30">
    <Header gameState={gameState} isSocketConnected={isSocketConnected} onOpenSoundSettings={() => setIsSoundModalOpen(true)} onOpenDebrief={() => setIsDebriefModalOpen(true)} />
    <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 pb-8 flex flex-col gap-4">
      <div className="control-bar"><div className="tab-island" role="tablist">{tabs.map(({ id, label, Icon }) => <button role="tab" aria-selected={activeTab === id} key={id} onClick={() => setActiveTab(id)} className={activeTab === id ? 'active' : ''}><Icon size={15}/>{t(label)}</button>)}</div><div className="toolbar-meta"><span><ShieldCheck size={14}/>{t('safe')}</span><button className="language-button" onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}>{t('language')}</button></div></div>
      {activeTab === 'live' && <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"><div className="lg:col-span-3 order-2 lg:order-1"><TimersColumn timers={gameState.timers} clockTime={gameState.clock_time} neutralAdvisor={gameState.neutral_advisor} tormentor={gameState.tormentor}/></div><div className="lg:col-span-5 order-1 lg:order-2"><HeroCenterColumn hero={gameState.hero} items={gameState.items} abilities={gameState.abilities} damage={gameState.damage} isDaytime={gameState.is_daytime}/></div><div className="lg:col-span-4 order-3"><EconomyColumn economy={gameState.economy} roshan={gameState.roshan} prediction={gameState.item_prediction} farmCoach={gameState.farm_coach} clockTime={gameState.clock_time}/></div></div>}
      {activeTab === 'pip' && <div className="py-6"><StreamerPipOverlay gameState={gameState}/></div>}
      {activeTab === 'profile' && <PlayerProfilePanel />}
      {activeTab === 'analytics' && <div className="analytics-layout"><MatchReviewPanel review={gameState.match_review}/><section className="safety-card"><ShieldCheck size={22}/><div><span className="eyebrow">VAC-SAFE DESIGN</span><h2>{t('safetyTitle')}</h2><p>{t('safetyText')}</p></div></section><section className="telemetry-card"><h2>{t('telemetry')}</h2><dl><div><dt>{t('noMatch')}</dt><dd>{gameState.match_id || '—'}</dd></div><div><dt>{t('state')}</dt><dd>{gameState.game_state.replace('DOTA_GAMERULES_STATE_', '')}</dd></div><div><dt>{t('gameClock')}</dt><dd>{gameState.formatted_clock}</dd></div><div><dt>{t('activeTimers')}</dt><dd>{gameState.timers.length}</dd></div></dl></section></div>}
    </main><InAppAlertToast alerts={alerts} onDismiss={dismissAlert}/><SoundSettingsModal isOpen={isSoundModalOpen} onClose={() => setIsSoundModalOpen(false)}/><PostGameDebriefModal isOpen={isDebriefModalOpen} debrief={gameState.post_game} onClose={() => setIsDebriefModalOpen(false)}/>
  </div>
}
export function App() { return <LanguageProvider><Dashboard/></LanguageProvider> }
