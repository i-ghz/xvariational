import { useEffect, useState } from 'react'

const URL = 'https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats'

export function useVariationalStats() {
  const [state, setState] = useState({ data: null, error: null, updatedAt: null })

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(URL)
        if (!res.ok) throw new Error(res.statusText)
        const json = await res.json()
        if (!alive) return
        const listings = (json.listings || []).map((l) => ({
          ticker: l.ticker,
          name: l.name,
          price: Number(l.mark_price),
          volume24h: Number(l.volume_24h),
          oi: Number(l.open_interest?.long_open_interest || 0) + Number(l.open_interest?.short_open_interest || 0),
          funding: Number(l.funding_rate),
        }))
        setState({
          data: {
            volume24h: Number(json.total_volume_24h),
            cumulativeVolume: Number(json.cumulative_volume),
            tvl: Number(json.tvl),
            openInterest: Number(json.open_interest),
            numMarkets: json.num_markets,
            topByVolume: [...listings].sort((a, b) => b.volume24h - a.volume24h).slice(0, 6),
          },
          error: null,
          updatedAt: new Date(),
        })
      } catch (e) {
        if (alive) setState((s) => ({ ...s, error: e }))
      }
    }
    load()
    const id = setInterval(load, 60_000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  return state
}
