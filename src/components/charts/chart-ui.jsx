/** Shared floating tooltip. Positioned in the chart's own relative box. */
export function Tooltip({ at, children }) {
  if (!at) return null
  return (
    <div
      className="pointer-events-none absolute z-20 rounded-lg border border-line bg-card px-2.5 py-1.5 shadow-lift
                 text-[11.5px] leading-snug whitespace-nowrap"
      style={{ left: at.x, top: at.y, transform: `translate(${at.flip ? '-100%' : '0'}, -50%)` }}
    >
      {children}
    </div>
  )
}

/** Identity is never colour-alone: every multi-series chart carries this. */
export function Legend({ items, className = '' }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 ${className}`}>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="num text-ink font-medium">{i.value}</span>}
        </li>
      ))}
    </ul>
  )
}

export function ChartCard({ title, sub, note, children, action }) {
  return (
    <section className="card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-[14.5px] font-semibold tracking-[-0.015em]">{title}</h3>
          {sub && <p className="text-[12px] text-muted mt-0.5 leading-relaxed">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
      {note && <p className="text-[11px] text-dim mt-3 leading-relaxed">{note}</p>}
    </section>
  )
}
