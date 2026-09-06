import { Activity, CircleCheck, Crosshair, ShieldCheck, TriangleAlert } from 'lucide-react'
import { MatchReview } from '../types/game'
import { useI18n } from '../i18n'

export function MatchReviewPanel({ review }: { review?: MatchReview | null }) {
  const { t } = useI18n()
  if (!review) return <section className="review-shell"><div className="review-empty"><Activity size={24} /><div><strong>{t('coaching')}</strong><p>{t('noMatch')}</p></div></div></section>
  const metric = (item: { code: string; value: number }) => {
    if (item.code.includes('farm') || item.code.includes('xp')) return t('valueGpm', item.value)
    if (item.code.includes('impact')) return t('valueDpm', item.value)
    if (item.code.includes('death')) return t('valueDeaths', item.value)
    if (item.code.includes('cs_on')) return t('valueCs', item.value)
    if (item.code.includes('gap')) return t('valueGap', item.value)
    return ''
  }
  const list = (items: typeof review.strengths, positive: boolean) => <div className={`insight-list ${positive ? 'positive' : 'focus'}`}>{items.map((item, index) => <div className="insight" key={`${item.code}-${index}`}><span>{positive ? <CircleCheck size={17} /> : <TriangleAlert size={17} />}</span><div><strong>{t(item.code)}</strong>{metric(item) && <small>{metric(item)}</small>}</div></div>)}</div>
  return <section className="review-shell" aria-label={t('coaching')}>
    <div className="review-heading"><div><span className="eyebrow">POST-MATCH / LIVE</span><h2>{t('coaching')}</h2><p>{t('sample')}: {review.sample_count}</p></div><div className="score-orb"><b>{review.score}</b><span>/100</span></div></div>
    <div className="review-grid"><article><h3><CircleCheck size={16} />{t('strengths')}</h3>{list(review.strengths, true)}</article><article><h3><Crosshair size={16} />{t('focus')}</h3>{list(review.focus, false)}</article></div>
    <div className="phase-table"><div className="phase-title"><ShieldCheck size={16}/>{t('phases')}</div>{review.phases.length ? review.phases.map(phase => <div className="phase-row" key={phase.phase}><strong>{t(phase.phase)}</strong><span>{phase.last_hits} CS</span><span>{phase.net_worth.toLocaleString()}g</span><span>{phase.gpm} GPM</span><em className={phase.grade}>{t(phase.grade)}</em></div>) : <p>{t('noMatch')}</p>}</div>
  </section>
}
