import { useState } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { clsx } from 'clsx'
import { Slider } from './Slider'
import { TradeLink } from './TradeLink'
import { ASSUMPTIONS, SCENARIOS } from '../lib/consensus'
import { fmtUsd, fmtUsd2, fmtUsdCompact, fmtPct, fmtCompact, fmtPoints } from '../lib/format'

/** The whole point of the home page: type your points, see a number. */
export function PointsCalculator({ sim }) {
  const [open, setOpen] = useState(false)
  const {
    points, setPoints, fdv, setFdv, share, setShare,
    totalPoints, setTotalPoints, userPoints, result, reset,
  } = sim
  const has = userPoints > 0
  const targets = [1_000, 10_000, 100_000]

  return (
    <section className="card overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-line flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title">What are your points worth?</h2>
          <p className="section-sub">Nothing is announced. Move the numbers and see for yourself.</p>
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

          <div className="border-t border-line pt-4">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-muted hover:text-accent transition-colors"
            >
              <ChevronDown size={14} className={clsx('transition-transform', open && 'rotate-180')} />
              {open ? 'Hide' : 'More'} assumptions
            </button>

            {open && (
              <div className="flex flex-col gap-5 mt-4">
                <Slider
                  label="Share of supply to points" value={share} onChange={setShare}
                  min={ASSUMPTIONS.share.min} max={ASSUMPTIONS.share.max} step={ASSUMPTIONS.share.step}
                  probably={ASSUMPTIONS.share.probably} format={(v) => fmtPct(v, 1)}
                />
                <Slider
                  label="Total points at TGE" value={totalPoints} onChange={setTotalPoints}
                  min={ASSUMPTIONS.points.min} max={ASSUMPTIONS.points.max} step={ASSUMPTIONS.points.step}
                  probably={ASSUMPTIONS.points.probably}
                  format={(v) => fmtCompact(v, { decimals: 2 })} formatEdge={(v) => fmtCompact(v, { decimals: 1 })}
                />
              </div>
            )}
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
              <div className="label mb-1.5">Your share</div>
              <div className="num text-[17px] font-semibold tracking-[-0.02em]">
                {has ? `${(result.userShare * 100).toFixed(4)}%` : '—'}
              </div>
            </div>
          </div>

          <div className="rounded-inner border border-line px-4 py-3.5">
            <div className="label mb-2">Points needed for</div>
            <div className="divide-y divide-line">
              {targets.map((t) => (
                <div key={t} className="flex items-center justify-between py-1.5 text-[12.5px] num">
                  <span className="text-muted">{fmtUsd(t)}</span>
                  <span className="font-semibold">{result.perPoint > 0 ? fmtPoints(t / result.perPoint) : '—'} pts</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11.5px] text-dim leading-relaxed mt-auto">
            Assumes {(share * 100).toFixed(1)}% of supply to points, split across{' '}
            {fmtCompact(totalPoints)} points. Every number here is a community guess.
          </p>
        </div>
      </div>
    </section>
  )
}
