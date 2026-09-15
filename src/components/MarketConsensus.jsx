import { ArrowUpRight } from 'lucide-react'
import { payout, expectedFdv } from '../lib/consensus'
import { LINKS } from '../lib/config'
import { fmtUsd, fmtUsdCompact } from '../lib/format'

export function MarketConsensus({ market, userPoints, share, totalPoints, onPickFdv, activeFdv }) {
  const { markets, volume, live, updatedAt } = market
  const expected = expectedFdv(markets)
  const has = userPoints > 0

  return (
    <section className="card overflow-hidden">
      <div className="p-5 md:p-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="label mb-2">Polymarket · consensus</div>
          <h2 className="text-[17px] md:text-[19px] font-semibold tracking-[-0.02em]">Variational FDV above ___ one day after launch?</h2>
          <p className="text-[12.5px] text-muted mt-1 num">
            {fmtUsd(volume)} traded · resolves by Dec 31, 2027 ·{' '}
            {live ? 'live' : `snapshot ${updatedAt}`}
          </p>
        </div>
        <a
          href={LINKS.polymarket}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12.5px] link-quiet shrink-0"
        >
          Open on Polymarket <ArrowUpRight size={14} />
        </a>
      </div>

      {expected && (
        <div className="mx-5 md:mx-6 mb-4 rounded-inner bg-sunken border border-line px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[12.5px] font-medium">Market-implied expected FDV</div>
            <div className="text-[11.5px] text-dim">Probability-weighted from the odds below</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="num text-[21px] font-semibold tracking-[-0.03em]">{fmtUsdCompact(expected)}</span>
            <button
              onClick={() => onPickFdv(expected)}
              className="text-[12.5px] px-3.5 py-1.5 rounded-full bg-accent text-white font-medium hover:bg-accent-2 transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-line">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-5 md:px-6 py-2.5 label border-b border-line bg-sunken/60">
          <span>Threshold</span>
          <span>Yes probability</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Your payout</span>
        </div>
        <div className="divide-y divide-line">
          {markets.map((m) => {
            const p = payout({ userPoints, fdv: m.fdv, share, totalPoints })
            const active = Math.abs(activeFdv - m.fdv) / m.fdv < 0.02
            return (
              <button
                key={m.fdv}
                onClick={() => onPickFdv(m.fdv)}
                className={`w-full text-left grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr_1fr] gap-x-4 gap-y-2 items-center px-5 md:px-6 py-3 transition-colors hover:bg-accent-soft/40 ${active ? 'bg-accent-soft/70' : ''}`}
              >
                <div className="num text-[15px] font-semibold tracking-[-0.02em]">{fmtUsdCompact(m.fdv, 0)}</div>
                <div className="flex items-center gap-3 col-span-2 md:col-span-1 order-last md:order-none">
                  <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full bg-up" style={{ width: `${m.yes * 100}%` }} />
                  </div>
                  <span className="num text-[13.5px] font-semibold w-11 text-right">{Math.round(m.yes * 100)}%</span>
                </div>
                <div className="num text-[12.5px] text-dim text-right hidden md:block">{fmtUsd(m.volume)}</div>
                <div className="num text-[13.5px] font-medium text-right">{has ? fmtUsd(p.value) : <span className="text-dim">—</span>}</div>
              </button>
            )
          })}
        </div>
      </div>
      <p className="px-5 md:px-6 py-3 text-[11.5px] text-dim border-t border-line">
        Tap a row to set that FDV in the simulator. Payouts use your current share and total-points assumptions.
      </p>
    </section>
  )
}
