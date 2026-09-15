import { ChartCard, Legend, Tooltip } from './chart-ui'
import { useHover, SURFACE } from './chart-tokens'
import { fmtUsdCompact } from '../../lib/format'

const GAP = 2 // surface gap between segments — white does the separating

function ShareBar({ rows, keyName, label, total, onHover }) {
  const segments = rows.filter((r) => r[keyName] > 0.001)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12px] font-medium">{label}</span>
        <span className="num text-[12px] text-muted">{fmtUsdCompact(total)}</span>
      </div>
      <div className="relative flex h-8 rounded-md overflow-hidden" style={{ background: SURFACE }}>
        {segments.map((r, i) => {
          const pct = r[keyName] * 100
          // Only label inside when the text comfortably fits.
          const showLabel = pct >= 12
          return (
            <div
              key={r.id}
              className="relative flex items-center justify-center transition-[filter] hover:brightness-110 cursor-default"
              style={{
                width: `${pct}%`,
                background: r.color,
                marginLeft: i === 0 ? 0 : GAP,
                borderTopLeftRadius: i === 0 ? 6 : 0,
                borderBottomLeftRadius: i === 0 ? 6 : 0,
                borderTopRightRadius: i === segments.length - 1 ? 6 : 0,
                borderBottomRightRadius: i === segments.length - 1 ? 6 : 0,
              }}
              onMouseEnter={(e) => {
                const box = e.currentTarget.closest('[data-chart]').getBoundingClientRect()
                const r2 = e.currentTarget.getBoundingClientRect()
                onHover({
                  x: r2.left - box.left + r2.width / 2,
                  y: r2.top - box.top - 10,
                  row: r,
                  keyName,
                })
              }}
              onMouseLeave={() => onHover(null)}
            >
              {showLabel && (
                <span className="num text-[11px] font-semibold text-white/95">{pct.toFixed(0)}%</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CompositionChart({ data }) {
  const [hover, setHover] = useHover()
  if (!data) return <ChartCard title="What the venue is made of"><div className="h-28 animate-breathe bg-sunken rounded-md" /></ChartCard>

  const { rows, totalVol, totalOi } = data
  const topVol = [...rows].sort((a, b) => b.volumeShare - a.volumeShare)[0]

  return (
    <ChartCard
      title="What the venue is made of"
      sub="Share of the last 24 hours of volume, against share of open interest."
      note={
        topVol
          ? `${topVol.label} drive ${(topVol.volumeShare * 100).toFixed(0)}% of volume but hold ${(topVol.oiShare * 100).toFixed(0)}% of open interest — traded, not held.`
          : null
      }
    >
      <div className="relative flex flex-col gap-4" data-chart>
        <ShareBar rows={rows} keyName="volumeShare" label="24h volume" total={totalVol} onHover={setHover} />
        <ShareBar rows={rows} keyName="oiShare" label="Open interest" total={totalOi} onHover={setHover} />
        <Tooltip at={hover}>
          {hover && (
            <>
              <span className="font-semibold">{hover.row.label}</span>
              <span className="text-muted"> · {hover.row.count} markets</span>
              <br />
              <span className="num">
                {(hover.row[hover.keyName] * 100).toFixed(1)}% ·{' '}
                {fmtUsdCompact(hover.keyName === 'volumeShare' ? hover.row.volume : hover.row.oi)}
              </span>
            </>
          )}
        </Tooltip>
      </div>
      <Legend className="mt-4" items={rows.map((r) => ({ label: r.label, color: r.color }))} />
    </ChartCard>
  )
}
