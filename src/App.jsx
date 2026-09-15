import { useMemo, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Nav } from './components/Nav'
import { StatsStrip } from './components/StatsStrip'
import { Assumptions } from './components/Assumptions'
import { Outputs } from './components/Outputs'
import { MarketConsensus } from './components/MarketConsensus'
import { ShareEditor } from './components/ShareEditor'
import { Footer } from './components/Footer'
import { useVariationalStats } from './hooks/useVariationalStats'
import { usePolymarket } from './hooks/usePolymarket'
import { ASSUMPTIONS, SCENARIOS, payout } from './lib/consensus'
import { fmtUsd, fmtUsdCompact } from './lib/format'
import logo from './assets/logo-new.png'

function App() {
  const [points, setPoints] = useState('')
  const [fdv, setFdv] = useState(ASSUMPTIONS.fdv.default)
  const [share, setShare] = useState(ASSUMPTIONS.share.default)
  const [totalPoints, setTotalPoints] = useState(ASSUMPTIONS.points.default)

  const stats = useVariationalStats()
  const market = usePolymarket()

  const userPoints = Math.max(0, parseFloat(points) || 0)
  const result = useMemo(() => payout({ userPoints, fdv, share, totalPoints }), [userPoints, fdv, share, totalPoints])

  const reset = () => {
    setFdv(ASSUMPTIONS.fdv.default)
    setShare(ASSUMPTIONS.share.default)
    setTotalPoints(ASSUMPTIONS.points.default)
  }

  const pickFdv = (v) => {
    setFdv(Math.min(ASSUMPTIONS.fdv.max, Math.max(ASSUMPTIONS.fdv.min, v)))
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="mx-auto w-full max-w-6xl px-5 md:px-8 flex flex-col gap-6">
        <section className="pt-16 md:pt-24 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-rise">
          <div className="max-w-2xl">
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.02]">
              Airdrop simulator
            </h1>
            <p className="text-[16px] md:text-[18px] text-muted mt-5 leading-relaxed">
              Nothing about a Variational airdrop has been announced. These are the numbers people are quoting, laid out so you can move them and see what your points would be worth.
            </p>
          </div>
          <img src={logo} alt="" className="hidden md:block w-24 h-24 object-contain opacity-90 drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]" />
        </section>

        <StatsStrip stats={stats.data} error={stats.error} updatedAt={stats.updatedAt} />

        <div id="simulator" className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4 scroll-mt-20 animate-rise" style={{ animationDelay: '160ms' }}>
          <Assumptions
            points={points} setPoints={setPoints}
            fdv={fdv} setFdv={setFdv}
            share={share} setShare={setShare}
            totalPoints={totalPoints} setTotalPoints={setTotalPoints}
            onReset={reset}
          />
          <Outputs userPoints={userPoints} result={result} fdv={fdv} share={share} totalPoints={totalPoints} />
        </div>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-rise" style={{ animationDelay: '240ms' }}>
          {SCENARIOS.map((s) => {
            const p = payout({ userPoints, fdv: s, share, totalPoints })
            const active = Math.abs(fdv - s) / s < 0.02
            return (
              <button
                key={s}
                onClick={() => setFdv(s)}
                className={`card p-4 text-left transition-colors hover:border-white/20 ${active ? 'border-accent/60 shadow-glow' : ''}`}
              >
                <div className="label">{fmtUsdCompact(s, 0)} FDV</div>
                <div className="num text-[20px] font-semibold tracking-tight mt-2">{userPoints > 0 ? fmtUsd(p.value) : fmtUsd(p.perPoint) + '/pt'}</div>
              </button>
            )
          })}
        </section>

        <MarketConsensus market={market} userPoints={userPoints} share={share} totalPoints={totalPoints} onPickFdv={pickFdv} activeFdv={fdv} />

        <ShareEditor userPoints={userPoints} fdv={fdv} share={share} totalPoints={totalPoints} result={result} />
      </main>

      <Footer />
      <Analytics />
    </div>
  )
}

export default App
