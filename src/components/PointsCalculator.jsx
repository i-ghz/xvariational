import { RotateCcw } from 'lucide-react'
import { clsx } from 'clsx'
import { Slider } from './Slider'
import { TradeLink } from './TradeLink'
import { ASSUMPTIONS, SCENARIOS } from '../lib/consensus'
import { TOKENOMICS, weeklyDilution } from '../lib/tokenomics'
import { fmtUsd, fmtUsd2, fmtUsdCompact, fmtCompact, fmtPoints, fmtInt } from '../lib/format'

/**
 * With the 32% genesis share announced, the price at TGE is the only thing left
 * that really moves the answer — so it leads, and the rest gets out of its way.
 */
export function PointsCalculator({ sim }) {
  const { points, setPoints, fdv, setFdv, totalPoints, setTotalPoints, share, userPoints, result, reset } = sim
  const has = userPoints > 0
  const dilution = weeklyDilution(userPoints, totalPoints)
  const targets = [1_000, 10_000, 100_000]

  return (
    <section className="card overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-line flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="section-title">What are your points worth?</h2>
          <p className="section-sub">
            <span className="text-ink font-medium">{Math.round(share * 100)}% of supply</span> goes to
            points — announced, fully unlocked at TGE. The price is the open question.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 text-[12.5px] text-muted hover:text-accent transition-colors px-2.5 py-1.5 rounded-full hover:bg-sunken shrink-0"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="points" className="block text-[13.5px] font-medium mb-2">Your Omni points</label>
            <div className="relative">
              <input
                id="points"
                type="number"
                inputMode="decimal"
                min="0"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="0"
                className="num w-full bg-sunken border border-line rounded-inner px-4 py-3 pr-12 text-[26px] font-semibold
                           tracking-[-0.03em] placeholder:text-dim focus:outline-none focus:border-accent focus:shadow-focus
                           focus:bg-card transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] text-dim">pts</span>
            </div>
            <p className="text-[11.5px] text-dim mt-2">
              Read them off <TradeLink path="/points" className="link-quiet">your Omni points page</TradeLink>.
            </p>
          </div>

          <Slider
            label="FDV at TGE" value={fdv} onChange={setFdv}
            min={ASSUMPTIONS.fdv.min} max={ASSUMPTIONS.fdv.max} log step={10e6}
            probably={ASSUMPTIONS.fdv.probably}
            format={(v) => fmtUsdCompact(v, 2)} formatEdge={(v) => fmtUsdCompact(v, 1)}
          />

          <div className="flex flex-wrap gap-1.5">
            {SCENARIOS.map((s) => {
              const active = Math.abs(fdv - s) / s < 0.02
              return (
                <button
                  key={s}
                  onClick={() => setFdv(s)}
                  className={clsx(
                    'pill border !text-[12px] !px-2.5 !py-1 num',
                    active ? 'bg-accent text-white border-accent' : 'border-line text-muted hover:border-accent hover:text-accent',
                  )}
                >
                  {fmtUsdCompact(s, 0)}
                </button>
              )
            })}
          </div>

          <div className="border-t border-line pt-5">
            <Slider
              label="Points in existence at TGE" value={totalPoints} onChange={setTotalPoints}
              min={ASSUMPTIONS.totalPoints.min} max={ASSUMPTIONS.totalPoints.max}
              step={ASSUMPTIONS.totalPoints.step} probably={ASSUMPTIONS.totalPoints.probably}
              format={(v) => fmtCompact(v, { decimals: 2 })} formatEdge={(v) => fmtCompact(v, { decimals: 0 })}
            />
            <p className="text-[11.5px] text-dim leading-relaxed mt-2.5">
              {fmtInt(TOKENOMICS.weeklyPoints)} points drop every week until the {TOKENOMICS.tgeQuarter} TGE,
              which lands the final supply somewhere around{' '}
              {fmtCompact(ASSUMPTIONS.totalPoints.probably[0])}–{fmtCompact(ASSUMPTIONS.totalPoints.probably[1])}.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-inner bg-accent-soft/60 border border-accent/15 px-5 py-5">
            <div className="label !text-accent/70 mb-2">Your payout</div>
            <div className="num text-[38px] md:text-[46px] font-semibold tracking-[-0.04em] leading-none text-accent">
              {has ? fmtUsd(result.value) : '$0'}
            </div>
            <div className="text-[12.5px] text-muted mt-2.5">
              {has
                ? `${fmtPoints(userPoints)} pts × ${fmtUsd2(result.perPoint)} at ${fmtUsdCompact(fdv)} FDV`
                : 'Enter your points to see this'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-inner border border-line px-4 py-3.5">
              <div className="label mb-1.5">Per point</div>
              <div className="num text-[17px] font-semibold tracking-[-0.02em]">{fmtUsd2(result.perPoint)}</div>
            </div>
            <div className="rounded-inner border border-line px-4 py-3.5">
              <div className="label mb-1.5">Genesis pool</div>
              <div className="num text-[17px] font-semibold tracking-[-0.02em]">{fmtUsdCompact(result.pool)}</div>
            </div>
          </div>

          <div className="rounded-inner border border-line px-4 py-3.5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="label">Points needed for</span>
              {has && (
                <span className="num text-[11.5px] text-dim">
                  your share {(result.userShare * 100).toFixed(4)}%
                </span>
              )}
            </div>
            <div className="divide-y divide-line">
              {targets.map((t) => (
                <div key={t} className="flex items-center justify-between py-1.5 text-[12.5px] num">
                  <span className="text-muted">{fmtUsd(t)}</span>
                  <span className="font-semibold">{result.perPoint > 0 ? fmtPoints(t / result.perPoint) : '—'} pts</span>
                </div>
              ))}
            </div>
          </div>

          {dilution > 0 && (
            <p className="text-[11.5px] leading-relaxed rounded-inner bg-sunken px-3.5 py-2.5 mt-auto">
              <span className="text-ink font-medium">
                Every week you sit out costs you {(dilution * 100).toFixed(2)}% of your share
              </span>
              <span className="text-muted">
                {' '}— {fmtInt(TOKENOMICS.weeklyPoints)} new points join the pool whether you farm or not.
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
