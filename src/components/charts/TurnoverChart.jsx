import { ChartCard, Tooltip } from './chart-ui'
import { useHover } from './chart-tokens'
import { TradeLink } from '../TradeLink'
import { fmtUsdCompact } from '../../lib/format'

const ACCENT = '#1c5bd9'
const MAX_BAR = 24

/**
 * Volume divided by open interest: how many times a market turns its whole book
 * over in a day. Separates the venue's trading floor from its parking lot.
 */
export function TurnoverChart({ rows }) {
  const [hover, setHover] = useHover()

  if (!rows?.length) {
    return (
      <ChartCard title="Traded hardest, relative to size">
        <div className="h-40 animate-breathe bg-sunken rounded-md" />
      </ChartCard>
    )
  }

  const max = Math.max(...rows.map((r) => r.turn))
  const top = rows[0]

  return (
    <ChartCard
      title="Traded hardest, relative to size"
      sub="24h volume divided by open interest — how many times a book turns over in a day."
      note={`${top.ticker} churns its entire open interest ${top.turn.toFixed(1)} times a day. A market can be small and still be the busiest thing on the venue.`}
    >
      <div className="relative flex flex-col gap-2" data-chart>
        {rows.map((r) => (
          <TradeLink
            key={r.ticker}
            ticker={r.ticker}
            isSwap={r.isSwap}
            className="flex items-center gap-3 group"
            onMouseEnter={(e) => {
              const box = e.currentTarget.closest('[data-chart]').getBoundingClientRect()
              const b = e.currentTarget.getBoundingClientRect()
              setHover({ x: b.left - box.left + 120, y: b.top - box.top + b.height / 2, r })
            }}
            onMouseLeave={() => setHover(null)}
          >
            <span className="w-16 shrink-0 text-[11.5px] font-medium truncate group-hover:text-accent transition-colors">
              {r.ticker}
            </span>
            {/* the value keeps its own column so a full-width bar can never push it off */}
            <div className="flex-1 min-w-0" style={{ height: MAX_BAR - 8 }}>
              <div
                className="h-full rounded-r-[4px] transition-opacity"
                style={{
                  width: `${Math.max(2, (r.turn / max) * 100)}%`,
                  background: ACCENT,
                  opacity: hover && hover.r.ticker !== r.ticker ? 0.45 : 1,
                }}
              />
            </div>
            <span className="num text-[11px] text-muted w-12 shrink-0 text-right">{r.turn.toFixed(1)}×</span>
          </TradeLink>
        ))}

        <Tooltip at={hover}>
          {hover && (
            <>
              <span className="font-semibold">{hover.r.ticker}</span>
              <span className="text-muted"> · {hover.r.name}</span>
              <br />
              <span className="num">
                Vol {fmtUsdCompact(hover.r.volume24h, 1)} · OI {fmtUsdCompact(hover.r.oi, 1)}
              </span>
            </>
          )}
        </Tooltip>
      </div>
    </ChartCard>
  )
}
