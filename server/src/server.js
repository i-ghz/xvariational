import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { start, snapshot, historyFor } from './polymarket.js'

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

const port = Number(process.env.PORT || 3000)
start().then(() => {
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })
  console.log(`[xvariational] listening on :${port}`)
})
