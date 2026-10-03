// Polls the Polymarket Gamma API for the Variational FDV event and keeps a
// 7-day price history on disk so the API can serve 24h / 7d changes.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const SLUG = process.env.POLYMARKET_SLUG || 'variational-fdv-above-one-day-after-launch'
const GAMMA = `https://gamma-api.polymarket.com/events?slug=${SLUG}`
const FILE = process.env.DATA_FILE || '/app/data/polymarket.json'
const POLL_MS = Number(process.env.POLL_MS || 120_000)
const HISTORY_STEP_MS = 10 * 60_000
const HISTORY_KEEP_MS = 8 * 24 * 3_600_000

let state = { ok: false, updatedAt: null, error: null, event: null, markets: [], history: {} }

function parseFdv(title) {
  const m = /\$?\s*([\d.]+)\s*(M|B|Md|Mds)?/i.exec(title || '')
  if (!m) return null
  const n = parseFloat(m[1])
  const unit = (m[2] || '').toUpperCase()
  return unit.startsWith('B') || unit.startsWith('MD') ? n * 1e9 : n * 1e6
}

const num = (v) => (v == null || v === '' ? null : Number(v))

function changeSince(hist, now, ms) {
  if (!hist?.length) return null
  const target = now - ms
  let best = null
  for (const [t, p] of hist) {
    if (t <= target && (best == null || t > best[0])) best = [t, p]
  }
  if (!best) best = hist[0]
  if (now - best[0] < ms * 0.5) return null // not enough history yet
  return best[1]
}

async function load() {
  try {
    const saved = JSON.parse(await readFile(FILE, 'utf8'))
    state = { ...state, ...saved }
  } catch { /* first run */ }
}

async function save() {
  try {
    await mkdir(dirname(FILE), { recursive: true })
    await writeFile(FILE, JSON.stringify({ updatedAt: state.updatedAt, event: state.event, markets: state.markets, history: state.history }))
  } catch (e) {
    console.warn('[polymarket] save failed', e.message)
  }
}

export async function poll() {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15_000)
  try {
    const res = await fetch(GAMMA, { signal: ctrl.signal, headers: { 'user-agent': 'xvariational.xyz/1.0' } })
    if (!res.ok) throw new Error(`gamma ${res.status}`)
    const events = await res.json()
    const ev = Array.isArray(events) ? events[0] : null
    if (!ev) throw new Error('event not found')

    const now = Date.now()
    const history = state.history || {}
    const markets = (ev.markets || [])
      .map((m) => {
        const fdv = parseFdv(m.groupItemTitle || m.question)
        let prices = []
        try { prices = JSON.parse(m.outcomePrices || '[]').map(Number) } catch { /* ignore */ }
        const yes = prices[0]
        if (!fdv || !Number.isFinite(yes)) return null

        const key = String(fdv)
        const hist = history[key] || []
        const last = hist[hist.length - 1]
        if (!last || now - last[0] >= HISTORY_STEP_MS) hist.push([now, yes])
        history[key] = hist.filter(([t]) => now - t <= HISTORY_KEEP_MS)

        const yes24hAgo = changeSince(history[key], now, 24 * 3_600_000)
        return {
          fdv,
          label: m.groupItemTitle,
          yes,
          no: prices[1] ?? 1 - yes,
          bestBid: num(m.bestBid),
          bestAsk: num(m.bestAsk),
          lastTrade: num(m.lastTradePrice),
          spread: num(m.spread),
          volume: num(m.volume) || 0,
          volume24h: num(m.volume24hr) || 0,
          liquidity: num(m.liquidityNum ?? m.liquidity) || 0,
          change24h: yes24hAgo == null ? num(m.oneDayPriceChange) : yes - yes24hAgo,
          change7d: num(m.oneWeekPriceChange),
          closed: !!m.closed,
          active: !!m.active,
          slug: m.slug,
          conditionId: m.conditionId,
          endDate: m.endDate,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.fdv - b.fdv)

    state = {
      ok: true,
      error: null,
      updatedAt: new Date(now).toISOString(),
      event: {
        slug: ev.slug,
        title: ev.title,
        url: `https://polymarket.com/event/${ev.slug}`,
        volume: num(ev.volume) || 0,
        volume24h: num(ev.volume24hr) || 0,
        liquidity: num(ev.liquidity) || 0,
        openInterest: num(ev.openInterest) || 0,
        endDate: ev.endDate,
        comments: ev.commentCount ?? null,
      },
      markets,
      history,
    }
    await save()
    console.log(`[polymarket] ${markets.length} markets · event vol ${Math.round(state.event.volume)}`)
  } catch (e) {
    state = { ...state, error: e.message, errorAt: new Date().toISOString() }
    console.warn('[polymarket] poll failed', e.message)
  } finally {
    clearTimeout(timer)
  }
}

export function snapshot() {
  const { history: _history, ...rest } = state
  return { ...rest, stale: state.updatedAt ? Date.now() - Date.parse(state.updatedAt) > POLL_MS * 3 : true }
}

export function historyFor(fdv) {
  return state.history?.[String(fdv)] || []
}

export async function start() {
  await load()
  await poll()
  setInterval(poll, POLL_MS)
}
