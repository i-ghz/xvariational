// Single source of truth for every outbound link.
// The referral code rides on every link to Variational, everywhere on the site.
export const REF_CODE = 'OMNIGHZ'

const OMNI_ORIGIN = 'https://omni.variational.io'

/** Build a referral-tagged Omni URL. `path` is optional ('/markets', '/points', …). */
export function omni(path = '/') {
  const url = new URL(path, OMNI_ORIGIN)
  url.searchParams.set('ref', REF_CODE)
  return url.toString()
}

/**
 * Deep link to one market. Omni routes perps and swaps differently, and both
 * use the ticker exactly as the stats API spells it (`/swap/US100S`, not US100).
 */
export const omniMarket = (ticker, isSwap = false) =>
  omni(`/${isSwap ? 'swap' : 'perpetual'}/${encodeURIComponent(ticker)}`)

export const LINKS = {
  omni: omni(),
  omniMarkets: omni('/markets'),
  omniPoints: omni('/points'),
  omniRewards: omni('/rewards'),
  docs: 'https://docs.variational.io',
  variational: 'https://variational.io',
  fundingView: 'https://fundingview.app',
  polymarket: 'https://polymarket.com/event/variational-fdv-above-one-day-after-launch',
  site: 'https://xvariational.xyz',
}

export const STATS_ENDPOINT =
  'https://omni-client-api.prod.ap-northeast-1.variational.io/metadata/stats'
