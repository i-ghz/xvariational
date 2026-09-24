import { useMemo, useState } from 'react'
import { ChartCard, Legend, Tooltip } from './chart-ui'
import { useHover, SURFACE } from './chart-tokens'
import { omniMarket } from '../../lib/config'
import { ASSET_CLASSES, POLARITY } from '../../lib/analytics'
import { packBubbles, bubbleRadius } from '../../lib/bubbles'
import { fmtUsdCompact, fmtSignedPct, fmtPrice } from '../../lib/format'

const COUNT = 150
const VIEW = 420

const CLASS_BY_ID = Object.fromEntries(ASSET_CLASSES.map((c) => [c.id, c]))

function colourFor(m, mode) {
  if (mode === 'class') return CLASS_BY_ID[m.category]?.color || POLARITY.neutral
  if (m.fundingApr == null || m.fundingApr === 0) return POLARITY.neutral
  return m.fundingApr > 0 ? POLARITY.pay : POLARITY.collect
}

export function VenueHeartbeat({ stats, prev }) {
  const [hover, setHover] = useHover()
  const [mode, setMode] = useState('funding')

  const listings = stats?.listings

  const top = useMemo(
    () => (listings ? [...listings].sort((a, b) => b.oi - a.oi).slice(0, COUNT) : []),
    [listings],
  )

  // Layout depends only on the ranking, not the raw values, so a poll that nudges
  // open interest does not make every bubble jump to a new seat.
  const layoutKey = top.map((m) => m.ticker).join(',')
  const layout = useMemo(() => {
    if (!top.length) return null
    const max = top[0].oi
    const items = top.map((m) => ({ ticker: m.ticker, r: bubbleRadius(m.oi, { max }) }))
    return packBubbles(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutKey])

  // Which markets moved since the last poll — those get a one-shot pulse.
  const moved = useMemo(() => {
    if (!prev?.listings || !listings) return new Set()
    const before = new Map(prev.listings.map((l) => [l.ticker, l.oi]))
    const out = new Set()
    for (const l of listings) {
      const p = before.get(l.ticker)
      if (p != null && p > 0 && Math.abs(l.oi - p) / p > 0.004) out.add(l.ticker)
    }
    return out
  }, [prev, listings])

  if (!layout) {
    return (
      <ChartCard title="The venue, beating">
        <div className="h-[380px] animate-breathe bg-sunken rounded-md" />
      </ChartCard>
    )
  }

  const byTicker = new Map(top.map((m) => [m.ticker, m]))
  const scale = (VIEW / 2 - 6) / layout.extent

  return (
    <ChartCard
      title="The venue, beating"
      sub={`The ${COUNT} largest books, sized by open interest. It redraws as Omni's data moves — a ring marks what just changed.`}
      note="Every bubble opens that market on Omni."
      action={
        <div className="flex items-center gap-1 rounded-full border border-line p-1 shrink-0">
          {[
            { id: 'funding', label: 'Funding' },
            { id: 'class', label: 'Asset class' },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => setMode(o.id)}
              className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                mode === o.id ? 'bg-sunken text-ink' : 'text-dim hover:text-muted'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="relative mx-auto w-full max-w-[620px]" data-chart>
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="w-full h-auto" role="img" aria-label="Markets sized by open interest">
          <g transform={`translate(${VIEW / 2} ${VIEW / 2}) scale(${scale})`}>
            {layout.nodes.map((n) => {
              const m = byTicker.get(n.ticker)
              if (!m) return null
              const active = hover?.m.ticker === n.ticker
              return (
                <a
                  key={n.ticker}
                  href={omniMarket(m.ticker, m.isSwap)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() =>
                    setHover({
                      m,
                      x: `${((VIEW / 2 + n.x * scale) / VIEW) * 100}%`,
                      y: `${((VIEW / 2 + n.y * scale - n.r * scale - 6) / VIEW) * 100}%`,
                      flip: n.x > 0,
                    })
                  }
                  onMouseLeave={() => setHover(null)}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r}
                    fill={colourFor(m, mode)}
                    fillOpacity={active ? 1 : 0.88}
                    stroke={SURFACE}
                    strokeWidth={active ? 2.5 / scale : 1.2 / scale}
                    style={{ transition: 'fill-opacity .2s ease' }}
                  />
                  {moved.has(n.ticker) && (
                    <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke={colourFor(m, mode)} strokeWidth={2 / scale}>
                      <animate attributeName="r" from={n.r} to={n.r * 1.9} dur="1.6s" begin="0s" fill="freeze" />
                      <animate attributeName="opacity" from="0.8" to="0" dur="1.6s" begin="0s" fill="freeze" />
                    </circle>
                  )}
                  {n.r > 16 && (
                    <text
                      x={n.x}
                      y={n.y + 3.5 / scale}
                      textAnchor="middle"
                      fontSize={Math.min(11, n.r * 0.42)}
                      fill="#fff"
                      fontWeight="600"
                      pointerEvents="none"
                    >
                      {m.ticker}
                    </text>
                  )}
                </a>
              )
            })}
          </g>
        </svg>

        <Tooltip at={hover}>
          {hover && (
            <>
              <span className="font-semibold">{hover.m.ticker}</span>
              <span className="text-muted"> · {hover.m.name}</span>
              <br />
              <span className="num">
                {fmtPrice(hover.m.price)} · OI {fmtUsdCompact(hover.m.oi, 1)}
              </span>
              <br />
              <span className="num text-muted">
                {hover.m.fundingApr == null
                  ? 'no funding rate'
                  : `funding ${fmtSignedPct(hover.m.fundingApr)} APR`}
              </span>
            </>
          )}
        </Tooltip>
      </div>

      <Legend
        className="mt-3"
        items={
          mode === 'funding'
            ? [
                { label: 'Longs pay', color: POLARITY.pay },
                { label: 'Shorts pay', color: POLARITY.collect },
                { label: 'Flat', color: POLARITY.neutral },
              ]
            : ASSET_CLASSES.map((c) => ({ label: c.label, color: c.color }))
        }
      />
    </ChartCard>
  )
}
