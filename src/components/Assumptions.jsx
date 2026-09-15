import { RotateCcw } from 'lucide-react'
import { Slider } from './Slider'
import { ASSUMPTIONS } from '../lib/consensus'
import { fmtUsdCompact, fmtPct, fmtCompact } from '../lib/format'

export function Assumptions({ points, setPoints, fdv, setFdv, share, setShare, totalPoints, setTotalPoints, onReset }) {
  return (
    <section className="card p-6 md:p-8 flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold tracking-tight">Assumptions</h2>
          <p className="text-[13px] text-muted mt-1">Community estimates. Not confirmed by anyone.</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-[13px] text-muted hover:text-text transition-colors px-3 py-1.5 rounded-full hover:bg-white/5"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div>
        <label htmlFor="points" className="block text-[15px] font-medium mb-3">Your points</label>
        <div className="relative">
          <input
            id="points"
            type="number"
            inputMode="decimal"
            min="0"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="0"
            className="num w-full bg-panel-2 border border-line rounded-2xl px-5 py-4 text-[28px] font-semibold tracking-tight text-text placeholder:text-dim/60 focus:outline-none focus:border-accent/60 focus:shadow-glow transition-all"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[13px] text-dim">pts</span>
        </div>
        <p className="text-[12px] text-dim mt-2">Find them on the Omni rewards page. Type them by hand.</p>
      </div>

      <Slider
        label="FDV at TGE"
        value={fdv}
        onChange={setFdv}
        min={ASSUMPTIONS.fdv.min}
        max={ASSUMPTIONS.fdv.max}
        log
        step={10e6}
        consensus={ASSUMPTIONS.fdv.consensus}
        format={(v) => fmtUsdCompact(v, 2)}
        formatEdge={(v) => fmtUsdCompact(v, 1)}
      />
      <Slider
        label="Share of supply to points"
        value={share}
        onChange={setShare}
        min={ASSUMPTIONS.share.min}
        max={ASSUMPTIONS.share.max}
        step={ASSUMPTIONS.share.step}
        consensus={ASSUMPTIONS.share.consensus}
        format={(v) => fmtPct(v, 1)}
      />
      <Slider
        label="Total points at TGE"
        value={totalPoints}
        onChange={setTotalPoints}
        min={ASSUMPTIONS.points.min}
        max={ASSUMPTIONS.points.max}
        step={ASSUMPTIONS.points.step}
        consensus={ASSUMPTIONS.points.consensus}
        format={(v) => fmtCompact(v, { decimals: 2 })}
        formatEdge={(v) => fmtCompact(v, { decimals: 1 })}
      />
    </section>
  )
}
