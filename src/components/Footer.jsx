import { ArrowUpRight } from 'lucide-react'
import { TradeLink } from './TradeLink'
import { LINKS, REF_CODE } from '../lib/config'
import fundingLogo from '../assets/funding-logo.png'
import logo from '../assets/logo-new.png'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-card">
      <div className="mx-auto max-w-[1200px] px-4 md:px-7 py-10 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TradeLink className="card card-hover p-5 flex items-center gap-4 group">
            <img src={logo} alt="" className="w-9 h-9 object-contain shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-semibold tracking-[-0.01em]">Trade on Variational Omni</div>
              <div className="text-[12.5px] text-muted mt-0.5">
                550+ perps, one USDC account. Access code {REF_CODE}.
              </div>
            </div>
            <ArrowUpRight size={17} className="text-dim group-hover:text-accent transition-colors shrink-0" />
          </TradeLink>

          <a
            href={LINKS.fundingView}
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover p-5 flex items-center gap-4 group"
          >
            <img src={fundingLogo} alt="" className="w-9 h-9 rounded-inner object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[14.5px] font-semibold tracking-[-0.01em]">Funding View</div>
              <div className="text-[12.5px] text-muted mt-0.5">
                Funding rates across every perp DEX, and the airdrops behind them.
              </div>
            </div>
            <ArrowUpRight size={17} className="text-dim group-hover:text-accent transition-colors shrink-0" />
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-[12px] text-dim">
          <p className="max-w-2xl leading-relaxed">
            Market data comes from Variational&apos;s public read-only API. Every airdrop number here is
            a community assumption or a prediction-market price — nothing has been announced. Links to
            Omni carry a referral code. Not affiliated with Variational. Not financial advice.
          </p>
          <div className="flex items-center gap-4 shrink-0">
            <a href={LINKS.docs} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">API docs</a>
            <a href={LINKS.variational} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">variational.io</a>
            <span className="num">code {REF_CODE}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
