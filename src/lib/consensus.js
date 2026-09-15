// Community assumptions. Nothing here is confirmed by Variational.
export const ASSUMPTIONS = {
  fdv: { min: 100e6, max: 5e9, default: 1e9, consensus: [500e6, 2e9], log: true },
  share: { min: 0.01, max: 0.6, default: 0.275, consensus: [0.25, 0.3], step: 0.005 },
  points: { min: 1e6, max: 30e6, default: 9.3e6, consensus: [9e6, 9.4e6], step: 50_000 },
}

export const SCENARIOS = [100e6, 300e6, 500e6, 1e9, 2e9, 5e9]

// Snapshot of the Polymarket event "Variational FDV above ___ one day after launch?"
// Used when the live Gamma API is unreachable (it is geo-blocked in several countries).
export const POLYMARKET_EVENT = {
  slug: 'variational-fdv-above-one-day-after-launch',
  url: 'https://polymarket.com/event/variational-fdv-above-one-day-after-launch',
  snapshotDate: '2026-09-15',
  volume: 2_474_702,
  endDate: '2027-12-31',
}

export const POLYMARKET_SNAPSHOT = [
  { fdv: 100e6, yes: 0.99, volume: 59_133 },
  { fdv: 200e6, yes: 0.98, volume: 55_788 },
  { fdv: 300e6, yes: 0.95, volume: 249_979 },
  { fdv: 500e6, yes: 0.86, volume: 863_620 },
  { fdv: 800e6, yes: 0.71, volume: 365_309 },
  { fdv: 1e9, yes: 0.61, volume: 366_914 },
]

export function payout({ userPoints, fdv, share, totalPoints }) {
  const pool = fdv * share
  const perPoint = totalPoints > 0 ? pool / totalPoints : 0
  return { pool, perPoint, value: perPoint * userPoints, userShare: totalPoints > 0 ? userPoints / totalPoints : 0 }
}

// Turn the "above X" cumulative curve into an expected FDV (probability-weighted midpoint of each bucket).
export function expectedFdv(markets) {
  const sorted = [...markets].sort((a, b) => a.fdv - b.fdv)
  if (!sorted.length) return null
  let expected = 0
  let prevProb = 1
  let prevFdv = 0
  for (const m of sorted) {
    const massInBucket = prevProb - m.yes
    expected += massInBucket * ((prevFdv + m.fdv) / 2)
    prevProb = m.yes
    prevFdv = m.fdv
  }
  // Tail above the last threshold: assume 1.5x the last threshold as midpoint.
  expected += prevProb * prevFdv * 1.5
  return expected
}
