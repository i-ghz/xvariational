// Announced by Variational on 2026-09-24. These are facts, not assumptions —
// everything here comes from the official tokenomics post.
export const TOKENOMICS = {
  announcedOn: '2026-09-24',
  tgeQuarter: 'Q4 2026',
  tgeWindow: { from: '2026-10-01', to: '2026-12-31' },

  /** Share of total supply airdropped to points holders, 100% unlocked at TGE. */
  genesisShare: 0.32,
  weeklyPoints: 150_000,
  minPointsToClaim: 1,

  /** Boost to points earned, unlocked by 30-day volume (docs.variational.io). */
  tiers: [
    { id: 'iron', label: 'Iron', volume: 0, boost: 0 },
    { id: 'bronze', label: 'Bronze', volume: 1e6, boost: 0.005 },
    { id: 'silver', label: 'Silver', volume: 5e6, boost: 0.01 },
    { id: 'gold', label: 'Gold', volume: 25e6, boost: 0.02 },
    { id: 'platinum', label: 'Platinum', volume: 100e6, boost: 0.03 },
    { id: 'diamond', label: 'Diamond', volume: 750e6, boost: 0.04 },
    { id: 'infinity', label: 'Infinity', volume: 2.5e9, boost: 0.05 },
  ],

  /** What the access code hands a new account outright. */
  referralPerk: { tier: 'bronze', days: 90 },

  buckets: [
    { id: 'genesis', label: 'Genesis airdrop', share: 0.32, color: '#1c5bd9', note: 'To points holders. 100% unlocked at TGE.' },
    { id: 'ecosystem', label: 'Ecosystem reserve', share: 0.18, color: '#0d9488', note: "Held by the Variational Foundation." },
    { id: 'team', label: 'Team & investors', share: 0.50, color: '#a0aec0', note: 'Locked 12 months, then vesting over 3 years minimum.' },
  ],
}

/**
 * Every week adds 150k points to the denominator, so a holder who stops farming
 * is diluted even though their own balance never changes.
 */
export function weeklyDilution(userPoints, totalPoints) {
  if (!(userPoints > 0) || !(totalPoints > 0)) return 0
  const before = userPoints / totalPoints
  const after = userPoints / (totalPoints + TOKENOMICS.weeklyPoints)
  return (before - after) / before
}
