/**
 * Greedy spiral packing. Circles are placed biggest-first from the centre
 * outwards, each one walking an expanding spiral until it clears everything
 * already down. Deterministic: the same ordering always yields the same
 * layout, so bubbles do not jump around between refreshes.
 */

const GOLDEN = Math.PI * (3 - Math.sqrt(5))

/**
 * Open interest spans four orders of magnitude, so a plain sqrt radius makes the
 * biggest market 30x the width of a mid one and buries the rest. A compressed
 * exponent plus a floor keeps every market visible while preserving the ranking.
 */
export function bubbleRadius(value, { max, exponent = 0.42, minR = 3.5, maxR = 46 }) {
  if (!(value > 0) || !(max > 0)) return minR
  const r = maxR * Math.pow(value / max, exponent)
  return Math.max(minR, Math.min(maxR, r))
}

export function packBubbles(items, { padding = 1.6, step = 2.2 } = {}) {
  const placed = []
  let extent = 0

  for (const item of items) {
    const r = item.r
    let x = 0
    let y = 0

    if (placed.length) {
      // Walk out along a spiral until this circle clears every placed one.
      let angle = placed.length * GOLDEN
      let radius = 0
      let ok = false
      let guard = 0
      while (!ok && guard < 20000) {
        x = Math.cos(angle) * radius
        y = Math.sin(angle) * radius
        ok = true
        for (let i = 0; i < placed.length; i++) {
          const p = placed[i]
          const dx = p.x - x
          const dy = p.y - y
          const need = p.r + r + padding
          if (dx * dx + dy * dy < need * need) { ok = false; break }
        }
        if (!ok) {
          angle += GOLDEN
          radius += step * 0.18
        }
        guard++
      }
    }

    placed.push({ ...item, x, y })
    extent = Math.max(extent, Math.hypot(x, y) + r)
  }

  return { nodes: placed, extent: extent || 1 }
}
