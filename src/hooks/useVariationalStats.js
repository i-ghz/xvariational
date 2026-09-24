import { useCallback, useEffect, useRef, useState } from 'react'
import { STATS_ENDPOINT } from '../lib/config'
import { normalizeStats } from '../lib/markets'

/**
 * The endpoint is cached upstream: measured against it, the numbers only move
 * every one to three minutes, and identical bytes come back in between. Polling
 * faster just re-downloads ~280KB for nothing and walks into their rate limit
 * (10 requests per 10s per IP), which returns empty bodies.
 */
const REFRESH_MS = 60_000
const FAILURES_BEFORE_ERROR = 2

/** Cheap fingerprint to tell a genuinely new snapshot from a cached repeat. */
const fingerprint = (json) =>
  `${json.cumulative_volume}|${json.total_volume_24h}|${json.open_interest}|${json.tvl}`

export function useVariationalStats() {
  const [state, setState] = useState({
    data: null,
    prev: null,
    error: null,
    updatedAt: null,
    changedAt: null,
    loading: true,
    sessionStart: Date.now(),
  })
  const alive = useRef(true)
  const lastPrint = useRef(null)
  const failures = useRef(0)

  const load = useCallback(async () => {
    try {
      const res = await fetch(STATS_ENDPOINT, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      if (!json?.listings?.length) throw new Error('empty payload')
      if (!alive.current) return

      failures.current = 0
      const print = fingerprint(json)
      const unchanged = print === lastPrint.current
      lastPrint.current = print

      setState((s) => {
        // A cached repeat must not shift `prev`, or the feed would narrate
        // nothing and the heartbeat would pulse on no movement at all.
        if (unchanged && s.data) {
          return { ...s, error: null, updatedAt: new Date(), loading: false }
        }
        return {
          ...s,
          prev: s.data,
          data: normalizeStats(json),
          error: null,
          updatedAt: new Date(),
          changedAt: new Date(),
          loading: false,
        }
      })
    } catch (e) {
      if (!alive.current) return
      failures.current += 1
      // One bad poll is normal (their cache and rate limiter both return empties);
      // keep the last good snapshot on screen rather than blanking the page.
      setState((s) => ({
        ...s,
        loading: false,
        error: failures.current >= FAILURES_BEFORE_ERROR ? e : s.error,
      }))
    }
  }, [])

  useEffect(() => {
    alive.current = true
    load()
    let id = setInterval(load, REFRESH_MS)
    const onVisibility = () => {
      clearInterval(id)
      if (document.visibilityState === 'visible') {
        load()
        id = setInterval(load, REFRESH_MS)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      alive.current = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [load])

  return { ...state, refresh: load }
}
