import { useState, useRef, useEffect } from 'react'
import { Download, Copy, Check } from 'lucide-react'
import html2canvas from 'html2canvas'
import { clsx } from 'clsx'
import { ShareCard } from './ShareCard'
import { REF_CODE, omni } from '../lib/config'
import { fmtInt, fmtUsd, fmtUsdCompact } from '../lib/format'

const CAPTURE = { scale: 2, backgroundColor: null, useCORS: true, logging: false, width: 800, height: 418, windowWidth: 800, windowHeight: 418 }

export function ShareEditor({ userPoints, fdv, share, totalPoints, result }) {
  const [theme, setTheme] = useState('light')
  const [scale, setScale] = useState(0.5)
  const [copied, setCopied] = useState(false)
  const exportRef = useRef(null)
  const containerRef = useRef(null)
  const enabled = userPoints > 0

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth - 48
      setScale(Math.max(0.3, Math.min(0.85, w / 800)))
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
    a.download = `xvariational-${Math.round(userPoints)}pts.png`
    a.click()
  }

  const handleCopy = async () => {
    try {
      const item = new ClipboardItem({
        'image/png': capture().then((c) => new Promise((res) => c.toBlob(res))),
      })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
      handleDownload()
    }
  }

  const handleTweet = () => {
    const text = `My Variational airdrop estimate 🪂\n\nPoints: ${fmtInt(userPoints)}\nAt ${fmtUsdCompact(fdv)} FDV: ${fmtUsd(result.value)}\n\nRun yours: xvariational.xyz\nStart farming: ${omni()} (ref ${REF_CODE}) @variational_io`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div ref={containerRef} className="flex-1 p-6 flex items-center justify-center min-h-[300px] bg-sunken">
          <div style={{ width: 800 * scale, height: 418 * scale }} className="relative">
            <div style={{ transform: `scale(${scale})` }} className="origin-top-left absolute top-0 left-0 rounded-card shadow-lift">
              <ShareCard points={userPoints} fdv={fdv} share={share} totalPoints={totalPoints} result={result} theme={theme} isPreview />
            </div>
          </div>
        </div>

        <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden>
          <div ref={exportRef}>
            <ShareCard points={userPoints} fdv={fdv} share={share} totalPoints={totalPoints} result={result} theme={theme} />
          </div>
        </div>

        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-line p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-[16px] font-semibold tracking-[-0.02em]">Share your estimate</h2>
            <p className="text-[12.5px] text-muted mt-0.5">A card with your current assumptions.</p>
          </div>

          <div>
            <div className="label mb-3">Appearance</div>
            <div className="flex gap-2 p-1 rounded-full bg-sunken border border-line">
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={clsx('flex-1 py-1.5 rounded-full text-[13px] font-medium capitalize transition-colors', theme === t ? 'bg-accent text-white' : 'text-muted hover:text-ink')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <button
              onClick={handleTweet}
              disabled={!enabled}
              className="w-full py-3 rounded-inner bg-ink text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 hover:bg-ink/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Post on X
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopy}
                disabled={!enabled}
                className={clsx('py-3 rounded-inner text-[13.5px] font-medium flex items-center justify-center gap-2 border border-line transition-colors disabled:opacity-40 disabled:cursor-not-allowed', copied ? 'bg-up-soft text-up border-up/30' : 'bg-card hover:bg-sunken')}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!enabled}
                className="py-3 rounded-inner text-[13.5px] font-medium flex items-center justify-center gap-2 bg-card border border-line hover:bg-sunken transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={15} /> Save
              </button>
            </div>
            {!enabled && <p className="text-[11.5px] text-dim text-center">Enter your points to enable sharing.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
