/**
 * AxisCard - Unified Navigation Card Block
 *
 * DOCTRINE: Single card component for all navigation patterns.
 * Uses card-axis and btn-axis utilities from design system.
 */

import Link from "next/link"

interface AxisCardProps {
  href: string
  eyebrow: string
  title: string
  body: string
  action?: string
  documentId?: string
  ariaLabel?: string
}

export function AxisCard({
  href,
  eyebrow,
  title,
  body,
  action = "Enter Module →",
  documentId,
  ariaLabel,
}: AxisCardProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? `Navigate to ${title}`}
      className="card-axis group relative block p-10 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
    >
      {/* Document ID - optional */}
      {documentId && (
        <div className="absolute right-6 top-6 font-mono text-micro text-muted/40 group-hover:text-gold/50 transition-colors duration-700">
          {documentId}
        </div>
      )}

      {/* Eyebrow - Gold authority signal */}
      <div className="mb-6 font-mono text-meta uppercase tracking-[0.12em] text-gold opacity-90">
        {eyebrow}
      </div>

      {/* Title */}
      <h3 className="mb-3 text-h3 font-medium tracking-h3 text-signal">{title}</h3>

      {/* Description */}
      <p className="mb-8 text-body font-light leading-body text-muted opacity-90">{body}</p>

      {/* Action */}
      <div className="mt-auto">
        <span className="btn-axis">{action}</span>
      </div>
    </Link>
  )
}
