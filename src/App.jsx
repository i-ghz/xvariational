import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { ScenarioCard } from './components/ScenarioCard'
import { ShareEditor } from './components/ShareEditor'
import { FundingAd } from './components/FundingAd'
import logoNew from './assets/logo-new.png'

// Constants
const TOTAL_POINTS = 9_150_000
const AIRDROP_ALLOCATION = 0.15

const SCENARIOS = [
  { label: '$500M', fdv: 500_000_000 },
  { label: '$1B', fdv: 1_000_000_000 },
  { label: '$5B', fdv: 5_000_000_000 },
  { label: '$10B', fdv: 10_000_000_000 },
]

function App() {
  const [points, setPoints] = useState('')

  const userPoints = parseFloat(points) || 0
  const userShare = userPoints / TOTAL_POINTS

  // Calculate values
  const getValue = (fdv) => {
    const totalAirdropValue = fdv * AIRDROP_ALLOCATION
    return totalAirdropValue * userShare
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-4 md:px-8 relative overflow-x-hidden font-sans">

      {/* Decorative Grid Fades */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      <header className="mb-16 text-center z-10 relative flex flex-col items-center">
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-var-cyan/20 bg-var-cyan/5">
          <div className="w-1.5 h-1.5 bg-var-cyan rounded-full animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-var-cyan font-bold">Protocol Estimates</span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <img src={logoNew} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" alt="xVariational Logo" />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4">
          xVariational.xyz
        </h1>
        <p className="text-slate-400 font-light tracking-wide text-sm md:text-base max-w-md mx-auto">
          Project potential allocation value across different network scenarios.
        </p>
      </header>

      <div className="w-full max-w-5xl z-10">

        {/* Input Section */}
        <div className="bg-surface/50 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl mb-12 relative group hover:border-slate-700 transition-colors">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-var-cyan to-blue-600 rounded-2xl opacity-0 group-hover:opacity-10 transition duration-500 blur"></div>

          <div className="relative">
            <label className="block text-xs font-bold text-var-cyan mb-3 uppercase tracking-widest pl-1">
              Enter your Points
            </label>
            <div className="relative">
              <input
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="w-full bg-background border border-slate-700/50 rounded-xl px-6 py-5 text-4xl font-mono text-white placeholder-slate-800 focus:outline-none focus:border-var-cyan/50 focus:ring-1 focus:ring-var-cyan/50 transition-all shadow-inner"
                placeholder="0"
              />
              <Calculator className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 w-6 h-6" />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500 mt-4 px-2 tracking-wider uppercase">
            <span>Total Points Supply Implied: 9.15M</span>
            <span>Allocation: 15%</span>
          </div>
        </div>

        {/* Inline Editor Section */}
        <ShareEditor
          userPoints={userPoints}
          valueAt1B={getValue(1_000_000_000)}
          valueAt5B={getValue(5_000_000_000)}
        />

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {SCENARIOS.map((scenario) => (
            <ScenarioCard
              key={scenario.label}
              fdvLabel={scenario.label}
              value={getValue(scenario.fdv)}
              className={scenario.fdv === 5_000_000_000 ? "border-var-cyan/40 bg-var-cyan/5 shadow-[0_0_30px_rgba(0,240,255,0.05)]" : ""}
            />
          ))}
        </div>

        {/* Actions Button */}
        <div className="flex justify-center pb-20 w-full">
          <a
            href="https://omni.variational.io/?ref=OMNIGHZ"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 text-lg tracking-wide hover:-translate-y-1"
          >
            Trade on Variational
            <span className="opacity-70 text-sm font-normal">(Ref: OMNIGHZ)</span>
          </a>
        </div>

      </div>

      {/* Cross Promotion Ad */}
      <FundingAd />

    </div>
  )
}

export default App
