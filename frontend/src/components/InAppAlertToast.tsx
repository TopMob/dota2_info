import React from 'react'
import { InAppAlertItem } from '../types/game'
import { AlertCircle, Bell, X } from 'lucide-react'

interface InAppAlertToastProps {
  alerts: InAppAlertItem[]
  onDismiss: (id: string) => void
}

export const InAppAlertToast: React.FC<InAppAlertToastProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {alerts.map((alert) => {
        const isCritical = alert.urgency === 'critical'
        const isWarning = alert.urgency === 'warning'

        let bgClass = 'bg-slate-900/95 border-cyan-500/40 text-cyan-200'
        let icon = <Bell className="w-4 h-4 text-cyan-400" />

        if (isCritical) {
          bgClass = 'bg-rose-950/95 border-rose-500/60 text-rose-200 shadow-glow-red'
          icon = <AlertCircle className="w-4 h-4 text-rose-400 animate-bounce" />
        } else if (isWarning) {
          bgClass = 'bg-amber-950/95 border-amber-500/50 text-amber-200 shadow-glow-gold'
          icon = <AlertCircle className="w-4 h-4 text-amber-400" />
        }

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 transition-all duration-300 transform translate-y-0 ${bgClass}`}
          >
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-xl bg-black/40 border border-white/10 mt-0.5">
                {icon}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80">
                  {alert.title}
                </span>
                <p className="text-xs font-semibold text-white leading-tight mt-0.5">
                  {alert.label}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(alert.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
