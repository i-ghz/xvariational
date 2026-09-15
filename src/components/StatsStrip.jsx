import { fmtUsdCompact, fmtInt } from '../lib/format'

function Stat({ label, value, sub }) {
  return (
    <div className="px-5 py-5 md:px-6">
      <div className="label mb-2">{label}</div>
      <div className="num text-[22px] md:text-[26px] font-semibold tracking-tight text-text leading-none">{value}</div>
      {sub && <div className="text-[12px] text-dim mt-2">{sub}</div>}
    </div>
  )
}

export function StatsStrip({ stats, error, updatedAt }) {
  const loading = !stats && !error
  const v = (n) => (stats ? fmtUsdCompact(n) : loading ? '—' : 'n/a')

  return (
    <section className="card overflow-hidden animate-rise" style={{ animationDelay: '80ms' }}>
      <div className="flex items-center justify-between px-5 md:px-6 py-3.5 border-b border-line">
        <div className="flex items-center gap-2.5">
          <span className={`w-1.5 h-1.5 rounded-full ${stats ? 'bg-up' : error ? 'bg-down' : 'bg-dim'} ${stats ? 'animate-pulse' : ''}`} />
          <span className="text-[13px] font-medium">Variational Omni · live protocol</span>
        </div>
        <span className="text-[12px] text-dim num">
          {stats && updatedAt ? `Updated ${updatedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : error ? 'API unreachable' : 'Loading…'}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-line">
        <Stat label="24h volume" value={v(stats?.volume24h)} />
        <Stat label="Cumulative volume" value={v(stats?.cumulativeVolume)} />
        <Stat label="Open interest" value={v(stats?.openInterest)} />
        <Stat label="TVL" value={v(stats?.tvl)} />
        <Stat label="Markets" value={stats ? fmtInt(stats.numMarkets) : loading ? '—' : 'n/a'} />
      </div>
      {stats?.topByVolume?.length > 0 && (
        <div className="border-t border-line px-5 md:px-6 py-3 flex gap-6 overflow-x-auto text-[12px] num">
          <span className="text-dim shrink-0">Top 24h</span>
          {stats.topByVolume.map((l) => (
            <span key={l.ticker} className="shrink-0 flex items-center gap-2">
              <span className="font-medium text-text">{l.ticker}</span>
              <span className="text-muted">{fmtUsdCompact(l.volume24h, 1)}</span>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
