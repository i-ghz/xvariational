import { RefreshCw } from 'lucide-react'
import { fmtUsdCompact, fmtInt, fmtTime } from '../lib/format'

function Stat({ label, value, sub }) {
  return (
    <div className="px-4 py-4 md:px-5">
      <div className="label mb-1.5">{label}</div>
      <div className="num text-[20px] md:text-[23px] font-semibold tracking-[-0.025em] leading-none">{value}</div>
      {sub && <div className="text-[11.5px] text-dim mt-1.5">{sub}</div>}
    </div>
  )
}

export function StatsStrip({ stats, error, loading, updatedAt, onRefresh }) {
  const v = (n, d = 2) => (stats ? fmtUsdCompact(n, d) : loading ? '—' : 'n/a')
  const cats = stats?.byCategory || {}

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 md:px-5 py-2.5 border-b border-line bg-sunken/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stats ? 'bg-up animate-breathe' : error ? 'bg-down' : 'bg-dim'}`} />
          <span className="text-[12.5px] font-medium truncate">Variational Omni · live</span>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-[12px] text-muted hover:text-accent transition-colors num shrink-0"
          title="Refresh now"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {error ? 'API unreachable' : updatedAt ? fmtTime(updatedAt) : 'Loading…'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-line">
        <Stat label="24h volume" value={v(stats?.volume24h)} />
        <Stat label="Open interest" value={v(stats?.openInterest)} />
        <Stat label="TVL" value={v(stats?.tvl)} />
        <Stat label="All-time volume" value={v(stats?.cumulativeVolume)} />
        <Stat
          label="Markets"
          value={stats ? fmtInt(stats.numMarkets) : loading ? '—' : 'n/a'}
          sub={stats ? `${cats.crypto || 0} crypto · ${cats.stocks || 0} stocks · ${(cats.index || 0) + (cats.commodity || 0)} macro` : null}
        />
      </div>
    </section>
  )
}
