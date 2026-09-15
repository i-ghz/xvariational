import { useMemo, useState } from 'react'
import { Search, ArrowUpRight, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { TradeLink } from './TradeLink'
import { CATEGORIES, SORTS, filterMarkets, sortDir } from '../lib/markets'
import { fmtUsdCompact, fmtPrice, fmtSignedPct, fmtInterval } from '../lib/format'

const PAGE = 25

export function Funding({ value, interval }) {
  if (value == null) {
    return <span className="text-dim" title="Swaps quote separate long/short rates on Omni">—</span>
  }
  if (!value) return <span className="text-dim">0.00%</span>
  return (
    <span className={value > 0 ? 'text-up' : 'text-down'} title={`Funding interval ${fmtInterval(interval)}`}>
      {fmtSignedPct(value)}
    </span>
  )
}

export function Badge({ isSwap }) {
  return (
    <span
      className={clsx(
        'text-[9.5px] font-semibold tracking-[0.06em] rounded px-1.5 py-px shrink-0 self-center',
        isSwap ? 'bg-accent-soft text-accent' : 'bg-sunken text-muted',
      )}
    >
      {isSwap ? 'SWAP' : 'PERP'}
    </span>
  )
}

function Row({ m }) {
  return (
    <TradeLink
      ticker={m.ticker}
      isSwap={m.isSwap}
      className="group grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,2.4fr)_1fr_1fr_1fr_1fr_auto] items-center
                 gap-x-4 gap-y-1.5 px-4 md:px-5 py-3 transition-colors hover:bg-accent-soft/40"
    >
      <div className="min-w-0 flex items-baseline gap-2">
        <span className="text-[14px] font-semibold tracking-[-0.01em]">{m.ticker}</span>
        <Badge isSwap={m.isSwap} />
        <span className="text-[12px] text-dim truncate">{m.name}</span>
      </div>

      <div className="num text-[13.5px] font-medium text-right md:text-left">{fmtPrice(m.price)}</div>
      <div className="num text-[13px] text-muted hidden md:block">{fmtUsdCompact(m.volume24h, 1)}</div>
      <div className="num text-[13px] text-muted hidden md:block">{fmtUsdCompact(m.oi, 1)}</div>
      <div className="num text-[13px] font-medium hidden md:block">
        <Funding value={m.fundingApr} interval={m.fundingIntervalS} />
      </div>

      <div className="col-span-2 md:col-span-1 flex md:justify-end items-center gap-3">
        <span className="num text-[12px] text-dim md:hidden">
          Vol {fmtUsdCompact(m.volume24h, 1)} · OI {fmtUsdCompact(m.oi, 1)} ·{' '}
          <Funding value={m.fundingApr} interval={m.fundingIntervalS} />
        </span>
        <ArrowUpRight
          size={15}
          className="ml-auto md:ml-0 text-dim md:text-line-2 group-hover:text-accent transition-colors shrink-0"
        />
      </div>
    </TradeLink>
  )
}

export function Markets({ listings = [], loading }) {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('volume24h')
  const [limit, setLimit] = useState(PAGE)

  const rows = useMemo(
    () => filterMarkets(listings, { category, query, sort, dir: sortDir(sort) }),
    [listings, category, query, sort],
  )
  const visible = rows.slice(0, limit)
  const pick = (next, setter) => { setter(next); setLimit(PAGE) }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => pick(c.id, setCategory)}
              className={clsx(
                'pill border',
                category === c.id
                  ? 'bg-accent text-white border-accent'
                  : 'border-line bg-card text-muted hover:border-accent hover:text-accent',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64 shrink-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => pick(e.target.value, setQuery)}
            placeholder="Search markets"
            aria-label="Search markets"
            className="w-full rounded-full bg-card border border-line pl-10 pr-4 py-2 text-[13.5px]
                       placeholder:text-dim focus:outline-none focus:border-accent focus:shadow-focus transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="label hidden sm:block">Sort</span>
        <div className="flex items-center gap-1 rounded-full border border-line bg-card p-1 overflow-x-auto scroll-soft">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => pick(s.id, setSort)}
              className={clsx(
                'rounded-full px-3 py-1 text-[12.5px] font-medium whitespace-nowrap transition-colors',
                sort === s.id ? 'bg-sunken text-ink' : 'text-muted hover:text-ink',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-dim num ml-auto shrink-0">{rows.length} markets</span>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden md:grid grid-cols-[minmax(0,2.4fr)_1fr_1fr_1fr_1fr_auto] gap-x-4 px-5 py-2.5 label border-b border-line bg-sunken/60">
          <span>Market</span>
          <span>Price</span>
          <span>24h volume</span>
          <span>Open interest</span>
          <span>Funding (APR)</span>
          <span className="w-4" />
        </div>

        {loading && !listings.length ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="px-5 py-3.5">
                <div className="h-3.5 w-1/3 rounded-full bg-sunken animate-breathe" />
              </div>
            ))}
          </div>
        ) : visible.length ? (
          <div className="divide-y divide-line">
            {visible.map((m) => <Row key={m.ticker} m={m} />)}
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-[13.5px] text-dim">No market matches “{query}”.</p>
        )}

        {rows.length > limit && (
          <button
            onClick={() => setLimit((l) => l + PAGE * 2)}
            className="w-full border-t border-line py-3.5 text-[13px] font-medium text-muted hover:text-accent
                       hover:bg-sunken/60 transition-colors flex items-center justify-center gap-1.5"
          >
            Show {Math.min(PAGE * 2, rows.length - limit)} more
            <ChevronDown size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
