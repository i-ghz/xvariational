import { ChartCard, Legend, Tooltip } from './chart-ui'
import { useHover, SURFACE } from './chart-tokens'
import { POLARITY } from '../../lib/analytics'
import { fmtUsdCompact } from '../../lib/format'

/** One diverging row per market: how its open interest splits long against short. */
export function SkewChart({ rows }) {
  const [hover, setHover] = useHover()

  if (!rows?.length) {
    return (
      <ChartCard title="Who is crowded, and on which side">
        <div className="h-52 animate-breathe bg-sunken rounded-md" />
      </ChartCard>
    )
  }

  const most = [...rows].sort((a, b) => Math.abs(b.skew) - Math.abs(a.skew))[0]

  return (
    <ChartCard
      title="Who is crowded, and on which side"
      sub="The ten largest books by open interest, split long against short."
      note={
        most
          ? `${most.ticker} is the most lopsided: ${(Math.max(most.longShare, 1 - most.longShare) * 100).toFixed(0)}% of its open interest sits ${most.longShare > 0.5 ? 'long' : 'short'}.`
          : null
      }
    >
      <div className="relative flex flex-col gap-2" data-chart>
        {rows.map((r) => {
          const longPct = r.longShare * 100
          return (
            <div key={r.ticker} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[11.5px] font-medium truncate">{r.ticker}</span>
              <div
                className="relative flex-1 flex h-4 rounded-md overflow-hidden"
                style={{ background: SURFACE }}
                onMouseEnter={(e) => {
                  const box = e.currentTarget.closest('[data-chart]').getBoundingClientRect()
                  const b = e.currentTarget.getBoundingClientRect()
                  setHover({ x: b.left - box.left + b.width / 2, y: b.top - box.top - 8, r })
                }}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className="rounded-l-md flex items-center justify-start pl-1.5"
                  style={{ width: `${longPct}%`, background: POLARITY.collect }}
                >
                  {longPct >= 22 && <span className="num text-[9.5px] font-semibold text-white/95">{longPct.toFixed(0)}%</span>}
                </div>
                <div
                  className="rounded-r-md flex items-center justify-end pr-1.5"
                  style={{ width: `calc(${100 - longPct}% - 2px)`, marginLeft: 2, background: POLARITY.pay }}
                >
                  {100 - longPct >= 22 && (
                    <span className="num text-[9.5px] font-semibold text-white/95">{(100 - longPct).toFixed(0)}%</span>
                  )}
                </div>
              </div>
              <span className="w-14 shrink-0 num text-[11px] text-muted text-right">{fmtUsdCompact(r.oi, 0)}</span>
            </div>
          )
        })}

        <Tooltip at={hover}>
          {hover && (
            <>
              <span className="font-semibold">{hover.r.ticker}</span>
              <span className="text-muted"> · {hover.r.name}</span>
              <br />
              <span className="num">
                {(hover.r.longShare * 100).toFixed(0)}% long · {((1 - hover.r.longShare) * 100).toFixed(0)}% short
              </span>
              <br />
              <span className="num text-muted">OI {fmtUsdCompact(hover.r.oi)}</span>
            </>
          )}
        </Tooltip>
      </div>

      <Legend
        className="mt-4"
        items={[
          { label: 'Long', color: POLARITY.collect },
          { label: 'Short', color: POLARITY.pay },
        ]}
      />
    </ChartCard>
  )
}
