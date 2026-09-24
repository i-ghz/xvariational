import { useEffect, useState } from 'react'
import { Radio } from 'lucide-react'
import { diffSnapshots } from '../lib/session-feed'
import { fmtUsdCompact } from '../lib/format'

const MAX_EVENTS = 6

function since(start) {
  const s = Math.floor((Date.now() - start) / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
}

const TONE = {
  accent: 'bg-accent',
  pay: 'bg-[#c2255c]',
  collect: 'bg-accent',
}

/**
 * The venue has no history endpoint, so this narrates only what happens while
 * the page is open: each poll diffed against the last. The upstream data moves
 * every one to three minutes, so entries arrive in bursts rather than a stream.
 */
export function SessionFeed({ stats, prev, sessionStart }) {
  const [feed, setFeed] = useState({ events: [], traded: 0, seen: null })
  const [, tick] = useState(0)

  // Adjusting state while rendering on a changed input — React's documented
  // alternative to diffing inside an effect.
  if (stats && prev && stats !== feed.seen) {
    const { events: fresh, tradedDelta } = diffSnapshots(prev, stats)
    setFeed((f) => ({
      seen: stats,
      traded: f.traded + Math.max(0, tradedDelta),
      events: fresh.length ? [...fresh, ...f.events].slice(0, MAX_EVENTS) : f.events,
    }))
  }

  const { events, traded } = feed

  // keep the "on this page for N" label honest
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-line flex items-center justify-between gap-3 bg-sunken/60">
        <div className="flex items-center gap-2 min-w-0">
          <Radio size={14} className="text-accent shrink-0" />
          <span className="text-[13px] font-semibold tracking-[-0.01em]">Since you arrived</span>
          <span className="text-[11.5px] text-dim num shrink-0">· {since(sessionStart)}</span>
        </div>
        <span className="num text-[13px] font-semibold text-accent shrink-0">
          {fmtUsdCompact(traded)} traded
        </span>
      </div>

      <ul className="divide-y divide-line min-h-[120px]">
        {events.length === 0 && (
          <li className="px-5 py-8 text-center text-[12.5px] text-dim">
            Watching the tape. Omni's numbers refresh every minute or two — whatever moves lands here.
          </li>
        )}
        {events.map((e) => (
          <li key={e.id} className="px-5 py-2.5 flex items-center gap-3 animate-rise">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TONE[e.tone] || 'bg-dim'}`} />
            <span className="text-[12.5px] flex-1 min-w-0 truncate">
              {e.text}
              {e.kind === 'oi' ? (
                <span className="num text-muted"> by {fmtUsdCompact(Math.abs(e.detail), 1)}</span>
              ) : (
                e.detail && typeof e.detail === 'string' && <span className="text-dim"> · {e.detail}</span>
              )}
            </span>
            <span className="num text-[11px] text-dim shrink-0">
              {new Date(e.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
