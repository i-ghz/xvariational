import { TOKENOMICS } from '../lib/tokenomics'
import { fmtInt } from '../lib/format'

const GAP = 2

/** The announced supply split. Facts, so it states rather than lets you fiddle. */
export function TokenomicsPanel() {
  return (
    <section className="card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-line flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="section-title !text-[16px]">$VAR tokenomics</h2>
          <p className="section-sub !text-[12.5px] !mt-0.5">
            Announced by Variational · TGE set for {TOKENOMICS.tgeQuarter}
          </p>
        </div>
        <span className="pill bg-accent-soft text-accent !text-[11.5px] !py-1 shrink-0">Confirmed</span>
      </div>

      <div className="p-5">
        <div className="flex h-9 rounded-md overflow-hidden">
          {TOKENOMICS.buckets.map((b, i) => (
            <div
              key={b.id}
              className="flex items-center justify-center"
              style={{
                width: `${b.share * 100}%`,
                background: b.color,
                marginLeft: i === 0 ? 0 : GAP,
                borderTopLeftRadius: i === 0 ? 6 : 0,
                borderBottomLeftRadius: i === 0 ? 6 : 0,
                borderTopRightRadius: i === TOKENOMICS.buckets.length - 1 ? 6 : 0,
                borderBottomRightRadius: i === TOKENOMICS.buckets.length - 1 ? 6 : 0,
              }}
            >
              <span className="num text-[12px] font-semibold text-white">{Math.round(b.share * 100)}%</span>
            </div>
          ))}
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {TOKENOMICS.buckets.map((b) => (
            <li key={b.id} className="flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0 mt-1" style={{ background: b.color }} />
              <div className="min-w-0">
                <span className="text-[13px] font-medium">{b.label}</span>
                <span className="text-[12.5px] text-muted"> — {b.note}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-line grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12.5px]">
          <div>
            <div className="label mb-1">Weekly drop</div>
            <div className="num font-semibold">{fmtInt(TOKENOMICS.weeklyPoints)} pts</div>
          </div>
          <div>
            <div className="label mb-1">To claim</div>
            <div className="num font-semibold">≥ {TOKENOMICS.minPointsToClaim} point</div>
          </div>
          <div>
            <div className="label mb-1">Unclaimed</div>
            <div className="font-semibold">Burned</div>
          </div>
        </div>
      </div>
    </section>
  )
}
