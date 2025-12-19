import { useState, useRef, useEffect } from 'react'
import { Download, Check, Rocket, Image as ImageIcon, Copy, CheckCircle2 } from 'lucide-react'
import { ShareCard } from './ShareCard'
import html2canvas from 'html2canvas'
import { clsx } from 'clsx'

export function ShareEditor({ userPoints, valueAt1B, valueAt5B }) {
    const [theme, setTheme] = useState('dark') // 'dark', 'blue', 'white'
    const [graphic, setGraphic] = useState('rocket') // 'rocket', 'none'
    const [scale, setScale] = useState(0.5)
    const [copied, setCopied] = useState(false)

    // cardRef is now for the hidden export version
    const exportRef = useRef(null)
    const containerRef = useRef(null)

    const handleDownload = async () => {
        if (exportRef.current) {
            // Wait a tick to ensure font rendering or any state updates
            await new Promise(resolve => setTimeout(resolve, 100))

            const canvas = await html2canvas(exportRef.current, {
                scale: 2, // 2x for retina quality
                backgroundColor: null,
                useCORS: true,
                logging: false,
                width: 800,
                height: 418,
                windowWidth: 800,
                windowHeight: 418,
            })
            const image = canvas.toDataURL("image/png")
            const link = document.createElement('a')
            link.href = image
            link.download = `variational-estimate-${userPoints}.png`
            link.click()
        }
    }

    const handleCopy = async () => {
        if (exportRef.current) {
            try {
                // Safari and modern Chrome support passing a Promise to ClipboardItem
                // This is crucial because html2canvas is async, and Safari demands the ClipboardItem
                // be created during the user interaction event loop.
                const item = new ClipboardItem({
                    'image/png': new Promise(async (resolve) => {
                        // Tiny delay to ensure rendering if needed, though usually redundant with offscreen
                        await new Promise(r => setTimeout(r, 50))

                        const canvas = await html2canvas(exportRef.current, {
                            scale: 2,
                            backgroundColor: null,
                            useCORS: true,
                            logging: false,
                            width: 800,
                            height: 418,
                            windowWidth: 800,
                            windowHeight: 418,
                        })

                        canvas.toBlob((blob) => {
                            resolve(blob)
                        })
                    })
                })

                await navigator.clipboard.write([item])
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)

            } catch (err) {
                console.error('Failed to copy', err)
                alert('Copy failed. Please try "Download" instead.')
            }
        }
    }

    const handleTweet = () => {
        const formattedPoints = new Intl.NumberFormat('en-US').format(userPoints)
        const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(valueAt5B)

        const text = `I'm estimating my Variational Airdrop! 🪂

Points: ${formattedPoints}
Est. Value: ${formattedValue}

Check yours at: xvariational.xyz @variational_io

gVar`

        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
    }

    // Auto-scale logic
    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const padding = 64 // 2rem * 2 roughly
                const availableWidth = containerWidth - padding
                const cardWidth = 800 // The fixed width of ShareCard

                // Calculate ratio to fit, maxing out at 0.8 to not look huge
                const newScale = Math.min(0.8, availableWidth / cardWidth)
                // Don't let it get microscopic, though layout should prevent that
                setScale(Math.max(0.3, newScale))
            }
        }

        // Initial calc
        calculateScale()

        // Observer
        const observer = new ResizeObserver(calculateScale)
        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])


    const isVisible = userPoints > 0;

    return (
        <div className={clsx(
            "w-full transition-all duration-500 ease-in-out overflow-hidden transform-gpu", // GPU accel for smooth transition
            isVisible ? "opacity-100 max-h-[1200px] mb-12" : "opacity-50 max-h-[1200px] grayscale mb-12"
        )}>
            <div className="bg-surface border border-slate-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">

                {/* Preview Area */}
                <div
                    ref={containerRef}
                    className="flex-1 bg-slate-900/50 p-4 md:p-8 flex items-center justify-center relative min-h-[350px] overflow-hidden"
                >
                    <div
                        style={{ transform: `scale(${scale})` }}
                        className="origin-center shadow-2xl rounded-xl transition-transform duration-200 ease-out will-change-transform"
                    >
                        <ShareCard
                            points={userPoints}
                            valueAt1B={valueAt1B}
                            valueAt5B={valueAt5B}
                            theme={theme}
                            graphic={graphic}
                            isPreview={true}
                        />
                    </div>
                </div>

                {/* HIDDEN EXPORT AREA - This is what actually gets captured */}
                <div className="absolute top-0 left-0 overflow-hidden w-0 h-0 opacity-0 pointer-events-none">
                    <div ref={exportRef}>
                        <ShareCard
                            points={userPoints}
                            valueAt1B={valueAt1B}
                            valueAt5B={valueAt5B}
                            theme={theme}
                            graphic={graphic}
                            isPreview={false}
                        />
                    </div>
                </div>

                {/* Controls Area */}
                <div className="w-full lg:w-80 bg-surface border-t lg:border-t-0 lg:border-l border-slate-700 p-6 flex flex-col justify-center z-10 relative">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        Customize Card
                    </h2>

                    <div className="space-y-6">
                        {/* Themes */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Theme</label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={clsx("h-12 rounded-lg border-2 flex items-center justify-center transition-all bg-[#040812]", theme === 'dark' ? "border-var-cyan ring-2 ring-var-cyan/20" : "border-slate-700 hover:border-slate-600")}
                                >
                                    {theme === 'dark' && <Check size={16} className="text-white" />}
                                </button>
                                <button
                                    onClick={() => setTheme('blue')}
                                    className={clsx("h-12 rounded-lg border-2 flex items-center justify-center transition-all bg-[#4F46E5]", theme === 'blue' ? "border-white ring-2 ring-white/20" : "border-slate-700 hover:border-slate-600")}
                                >
                                    {theme === 'blue' && <Check size={16} className="text-white" />}
                                </button>
                                <button
                                    onClick={() => setTheme('white')}
                                    className={clsx("h-12 rounded-lg border-2 flex items-center justify-center transition-all bg-white", theme === 'white' ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 hover:border-slate-300")}
                                >
                                    {theme === 'white' && <Check size={16} className="text-black" />}
                                </button>
                            </div>
                        </div>

                        {/* Graphics */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Decoration</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setGraphic('none')}
                                    className={clsx("h-16 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all", graphic === 'none' ? "bg-var-cyan/10 border-var-cyan text-var-cyan" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750")}
                                >
                                    <ImageIcon size={20} />
                                    <span className="text-[10px] font-bold">None</span>
                                </button>
                                <button
                                    onClick={() => setGraphic('rocket')}
                                    className={clsx("h-16 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all", graphic === 'rocket' ? "bg-var-cyan/10 border-var-cyan text-var-cyan" : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750")}
                                >
                                    <Rocket size={20} />
                                    <span className="text-[10px] font-bold">Rocket</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700 space-y-3">
                        <button
                            onClick={handleTweet}
                            disabled={!isVisible}
                            className={clsx("w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold mb-2",
                                "bg-black text-white border border-slate-700 hover:bg-slate-900 shadow-lg",
                                !isVisible && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            Post on X
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleCopy}
                                disabled={!isVisible}
                                className={clsx("w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-bold font-sans text-sm",
                                    copied ? "bg-green-500 text-white" : "bg-slate-800 text-white hover:bg-slate-700",
                                    !isVisible && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                {copied ? "Copied!" : "Copy Image"}
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={!isVisible}
                                className="w-full bg-var-cyan hover:bg-blue-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] text-sm"
                            >
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
