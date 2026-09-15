import { forwardRef } from 'react'
import logo from '../assets/logo-new.png'
import { REF_CODE } from '../lib/config'
import { fmtUsdCompact, fmtInt } from '../lib/format'

const T = {
  bg: '#ffffff',
  ink: '#151a25',
  muted: '#6c829d',
  dim: '#a0aec0',
  line: '#e9edf1',
  panel: '#f7f8fa',
  accent: '#1c5bd9',
  soft: '#dbedfe',
}

// Built from plain divs rather than SVG: html2canvas rasterises these reliably.
export const StatsCard = forwardRef(({ stats, composition, concentration, isPreview = false }, ref) => {
  const rows = (composition?.rows || []).filter((r) => r.volumeShare > 0.004)
  const top5 = concentration?.milestones?.top5

  const tiles = [
    ['Open interest', fmtUsdCompact(stats?.openInterest)],
    ['TVL', fmtUsdCompact(stats?.tvl)],
    ['Markets', fmtInt(stats?.numMarkets || 0)],
  ]

  return (
    <div
      ref={ref}
      style={{
        width: 800,
        height: 418,
        background: T.bg,
        color: T.ink,
        fontFamily: 'Inter, -apple-system, sans-serif',
        borderRadius: isPreview ? 20 : 0,
        overflow: 'hidden',
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <img src={logo} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1 }}>Variational Omni</div>
            <div style={{ fontSize: 10, color: T.dim, letterSpacing: 1.3, textTransform: 'uppercase', marginTop: 5 }}>
              Venue snapshot
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: T.dim, letterSpacing: 1.3, textTransform: 'uppercase' }}>24h volume</div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.6, color: T.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>
            {fmtUsdCompact(stats?.volume24h)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {tiles.map(([k, v]) => (
          <div key={k} style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: '11px 14px' }}>
            <div style={{ fontSize: 9.5, color: T.dim, letterSpacing: 1.1, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.4, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 9.5, color: T.dim, letterSpacing: 1.1, textTransform: 'uppercase', marginBottom: 8 }}>
          Where the volume came from
        </div>
        <div style={{ display: 'flex', height: 26, borderRadius: 7, overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <div
              key={r.id}
              style={{
                width: `${r.volumeShare * 100}%`,
                background: r.color,
                marginLeft: i === 0 ? 0 : 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {r.volumeShare >= 0.12 && (
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round(r.volumeShare * 100)}%
                </span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 9, flexWrap: 'wrap' }}>
          {rows.map((r) => (
            <span key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: T.muted }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: r.color, display: 'inline-block' }} />
              {r.label}
            </span>
          ))}
        </div>
      </div>

      {top5 != null && (
        <div style={{ background: T.soft, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: T.ink }}>
          The five busiest markets carry{' '}
          <strong style={{ color: T.accent }}>{Math.round(top5 * 100)}%</strong> of everything traded in 24 hours.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 10.5, color: T.dim, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
        <span>Live from Variational&apos;s public API. Not affiliated. Not financial advice.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontWeight: 600, color: T.ink }}>xvariational.xyz</span>
          <span>·</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>code {REF_CODE}</span>
        </span>
      </div>
    </div>
  )
})

StatsCard.displayName = 'StatsCard'
