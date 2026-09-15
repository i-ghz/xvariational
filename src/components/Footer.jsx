import { ArrowUpRight } from 'lucide-react'
import fundingLogo from '../assets/funding-logo.png'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-12 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://omni.variational.io/?ref=OMNIGHZ"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 flex items-center justify-between gap-4 hover:border-white/20 transition-colors group"
          >
            <div>
              <div className="text-[15px] font-semibold tracking-tight">Trade on Variational Omni</div>
              <div className="text-[13px] text-muted mt-1">Earn points on every trade. Referral OMNIGHZ.</div>
            </div>
            <ArrowUpRight size={18} className="text-dim group-hover:text-text transition-colors shrink-0" />
          </a>
          <a
            href="https://fundingview.app"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-6 flex items-center gap-4 hover:border-white/20 transition-colors group"
          >
            <img src={fundingLogo} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold tracking-tight">Funding View</div>
              <div className="text-[13px] text-muted mt-1">Funding rates across perp DEXs, and the airdrops behind them.</div>
            </div>
            <ArrowUpRight size={18} className="text-dim group-hover:text-text transition-colors shrink-0" />
          </a>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px] text-dim">
          <p className="max-w-xl leading-relaxed">
            Nothing about a Variational airdrop has been announced. Every number here is a community assumption or a prediction-market price. Not affiliated with Variational. Not financial advice.
          </p>
          <span>xvariational.xyz</span>
        </div>
      </div>
    </footer>
  )
}
