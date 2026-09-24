import { useEffect, useState } from 'react'
import { msUntilFunding, formatCountdown } from '../lib/funding-clock'

/**
 * Ticking countdown to a market's next funding settlement. Swap markets report
 * no interval, so they get nothing rather than an invented time.
 */
export function FundingClock({ intervalSeconds, className = '' }) {
  // The clock only needs a heartbeat; the time itself is read fresh each render.
  const [, tick] = useState(0)

  useEffect(() => {
    if (!intervalSeconds) return
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [intervalSeconds])

  const left = msUntilFunding(intervalSeconds)
  if (!intervalSeconds || left == null) return null

  // Inside the last ten minutes it is about to matter.
  const soon = left < 10 * 60 * 1000

  return (
    <span
      className={`num tabular-nums ${soon ? 'text-accent font-medium' : 'text-dim'} ${className}`}
      title={`Funding settles every ${intervalSeconds / 3600}h, on the UTC boundary`}
    >
      {formatCountdown(left)}
    </span>
  )
}
