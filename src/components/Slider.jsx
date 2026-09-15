const STEPS = 1000

export function Slider({ label, value, onChange, min, max, log = false, step, probably, format, formatEdge }) {
  const toPos = (v) => (log ? Math.log(v / min) / Math.log(max / min) : (v - min) / (max - min))
  const toVal = (p) => {
    const raw = log ? min * Math.pow(max / min, p) : min + p * (max - min)
    return step ? Math.round(raw / step) * step : raw
  }
  const pos = Math.min(1, Math.max(0, toPos(value)))
  const band = probably ? [toPos(probably[0]) * 100, toPos(probably[1]) * 100] : null
  const edge = formatEdge || format

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5 gap-4">
        <span className="text-[13.5px] font-medium">{label}</span>
        <span className="num text-[15px] font-semibold tracking-[-0.02em]">{format(value)}</span>
      </div>

      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-line" />
        {band && (
          <div className="absolute h-1.5 bg-up/30" style={{ left: `${band[0]}%`, width: `${band[1] - band[0]}%` }} />
        )}
        <div className="absolute h-1.5 rounded-full bg-accent" style={{ width: `${pos * 100}%` }} />
        <input
          type="range"
          className="slider relative z-10"
          min={0}
          max={STEPS}
          value={Math.round(pos * STEPS)}
          onChange={(e) => onChange(toVal(Number(e.target.value) / STEPS))}
          aria-label={label}
        />
      </div>

      <div className="flex justify-between mt-1.5 text-[11px] text-dim num">
        <span>{edge(min)}</span>
        {probably && <span className="text-up">probably {edge(probably[0])}–{edge(probably[1])}</span>}
        <span>{edge(max)}</span>
      </div>
    </div>
  )
}
