import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import { TOKENOMICS } from '../lib/tokenomics'
import { ASSUMPTIONS } from '../lib/consensus'
import { LINKS } from '../lib/config'
import { fmtCompact, fmtUsdCompact } from '../lib/format'

const SOURCES = [
  { label: 'Tokenomics: 32% genesis, 18% ecosystem, 50% team & investors', href: LINKS.docs },
  { label: '150k points distributed weekly until TGE', href: LINKS.docs },
  { label: 'Reward tiers and the boost to points earned', href: `${LINKS.docs}/omni/rewards/points` },
  { label: 'Referral terms: 5% of spread, 1 point per 10 earned', href: `${LINKS.docs}/omni/rewards/referrals` },
  { label: 'Live market data: public read-only stats API', href: `${LINKS.docs}/technical-documentation/api` },
]

/** Open about the arithmetic, because the page has a referral interest in the answer. */
export function HowItsCalculated() {
  const [open, setOpen] = useState(false)

  return (
    <section className="card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-sunken/60 transition-colors"
      >
        <span className="text-[13.5px] font-semibold tracking-[-0.01em]">How this estimate is calculated</span>
        <ChevronDown size={15} className={clsx('text-dim transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-line pt-4 flex flex-col gap-4">
          <div className="rounded-inner bg-sunken px-4 py-3.5">
            <code className="num text-[12.5px] leading-relaxed block">
              your payout = FDV × {Math.round(TOKENOMICS.genesisShare * 100)}% ÷ total points at TGE × your points
            </code>
          </div>

          <ul className="flex flex-col gap-2 text-[12.5px]">
            <li className="flex gap-2">
              <span className="text-up font-semibold shrink-0">Announced</span>
              <span className="text-muted">
                The {Math.round(TOKENOMICS.genesisShare * 100)}% genesis share, 100% unlocked at TGE,{' '}
                {TOKENOMICS.weeklyPoints.toLocaleString('en-US')} points a week until a{' '}
                {TOKENOMICS.tgeQuarter} TGE, a 1-point floor to claim, and unclaimed tokens burned.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-down font-semibold shrink-0">Unknown</span>
              <span className="text-muted">
                FDV at TGE — the band here ({fmtUsdCompact(ASSUMPTIONS.fdv.probably[0], 0)}–
                {fmtUsdCompact(ASSUMPTIONS.fdv.probably[1], 0)}) comes from Polymarket odds, not from
                Variational. Total points at TGE ({fmtCompact(ASSUMPTIONS.totalPoints.probably[0])}–
                {fmtCompact(ASSUMPTIONS.totalPoints.probably[1])}) is a community estimate: the circulating
                total has never been published.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-dim font-semibold shrink-0">Yours</span>
              <span className="text-muted">
                Your points and your weekly pace. There is no public points-per-volume formula, so a pace
                cannot be derived from trading volume — it has to be read off your own account.
              </span>
            </li>
          </ul>

          <div>
            <div className="label mb-2">Sources</div>
            <ul className="flex flex-col gap-1.5">
              {SOURCES.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12.5px] text-muted hover:text-accent transition-colors inline-flex items-start gap-1.5"
                  >
                    {s.label}
                    <ExternalLink size={11} className="mt-1 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11.5px] text-dim leading-relaxed border-t border-line pt-3">
            Referral disclosure: links to Omni on this site carry the access code {' '}
            <span className="num">OMNIGHZ</span>. If you sign up through them, this site&apos;s owner earns
            referral rewards. It costs you nothing and does not change your fees.
          </p>
        </div>
      )}
    </section>
  )
}
