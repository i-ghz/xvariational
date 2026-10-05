import { ArrowUpRight, RefreshCw } from 'lucide-react'
import { payout, expectedFdv } from '../lib/consensus'
import { LINKS } from '../lib/config'
import { fmtUsd, fmtUsdCompact } from '../lib/format'

function ago(date) {
  const t = date instanceof Date ? date.getTime() : Date.parse(date)
  if (!Number.isFinite(t)) return ''
  const s = Math.max(0, Math.round((Date.now() - t) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} d ago`
}

function Change({ value }) {
  if (value == null || Math.abs(value) < 0.0005) return <span className="num text-[11px] text-dim">·</span>
  const up = value > 0
  return (
    <span className={`num text-[11px] font-semibold ${up ? 'text-up' : 'text-down'}`}>
      {up ? '▲' : '▼'}{Math.abs(value * 100).toFixed(1)}
    </span>
  )
}

const cents = (p) => (p == null ? '—' : `${(p * 100).toFixed(1)}¢`)

/**
 * Polymarket's "Variational FDV above ___ one day after launch?" event, laid out
 * to sit beside the calculator: one row per threshold, the probability as a bar,
 * and what that threshold would pay the visitor.
 */
export function MarketConsensus({ market, userPoints, share, totalPoints, onPickFdv, activeFdv }) {
  const { markets, event, volume, live, stale, updatedAt, loading, refresh } = market
  const expected = expectedFdv(markets)
  const has = userPoints > 0
  const isLive = live && !stale

  return (
    <section className="card overflow-hidden flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-line">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="label">Polymarket</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${isLive ? 'bg-up-soft text-up' : 'bg-sunken text-dim'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-up animate-breathe' : 'bg-dim'}`} />
              {live ? (stale ? 'delayed' : 'live') : 'snapshot'}
            </span>
          </div>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-dim hover:text-accent transition-colors num shrink-0"
            title="Refresh now"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            {live ? ago(updatedAt) : `as of ${updatedAt}`}
          </button>
        </div>
        <h2 className="text-[16px] md:text-[17px] font-semibold tracking-[-0.02em] mt-2 leading-snug">
          What the market expects at launch
        </h2>
        <p className="text-[12px] text-muted mt-1 num">
          Traders have {fmtUsdCompact(volume, 2)} riding on where $VAR&apos;s FDV lands one day after TGE.
        </p>
      </div>

      {expected && (
        <div className="px-5 py-4 border-b border-line bg-sunken/70 flex items-center justify-between gap-3">
          <div>
            <div className="label mb-1">Market-implied FDV</div>
            <div className="num text-[28px] font-semibold tracking-[-0.04em] leading-none">{fmtUsdCompact(expected)}</div>
            <div className="text-[11px] text-dim mt-1.5">Probability-weighted from the odds below</div>
          </div>
          <button
            onClick={() => onPickFdv(expected)}
            className="btn-primary !px-4 !py-2 !text-[13px] shrink-0"
          >
            Use in calculator
          </button>
        </div>
      )}

      <div className="grid grid-cols-[64px_1fr_44px_84px] gap-x-3 px-5 py-2 label border-b border-line">
        <span>Above</span>
        <span>Yes · 24h</span>
        <span className="text-right">Buy</span>
        <span className="text-right">{has ? 'You get' : 'Per point'}</span>
      </div>

      <div className="divide-y divide-line flex-1">
        {markets.map((m) => {
          const p = payout({ userPoints: has ? userPoints : 1, fdv: m.fdv, share, totalPoints })
          const active = Math.abs(activeFdv - m.fdv) / m.fdv < 0.02
          const yesAsk = m.bestAsk ?? m.yes
          return (
            <button
              key={m.fdv}
              onClick={() => onPickFdv(m.fdv)}
              title={`${fmtUsd(m.volume)} traded · buy yes ${cents(yesAsk)} · buy no ${cents(m.bestBid != null ? 1 - m.bestBid : 1 - m.yes)}`}
              className={`w-full text-left grid grid-cols-[64px_1fr_44px_84px] gap-x-3 items-center px-5 py-2.5 transition-colors hover:bg-accent-soft/50 ${active ? 'bg-accent-soft' : ''}`}
            >
              <div className={`num text-[14px] font-semibold tracking-[-0.02em] ${active ? 'text-accent' : ''}`}>{fmtUsdCompact(m.fdv, 0)}</div>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                  <div className="h-full rounded-full bg-up transition-[width] duration-500" style={{ width: `${m.yes * 100}%` }} />
                </div>
                <span className="num text-[13.5px] font-semibold w-9 text-right">{Math.round(m.yes * 100)}%</span>
                <span className="w-9 text-right"><Change value={m.change24h} /></span>
              </div>
              <div className="num text-[11.5px] text-up font-semibold text-right">{cents(yesAsk)}</div>
              <div className="num text-[13px] font-medium text-right">
                {has ? fmtUsd(p.value) : <span className="text-muted">{fmtUsd(p.perPoint)}</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-line flex items-center justify-between gap-3 text-[11.5px] text-dim">
        <span className="num">
          {event?.volume24h > 0 ? `${fmtUsd(event.volume24h)} traded in 24h` : 'Tap a row to use that FDV'}
        </span>
        <a href={LINKS.polymarket} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 link-quiet">
          Polymarket <ArrowUpRight size={13} />
        </a>
      </div>
    </section>
  )
}
