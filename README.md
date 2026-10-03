# xVariational.xyz

Airdrop simulator for [Variational](https://variational.io) points.

- **Simulator** — sliders for FDV at TGE, share of supply to points and total points at TGE, with community consensus bands. Outputs value per point, your payout, your share and the airdrop pool.
- **Live protocol stats** — 24h volume, cumulative volume, open interest, TVL and market count from the public Omni API (`/metadata/stats`), refreshed every minute.
- **Polymarket consensus** — live odds for "Variational FDV above ___ one day after launch?": yes probability, 24h change, buy yes/no prices, volume. Served by our relay in `server/` (Polymarket is geo-blocked in several countries), with direct Gamma and a dated snapshot as fallbacks. Includes a probability-weighted expected FDV.
- **Share card** — dark/light PNG export, copy to clipboard, post on X.

## Develop

```
npm install
npm run dev
```

Nothing about a Variational airdrop has been announced. All numbers are community assumptions or prediction-market prices. Not financial advice.
