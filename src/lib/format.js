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

export function fmtPoints(n) {
  const v = Number(n) || 0
  if (v >= 10000) return int.format(Math.round(v))
  return v.toLocaleString('en-US', { maximumFractionDigits: 2 })
}
