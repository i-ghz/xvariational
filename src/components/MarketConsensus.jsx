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
  if (value == null || Math.abs(value) < 0.0005) return <span className="text-[11.5px] text-dim num">—</span>
  const up = value > 0
  return (
    <span className={`num text-[11.5px] font-semibold ${up ? 'text-up' : 'text-down'}`}>
      {up ? '▲' : '▼'} {Math.abs(value * 100).toFixed(1)}%
    </span>
  )
}

const cents = (p) => (p == null ? '—' : `${(p * 100).toFixed(1)}¢`)

export function MarketConsensus({ market, userPoints, share, totalPoints, onPickFdv, activeFdv }) {
  const { markets, event, volume, live, stale, updatedAt, loading, refresh } = market
  const expected = expectedFdv(markets)
  const has = userPoints > 0
  const endYear = event?.endDate ? new Date(event.endDate).getUTCFullYear() : 2027

  return (
    <section className="card overflow-hidden">
      <div className="p-5 md:p-6 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="label">Polymarket · probably</span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${live && !stale ? 'bg-up-soft text-up' : 'bg-sunken text-dim'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${live && !stale ? 'bg-up animate-pulse' : 'bg-dim'}`} />
              {live ? (stale ? 'live · delayed' : 'live') : 'snapshot'}
            </span>
          </div>
          <h2 className="text-[17px] md:text-[19px] font-semibold tracking-[-0.02em]">Variational FDV above ___ one day after launch?</h2>
          <p className="text-[12.5px] text-muted mt-1 num">
            {fmtUsd(volume)} traded
            {event?.volume24h > 0 && <> · {fmtUsd(event.volume24h)} in 24h</>}
            {event?.liquidity > 0 && <> · {fmtUsdCompact(event.liquidity, 0)} liquidity</>}
            {' '}· resolves by Dec {endYear === 2028 ? '31, 2027' : `31, ${endYear}`}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 text-[12px] text-dim hover:text-muted transition-colors num"
            title="Refresh now"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            {live ? `updated ${ago(updatedAt)}` : `as of ${updatedAt}`}
          </button>
          <a href={LINKS.polymarket} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12.5px] link-quiet">
            Open on Polymarket <ArrowUpRight size={14} />
          </a>
        </div>
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
        <div className="hidden md:grid grid-cols-[0.8fr_2fr_0.9fr_0.9fr_0.9fr] gap-4 px-5 md:px-6 py-2.5 label border-b border-line bg-sunken/60">
          <span>Threshold</span>
          <span>Yes probability · 24h</span>
          <span className="text-right">Buy yes / no</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Your payout</span>
        </div>
        <div className="divide-y divide-line">
          {markets.map((m) => {
            const p = payout({ userPoints, fdv: m.fdv, share, totalPoints })
            const active = Math.abs(activeFdv - m.fdv) / m.fdv < 0.02
            const yesAsk = m.bestAsk ?? m.yes
            const noAsk = m.bestBid != null ? 1 - m.bestBid : (m.no ?? 1 - m.yes)
            return (
              <button
                key={m.fdv}
                onClick={() => onPickFdv(m.fdv)}
                className={`w-full text-left grid grid-cols-2 md:grid-cols-[0.8fr_2fr_0.9fr_0.9fr_0.9fr] gap-x-4 gap-y-2 items-center px-5 md:px-6 py-3 transition-colors hover:bg-accent-soft/40 ${active ? 'bg-accent-soft/70' : ''}`}
              >
                <div>
                  <div className="num text-[15px] font-semibold tracking-[-0.02em]">{fmtUsdCompact(m.fdv, 0)}</div>
                  {m.volume24h > 0 && <div className="num text-[11px] text-dim md:hidden">{fmtUsd(m.volume)} vol</div>}
                </div>
                <div className="flex items-center gap-3 col-span-2 md:col-span-1 order-last md:order-none">
                  <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full rounded-full bg-up transition-[width] duration-500" style={{ width: `${m.yes * 100}%` }} />
                  </div>
                  <span className="num text-[13.5px] font-semibold w-11 text-right">{Math.round(m.yes * 100)}%</span>
                  <span className="w-14 text-right"><Change value={m.change24h} /></span>
                </div>
                <div className="hidden md:flex items-center justify-end gap-1.5 num text-[11.5px]">
                  <span className="rounded-md bg-up-soft text-up px-1.5 py-0.5 font-semibold">{cents(yesAsk)}</span>
                  <span className="rounded-md bg-down-soft text-down px-1.5 py-0.5 font-semibold">{cents(noAsk)}</span>
                </div>
                <div className="num text-[12.5px] text-dim text-right hidden md:block">
                  {fmtUsd(m.volume)}
                  {m.volume24h > 0 && <div className="text-[10.5px]">{fmtUsd(m.volume24h)} · 24h</div>}
                </div>
                <div className="num text-[13.5px] font-medium text-right">{has ? fmtUsd(p.value) : <span className="text-dim">—</span>}</div>
              </button>
            )
          })}
        </div>
      </div>
      <p className="px-5 md:px-6 py-3 text-[11.5px] text-dim border-t border-line">
        Tap a row to set that FDV in the simulator. Odds refresh every minute via our relay, so they show even where Polymarket is blocked. Payouts use the announced 32% genesis share and your projected total points.
      </p>
    </section>
  )
}
