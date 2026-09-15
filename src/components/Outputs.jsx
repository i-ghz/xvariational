import { fmtUsd, fmtUsd2, fmtUsdCompact, fmtPct, fmtCompact, fmtPoints } from '../lib/format'

function Tile({ label, value, sub, accent }) {
  return (
    <div className="card p-6 md:p-7">
      <div className="label mb-3">{label}</div>
      <div className={`num text-[30px] md:text-[34px] font-semibold tracking-tight leading-none ${accent ? 'text-accent' : 'text-text'}`}>{value}</div>
      <div className="text-[13px] text-muted mt-3">{sub}</div>
    </div>
  )
}

export function Outputs({ userPoints, result, fdv, share, totalPoints }) {
  const has = userPoints > 0
  const targets = [1_000, 10_000, 100_000]
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Tile label="Value per point" value={fmtUsd2(result.perPoint)} sub={`${fmtUsdCompact(result.pool)} split across ${fmtCompact(totalPoints)} points`} />
        <Tile label="Your payout" value={has ? fmtUsd(result.value) : '$0'} sub={has ? `${fmtPoints(userPoints)} points × ${fmtUsd2(result.perPoint)}` : 'enter your points to see this'} accent />
        <Tile label="Your share" value={has ? `${(result.userShare * 100).toFixed(4)}%` : '·'} sub="of every point in existence at TGE" />
        <Tile label="Airdrop pool" value={fmtUsdCompact(result.pool)} sub={`${fmtPct(share)} of a ${fmtUsdCompact(fdv)} FDV`} />
      </div>

      <div className="card p-6 md:p-7">
        <h3 className="text-[17px] font-semibold tracking-tight">What each payout costs</h3>
        <p className="text-[13px] text-muted mt-1 mb-4">Points needed under the assumptions on the left.</p>
        <div className="divide-y divide-line">
          {targets.map((t) => (
            <div key={t} className="flex items-center justify-between py-3 text-[15px] num">
              <span className="text-muted">{fmtUsd(t)}</span>
              <span className="font-semibold">{result.perPoint > 0 ? fmtPoints(t / result.perPoint) : '—'} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
