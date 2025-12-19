import { twMerge } from 'tailwind-merge'

export function ScenarioCard({ fdvLabel, value, className }) {
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value)

    return (
        <div className={twMerge(
            "group relative bg-surface border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden",
            "hover:border-var-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]",
            className
        )}>
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-600 group-hover:border-var-cyan transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-600 group-hover:border-var-cyan transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-600 group-hover:border-var-cyan transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-600 group-hover:border-var-cyan transition-colors" />

            <h3 className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-[0.2em]">FDV: {fdvLabel}</h3>
            <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight group-hover:text-var-cyan transition-colors">
                {formattedValue}
            </div>
        </div>
    )
}
