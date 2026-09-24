import { useMemo } from 'react'
import { Markets } from '../components/Markets'
import { StatsStrip } from '../components/StatsStrip'
import { VenueHeartbeat } from '../components/charts/VenueHeartbeat'
import { CompositionChart } from '../components/charts/CompositionChart'
import { ConcentrationChart } from '../components/charts/ConcentrationChart'
import { FundingHistogram } from '../components/charts/FundingHistogram'
import { SkewChart } from '../components/charts/SkewChart'
import { TurnoverChart } from '../components/charts/TurnoverChart'
import { StatsShare } from '../components/LazyShare'
import { composition, concentration, fundingHistogram, skew, turnover } from '../lib/analytics'

export function MarketsPage({ stats }) {
  const listings = stats.data?.listings

  const derived = useMemo(() => {
    if (!listings) return {}
    return {
      composition: composition(listings),
      concentration: concentration(listings),
      funding: fundingHistogram(listings),
      skew: skew(listings, 10),
      turnover: turnover(listings, 8),
    }
  }, [listings])

  return (
    <div className="flex flex-col gap-4 animate-rise">
      <header>
        <h1 className="text-[26px] md:text-[32px] font-semibold tracking-[-0.03em] leading-tight">Markets</h1>
        <p className="text-[14px] text-muted mt-1.5 max-w-2xl leading-relaxed">
          Every perp Variational Omni lists — Bitcoin, Nvidia and gold on the same order book — plus
          the shape behind the list: what the venue is made of, how concentrated it is, and which way
          it leans.
        </p>
      </header>

      <StatsStrip
        stats={stats.data}
        error={stats.error}
        loading={stats.loading}
        updatedAt={stats.updatedAt}
        onRefresh={stats.refresh}
      />

      <VenueHeartbeat stats={stats.data} prev={stats.prev} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <CompositionChart data={derived.composition} />
        <ConcentrationChart data={derived.concentration} />
        <FundingHistogram data={derived.funding} />
        <SkewChart rows={derived.skew} />
      </div>

      <TurnoverChart rows={derived.turnover} />

      <StatsShare
        stats={stats.data}
        composition={derived.composition}
        concentration={derived.concentration}
      />

      <div className="pt-4">
        <h2 className="section-title mb-1">All {stats.data?.numMarkets || ''} markets</h2>
        <p className="section-sub mb-4">Search, filter and sort the full list. Tap a row to open it on Omni.</p>
        <Markets listings={listings} loading={stats.loading} />
      </div>

      <p className="text-[11.5px] text-dim">
        Live from Variational&apos;s public stats API · funding shown annualised · open interest counts both sides.
      </p>
    </div>
  )
}
