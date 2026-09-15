import logo from '../assets/logo-new.png'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink/60 border-b border-line">
      <div className="mx-auto max-w-6xl px-5 md:px-8 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" className="w-6 h-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight">xVariational</span>
        </a>
        <nav className="flex items-center gap-1 text-[13px]">
          <a href="#simulator" className="hidden sm:block px-3 py-1.5 rounded-full text-muted hover:text-text transition-colors">Simulator</a>
          <a href="#market" className="hidden sm:block px-3 py-1.5 rounded-full text-muted hover:text-text transition-colors">Market</a>
          <a href="#share" className="hidden sm:block px-3 py-1.5 rounded-full text-muted hover:text-text transition-colors">Share</a>
          <a
            href="https://omni.variational.io/?ref=OMNIGHZ"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-1.5 rounded-full bg-text text-ink font-medium hover:bg-white transition-colors"
          >
            Trade
          </a>
        </nav>
      </div>
    </header>
  )
}
