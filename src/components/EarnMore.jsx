import { useState } from 'react'
import { Check, Copy, Zap } from 'lucide-react'
import { TradeLink } from './TradeLink'
import { REF_CODE, omni } from '../lib/config'

// Omni's reward tiers (docs.variational.io). Normally each one is unlocked by
// 30-day volume — the access code hands you Bronze outright for 90 days.
const TIERS = [
  { name: 'Iron', volume: '$0', boost: '0%' },
  { name: 'Bronze', volume: '$1M', boost: '+0.5%', granted: true },
  { name: 'Silver', volume: '$5M', boost: '+1%' },
  { name: 'Gold', volume: '$25M', boost: '+2%' },
]

export function EarnMore() {
  const [copied, setCopied] = useState(null)

  const copy = async (what, value) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(what)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      /* clipboard blocked — the code is on screen anyway */
    }
  }

  return (
    <section className="card overflow-hidden flex flex-col">
      <div className="px-5 md:px-6 py-4 border-b border-line">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          <h2 className="section-title">Earn more points</h2>
        </div>
        <p className="section-sub">
          Omni is invite-only, and the code does more than let you in.
        </p>
      </div>

      <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
        <div className="rounded-inner border border-accent/20 bg-accent-soft/50 px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="label !text-accent/70 mb-1.5">Access code</div>
              <span className="num text-[24px] font-semibold tracking-[0.03em] text-accent">{REF_CODE}</span>
            </div>
            <button
              onClick={() => copy('code', REF_CODE)}
              className={`pill border bg-card !text-[12.5px] shrink-0 ${
                copied === 'code' ? 'border-up text-up' : 'border-line-2 text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {copied === 'code' ? <Check size={13} /> : <Copy size={13} />}
              {copied === 'code' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[12.5px] text-ink/80 mt-3 pt-3 border-t border-accent/15 leading-relaxed">
            Signing up with it gives you <strong className="font-semibold">Bronze tier for 90 days</strong> —
            a boost on every point you earn, from your first trade. Bronze normally takes $1M of
            30-day volume to unlock.
          </p>
        </div>

        <TradeLink variant="primary" arrow className="w-full !py-3 !text-[14.5px]">
          Claim Bronze on Omni
        </TradeLink>

        <div>
          <div className="label mb-2">Tier boost to points earned</div>
          <div className="rounded-inner border border-line divide-y divide-line overflow-hidden">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`flex items-center justify-between px-3.5 py-2 text-[12.5px] ${
                  t.granted ? 'bg-accent-soft/50' : ''
                }`}
              >
                <span className={`font-medium ${t.granted ? 'text-accent' : ''}`}>
                  {t.name}
                  {t.granted && <span className="ml-2 text-[10.5px] font-semibold uppercase tracking-[0.06em]">90d free</span>}
                </span>
                <span className="num text-dim">{t.volume}</span>
                <span className={`num font-semibold w-11 text-right ${t.granted ? 'text-accent' : 'text-up'}`}>{t.boost}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-dim mt-2 leading-relaxed">
            Tiers run to Infinity (+5%). After the 90 days, 30-day volume keeps your tier —
            and referred volume counts for 20% of yours.
          </p>
        </div>

        <button
          onClick={() => copy('link', omni())}
          className={`text-[12px] mt-auto transition-colors ${copied === 'link' ? 'text-up' : 'text-dim hover:text-accent'}`}
        >
          {copied === 'link' ? 'Invite link copied' : 'or copy the invite link'}
        </button>
      </div>
    </section>
  )
}
