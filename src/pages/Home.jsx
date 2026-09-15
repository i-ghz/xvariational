import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { StatsStrip } from '../components/StatsStrip'
import { PointsCalculator } from '../components/PointsCalculator'
import { EarnMore } from '../components/EarnMore'
import { MarketConsensus } from '../components/MarketConsensus'
import { ShareEditor } from '../components/LazyShare'
import { MarketsPreview } from '../components/MarketsPreview'
import { CompositionChart } from '../components/charts/CompositionChart'
import { FundingRadar } from '../components/FundingRadar'
import { FundingViewPromo } from '../components/FundingViewPromo'
import { composition } from '../lib/analytics'
import { ASSUMPTIONS } from '../lib/consensus'

export function Home({ stats, sim, market }) {
  const listings = stats.data?.listings
  const comp = useMemo(() => (listings ? composition(listings) : null), [listings])

  const pickFdv = (v) =>
    sim.setFdv(Math.min(ASSUMPTIONS.fdv.max, Math.max(ASSUMPTIONS.fdv.min, v)))

  return (
    <div className="flex flex-col gap-4 animate-rise">
      <StatsStrip
        stats={stats.data}
        error={stats.error}
        loading={stats.loading}
        updatedAt={stats.updatedAt}
        onRefresh={stats.refresh}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-4 items-start">
        <PointsCalculator sim={sim} />
        <EarnMore />
      </div>

      <MarketConsensus
        market={market}
        userPoints={sim.userPoints}
        share={sim.share}
        totalPoints={sim.totalPoints}
        onPickFdv={pickFdv}
        activeFdv={sim.fdv}
      />

      <ShareEditor
        userPoints={sim.userPoints}
        fdv={sim.fdv}
        share={sim.share}
        totalPoints={sim.totalPoints}
        result={sim.result}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3 px-1">
            <div>
              <h2 className="section-title !text-[17px]">The venue, in shape</h2>
              <p className="section-sub !text-[12.5px] !mt-0.5">Volume against open interest, by asset class</p>
            </div>
            <Link to="/markets" className="text-[12.5px] link-quiet flex items-center gap-1 shrink-0 group">
              Full dashboard
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <CompositionChart data={comp} />
        </div>

        <MarketsPreview stats={stats.data} loading={stats.loading} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3 px-1">
          <div>
            <h2 className="section-title !text-[17px]">Funding radar</h2>
            <p className="section-sub !text-[12.5px] !mt-0.5">Who is paying whom, annualised</p>
          </div>
          <Link to="/markets" className="text-[12.5px] link-quiet flex items-center gap-1 shrink-0 group">
            All rates
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <FundingRadar stats={stats.data} limit={4} />
      </div>

      <FundingViewPromo />
    </div>
  )
}
