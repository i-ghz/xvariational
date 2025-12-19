import { ExternalLink } from 'lucide-react'
import fundingLogo from '../assets/funding-logo.png'

export function FundingAd() {
    return (
        <a
            href="https://fundingview.app"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-8 md:right-8 z-50 group block"
        >
            <div className="bg-[#0A0C10] border border-slate-800 rounded-xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-2xl hover:border-red-900/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-300 w-full md:w-[420px] hover:scale-[1.02]">
                {/* Logo Container */}
                <div className="w-14 h-14 md:w-20 md:h-20 bg-black/40 rounded-lg flex items-center justify-center border border-white/5 shrink-0 overflow-hidden">
                    <img src={fundingLogo} alt="Funding View" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <span className="bg-red-500/10 text-red-500 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-red-500/20 tracking-wider">RECOMMENDED</span>
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-lg leading-tight group-hover:text-red-500 transition-colors">Funding View</h3>
                    <p className="text-slate-400 text-[10px] md:text-sm leading-snug mt-1">Track funding rates & farm passive airdrops for perpdexes.</p>
                </div>

                {/* Icon */}
                <ExternalLink size={20} className="text-slate-600 group-hover:text-white transition-colors self-start mt-1 hidden sm:block" />
            </div>
        </a>
    )
}
