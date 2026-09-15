const STEPS = 1000

export function Slider({ label, value, onChange, min, max, log = false, step, consensus, format, formatEdge }) {
  const toPos = (v) => (log ? Math.log(v / min) / Math.log(max / min) : (v - min) / (max - min))
  const toVal = (p) => {
    const raw = log ? min * Math.pow(max / min, p) : min + p * (max - min)
    return step ? Math.round(raw / step) * step : raw
  }
  const pos = toPos(value)
  const band = consensus ? [toPos(consensus[0]) * 100, toPos(consensus[1]) * 100] : null
  const edge = formatEdge || format

  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[15px] font-medium text-text">{label}</span>
        <span className="num text-[17px] font-semibold text-accent">{format(value)}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-white/10" />
        {band && (
          <div className="absolute h-1 rounded-full bg-up/60" style={{ left: `${band[0]}%`, width: `${band[1] - band[0]}%` }} />
        )}
        <div className="absolute h-1 rounded-full bg-accent" style={{ left: 0, width: `${pos * 100}%` }} />
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
      <div className="flex justify-between mt-2 text-[12px] text-dim num">
        <span>{edge(min)}</span>
        {consensus && (
          <span className="text-up/90">consensus {edge(consensus[0])} – {edge(consensus[1])}</span>
        )}
        <span>{edge(max)}</span>
      </div>
    </div>
  )
}
