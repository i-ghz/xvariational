import { useMemo, useState } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { Slider } from './Slider'
import { TradeLink } from './TradeLink'
import { ASSUMPTIONS } from '../lib/consensus'
import { TOKENOMICS } from '../lib/tokenomics'
import { REF_CODE } from '../lib/config'
import { projectPoints, scenarios, valueAt, tgeWindowWeeks, tierBoost } from '../lib/projection'
import { fmtUsd, fmtUsd2, fmtUsdCompact, fmtPoints, fmtInt } from '../lib/format'

const PICKABLE = ['iron', 'bronze', 'silver', 'gold']

export function PointsProjection({ sim }) {
  const [rate, setRate] = useState('')
  const [tier, setTier] = useState('iron')
  const window = useMemo(() => tgeWindowWeeks(), [])
  const [weeks, setWeeks] = useState(window.mid)

  const weeklyRate = Math.max(0, parseFloat(rate) || 0)
  const pointsNow = sim.userPoints

  const proj = projectPoints({ pointsNow, weeklyRate, tier, weeks })
  // What the access code would change, for someone who has no tier yet.
  const withBronze = projectPoints({ pointsNow, weeklyRate, tier: 'bronze', weeks })
  const bronzeGain = withBronze.total - proj.total

  const rows = useMemo(
    () => scenarios({ fdvBand: ASSUMPTIONS.fdv.probably, supplyBand: ASSUMPTIONS.totalPoints.probably }),
    [],
  )

  const ready = pointsNow > 0 || weeklyRate > 0
  const values = rows.map((r) => ({ ...r, ...valueAt({ userPoints: proj.total, fdv: r.fdv, supply: r.supply }) }))
  const low = values[0]?.value ?? 0
  const high = values[values.length - 1]?.value ?? 0

  return (
    <section className="card overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-line">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-accent" />
          <h2 className="section-title">Where you land at TGE</h2>
        </div>
        <p className="section-sub">
          Your points keep growing until {TOKENOMICS.tgeQuarter}. This projects your own pace forward —
          Variational has never published a points-per-volume rate, so the pace has to come from you.
        </p>
      </div>

      <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="rate" className="block text-[13.5px] font-medium mb-2">
              Points you earn per week
            </label>
            <div className="relative">
              <input
                id="rate"
                type="number"
                inputMode="decimal"
                min="0"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="0"
                className="num w-full bg-sunken border border-line rounded-inner px-4 py-2.5 pr-16 text-[20px] font-semibold
                           tracking-[-0.02em] placeholder:text-dim focus:outline-none focus:border-accent focus:shadow-focus
                           focus:bg-card transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-dim">pts/wk</span>
            </div>
            <p className="text-[11.5px] text-dim mt-2">
              Compare two weeks on{' '}
              <TradeLink path="/points" className="link-quiet">your Omni points page</TradeLink> to get this.
            </p>
          </div>

          <div>
            <div className="text-[13.5px] font-medium mb-2">Your reward tier</div>
            <div className="flex flex-wrap gap-1.5">
              {PICKABLE.map((id) => {
                const t = TOKENOMICS.tiers.find((x) => x.id === id)
                return (
                  <button
                    key={id}
                    onClick={() => setTier(id)}
                    className={clsx(
                      'pill border !text-[12px] !px-2.5 !py-1',
                      tier === id
                        ? 'bg-accent text-white border-accent'
                        : 'border-line text-muted hover:border-accent hover:text-accent',
                    )}
                  >
                    {t.label}
                    <span className="num opacity-70">
                      {t.boost ? `+${(t.boost * 100).toFixed(1).replace('.0', '')}%` : '0%'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Slider
            label="Weeks until TGE"
            value={weeks}
            onChange={(v) => setWeeks(Math.round(v))}
            min={window.min}
            max={window.max}
            step={1}
            format={(v) => `${Math.round(v)} wk`}
            formatEdge={(v) => `${Math.round(v)}`}
          />
          <p className="text-[11.5px] text-dim leading-relaxed -mt-2">
            TGE is {TOKENOMICS.tgeQuarter}; the exact date is not set, so this is the window.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-inner bg-accent-soft/60 border border-accent/15 px-5 py-4">
            <div className="label !text-accent/70 mb-1.5">Your points at TGE</div>
            <div className="num text-[32px] font-semibold tracking-[-0.035em] leading-none text-accent">
              {ready ? fmtPoints(Math.round(proj.total)) : '—'}
            </div>
            <div className="text-[12px] text-muted mt-2">
              {ready
                ? `${fmtPoints(pointsNow)} now + ${fmtPoints(Math.round(proj.earned))} earned over ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
                : 'Add your points and your weekly pace'}
            </div>
          </div>

          <div className="rounded-inner border border-line overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 px-4 py-2 label border-b border-line bg-sunken/60">
              <span>Case</span>
              <span className="text-right">Per point</span>
              <span className="text-right">You get</span>
            </div>
            <div className="divide-y divide-line">
              {values.map((v) => (
                <div key={v.id} className="grid grid-cols-[auto_1fr_1fr] gap-x-3 px-4 py-2 items-baseline text-[12.5px]">
                  <span className="font-medium w-10">{v.label}</span>
                  <span className="num text-muted text-right">{fmtUsd2(v.perPoint)}</span>
                  <span className={clsx('num font-semibold text-right', v.id === 'base' && 'text-accent')}>
                    {ready ? fmtUsd(v.value) : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {ready && (
            <p className="text-[12px] text-muted leading-relaxed">
              At this pace you land between{' '}
              <span className="num font-semibold text-ink">{fmtUsd(low)}</span> and{' '}
              <span className="num font-semibold text-ink">{fmtUsd(high)}</span>, depending on where FDV
              and the final points supply settle.
            </p>
          )}

          {tier === 'iron' && weeklyRate > 0 && (
            <div className="rounded-inner border border-accent/20 bg-accent-soft/40 px-4 py-3.5 mt-auto">
              {/* The boost itself is small by design; the honest pitch is the head
                  start, with the extra points as a footnote rather than the hook. */}
              <p className="text-[12.5px] leading-relaxed">
                <span className="font-semibold">You are on Iron — no boost.</span>{' '}
                <span className="text-muted">
                  {REF_CODE} starts you on Bronze for {TOKENOMICS.referralPerk.days} days without the{' '}
                  {fmtUsdCompact(TOKENOMICS.tiers[1].volume, 0)} of 30-day volume it normally takes — so
                  every point you earn carries +0.5% from your first trade
                  {bronzeGain >= 1
                    ? `, about ${fmtInt(Math.round(bronzeGain))} extra ${Math.round(bronzeGain) === 1 ? 'point' : 'points'} over these ${weeks} weeks at your pace`
                    : ''}
                  . Omni is invite-only, so the code is also how you get in at all.
                </span>
              </p>
              <TradeLink variant="primary" arrow className="w-full mt-3 !py-2.5 !text-[13.5px]">
                Join Omni with free Bronze
              </TradeLink>
            </div>
          )}

          {tier !== 'iron' && (
            <p className="text-[11.5px] text-dim leading-relaxed mt-auto">
              {TOKENOMICS.tiers.find((t) => t.id === tier)?.label} adds{' '}
              {(tierBoost(tier) * 100).toFixed(1).replace('.0', '')}% to every point you earn.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
