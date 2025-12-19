import { forwardRef } from 'react'
import { Rocket } from 'lucide-react'
import { clsx } from 'clsx'
import logoNew from '../assets/logo-new.png'

export const ShareCard = forwardRef(({ points, valueAt1B, valueAt5B, theme = 'dark', graphic = 'rocket', isPreview = false }, ref) => {
    const formatted1B = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(valueAt1B)
    const formatted5B = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(valueAt5B)
    const formattedPoints = new Intl.NumberFormat('en-US').format(points || 0)

    // Theme Configs
    const themes = {
        dark: {
            bg: 'bg-[#040812]',
            text: 'text-white',
            subtext: 'text-slate-400',
            accent: 'text-var-cyan',
            border: 'border-slate-800',
            cardBg: 'bg-surface/80',
            logoColor: 'text-white',
            gridColor: 'rgba(30, 41, 59, 1)', // slate-800
        },
        blue: {
            bg: 'bg-[#4F46E5]',
            text: 'text-white',
            subtext: 'text-indigo-200',
            accent: 'text-white',
            border: 'border-indigo-400/30',
            cardBg: 'bg-black/20',
            logoColor: 'text-white',
            gridColor: 'rgba(255, 255, 255, 0.1)',
        },
        white: {
            bg: 'bg-[#F8FAFC]',
            text: 'text-slate-900',
            subtext: 'text-slate-500',
            accent: 'text-[#4F46E5]',
            border: 'border-slate-200',
            cardBg: 'bg-white',
            logoColor: 'text-slate-900',
            gridColor: 'rgba(148, 163, 184, 0.2)', // slate-400
        }
    }

    const currentTheme = themes[theme] || themes.dark

    // Graphic selection logic helper
    const renderGraphic = () => {
        if (graphic === 'none') return null

        if (graphic === 'rocket') {
            return (
                <div className="relative transform rotate-[-45deg] drop-shadow-2xl filter hover:scale-105 transition-transform duration-500">
                    <Rocket className={clsx("w-32 h-32", theme === 'white' ? "text-blue-600" : "text-white")} strokeWidth={1.5} />
                    {/* Engine glow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-20 bg-orange-500/80 blur-xl rounded-full -z-10"></div>
                </div>
            )
        }

        return null
    }

    return (
        <div
            ref={ref}
            className={clsx(
                "w-[800px] h-[418px] p-10 flex flex-col justify-between relative overflow-hidden transition-colors duration-300",
                currentTheme.bg,
                currentTheme.text,
                isPreview ? "shadow-2xl rounded-xl" : "" // Only show shadow/rounded in preview, flat for export
            )}
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            {/* Background decoration: Grid */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, ${currentTheme.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${currentTheme.gridColor} 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)' // Fade out grid edges
                }}
            />

            {/* Glow Effects (Theme Dependent) */}
            {theme === 'dark' && (
                <>
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-var-cyan/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                </>
            )}
            {theme === 'blue' && (
                <>
                    <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]" />
                </>
            )}

            {/* Header */}
            <div className={clsx("relative z-20 flex justify-between items-start border-b pb-6", currentTheme.border)}>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <img src={logoNew} className="w-10 h-10 object-contain" alt="Logo" />
                        <h1 className="text-3xl font-bold tracking-tight">
                            Variational
                        </h1>
                    </div>
                    <p className={clsx("text-sm font-light tracking-wider pl-1", currentTheme.subtext)}>PROTOCOL ESTIMATES</p>
                </div>
                <div className="text-right">
                    <div className={clsx("text-xs font-bold uppercase tracking-widest mb-1", currentTheme.accent)}>My Allocation</div>
                    <div className="text-4xl font-mono font-bold tracking-tighter">{formattedPoints} <span className={clsx("text-lg font-sans font-normal", currentTheme.subtext)}>pts</span></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-20 flex mt-2 gap-8">

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                    <div className={clsx("p-6 rounded-xl border relative overflow-hidden backdrop-blur-sm", currentTheme.cardBg, currentTheme.border)}>
                        <div className={clsx("absolute top-0 left-0 w-1 h-full", theme === 'white' ? "bg-slate-400" : "bg-slate-700")}></div>
                        <div className={clsx("text-xs mb-2 uppercase tracking-wider", currentTheme.subtext)}>Conservative</div>
                        <div className="flex flex-col justify-end h-16">
                            <div className={clsx("text-sm font-mono mb-1 opt-70", currentTheme.subtext)}>$1.0B FDV</div>
                            <div className="text-3xl font-mono font-bold">{formatted1B}</div>
                        </div>
                    </div>

                    <div className={clsx("p-6 rounded-xl border relative overflow-hidden backdrop-blur-sm", currentTheme.cardBg, currentTheme.border)}>
                        <div className={clsx("absolute top-0 left-0 w-1 h-full shadow-[0_0_10px_currentColor]", currentTheme.accent.replace('text-', 'bg-'))}></div>
                        <div className={clsx("text-xs mb-2 uppercase tracking-wider font-bold", currentTheme.accent)}>Target</div>
                        <div className="flex flex-col justify-end h-16">
                            <div className={clsx("text-sm font-mono mb-1", currentTheme.subtext)}>$5.0B FDV</div>
                            <div className={clsx("text-3xl font-mono font-bold", theme === 'dark' ? "text-glow" : "")}>{formatted5B}</div>
                        </div>
                    </div>
                </div>

                {/* Graphic Area */}
                <div className="w-[180px] relative flex items-center justify-center">
                    {renderGraphic()}
                </div>

            </div>

            {/* Footer */}
            <div className="relative z-20 flex justify-between items-end mt-4">
                <div className={clsx("text-[10px] max-w-[50%] leading-relaxed", currentTheme.subtext)}>
                    *Estimates based on 9.15M total points & 15% airdrop allocation. <br />
                    Hypothetical valuations only. Not financial advice.
                </div>
                <div className="text-right">
                    <div className={clsx("text-[10px] uppercase tracking-widest mb-1", currentTheme.subtext)}>Generated at</div>
                    <div className={clsx("text-sm font-bold px-3 py-1 rounded border", currentTheme.cardBg, currentTheme.border)}>xvariational.xyz</div>
                </div>
            </div>
        </div>
    )
})

ShareCard.displayName = "ShareCard"
