/**
 * AxisHero - Canonical Page Header Block
 *
 * DOCTRINE: Slot model enforced. No children prop to prevent escape hatches.
 * - status: Optional system status badge
 * - title: Required page title
 * - subtitle: Optional gradient text subtitle
 * - description: Optional body text
 * - actions: Optional action buttons slot
 */

interface AxisHeroProps {
  status?: string
  title: string
  subtitle?: string
  description?: string
  actions?: React.ReactNode
  // NO children prop - slots are explicit
}

export function AxisHero({ status, title, subtitle, description, actions }: AxisHeroProps) {
  return (
    <header className="mb-20">
      {status && (
        <div className="micro-status mb-6 inline-flex items-center gap-4 whitespace-nowrap">
          <span aria-hidden="true" className="h-px w-14 bg-gold/40" />
          <span>{status}</span>
        </div>
      )}

      <h1 className="h1-apex">
        {title}
        {subtitle && <span className="text-divergence mt-1 block font-normal">{subtitle}</span>}
      </h1>

      {description && (
        <p className="mt-6 max-w-prose text-body leading-body text-muted opacity-75">
          {description}
        </p>
      )}

      {actions && <div className="mt-8 flex gap-6">{actions}</div>}
    </header>
  )
}
