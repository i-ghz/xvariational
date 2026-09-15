import { ArrowUpRight } from 'lucide-react'
import { LINKS } from '../lib/config'
import fundingLogo from '../assets/funding-logo.png'

export function FundingViewPromo() {
  return (
    <a
      href={LINKS.fundingView}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4 group"
    >
      <img src={fundingLogo} alt="" className="w-11 h-11 rounded-inner object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold tracking-[-0.015em]">Funding View</span>
          <span className="pill !px-2 !py-0.5 !text-[10.5px] bg-sunken text-muted">Companion app</span>
        </div>
        <p className="text-[13px] text-muted mt-1 leading-relaxed">
          Omni is one venue. Funding View puts its rates next to every other perp DEX — so you can see
          which side of the trade is actually getting paid, and which airdrops sit behind them.
        </p>
      </div>
      <span className="btn-ghost shrink-0 !py-2 !text-[13px] group-hover:border-accent group-hover:text-accent">
        Open <ArrowUpRight size={14} />
      </span>
    </a>
  )
}
