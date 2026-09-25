import { useEffect, useState } from 'react'
import { TradeLink } from './TradeLink'
import { REF_CODE } from '../lib/config'

/** Quiet bottom bar on phones — appears once the first screen is behind you. */
export function MobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3
        bg-gradient-to-t from-page via-page/95 to-transparent transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <TradeLink variant="primary" arrow className="w-full !py-3 !text-[14.5px] flex-col !gap-0">
        <span>Join Omni with free Bronze</span>
        <span className="num text-[11px] font-normal opacity-80">
          code {REF_CODE} · 90 days, +0.5% points
        </span>
      </TradeLink>
    </div>
  )
}
