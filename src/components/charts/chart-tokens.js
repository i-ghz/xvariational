// Chart constants and hooks live apart from the components so fast-refresh works.
import { useState } from 'react'

export const SURFACE = '#ffffff'
export const GRID = '#e9edf1'
export const AXIS_TEXT = '#a0aec0'
export const INK = '#151a25'

export function useHover() {
  const [hover, setHover] = useState(null)
  return [hover, setHover]
}
