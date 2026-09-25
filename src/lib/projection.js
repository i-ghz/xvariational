import { TOKENOMICS } from './tokenomics'

const WEEK_MS = 7 * 24 * 3600 * 1000

/** Whole weeks of 150k drops left before a given date. */
export function weeksUntil(dateISO, now = Date.now()) {
  const target = new Date(`${dateISO}T00:00:00Z`).getTime()
  return Math.max(0, Math.round((target - now) / WEEK_MS))
}

/** The announced Q4 window, in weeks from now. */
export function tgeWindowWeeks(now = Date.now()) {
  const min = weeksUntil(TOKENOMICS.tgeWindow.from, now)
  const max = weeksUntil(TOKENOMICS.tgeWindow.to, now)
  return { min, max, mid: Math.round((min + max) / 2) }
}

export const tierBoost = (id) => TOKENOMICS.tiers.find((t) => t.id === id)?.boost ?? 0

/**
 * Where a holder lands at TGE.
 *
 * `weeklyRate` is the user's own observed pace — Variational has never published
 * a points-per-volume formula, so it cannot be derived from trading volume and
 * has to come from the person reading the page.
 */
export function projectPoints({ pointsNow, weeklyRate, tier = 'iron', weeks }) {
  const boost = tierBoost(tier)
  const perWeek = Math.max(0, weeklyRate) * (1 + boost)
  const earned = perWeek * Math.max(0, weeks)
  return {
    boost,
    perWeek,
    earned,
    total: Math.max(0, pointsNow) + earned,
    /** Extra points the boost alone is responsible for. */
    fromBoost: Math.max(0, weeklyRate) * boost * Math.max(0, weeks),
  }
}

/**
 * Bear / base / bull, anchored on the stated bands rather than invented:
 * the FDV edges people keep quoting, against the points-supply edges.
 * Base is the geometric midpoint of the FDV band.
 */
export function scenarios({ fdvBand, supplyBand }) {
  const [fdvLow, fdvHigh] = fdvBand
  const [supplyLow, supplyHigh] = supplyBand
  return [
    { id: 'bear', label: 'Bear', fdv: fdvLow, supply: supplyHigh },
    { id: 'base', label: 'Base', fdv: Math.sqrt(fdvLow * fdvHigh), supply: (supplyLow + supplyHigh) / 2 },
    { id: 'bull', label: 'Bull', fdv: fdvHigh, supply: supplyLow },
  ]
}

export function valueAt({ userPoints, fdv, supply }) {
  const pool = fdv * TOKENOMICS.genesisShare
  const perPoint = supply > 0 ? pool / supply : 0
  return { pool, perPoint, value: perPoint * Math.max(0, userPoints) }
}
