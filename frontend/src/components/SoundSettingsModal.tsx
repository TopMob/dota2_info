import React, { useState } from 'react'
import { soundEngine } from '../audio/soundEngine'
import { X, Volume2, VolumeX, Play, ShieldAlert, Sparkles, Droplets, Coins, BookOpen, Clock } from 'lucide-react'

interface SoundSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({ isOpen, onClose }) => {
  const [masterVolume, setMasterVolume] = useState(soundEngine.getVolume())
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted())

  if (!isOpen) return null

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setMasterVolume(val)
    soundEngine.setVolume(val)
  }

  const toggleMute = () => {
    const next = !isMuted
    setIsMuted(next)
    soundEngine.setMuted(next)
  }

  const testTriggers = [
    { id: 'water_rune', label: 'Water Rune Alert', icon: <Droplets className="w-4 h-4 text-cyan-400" /> },
    { id: 'bounty_rune', label: 'Bounty Rune Alert', icon: <Coins className="w-4 h-4 text-amber-400" /> },
    { id: 'wisdom_rune', label: 'Wisdom Rune Alert', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
    { id: 'roshan_window', label: 'Roshan Respawn Warning', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'tormentor', label: 'Tormentor Spawn Warning', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
    { id: 'buyback_deficit', label: 'Buyback Deficit Danger', icon: <Clock className="w-4 h-4 text-rose-500" /> },
  ]

  const playTestSound = (soundId: string) => {
    soundEngine.playCue(soundId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-white/15 flex flex-col gap-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Tactical Audio Deck
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-time Cues &amp; Audio Alarms
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

        {/* Master Volume & Mute */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-bold">Master Audio Level:</span>
            <span className="text-cyan-300 font-bold">{Math.round(masterVolume * 100)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-300 border-white/10'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={handleVolumeChange}
              className="flex-1 accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Sound Test List */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Audio Alert Trigger Testing
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {testTriggers.map((t) => (
              <button
                key={t.id}
                onClick={() => playTestSound(t.id)}
                className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between hover:border-cyan-500/40 hover:bg-slate-900 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  {t.icon}
                  <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {t.label}
                  </span>
                </div>
                <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase tracking-wider hover:bg-cyan-500/30 transition-all shadow-glow-cyan"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  )
}
