import { ChartCard, Legend, Tooltip } from './chart-ui'
import { useHover, GRID, AXIS_TEXT } from './chart-tokens'
import { POLARITY } from '../../lib/analytics'

const W = 520
const H = 195
const PAD = { top: 10, right: 10, bottom: 56, left: 30 }
const MAX_BAR = 24

export function FundingHistogram({ data }) {
  const [hover, setHover] = useHover()

  if (!data?.total) {
    return (
      <ChartCard title="Which way funding leans">
        <div className="h-40 animate-breathe bg-sunken rounded-md" />
      </ChartCard>
    )
  }

  const { bins, max, paying, collecting, flat, total } = data
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const band = plotW / bins.length
  const barW = Math.min(MAX_BAR, band - 2) // 2px surface gap between neighbours
  const y = (c) => PAD.top + plotH * (1 - c / max)

  return (
    <ChartCard
      title="Which way funding leans"
      sub={`${total} markets with real size and a live rate, bucketed by annualised funding.`}
      note={`${paying} markets have longs paying, ${collecting} have shorts paying${flat ? `, and ${flat} sit flat at zero` : ''}. The pile-up near +11% is the funding cap.`}
    >
      <div className="relative" data-chart>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Distribution of annualised funding rates">
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(max * t)} y2={y(max * t)} stroke={GRID} strokeWidth="1" />
              <text x={PAD.left - 5} y={y(max * t) + 3.5} textAnchor="end" fontSize="9.5" fill={AXIS_TEXT}>
                {Math.round(max * t)}
              </text>
            </g>
          ))}

          {bins.map((b, i) => {
            const isPay = b.from >= 0
            const cx = PAD.left + band * i + band / 2
            const h = Math.max(b.count > 0 ? 3 : 0, plotH * (b.count / max))
            return (
              <g key={b.label}>
                <rect
                  x={cx - barW / 2}
                  y={PAD.top + plotH - h}
                  width={barW}
                  height={h}
                  rx="4"
                  fill={isPay ? POLARITY.pay : POLARITY.collect}
                  opacity={hover && hover.label !== b.label ? 0.45 : 1}
                />
                {/* square off the baseline end: 4px rounding on the data end only */}
                <rect
                  x={cx - barW / 2}
                  y={PAD.top + plotH - Math.min(h, 4)}
                  width={barW}
                  height={Math.min(h, 4)}
                  fill={isPay ? POLARITY.pay : POLARITY.collect}
                  opacity={hover && hover.label !== b.label ? 0.45 : 1}
                />
                <rect
                  x={cx - band / 2}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() =>
                    setHover({ ...b, x: `${(cx / W) * 100}%`, y: `${((PAD.top + plotH - h - 8) / H) * 100}%`, isPay })
                  }
                  onMouseLeave={() => setHover(null)}
                />
              </g>
            )
          })}

          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + plotH} y2={PAD.top + plotH} stroke={GRID} strokeWidth="1" />

          {bins.map((b, i) => {
            const cx = PAD.left + band * i + band / 2
            return (
              <text
                key={b.label}
                x={cx}
                y={PAD.top + plotH + 8}
                textAnchor="end"
                fontSize="8.5"
                fill={AXIS_TEXT}
                transform={`rotate(-45 ${cx} ${PAD.top + plotH + 8})`}
              >
                {b.label}
              </text>
            )
          })}
          <text x={(PAD.left + W - PAD.right) / 2} y={H - 3} textAnchor="middle" fontSize="9" fill={AXIS_TEXT}>
            annualised funding rate
          </text>
        </svg>

        <Tooltip at={hover}>
          {hover && (
            <>
              <span className="num font-semibold">{hover.count}</span>
              <span className="text-muted"> market{hover.count === 1 ? '' : 's'}</span>
              <br />
              <span className="num">{hover.label}</span>
              <span className="text-muted"> · {hover.isPay ? 'longs pay' : 'shorts pay'}</span>
            </>
          )}
        </Tooltip>
      </div>

      <Legend
        className="mt-3"
        items={[
          { label: 'Longs pay', color: POLARITY.pay },
          { label: 'Shorts pay', color: POLARITY.collect },
        ]}
      />
    </ChartCard>
  )
}
