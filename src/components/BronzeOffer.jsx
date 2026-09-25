import { useState } from 'react'
import { Check, Copy, Zap } from 'lucide-react'
import { TradeLink } from './TradeLink'
import { REF_CODE } from '../lib/config'
import { TOKENOMICS } from '../lib/tokenomics'

/**
 * The reason to use this link rather than going straight to Omni, stated once,
 * high up, before the visitor has to scroll through anything.
 */
export function BronzeOffer() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REF_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the code is on screen */
    }
  }

  return (
    <section className="card card-hover border-accent/25 bg-accent-soft/40 p-4 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <span className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <Zap size={16} className="text-accent" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-semibold tracking-[-0.01em]">
          Get Bronze free for {TOKENOMICS.referralPerk.days} days
        </div>
        <p className="text-[12.5px] text-muted mt-0.5 leading-relaxed">
          Omni is invite-only. Join with{' '}
          <span className="num font-semibold text-accent">{REF_CODE}</span> and earn 0.5% more points
          from your first trade — Bronze otherwise takes $1M of 30-day volume.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TradeLink variant="primary" arrow className="!px-4 !py-2 !text-[13.5px]">
          Join Omni
        </TradeLink>
        <button
          onClick={copy}
          className={`btn-ghost !px-3.5 !py-2 !text-[13px] ${copied ? '!border-up !text-up' : ''}`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Code copied' : 'Copy access code'}
        </button>
      </div>
    </section>
  )
}
