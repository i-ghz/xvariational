// The stats endpoint is a snapshot, not a time series — so instead of faking
// history, these turn one snapshot into the shapes Variational's own UI never
// shows: what the venue is made of, how concentrated it is, and which way it leans.

export const ASSET_CLASSES = [
  { id: 'crypto', label: 'Crypto', color: '#1c5bd9' },
  { id: 'stocks', label: 'Stocks', color: '#0d9488' },
  { id: 'index', label: 'Indices & ETFs', color: '#7c3aed' },
  { id: 'commodity', label: 'Commodities', color: '#d97706' },
]

// Diverging pair for polarity. Warm = paying, cool = collecting.
export const POLARITY = { pay: '#c2255c', collect: '#1c5bd9', neutral: '#a0aec0' }

const sum = (xs, f) => xs.reduce((a, x) => a + f(x), 0)

/** Share of 24h volume and of open interest held by each asset class. */
export function composition(listings = []) {
  const totalVol = sum(listings, (l) => l.volume24h)
  const totalOi = sum(listings, (l) => l.oi)

  const rows = ASSET_CLASSES.map((c) => {
    const group = listings.filter((l) => l.category === c.id)
    const volume = sum(group, (l) => l.volume24h)
    const oi = sum(group, (l) => l.oi)
    return {
      ...c,
      count: group.length,
      volume,
      oi,
      volumeShare: totalVol > 0 ? volume / totalVol : 0,
      oiShare: totalOi > 0 ? oi / totalOi : 0,
    }
  })

  return { rows, totalVol, totalOi }
}

/**
 * Lorenz-style curve: after ranking markets by 24h volume, what share of total
 * volume do the first N carry? Answers "how top-heavy is this venue".
 */
export function concentration(listings = []) {
  const ranked = [...listings].filter((l) => l.volume24h > 0).sort((a, b) => b.volume24h - a.volume24h)
  const total = sum(ranked, (l) => l.volume24h)
  if (!ranked.length || total <= 0) return { points: [], total: 0, tradedCount: 0, milestones: {} }

  const points = []
  let running = 0
  ranked.forEach((l, i) => {
    running += l.volume24h
    points.push({ rank: i + 1, share: running / total, ticker: l.ticker })
  })

  const at = (n) => (points[Math.min(n, points.length) - 1]?.share ?? 1)
  const milestones = { top5: at(5), top10: at(10), top25: at(25), top50: at(50) }

  return { points, full: points, total, tradedCount: ranked.length, milestones }
}

/** Histogram of annualised funding, bucketed and split by who is paying. */
export function fundingHistogram(listings = [], { minOi = 250e3 } = {}) {
  const edges = [-Infinity, -0.5, -0.25, -0.1, -0.03, 0, 0.03, 0.1, 0.25, 0.5, Infinity]
  const labels = ['<-50%', '-50/-25', '-25/-10', '-10/-3', '-3/0', '0/+3', '+3/+10', '+10/+25', '+25/+50', '>+50%']

  // Markets sitting at exactly zero carry no funding pressure — counting them
  // would pile 40+ flat markets into the first positive bucket.
  const pool = listings.filter((l) => l.fundingApr && l.oi >= minOi)
  const flat = listings.filter((l) => l.fundingApr === 0 && l.oi >= minOi).length
  const bins = labels.map((label, i) => ({ label, from: edges[i], to: edges[i + 1], count: 0 }))

  for (const l of pool) {
    const i = edges.findIndex((e, k) => k < edges.length - 1 && l.fundingApr >= e && l.fundingApr < edges[k + 1])
    if (i >= 0) bins[i].count += 1
  }

  const paying = pool.filter((l) => l.fundingApr > 0).length
  const collecting = pool.filter((l) => l.fundingApr < 0).length
  return { bins, total: pool.length, paying, collecting, flat, max: Math.max(1, ...bins.map((b) => b.count)) }
}

/** The biggest markets, and how lopsided their open interest is. */
export function skew(listings = [], n = 10) {
  return [...listings]
    .filter((l) => l.oi > 0)
    .sort((a, b) => b.oi - a.oi)
    .slice(0, n)
    .map((l) => ({
      ticker: l.ticker,
      name: l.name,
      isSwap: l.isSwap,
      oi: l.oi,
      longShare: l.oi > 0 ? l.longOi / l.oi : 0.5,
      skew: l.skew,
    }))
}

/** How hard each market turns its open interest over in a day. */
export function turnover(listings = [], n = 8, { minOi = 1e6 } = {}) {
  return listings
    .filter((l) => l.oi >= minOi && l.volume24h > 0)
    .map((l) => ({ ...l, turn: l.volume24h / l.oi }))
    .sort((a, b) => b.turn - a.turn)
    .slice(0, n)
}
