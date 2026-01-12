/**
 * ConstitutionalCitation Component
 *
 * Standardized citation format for referencing constitutional articles.
 * Uses design system tokens and shared components.
 */

import type React from 'react'
import { Link } from '../shared'
import { Badge } from '../shared'
import { cn } from '@mythic/shared-utils'
import { tokens } from '../../lib/design-tokens'

interface ConstitutionalCitationProps {
  article: string
  section?: string
  clause?: string
  title: string
  documentName?: string
  href?: string
}

export function ConstitutionalCitation({
  article,
  section,
  clause,
  title,
  documentName = 'NexusCanon Constitution',
  href,
}: ConstitutionalCitationProps): React.ReactElement {
  // Build citation reference
  const parts = [`Article ${article}`]
  if (section) parts.push(`Section ${section}`)
  if (clause) parts.push(`Clause ${clause}`)
  const reference = parts.join('.')

  const content = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs border',
        'bg-gold/10 border-gold/30 px-2 py-1 text-sm'
      )}
    >
      <Badge status="APPROVED" size="sm" className="font-mono">
        [{reference}]
      </Badge>
      <span className="text-parchment">{title}</span>
      <span className="text-xs text-ash">({documentName})</span>
    </span>
  )

  if (href) {
    return (
      <Link
        href={href}
        variant="default"
        className="inline-block text-inherit no-underline"
        title={`View ${reference}: ${title}`}
      >
        {content}
      </Link>
    )
  }

  return content
}

export default ConstitutionalCitation
