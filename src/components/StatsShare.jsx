import { useState, useRef, useEffect } from 'react'
import { Download, Copy, Check } from 'lucide-react'
import html2canvas from 'html2canvas'
import { clsx } from 'clsx'
import { StatsCard } from './StatsCard'
import { REF_CODE, omni, LINKS } from '../lib/config'
import { fmtUsdCompact } from '../lib/format'

const CAPTURE = { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, width: 800, height: 418, windowWidth: 800, windowHeight: 418 }

export function StatsShare({ stats, composition, concentration }) {
  const [scale, setScale] = useState(0.5)
  const [copied, setCopied] = useState(false)
  const exportRef = useRef(null)
  const containerRef = useRef(null)
  const ready = !!stats

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth - 40
      setScale(Math.max(0.3, Math.min(0.9, w / 800)))
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const capture = async () => {
    await new Promise((r) => setTimeout(r, 60))
    return html2canvas(exportRef.current, CAPTURE)
  }

  const handleDownload = async () => {
    const canvas = await capture()
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'variational-omni-snapshot.png'
    a.click()
  }

  const handleCopy = async () => {
    try {
      const item = new ClipboardItem({ 'image/png': capture().then((c) => new Promise((res) => c.toBlob(res))) })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
      handleDownload()
    }
  }

  const handleTweet = () => {
    const top5 = concentration?.milestones?.top5
    const text = `Variational Omni right now 📊\n\n24h volume: ${fmtUsdCompact(stats?.volume24h)}\nOpen interest: ${fmtUsdCompact(stats?.openInterest)}\n${stats?.numMarkets} markets — crypto, US stocks, indices, commodities${top5 ? `\nTop 5 markets = ${Math.round(top5 * 100)}% of volume` : ''}\n\nLive dashboard: ${LINKS.site}/markets\nTrade: ${omni()} (code ${REF_CODE}) @variational_io`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div ref={containerRef} className="flex-1 p-5 flex items-center justify-center min-h-[260px] bg-sunken">
          <div style={{ width: 800 * scale, height: 418 * scale }} className="relative">
            <div style={{ transform: `scale(${scale})` }} className="origin-top-left absolute top-0 left-0 rounded-card shadow-lift overflow-hidden">
              <StatsCard stats={stats} composition={composition} concentration={concentration} isPreview />
            </div>
          </div>
        </div>

        <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden>
          <div ref={exportRef}>
            <StatsCard stats={stats} composition={composition} concentration={concentration} />
          </div>
        </div>

        <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-line p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.02em]">Share the snapshot</h2>
            <p className="text-[12.5px] text-muted mt-0.5 leading-relaxed">
              A card of the venue as it stands right now, code included.
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={handleTweet}
              disabled={!ready}
              className="w-full py-2.5 rounded-inner bg-ink text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 hover:bg-ink/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Post on X
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                disabled={!ready}
                className={clsx(
                  'py-2.5 rounded-inner text-[13px] font-medium flex items-center justify-center gap-1.5 border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                  copied ? 'bg-up-soft text-up border-up/30' : 'bg-card border-line hover:bg-sunken',
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!ready}
                className="py-2.5 rounded-inner text-[13px] font-medium flex items-center justify-center gap-1.5 bg-card border border-line hover:bg-sunken transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} /> Save
              </button>
            </div>
            {!ready && <p className="text-[11.5px] text-dim text-center">Waiting for live data…</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
