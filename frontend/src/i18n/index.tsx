import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Locale = 'ru' | 'en'
type Dictionary = Record<string, string>
const translations: Record<Locale, Dictionary> = {
  en: {
    live: 'Live dashboard', pip: 'Streamer mode', review: 'Match review', debrief: 'Match debrief',
    safe: 'GSI-only · fair-play mode', language: 'Русский', noMatch: 'Waiting for match',
    safetyTitle: 'Built for fair play', safetyText: 'This app reads only the data Dota 2 voluntarily sends through Game State Integration. It does not read game memory, automate inputs, capture the screen, reveal fog-of-war data, or inspect enemy inventories.',
    telemetry: 'Your live telemetry', gameClock: 'Game clock', activeTimers: 'Active timers', state: 'State',
    coaching: 'Coaching review', sample: 'Data samples', strengths: 'What worked', focus: 'Next match focus',
    phases: 'Match phases', laning: 'Laning', midgame: 'Mid game', late: 'Late game', good: 'On track', needs_work: 'Needs work',
    score: 'Performance score', close: 'Close', matchScore: 'Match score', duration: 'Duration',
    farm_strong: 'Excellent farming pace', farm_behind: 'Farm pace is below the coaching benchmark', xp_strong: 'Strong experience pace', xp_behind: 'You fell behind in experience gain', fight_impact: 'Meaningful fight impact', fight_low_impact: 'Look for safer teamfight participation', deaths_disciplined: 'Deaths were well controlled', deaths_costly: 'Deaths created expensive downtime', buyback_risk: 'Late-game buyback was unavailable', buyback_ready: 'Buyback reserve was kept', lane_cs_gap: 'Practice last hits in the lane', cs_on_track: 'Last-hit pace stayed on track', steady_game: 'Stable game with useful signals', next_focus_objectives: 'Plan the next objective before leaving base',
    valueGpm: '{value} GPM', valueDpm: '{value} DPM', valueDeaths: '{value} deaths', valueCs: '{value} last hits', valueGap: '≈ {value} CS to benchmark',
  },
  ru: {
    live: 'Панель матча', pip: 'Режим стримера', review: 'Разбор матча', debrief: 'Итоги матча',
    safe: 'Только GSI · честная игра', language: 'English', noMatch: 'Ожидание матча',
    safetyTitle: 'Создано для честной игры', safetyText: 'Приложение читает только данные, которые Dota 2 сама отправляет через Game State Integration. Оно не читает память игры, не автоматизирует ввод, не захватывает экран, не раскрывает туман войны и не проверяет инвентари врагов.',
    telemetry: 'Ваша телеметрия', gameClock: 'Игровое время', activeTimers: 'Активные таймеры', state: 'Статус',
    coaching: 'Тренерский разбор', sample: 'Срезов данных', strengths: 'Что получилось', focus: 'Фокус на следующую игру',
    phases: 'Фазы матча', laning: 'Лайнинг', midgame: 'Мидгейм', late: 'Лейтгейм', good: 'Темп хороший', needs_work: 'Надо улучшить',
    score: 'Оценка игры', close: 'Закрыть', matchScore: 'Счёт матча', duration: 'Длительность',
    farm_strong: 'Отличный темп фарма', farm_behind: 'Темп фарма ниже ориентира', xp_strong: 'Хороший темп опыта', xp_behind: 'Не хватило опыта', fight_impact: 'Заметный вклад в драки', fight_low_impact: 'Ищи безопасные подключения к дракам', deaths_disciplined: 'Смерти под контролем', deaths_costly: 'Смерти создали дорогой простой', buyback_risk: 'В поздней игре не было байбека', buyback_ready: 'Сохранён резерв на байбек', lane_cs_gap: 'Потренируй ластхиты на линии', cs_on_track: 'Ластхиты держались в темпе', steady_game: 'Стабильная игра с полезными сигналами', next_focus_objectives: 'Планируй следующую цель до выхода с базы',
    valueGpm: '{value} GPM', valueDpm: '{value} урона/мин', valueDeaths: '{value} смертей', valueCs: '{value} ластхитов', valueGap: '≈ {value} CS до ориентира',
  },
}
const I18n = createContext<{ locale: Locale; setLocale: (locale: Locale) => void; t: (key: string, value?: number) => string }>({ locale: 'ru', setLocale: () => {}, t: (key) => key })
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('dota-locale') as Locale) || 'ru')
  useEffect(() => localStorage.setItem('dota-locale', locale), [locale])
  const t = (key: string, value?: number) => (translations[locale][key] || translations.en[key] || key).replace('{value}', String(value ?? ''))
  return <I18n.Provider value={{ locale, setLocale, t }}>{children}</I18n.Provider>
}
export const useI18n = () => useContext(I18n)
