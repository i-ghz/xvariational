import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { TradeLink } from './TradeLink'
import { Funding, Badge } from './Markets'
import { fmtUsdCompact, fmtPrice } from '../lib/format'

/** The busiest handful, so the home page shows the venue at a glance. */
export function MarketsPreview({ stats, loading }) {
  const rows = (stats?.topVolume || []).slice(0, 6)

  return (
    <section className="card overflow-hidden flex flex-col">
      <div className="px-5 py-3.5 border-b border-line flex items-center justify-between gap-3">
        <div>
          <h2 className="section-title !text-[17px]">Busiest markets</h2>
          <p className="section-sub !text-[12.5px] !mt-0.5">Crypto, US stocks and macro on one book</p>
        </div>
        <Link to="/markets" className="text-[12.5px] link-quiet flex items-center gap-1 shrink-0 group">
          All {stats?.numMarkets || ''}
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="divide-y divide-line flex-1">
        {loading && !rows.length
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-3">
                <div className="h-3.5 w-1/3 rounded-full bg-sunken animate-breathe" />
              </div>
            ))
          : rows.map((m) => (
              <TradeLink
                key={m.ticker}
                ticker={m.ticker}
                isSwap={m.isSwap}
                className="group grid grid-cols-[minmax(0,1.6fr)_1fr_1fr_auto] items-center gap-3 px-5 py-3 hover:bg-accent-soft/40 transition-colors"
              >
                <div className="min-w-0 flex items-baseline gap-2">
                  <span className="text-[13.5px] font-semibold">{m.ticker}</span>
                  <Badge isSwap={m.isSwap} />
                </div>
                <span className="num text-[13px] font-medium">{fmtPrice(m.price)}</span>
                <span className="num text-[12.5px] text-muted text-right">{fmtUsdCompact(m.volume24h, 1)}</span>
                <ArrowUpRight size={14} className="text-line-2 group-hover:text-accent transition-colors" />
              </TradeLink>
            ))}
      </div>
    </section>
  )
}
