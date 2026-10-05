import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { StatsStrip } from '../components/StatsStrip'
import { SessionFeed } from '../components/SessionFeed'
import { PointsCalculator } from '../components/PointsCalculator'
import { PointsProjection } from '../components/PointsProjection'
import { BronzeOffer } from '../components/BronzeOffer'
import { HowItsCalculated } from '../components/HowItsCalculated'
import { EarnMore } from '../components/EarnMore'
import { TokenomicsPanel } from '../components/TokenomicsPanel'
import { MarketConsensus } from '../components/MarketConsensus'
import { ShareEditor } from '../components/LazyShare'
import { MarketsPreview } from '../components/MarketsPreview'
import { CompositionChart } from '../components/charts/CompositionChart'
import { FundingRadar } from '../components/FundingRadar'
import { FundingViewPromo } from '../components/FundingViewPromo'
import { composition } from '../lib/analytics'
import { ASSUMPTIONS, expectedFdv } from '../lib/consensus'
import { TOKENOMICS } from '../lib/tokenomics'
import { fmtUsdCompact } from '../lib/format'

function SectionHead({ title, sub, to, cta }) {
  return (
    <div className="flex items-baseline justify-between gap-3 px-1">
      <div>
        <h2 className="section-title !text-[17px]">{title}</h2>
        {sub && <p className="section-sub !text-[12.5px] !mt-0.5">{sub}</p>}
      </div>
      {to && (
        <Link to={to} className="text-[12.5px] link-quiet flex items-center gap-1 shrink-0 group">
          {cta}
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}

export function Home({ stats, sim, market }) {
  const listings = stats.data?.listings
  const comp = useMemo(() => (listings ? composition(listings) : null), [listings])
  const implied = expectedFdv(market.markets)
  const atOrAbove1B = market.markets.find((m) => m.fdv === 1e9)?.yes

  const pickFdv = (v) =>
    sim.setFdv(Math.min(ASSUMPTIONS.fdv.max, Math.max(ASSUMPTIONS.fdv.min, v)))

  return (
    <div className="flex flex-col gap-4 animate-rise">
      {/* Hero: the question, then the two things that answer it side by side. */}
      <header className="pt-2 pb-1 md:pt-4 md:pb-2">
        <h1 className="text-[28px] md:text-[38px] font-semibold tracking-[-0.035em] leading-[1.05] max-w-3xl">
          Your Omni points, priced by the market.
        </h1>
        <p className="text-[14px] md:text-[15px] text-muted mt-3 max-w-2xl leading-relaxed">
          {Math.round(sim.share * 100)}% of $VAR goes to points holders at the {TOKENOMICS.tgeQuarter} TGE. The
          only unknown is the price, and Polymarket is already quoting it.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {implied && (
            <button onClick={() => pickFdv(implied)} className="pill bg-card border border-line hover:border-accent group">
              <span className="w-1.5 h-1.5 rounded-full bg-up animate-breathe" />
              <span className="text-muted">Market-implied FDV</span>
              <span className="num font-semibold group-hover:text-accent">{fmtUsdCompact(implied)}</span>
            </button>
          )}
          {atOrAbove1B != null && (
            <span className="pill bg-card border border-line">
              <span className="text-muted">Above $1B</span>
              <span className="num font-semibold">{Math.round(atOrAbove1B * 100)}%</span>
            </span>
          )}
          {stats.data?.volume24h > 0 && (
            <span className="pill bg-card border border-line">
              <span className="text-muted">Omni 24h volume</span>
              <span className="num font-semibold">{fmtUsdCompact(stats.data.volume24h)}</span>
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 items-stretch">
        <PointsCalculator sim={sim} />
        <MarketConsensus
          market={market}
          userPoints={sim.userPoints}
          share={sim.share}
          totalPoints={sim.totalPoints}
          onPickFdv={pickFdv}
          activeFdv={sim.fdv}
        />
      </div>

      <BronzeOffer />

      <StatsStrip
        stats={stats.data}
        error={stats.error}
        loading={stats.loading}
        updatedAt={stats.updatedAt}
        onRefresh={stats.refresh}
      />

      <PointsProjection sim={sim} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <EarnMore />
        <TokenomicsPanel />
      </div>

      <ShareEditor
        userPoints={sim.userPoints}
        fdv={sim.fdv}
        share={sim.share}
        totalPoints={sim.totalPoints}
        result={sim.result}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          <SectionHead title="The venue, in shape" sub="Volume against open interest, by asset class" to="/markets" cta="Full dashboard" />
          <CompositionChart data={comp} />
        </div>
        <MarketsPreview stats={stats.data} loading={stats.loading} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHead title="Funding radar" sub="Who is paying whom, annualised" to="/markets" cta="All rates" />
        <FundingRadar stats={stats.data} limit={4} />
      </div>

      <SessionFeed stats={stats.data} prev={stats.prev} sessionStart={stats.sessionStart} />

      <HowItsCalculated />

      <FundingViewPromo />
    </div>
  )
}
