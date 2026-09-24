// There is no history endpoint, so the only honest "live" story is the one that
// happens while you are watching: each poll is diffed against the last and the
// changes are narrated. Nothing here is reconstructed or back-filled.

const OI_MIN_MOVE = 250e3 // ignore noise on small books

let seq = 0
const mk = (kind, text, detail, tone) => ({ id: `${Date.now()}-${seq++}`, at: Date.now(), kind, text, detail, tone })

/**
 * Compare two normalised snapshots and narrate what moved.
 * Returns newest-first events plus the volume traded between the two polls.
 */
export function diffSnapshots(prev, next) {
  if (!prev || !next) return { events: [], tradedDelta: 0 }

  const events = []
  const tradedDelta = Math.max(0, next.cumulativeVolume - prev.cumulativeVolume)

  const before = new Map(prev.listings.map((l) => [l.ticker, l]))

  const oiMoves = []
  for (const l of next.listings) {
    const p = before.get(l.ticker)
    if (!p) {
      events.push(mk('new', `${l.ticker} just listed`, l.name, 'accent'))
      continue
    }

    const d = l.oi - p.oi
    if (Math.abs(d) >= OI_MIN_MOVE) oiMoves.push({ l, d })

    // A funding rate crossing zero flips who is being paid — the one change
    // that actually changes a decision.
    if (p.fundingApr != null && l.fundingApr != null && p.fundingApr !== 0 && l.fundingApr !== 0) {
      if (Math.sign(p.fundingApr) !== Math.sign(l.fundingApr)) {
        events.push(
          mk(
            'flip',
            `${l.ticker} funding flipped ${l.fundingApr > 0 ? 'positive' : 'negative'}`,
            l.fundingApr > 0 ? 'longs now pay' : 'shorts now pay',
            l.fundingApr > 0 ? 'pay' : 'collect',
            ),
        )
      }
    }
  }

  oiMoves.sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
  for (const { l, d } of oiMoves.slice(0, 2)) {
    events.push(mk('oi', `${l.ticker} open interest ${d > 0 ? 'grew' : 'shrank'}`, d, d > 0 ? 'collect' : 'pay'))
  }

  return { events, tradedDelta }
}
