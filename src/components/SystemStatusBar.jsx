import { useRef, useEffect, useState } from 'react'

export function SystemStatusBar() {
    return (
        <div className="w-full bg-[#02040a] border-b border-slate-800 text-[10px] md:text-xs font-mono py-1.5 px-4 flex items-center justify-between text-slate-500 overflow-hidden relative z-50 h-8">
            {/* Left Status Items */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-500/80 tracking-widest uppercase hidden sm:inline">System Online</span>
                    <span className="text-green-500/80 tracking-widest uppercase sm:hidden">Online</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="opacity-50">LATENCY:</span>
                    <span className="text-slate-300">12ms</span>
                </div>
                <div className="hidden lg:flex items-center gap-2">
                    <span className="opacity-50">BLOCK:</span>
                    <span className="text-slate-300">19,284,912</span>
                </div>
            </div>

            {/* Smart Ad Area - Flashing Opportunity */}
            <a
                href="https://fundingview.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group cursor-pointer hover:bg-slate-900 px-2 py-0.5 rounded transition-colors"
            >
                <div className="w-1.5 h-1.5 bg-yellow-500 rotate-45 animate-[ping_2s_ease-in-out_infinite]"></div>
                <span className="text-yellow-500 font-bold tracking-tight animate-pulse ml-1">
                    YIELD OPPORTUNITY DETECTED
                </span>
                <span className="text-slate-400 group-hover:text-white ml-1 transition-colors hidden sm:inline">
                    [VIEW SIGNAL]
                </span>
            </a>
        </div>
    )
}
