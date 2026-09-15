// The stats endpoint returns one flat list of every listing, with no asset class on it.
// Variational Omni lists crypto, US equities, ETFs/indices and commodities side by side,
// so we tag them here to make the market list browsable.

const ETF_NAME = /\bETFs?\b|Trust, Series|SPDR|iShares|Direxion|ProShares|Invesco|KraneShares|Roundhill|Sprott|Index Fund|Futures ETF/i

const EQUITY_NAME =
  /(,? Inc\b|Incorporated|Corp\b|Corporation|Company\b|Co\.|\bLtd\b|Limited\b|\bplc\b|N\.V\.|S\.A\.|Common Stock|Class [A-C]\b|Holdings\b|Depositary Shares|\bADR\b|Technologies\b|Systems\b|Semiconductor\b|Pharmaceuticals?\b|Bancorp\b)/i

// Explicit overrides: tokens whose names read like companies, and index/commodity swaps.
const CRYPTO_OVERRIDE = new Set(['TWT', 'TA', 'GIGGLE', 'TRUST', 'GAS', 'ONG', 'PAXG', 'XAUT', 'AGLD', 'CAKE', 'GWEI'])
const COMMODITY = new Set(['XAU', 'XAG', 'XPT', 'XPD', 'CL', 'BZ', 'NATGAS', 'COPPER', 'XAUS', 'XAGS', 'USOILP', 'UKOILP'])
const INDEX = new Set(['US500S', 'US100S', 'US30S', 'US2000S', 'JP225S', 'DE40S', 'EU50S'])
const PRE_IPO = new Set(['OPENAI', 'SPACEX', 'ANTHROPIC', 'XAI', 'STRIPE'])

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'index', label: 'Indices & ETFs' },
  { id: 'commodity', label: 'Commodities' },
]

export function classify({ ticker, name }) {
  if (COMMODITY.has(ticker)) return 'commodity'
  if (INDEX.has(ticker)) return 'index'
  if (CRYPTO_OVERRIDE.has(ticker)) return 'crypto'
  if (PRE_IPO.has(ticker)) return 'stocks'
  if (ETF_NAME.test(name)) return 'index'
  if (EQUITY_NAME.test(name)) return 'stocks'
  return 'crypto'
}

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/**
 * Open interest is USD on both sides, but each side is reported at half the size
 * Omni itself displays: doubling reproduces both the per-market figure on
 * omni.variational.io and the endpoint's own `open_interest` total (verified
 * against BTC: 154.0M reported, 308.0M shown, $307.79M on Omni).
 *
 * funding_rate is annualised, as a decimal (0.0928 = +9.28% APR) — Omni's "Ann.
 * Funding" column matches. Swap markets quote separate long/short rates that
 * this endpoint does not carry, so theirs comes back as 0 and is shown as "—".
 */
const OI_SCALE = 2

export function normalizeListing(l) {
  const long = num(l.open_interest?.long_open_interest) * OI_SCALE
  const short = num(l.open_interest?.short_open_interest) * OI_SCALE
  const price = num(l.mark_price)
  const bid = num(l.quotes?.base?.bid)
  const ask = num(l.quotes?.base?.ask)
  // The six swap markets are exactly the ones with no funding interval.
  const isSwap = !l.funding_interval_s
  return {
    ticker: l.ticker,
    name: l.name,
    category: classify(l),
    isSwap,
    price,
    volume24h: num(l.volume_24h),
    longOi: long,
    shortOi: short,
    oi: long + short,
    skew: long + short > 0 ? (long - short) / (long + short) : 0,
    fundingApr: isSwap ? null : num(l.funding_rate),
    fundingIntervalS: l.funding_interval_s || 0,
    spreadBps: num(l.base_spread_bps),
    bid,
    ask,
  }
}

export function normalizeStats(json) {
  const listings = (json.listings || []).map(normalizeListing)
  const byCategory = listings.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1
    return acc
  }, {})

  // Funding on dead micro-markets swings to absurd numbers, so the radar only
  // considers markets with enough size behind them to mean anything.
  const funded = listings.filter((l) => l.fundingApr && l.oi >= 500e3 && l.volume24h >= 50e3)

  return {
    volume24h: num(json.total_volume_24h),
    cumulativeVolume: num(json.cumulative_volume),
    tvl: num(json.tvl),
    openInterest: num(json.open_interest),
    numMarkets: json.num_markets ?? listings.length,
    listings,
    byCategory,
    topVolume: [...listings].sort((a, b) => b.volume24h - a.volume24h).slice(0, 8),
    longestFunding: [...funded].sort((a, b) => b.fundingApr - a.fundingApr).slice(0, 5),
    shortestFunding: [...funded].sort((a, b) => a.fundingApr - b.fundingApr).slice(0, 5),
  }
}

// `dir` is the direction that makes each column useful at a glance:
// biggest volume first, but tightest spread first.
export const SORTS = [
  { id: 'volume24h', label: '24h volume', dir: 'desc' },
  { id: 'oi', label: 'Open interest', dir: 'desc' },
  { id: 'fundingApr', label: 'Funding', dir: 'desc' },
  { id: 'spreadBps', label: 'Spread', dir: 'asc' },
]

export const sortDir = (id) => SORTS.find((s) => s.id === id)?.dir || 'desc'

export function filterMarkets(listings, { category, query, sort, dir = 'desc' }) {
  const q = query.trim().toLowerCase()
  const out = listings.filter(
    (l) =>
      (category === 'all' || l.category === category) &&
      (!q || l.ticker.toLowerCase().includes(q) || l.name.toLowerCase().includes(q)),
  )
  const sign = dir === 'asc' ? -1 : 1
  // Swap markets carry no funding rate; keep them last rather than at the top.
  return out.sort((a, b) => sign * ((b[sort] ?? -Infinity) - (a[sort] ?? -Infinity)))
}
