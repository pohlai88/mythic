/**
 * ConstitutionalCitation Component
 *
 * Standardized citation format for referencing constitutional articles.
 * Provides consistent formatting for governance document citations.
 */

import type React from 'react'

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
    <span className="inline-flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-sm dark:border-amber-800 dark:bg-amber-900/50">
      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
        [{reference}]
      </span>
      <span className="text-amber-900 dark:text-amber-100">{title}</span>
      <span className="text-xs text-amber-600 dark:text-amber-400">({documentName})</span>
    </span>
  )

  if (href) {
    return (
      <a
        href={href}
        className="inline-block text-inherit no-underline transition-opacity hover:opacity-80"
        title={`View ${reference}: ${title}`}
      >
        {content}
      </a>
    )
  }

  return content
}

export default ConstitutionalCitation
