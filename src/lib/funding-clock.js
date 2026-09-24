/**
 * Omni settles funding on fixed UTC boundaries aligned to each market's interval:
 * an 8h market pays at 00:00 / 08:00 / 16:00 UTC, a 4h one every four hours, and
 * so on. Verified against Omni's own countdown on BTC-PERP (8h interval, 05:46 UTC,
 * their clock read 02:13 — exactly the gap to 08:00 UTC).
 *
 * Swap markets report interval 0 and settle on their own schedule, which this
 * endpoint does not carry, so they get no clock rather than a guessed one.
 */
export function nextFundingAt(intervalSeconds, now = Date.now()) {
  if (!intervalSeconds || intervalSeconds <= 0) return null
  const ms = intervalSeconds * 1000
  return Math.ceil(now / ms) * ms
}

export function msUntilFunding(intervalSeconds, now = Date.now()) {
  const at = nextFundingAt(intervalSeconds, now)
  return at == null ? null : Math.max(0, at - now)
}

/** hh:mm:ss, or mm:ss inside the last hour. */
export function formatCountdown(ms) {
  if (ms == null) return null
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
