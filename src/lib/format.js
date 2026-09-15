const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })
const int = new Intl.NumberFormat('en-US')

export const fmtUsd = (n) => usd0.format(n || 0)
export const fmtUsd2 = (n) => usd2.format(n || 0)
export const fmtInt = (n) => int.format(Math.round(n || 0))

export function fmtCompact(n, { prefix = '', decimals = 2 } = {}) {
  const v = Number(n) || 0
  const abs = Math.abs(v)
  const unit = abs >= 1e12 ? [1e12, 'T'] : abs >= 1e9 ? [1e9, 'B'] : abs >= 1e6 ? [1e6, 'M'] : abs >= 1e3 ? [1e3, 'K'] : [1, '']
  const num = (v / unit[0]).toFixed(unit[1] ? decimals : 0)
  return `${prefix}${num.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1')}${unit[1]}`
}

export const fmtUsdCompact = (n, decimals = 2) => fmtCompact(n, { prefix: '$', decimals })
export const fmtPct = (x, decimals = 1) => `${(x * 100).toFixed(decimals)}%`
export const fmtSignedPct = (x, decimals = 2) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(decimals)}%`

/** Mark prices span 8 orders of magnitude here, so pick the precision from the value. */
export function fmtPrice(n) {
  const v = Number(n) || 0
  const abs = Math.abs(v)
  if (abs === 0) return '$0'
  if (abs >= 1000) return usd0.format(v)
  if (abs >= 1) return usd2.format(v)
  if (abs >= 0.01) return `$${v.toFixed(4)}`
  return `$${v.toPrecision(3)}`
}

export function fmtPoints(n) {
  const v = Number(n) || 0
  if (v >= 10000) return int.format(Math.round(v))
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function fmtInterval(seconds) {
  if (!seconds) return '—'
  const h = seconds / 3600
  return h >= 1 ? `${h}h` : `${Math.round(seconds / 60)}m`
}

export function fmtTime(date) {
  if (!date) return ''
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
