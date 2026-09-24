import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { MobileCta } from './components/MobileCta'
import { Home } from './pages/Home'
import { MarketsPage } from './pages/MarketsPage'
import { useVariationalStats } from './hooks/useVariationalStats'
import { usePolymarket } from './hooks/usePolymarket'
import { ASSUMPTIONS, payout } from './lib/consensus'
import { TOKENOMICS } from './lib/tokenomics'

const STORAGE_KEY = 'xv-points'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

export default function App() {
  // The simulator is on the home page and on /airdrop, so its inputs live here.
  const [points, setPoints] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
  })
  const [fdv, setFdv] = useState(ASSUMPTIONS.fdv.default)
  const [totalPoints, setTotalPoints] = useState(ASSUMPTIONS.totalPoints.default)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, points) } catch { /* private mode */ }
  }, [points])

  const stats = useVariationalStats()
  const market = usePolymarket()

  const userPoints = Math.max(0, parseFloat(points) || 0)
  const share = TOKENOMICS.genesisShare // announced, not a guess
  const result = useMemo(
    () => payout({ userPoints, fdv, share, totalPoints }),
    [userPoints, fdv, share, totalPoints],
  )

  const reset = () => {
    setFdv(ASSUMPTIONS.fdv.default)
    setTotalPoints(ASSUMPTIONS.totalPoints.default)
  }

  const sim = {
    points, setPoints,
    fdv, setFdv,
    totalPoints, setTotalPoints,
    share,
    userPoints, result, reset,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Nav />
      <main className="flex-1 mx-auto w-full max-w-[1200px] px-4 md:px-7 py-6 md:py-9">
        <Routes>
          <Route path="/" element={<Home stats={stats} sim={sim} market={market} />} />
          <Route path="/markets" element={<MarketsPage stats={stats} />} />
          {/* older links: the dashboard folded into /markets, the simulator into / */}
          <Route path="/stats" element={<Navigate to="/markets" replace />} />
          <Route path="/funding" element={<Navigate to="/markets" replace />} />
          <Route path="/airdrop" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileCta />
      <Analytics />
    </div>
  )
}
