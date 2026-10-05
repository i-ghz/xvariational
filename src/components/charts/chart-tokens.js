// Chart constants and hooks live apart from the components so fast-refresh works.
import { useState } from 'react'

export const SURFACE = '#0b101b'
export const GRID = '#1a2231'
export const AXIS_TEXT = '#6c829d'
export const INK = '#e9edf1'

export function useHover() {
  const [hover, setHover] = useState(null)
  return [hover, setHover]
}
