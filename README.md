# xVariational.xyz

Airdrop simulator for [Variational](https://variational.io) points.

- **Simulator** — sliders for FDV at TGE, share of supply to points and total points at TGE, with community consensus bands. Outputs value per point, your payout, your share and the airdrop pool.
- **Live protocol stats** — 24h volume, cumulative volume, open interest, TVL and market count from the public Omni API (`/metadata/stats`), refreshed every minute.
- **Polymarket consensus** — odds from "Variational FDV above ___ one day after launch?". Fetched live from the Gamma API when reachable, otherwise a dated snapshot in `src/lib/consensus.js`. Includes a probability-weighted expected FDV.
- **Share card** — dark/light PNG export, copy to clipboard, post on X.

## Develop

```
npm install
npm run dev
```

Nothing about a Variational airdrop has been announced. All numbers are community assumptions or prediction-market prices. Not financial advice.
