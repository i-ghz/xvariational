// What is left to guess after the 2026-09-24 tokenomics announcement.
// The genesis share (32%) and the 150k weekly drip are now facts and live in
// lib/tokenomics.js; only these two are still open.
// `probably` is the range people keep landing on — a band, not a promise.
export const ASSUMPTIONS = {
  fdv: { min: 100e6, max: 5e9, default: 600e6, probably: [500e6, 2e9], log: true },
  // ~9.3M in circulation plus 150k a week until the Q4 TGE lands here.
  totalPoints: { min: 5e6, max: 25e6, default: 10.5e6, probably: [10e6, 11e6], step: 50_000 },
}

export const SCENARIOS = [100e6, 300e6, 600e6, 1e9, 2e9, 5e9]

// Snapshot of the Polymarket event "Variational FDV above ___ one day after launch?"
// Used when the live Gamma API is unreachable (it is geo-blocked in several countries).
export const POLYMARKET_EVENT = {
  slug: 'variational-fdv-above-one-day-after-launch',
  url: 'https://polymarket.com/event/variational-fdv-above-one-day-after-launch',
  snapshotDate: '2026-10-03',
  volume: 3_169_300,
  endDate: '2027-12-31',
}

export const POLYMARKET_SNAPSHOT = [
  { fdv: 100e6, yes: 0.995, volume: 81_181 },
  { fdv: 200e6, yes: 0.972, volume: 77_030 },
  { fdv: 300e6, yes: 0.949, volume: 268_036 },
  { fdv: 500e6, yes: 0.835, volume: 951_475 },
  { fdv: 800e6, yes: 0.705, volume: 461_755 },
  { fdv: 1e9, yes: 0.605, volume: 629_367 },
  { fdv: 2e9, yes: 0.32, volume: 316_423 },
  { fdv: 3e9, yes: 0.1, volume: 131_891 },
  { fdv: 4e9, yes: 0.054, volume: 161_455 },
  { fdv: 5e9, yes: 0.045, volume: 90_687 },
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
