import { ArrowUpRight } from 'lucide-react'
import { POLYMARKET_EVENT, payout, expectedFdv } from '../lib/consensus'
import { fmtUsd, fmtUsdCompact } from '../lib/format'

export function MarketConsensus({ market, userPoints, share, totalPoints, onPickFdv, activeFdv }) {
  const { markets, volume, live, updatedAt } = market
  const expected = expectedFdv(markets)
  const has = userPoints > 0

  return (
    <section id="market" className="card overflow-hidden">
      <div className="p-6 md:p-8 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="label mb-2">Polymarket · consensus</div>
          <h2 className="text-[20px] font-semibold tracking-tight">Variational FDV above ___ one day after launch?</h2>
          <p className="text-[13px] text-muted mt-1.5 num">
            {fmtUsd(volume)} traded · resolves by Dec 31, 2027 ·{' '}
            {live ? 'live' : `snapshot ${updatedAt}`}
          </p>
        </div>
        <a
          href={POLYMARKET_EVENT.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-text transition-colors shrink-0"
        >
          Open on Polymarket <ArrowUpRight size={14} />
        </a>
      </div>

      {expected && (
        <div className="mx-6 md:mx-8 mb-5 rounded-2xl bg-panel-2 border border-line px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-[13px] text-muted">Market-implied expected FDV</div>
            <div className="text-[12px] text-dim">Probability-weighted from the odds below</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="num text-[24px] font-semibold tracking-tight">{fmtUsdCompact(expected)}</span>
            <button
              onClick={() => onPickFdv(expected)}
              className="text-[13px] px-3.5 py-1.5 rounded-full bg-text text-ink font-medium hover:bg-white transition-colors"
            >
              Use
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-line">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-8 py-2.5 label border-b border-line">
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
                className={`w-full text-left grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr_1fr] gap-x-4 gap-y-2 items-center px-6 md:px-8 py-4 transition-colors hover:bg-white/[0.03] ${active ? 'bg-accent/[0.06]' : ''}`}
              >
                <div className="num text-[17px] font-semibold tracking-tight">{fmtUsdCompact(m.fdv, 0)}</div>
                <div className="flex items-center gap-3 col-span-2 md:col-span-1 order-last md:order-none">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-up" style={{ width: `${m.yes * 100}%` }} />
                  </div>
                  <span className="num text-[15px] font-semibold w-12 text-right">{Math.round(m.yes * 100)}%</span>
                </div>
                <div className="num text-[13px] text-dim text-right hidden md:block">{fmtUsd(m.volume)}</div>
                <div className="num text-[15px] font-medium text-right">{has ? fmtUsd(p.value) : <span className="text-dim">—</span>}</div>
              </button>
            )
          })}
        </div>
      </div>
      <p className="px-6 md:px-8 py-4 text-[12px] text-dim border-t border-line">
        Tap a row to set that FDV in the simulator. Payouts use your current share and total-points assumptions.
      </p>
    </section>
  )
}
