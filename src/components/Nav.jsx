import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { TradeLink } from './TradeLink'
import logo from '../assets/logo-new.png'

const PAGES = [
  { to: '/', label: 'Overview', end: true },
  { to: '/markets', label: 'Markets' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-page/85 backdrop-blur-xl border-b border-line">
      <div className="mx-auto max-w-[1200px] px-4 md:px-7 h-14 flex items-center gap-4">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="" className="w-6 h-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">xVariational</span>
        </NavLink>

        <nav className="flex items-center gap-0.5 text-[13.5px] overflow-x-auto scroll-soft -mx-1 px-1">
          {PAGES.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              end={p.end}
              className={({ isActive }) =>
                clsx(
                  'px-3 py-1.5 rounded-full whitespace-nowrap transition-colors',
                  isActive ? 'bg-accent-soft text-accent font-medium' : 'text-muted hover:text-ink hover:bg-sunken',
                )
              }
            >
              {p.label}
            </NavLink>
          ))}
        </nav>

        <TradeLink variant="primary" arrow className="ml-auto !px-4 !py-2 !text-[13.5px] shrink-0">
          <span className="hidden md:inline">Join with free Bronze</span>
          <span className="hidden sm:inline md:hidden">Free Bronze</span>
          <span className="sm:hidden">Join</span>
        </TradeLink>
      </div>
    </header>
  )
}
