import { useCallback, useEffect, useRef, useState } from 'react'
import { POLYMARKET_EVENT, POLYMARKET_SNAPSHOT } from '../lib/consensus'
import { API_BASE } from '../lib/config'

const BACKEND = `${API_BASE}/polymarket`
const GAMMA = `https://gamma-api.polymarket.com/events?slug=${POLYMARKET_EVENT.slug}`
const REFRESH_MS = 60_000

function parseFdv(title) {
  const m = /\$?\s*([\d.]+)\s*(M|B|Md|Mds)?/i.exec(title || '')
  if (!m) return null
  const n = parseFloat(m[1])
  const unit = (m[2] || '').toUpperCase()
  return unit.startsWith('B') || unit.startsWith('MD') ? n * 1e9 : n * 1e6
}

async function fetchJson(url, ms = 7000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const r = await fetch(url, { signal: ctrl.signal })
    if (!r.ok) throw new Error(r.statusText)
    return await r.json()
  } finally {
    clearTimeout(timer)
  }
}

// Our backend: already normalised, includes bid/ask and 24h/7d changes.
async function fromBackend() {
  const d = await fetchJson(BACKEND)
  if (!d?.ok || !d.markets?.length) throw new Error('backend empty')
  return {
    markets: d.markets.filter((m) => !m.closed),
    event: d.event,
    volume: d.event?.volume || 0,
    live: true,
    source: 'backend',
    updatedAt: new Date(d.updatedAt),
    stale: !!d.stale,
  }
}

// Direct Gamma call: works where Polymarket is not geo-blocked.
async function fromGamma() {
  const events = await fetchJson(GAMMA, 6000)
  const ev = Array.isArray(events) ? events[0] : null
  if (!ev) throw new Error('event not found')
  const markets = (ev.markets || [])
    .filter((m) => !m.closed)
    .map((m) => {
      const fdv = parseFdv(m.groupItemTitle || m.question)
      let prices = []
      try { prices = JSON.parse(m.outcomePrices || '[]').map(Number) } catch { /* ignore */ }
      if (!fdv || !Number.isFinite(prices[0])) return null
      return {
        fdv, yes: prices[0], no: prices[1] ?? 1 - prices[0],
        bestBid: m.bestBid != null ? Number(m.bestBid) : null,
        bestAsk: m.bestAsk != null ? Number(m.bestAsk) : null,
        volume: Number(m.volume || 0), volume24h: Number(m.volume24hr || 0),
        liquidity: Number(m.liquidityNum ?? m.liquidity ?? 0),
        change24h: m.oneDayPriceChange != null ? Number(m.oneDayPriceChange) : null,
        change7d: m.oneWeekPriceChange != null ? Number(m.oneWeekPriceChange) : null,
        slug: m.slug,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.fdv - b.fdv)
  if (!markets.length) throw new Error('no markets')
  return {
    markets,
    event: { volume: Number(ev.volume || 0), volume24h: Number(ev.volume24hr || 0), liquidity: Number(ev.liquidity || 0), endDate: ev.endDate },
    volume: Number(ev.volume || 0),
    live: true,
    source: 'gamma',
    updatedAt: new Date(),
    stale: false,
  }
}

const SNAPSHOT = {
  markets: POLYMARKET_SNAPSHOT,
  event: { volume: POLYMARKET_EVENT.volume, endDate: POLYMARKET_EVENT.endDate },
  volume: POLYMARKET_EVENT.volume,
  live: false,
  source: 'snapshot',
  updatedAt: POLYMARKET_EVENT.snapshotDate,
  stale: true,
}

export function usePolymarket() {
  const [state, setState] = useState({ ...SNAPSHOT, loading: true })
  const alive = useRef(true)

  const load = useCallback(async () => {
    // Relay first, direct Gamma second, otherwise keep the bundled snapshot.
    const next = await fromBackend().catch(() => fromGamma()).catch(() => null)
    if (!alive.current) return
    setState((s) => (next ? { ...next, loading: false } : { ...s, loading: false }))
  }, [])

  useEffect(() => {
    alive.current = true
    // load() only sets state after awaiting the network, never synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    const id = setInterval(load, REFRESH_MS)
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      alive.current = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load])

  return { ...state, refresh: load }
}
