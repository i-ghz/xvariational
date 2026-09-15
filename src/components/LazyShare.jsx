import { lazy, Suspense } from 'react'

// html2canvas is heavy and only two pages ever draw a card, so it loads on demand.
const ShareEditorInner = lazy(() =>
  import('./ShareEditor').then((m) => ({ default: m.ShareEditor })),
)
const StatsShareInner = lazy(() =>
  import('./StatsShare').then((m) => ({ default: m.StatsShare })),
)

const Skeleton = () => <div className="card h-[320px] animate-breathe bg-sunken" />

export function ShareEditor(props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ShareEditorInner {...props} />
    </Suspense>
  )
}

export function StatsShare(props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <StatsShareInner {...props} />
    </Suspense>
  )
}
