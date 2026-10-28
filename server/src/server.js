import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { start, snapshot, historyFor } from './polymarket.js'
import { getData as variational } from './variational.js'

const app = new Hono()
const started = Date.now()

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'] }))

app.get('/health', (c) => c.json({ ok: true, uptime: Math.round((Date.now() - started) / 1000) }))

app.get('/polymarket', (c) => {
  const snap = snapshot()
  c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  return c.json(snap, snap.ok ? 200 : 503)
})

app.get('/polymarket/history/:fdv', (c) => {
  c.header('Cache-Control', 'public, max-age=300')
  return c.json({ fdv: Number(c.req.param('fdv')), points: historyFor(c.req.param('fdv')) })
})

const CACHE = 'public, max-age=60, stale-while-revalidate=120'
const unavailable = (c, r) => (c.header('Cache-Control', 'no-store'), c.json({ ok: false, error: 'variational unavailable', detail: r.error }, 503))

app.get('/variational/stats', async (c) => {
  const r = await variational()
  c.header('Cache-Control', CACHE)
  if (!r.ok) return unavailable(c, r)
  return c.json({ ok: true, updatedAt: r.updatedAt, stale: r.stale, ...r.data.stats })
})

app.get('/variational/markets', async (c) => {
  const r = await variational()
  c.header('Cache-Control', CACHE)
  if (!r.ok) return unavailable(c, r)
  const limit = Math.max(0, Number(c.req.query('limit'))) || r.data.markets.length
  return c.json({ ok: true, updatedAt: r.updatedAt, stale: r.stale, count: r.data.markets.length, markets: r.data.markets.slice(0, limit) })
})

app.get('/variational/markets/:ticker', async (c) => {
  const r = await variational()
  c.header('Cache-Control', CACHE)
  if (!r.ok) return unavailable(c, r)
  const t = c.req.param('ticker').toUpperCase()
  const m = r.data.markets.find((x) => x.ticker === t || x.ticker === `${t}-PERP`)
  if (!m) return c.json({ ok: false, error: 'market not found' }, 404)
  return c.json({ ok: true, updatedAt: r.updatedAt, stale: r.stale, market: m })
})

const port = Number(process.env.PORT || 3000)
start().then(() => {
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })
  console.log(`[xvariational] listening on :${port}`)
})
