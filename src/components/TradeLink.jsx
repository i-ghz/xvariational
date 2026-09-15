import { ArrowUpRight } from 'lucide-react'
import { clsx } from 'clsx'
import { REF_CODE, omni, omniMarket } from '../lib/config'

/**
 * Every outbound link to Variational goes through here, so the referral code is
 * never forgotten and never has to be typed twice.
 */
export function TradeLink({ ticker, isSwap, path, children, className, variant = 'bare', arrow = false, ...rest }) {
  const href = ticker ? omniMarket(ticker, isSwap) : omni(path)
  const styles = {
    bare: '',
    primary: 'btn-primary',
    ghost: 'btn-ghost',
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles[variant], className)}
      {...rest}
    >
      {children}
      {arrow && <ArrowUpRight size={15} className="shrink-0" />}
    </a>
  )
}

/** Small, quiet mark that explains why the links carry a code. */
export function RefBadge({ className }) {
  return (
    <span className={clsx('num text-[11px] tracking-[0.08em] text-dim', className)}>
      ref · {REF_CODE}
    </span>
  )
}
