# xvariational backend

Tiny Hono service on vpstotal (`/opt/xvariational`, served at `https://api.ghzcreative.ai/xvariational/`).
It exists because Polymarket's API is geo-blocked for part of the audience: the server polls it every
2 minutes and the frontend reads the cached result.

| Route | Returns |
|---|---|
| `GET /health` | `{ ok, uptime }` |
| `GET /polymarket` | event + markets (yes/no price, bid/ask, volume, liquidity, 24h and 7d change) |
| `GET /polymarket/history/:fdv` | `[timestamp, yesPrice]` points, 10-minute step, 8 days |

Deploy: `./server/deploy.sh`. Data persists in `/opt/xvariational/data/polymarket.json`.
