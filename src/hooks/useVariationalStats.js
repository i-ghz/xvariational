import { useCallback, useEffect, useRef, useState } from 'react'
import { STATS_ENDPOINT } from '../lib/config'
import { normalizeStats } from '../lib/markets'

const REFRESH_MS = 45_000

/**
 * Variational's public read-only endpoint (docs.variational.io → Technical documentation → API).
 * Rate limit is 10 req / 10 s per IP, so one poll every 45 s is well inside it.
 */
export function useVariationalStats() {
  const [state, setState] = useState({ data: null, error: null, updatedAt: null, loading: true })
  const alive = useRef(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch(STATS_ENDPOINT, { headers: { accept: 'application/json' } })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const json = await res.json()
      if (!alive.current) return
      setState({ data: normalizeStats(json), error: null, updatedAt: new Date(), loading: false })
    } catch (e) {
      if (!alive.current) return
      setState((s) => ({ ...s, error: e, loading: false }))
    }
  }, [])

  useEffect(() => {
    alive.current = true
    load()
    const id = setInterval(load, REFRESH_MS)
    const onFocus = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      alive.current = false
      clearInterval(id)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [load])

  return { ...state, refresh: load }
}
