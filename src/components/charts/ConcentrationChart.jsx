import { useRef, useState } from 'react'
import { ChartCard, Tooltip } from './chart-ui'
import { GRID, AXIS_TEXT, SURFACE } from './chart-tokens'

const W = 520
const H = 190
const PAD = { top: 14, right: 16, bottom: 30, left: 34 }
const ACCENT = '#1c5bd9'

export function ConcentrationChart({ data }) {
  const [hover, setHover] = useState(null)
  const svgRef = useRef(null)

  if (!data?.full?.length) {
    return (
      <ChartCard title="How top-heavy the volume is">
        <div className="h-48 animate-breathe bg-sunken rounded-md" />
      </ChartCard>
    )
  }

  const { full, tradedCount, milestones } = data
  const maxRank = full.length

  // Nearly all the mass sits in the first few ranks, so rank runs on a log scale —
  // on a linear axis the curve is a vertical wall against a flat line.
  const lx = (rank) => Math.log10(rank)
  const spanX = lx(maxRank) || 1
  const x = (rank) => PAD.left + (lx(rank) / spanX) * (W - PAD.left - PAD.right)
  const y = (share) => PAD.top + (1 - share) * (H - PAD.top - PAD.bottom)

  const line = full.map((p, i) => `${i ? 'L' : 'M'}${x(p.rank).toFixed(2)},${y(p.share).toFixed(2)}`).join(' ')
  const area = `${line} L${x(maxRank).toFixed(2)},${y(0)} L${x(1).toFixed(2)},${y(0)} Z`

  const ticks = [1, 5, 10, 25, 50, 100, 250, maxRank].filter((t, i, a) => t <= maxRank && a.indexOf(t) === i)

  const onMove = (e) => {
    const box = svgRef.current.getBoundingClientRect()
    const px = ((e.clientX - box.left) / box.width) * W
    const rank = Math.round(10 ** (((px - PAD.left) / (W - PAD.left - PAD.right)) * spanX))
    const p = full[Math.min(Math.max(rank, 1), maxRank) - 1]
    if (p) setHover(p)
  }

  // Markers sit far apart on a log axis, so their labels cannot collide.
  // The curve climbs steeply through rank 5, so that label hangs to its left;
  // the flat stretch past rank 25 leaves room on the right.
  const markers = [
    { rank: 5, label: 'top 5', dx: -8, dy: -8, anchor: 'end' },
    { rank: 25, label: 'top 25', dx: 8, dy: -8, anchor: 'start' },
  ].filter((m) => m.rank <= maxRank)

  return (
    <ChartCard
      title="How top-heavy the volume is"
      sub={`Cumulative share of 24h volume walking down the ${tradedCount} markets that traded. Rank is on a log scale.`}
      note={`The five busiest markets alone carry ${(milestones.top5 * 100).toFixed(0)}% of everything traded, and the top 25 carry ${(milestones.top25 * 100).toFixed(0)}%. The tail is long and nearly flat.`}
    >
      <div className="relative" data-chart>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto select-none"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label="Cumulative share of 24 hour volume by market rank, log scale"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
              <text x={PAD.left - 6} y={y(t) + 3.5} textAnchor="end" fontSize="9.5" fill={AXIS_TEXT}>
                {t * 100}%
              </text>
            </g>
          ))}

          <path d={area} fill={ACCENT} fillOpacity="0.1" />
          <path d={line} fill="none" stroke={ACCENT} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {markers.map((m) => {
            const p = full[m.rank - 1]
            return (
              <g key={m.rank}>
                <line x1={x(m.rank)} x2={x(m.rank)} y1={y(p.share)} y2={y(0)} stroke={GRID} strokeWidth="1" />
                <circle cx={x(m.rank)} cy={y(p.share)} r="4" fill={ACCENT} stroke={SURFACE} strokeWidth="2" />
                <text x={x(m.rank) + m.dx} y={y(p.share) + m.dy} textAnchor={m.anchor} fontSize="10" fill={AXIS_TEXT}>
                  {m.label} · {(p.share * 100).toFixed(0)}%
                </text>
              </g>
            )
          })}

          {hover && (
            <>
              <line x1={x(hover.rank)} x2={x(hover.rank)} y1={PAD.top} y2={y(0)} stroke={AXIS_TEXT} strokeWidth="1" />
              <circle cx={x(hover.rank)} cy={y(hover.share)} r="4" fill={ACCENT} stroke={SURFACE} strokeWidth="2" />
            </>
          )}

          {ticks.map((t) => (
            <text key={t} x={x(t)} y={H - 12} textAnchor="middle" fontSize="9.5" fill={AXIS_TEXT}>
              {t}
            </text>
          ))}
          <text x={(PAD.left + W - PAD.right) / 2} y={H - 2} textAnchor="middle" fontSize="9" fill={AXIS_TEXT}>
            markets ranked by 24h volume
          </text>
        </svg>

        {hover && (
          <Tooltip
            at={{
              x: `${(x(hover.rank) / W) * 100}%`,
              y: `${(y(hover.share) / H) * 100}%`,
              flip: x(hover.rank) > W * 0.62,
            }}
          >
            <span className="num font-semibold">Top {hover.rank}</span>
            <span className="text-muted"> markets</span>
            <br />
            <span className="num">{(hover.share * 100).toFixed(1)}% of 24h volume</span>
          </Tooltip>
        )}
      </div>
    </ChartCard>
  )
}
