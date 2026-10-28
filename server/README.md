# xvariational backend

Tiny Hono service on vpstotal (`/opt/xvariational`, served at `https://api.xvariational.xyz/`, also `https://api.ghzcreative.ai/xvariational/`).
It exists because Polymarket's API is geo-blocked for part of the audience: the server polls it every
2 minutes and the frontend reads the cached result.

| Route | Returns |
|---|---|
| `GET /health` | `{ ok, uptime }` |
| `GET /polymarket` | event + markets (yes/no price, bid/ask, volume, liquidity, 24h and 7d change) |
| `GET /polymarket/history/:fdv` | `[timestamp, yesPrice]` points, 10-minute step, 8 days |
| `GET /variational/stats` | Variational Omni totals: 24h volume, cumulative volume, TVL, open interest, market count (cached 45 s, 503 if Variational is down) |
| `GET /variational/markets` | every Omni market sorted by 24h volume: mark price, funding, open interest, bid/ask quotes. `?limit=N` to truncate |
| `GET /variational/markets/:ticker` | one market (`btc` or `BTC-PERP`), 404 if unknown |

Deploy: `./server/deploy.sh`. Data persists in `/opt/xvariational/data/polymarket.json`.

Déployé automatiquement par `ghz-autodeploy` sur vpstotal après une fusion validée sur GitHub.
