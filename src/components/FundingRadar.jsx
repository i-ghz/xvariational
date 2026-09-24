import { TrendingUp, TrendingDown } from 'lucide-react'
import { TradeLink } from './TradeLink'
import { Badge } from './Markets'
import { FundingClock } from './FundingClock'
import { fmtUsdCompact, fmtSignedPct } from '../lib/format'

export function FundingSide({ title, note, icon, tone, rows, compact = false }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-line">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-[15px] font-semibold tracking-[-0.015em]">{title}</h3>
        </div>
        <p className="text-[12px] text-dim mt-0.5">{note}</p>
      </div>
      <div className="divide-y divide-line">
        {rows.length ? (
          rows.map((m) => (
            <TradeLink
              key={m.ticker}
              ticker={m.ticker}
              isSwap={m.isSwap}
              className="flex items-center justify-between gap-4 px-5 py-2.5 hover:bg-accent-soft/40 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13.5px] font-semibold">{m.ticker}</span>
                  {!compact && <Badge isSwap={m.isSwap} />}
                </div>
                <div className="text-[11.5px] text-dim truncate">{m.name}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`num text-[14px] font-semibold ${tone}`}>{fmtSignedPct(m.fundingApr)}</div>
                <div className="num text-[11px] text-dim flex items-center gap-1.5 justify-end">
                  <span>OI {fmtUsdCompact(m.oi, 1)}</span>
                  <span aria-hidden>·</span>
                  <FundingClock intervalSeconds={m.fundingIntervalS} />
                </div>
              </div>
            </TradeLink>
          ))
        ) : (
          <p className="px-5 py-8 text-center text-[12.5px] text-dim">Loading…</p>
        )}
      </div>
    </div>
  )
}

export function FundingRadar({ stats, limit }) {
  const cut = (arr) => (limit ? (arr || []).slice(0, limit) : arr || [])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FundingSide
        title="Longs are paying"
        note="Shorts collect funding here"
        icon={<TrendingUp size={15} className="text-up" />}
        tone="text-up"
        rows={cut(stats?.longestFunding)}
        compact={!!limit}
      />
      <FundingSide
        title="Shorts are paying"
        note="Longs collect funding here"
        icon={<TrendingDown size={15} className="text-down" />}
        tone="text-down"
        rows={cut(stats?.shortestFunding)}
        compact={!!limit}
      />
    </div>
  )
}
