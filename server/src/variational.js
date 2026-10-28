// Read-only proxy for the public Variational Omni API (no key needed).
// Docs: https://docs.variational.io/technical-documentation/api
// One upstream call (/metadata/v2/stats) feeds both /variational/stats and
// /variational/markets; the result is cached in memory to stay well under the
// upstream rate limit (10 req / 10 s per IP).

const BASE = process.env.VARIATIONAL_API || 'https://omni-client-api.prod.ap-northeast-1.variational.io'
const STATS_URL = `${BASE}/metadata/v2/stats`
const CACHE_MS = Number(process.env.VARIATIONAL_CACHE_MS || 45_000)
const TIMEOUT_MS = 8_000
// If Variational is down, keep serving the last good copy for a while (flagged stale).
const STALE_MAX_MS = 5 * 60_000

let cache = { data: null, fetchedAt: 0 }
let inflight = null

const num = (v) => (v == null || v === '' ? null : Number(v))

function normalizeMarket(m) {
  const long = num(m.open_interest?.long_open_interest) || 0
  const short = num(m.open_interest?.short_open_interest) || 0
  return {
    ticker: m.ticker,
    name: m.name,
    type: m.contract_type,
    markPrice: num(m.mark_price),
    volume24h: num(m.volume_24h) || 0,
    openInterest: { long, short, total: long + short },
    funding: {
      lastAnnualized: num(m.funding?.last?.annualized_rate),
      lastInterval: num(m.funding?.last?.interval_rate),
      nextAnnualized: num(m.funding?.next?.annualized_rate),
      nextInterval: num(m.funding?.next?.interval_rate),
      intervalSeconds: m.funding?.interval_seconds ?? null,
      nextAt: m.funding?.next_timestamp ? new Date(m.funding.next_timestamp * 1000).toISOString() : null,
    },
    baseSpreadBps: num(m.base_spread_bps),
    quotes: {
      updatedAt: m.quotes?.updated_at ?? null,
      bid: num(m.quotes?.base?.bid),
      ask: num(m.quotes?.base?.ask),
      bid1k: num(m.quotes?.size_1k?.bid),
      ask1k: num(m.quotes?.size_1k?.ask),
      bid100k: num(m.quotes?.size_100k?.bid),
      ask100k: num(m.quotes?.size_100k?.ask),
    },
  }
}

async function fetchStats() {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(STATS_URL, { signal: ctrl.signal, headers: { 'user-agent': 'xvariational.xyz/1.0' } })
    if (!res.ok) throw new Error(`variational ${res.status}`)
    const raw = await res.json()
    if (!Array.isArray(raw?.listings)) throw new Error('unexpected payload')
    return {
      stats: {
        volume24h: num(raw.total_volume_24h),
        cumulativeVolume: num(raw.cumulative_volume),
        tvl: num(raw.tvl),
        openInterest: num(raw.open_interest),
        numMarkets: raw.num_markets ?? raw.listings.length,
        lossRefund: {
          poolSize: num(raw.loss_refund?.pool_size),
          refunded24h: num(raw.loss_refund?.refunded_24h),
        },
      },
      markets: raw.listings.map(normalizeMarket).sort((a, b) => b.volume24h - a.volume24h),
    }
  } catch (e) {
    throw new Error(e.name === 'AbortError' ? `timeout after ${TIMEOUT_MS / 1000}s` : e.message)
  } finally {
    clearTimeout(timer)
  }
}

// Returns { ok, data, updatedAt, stale, error }. Concurrent callers share one upstream request.
export async function getData() {
  const age = Date.now() - cache.fetchedAt
  if (cache.data && age < CACHE_MS) return { ok: true, data: cache.data, updatedAt: new Date(cache.fetchedAt).toISOString(), stale: false }

  inflight ??= fetchStats()
    .then((data) => { cache = { data, fetchedAt: Date.now() } })
    .finally(() => { inflight = null })

  try {
    await inflight
    return { ok: true, data: cache.data, updatedAt: new Date(cache.fetchedAt).toISOString(), stale: false }
  } catch (e) {
    console.warn('[variational] fetch failed', e.message)
    if (cache.data && Date.now() - cache.fetchedAt < STALE_MAX_MS) {
      return { ok: true, data: cache.data, updatedAt: new Date(cache.fetchedAt).toISOString(), stale: true, error: e.message }
    }
    return { ok: false, data: null, updatedAt: null, stale: true, error: e.message }
  }
}
