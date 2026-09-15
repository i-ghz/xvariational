import { useEffect, useState } from 'react'
import { POLYMARKET_EVENT, POLYMARKET_SNAPSHOT } from '../lib/consensus'

const URL = `https://gamma-api.polymarket.com/events?slug=${POLYMARKET_EVENT.slug}`

function parseFdv(title) {
  const m = /\$?\s*([\d.]+)\s*(M|B|Md|Mds)?/i.exec(title || '')
  if (!m) return null
  const n = parseFloat(m[1])
  const unit = (m[2] || '').toUpperCase()
  return unit.startsWith('B') || unit.startsWith('MD') ? n * 1e9 : n * 1e6
}

export function usePolymarket() {
  const [state, setState] = useState({
    markets: POLYMARKET_SNAPSHOT,
    volume: POLYMARKET_EVENT.volume,
    live: false,
    updatedAt: POLYMARKET_EVENT.snapshotDate,
  })

  useEffect(() => {
    let alive = true
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 6000)
    fetch(URL, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((events) => {
        const ev = Array.isArray(events) ? events[0] : null
        if (!ev || !alive) return
        const markets = (ev.markets || [])
          .filter((m) => !m.closed)
          .map((m) => {
            const fdv = parseFdv(m.groupItemTitle || m.question)
            let prices = []
            try { prices = JSON.parse(m.outcomePrices || '[]').map(Number) } catch { /* ignore */ }
            return fdv ? { fdv, yes: prices[0] ?? null, volume: Number(m.volume || 0) } : null
          })
          .filter((m) => m && m.yes != null)
          .sort((a, b) => a.fdv - b.fdv)
        if (markets.length) {
          setState({ markets, volume: Number(ev.volume || 0), live: true, updatedAt: new Date() })
        }
      })
      .catch(() => { /* keep snapshot */ })
      .finally(() => clearTimeout(timer))
    return () => { alive = false; ctrl.abort() }
  }, [])

  return state
}
