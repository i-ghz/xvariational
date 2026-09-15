import { forwardRef } from 'react'
import logo from '../assets/logo-new.png'
import { REF_CODE } from '../lib/config'
import { fmtUsd, fmtUsd2, fmtUsdCompact, fmtPct, fmtCompact, fmtPoints } from '../lib/format'

const THEMES = {
  light: { bg: '#ffffff', text: '#151a25', muted: '#6c829d', line: '#e9edf1', panel: '#f7f8fa', accent: '#1c5bd9', glow: 'rgba(28,91,217,0.10)' },
  dark: { bg: '#010612', text: '#e9edf1', muted: '#a0aec0', line: 'rgba(255,255,255,0.10)', panel: 'rgba(255,255,255,0.04)', accent: '#4c9af8', glow: 'rgba(76,154,248,0.22)' },
}

export const ShareCard = forwardRef(({ points, fdv, share, totalPoints, result, theme = 'light', isPreview = false }, ref) => {
  const t = THEMES[theme] || THEMES.light
  return (
    <div
      ref={ref}
      style={{
        width: 800,
        height: 418,
        background: t.bg,
        color: t.text,
        fontFamily: 'Inter, -apple-system, sans-serif',
        borderRadius: isPreview ? 24 : 0,
        position: 'relative',
        overflow: 'hidden',
        padding: 44,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', top: -200, right: -120, width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${t.glow}, transparent 65%)` }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1 }}>Variational</div>
            <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1.4, textTransform: 'uppercase', marginTop: 5 }}>Airdrop estimate</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: t.muted, letterSpacing: 1.4, textTransform: 'uppercase' }}>My points</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.8, fontVariantNumeric: 'tabular-nums', marginTop: 4 }}>{fmtPoints(points || 0)}</div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 13, color: t.muted, marginBottom: 6 }}>Estimated payout at {fmtUsdCompact(fdv)} FDV</div>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -3, lineHeight: 1, color: t.accent, fontVariantNumeric: 'tabular-nums' }}>{fmtUsd(result.value)}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, position: 'relative' }}>
        {[
          ['Value per point', fmtUsd2(result.perPoint)],
          ['Airdrop pool', `${fmtUsdCompact(result.pool)} · ${fmtPct(share, 1)}`],
          ['Total points', fmtCompact(totalPoints)],
        ].map(([k, v]) => (
          <div key={k} style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: t.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11, color: t.muted, position: 'relative' }}>
        <span>Hypothetical. Nothing announced. Not financial advice.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, color: t.text }}>xvariational.xyz</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>ref {REF_CODE}</span>
        </span>
      </div>
    </div>
  )
})

ShareCard.displayName = 'ShareCard'
