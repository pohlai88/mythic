/**
 * Diátaxis Utility Functions
 *
 * Helper functions for Diátaxis document type detection and styling
 */

export type DiataxisType = 'tutorial' | 'how-to' | 'reference' | 'explanation'

/**
 * Detect document type from frontmatter
 */
export function getDocumentType(
  frontmatter: Record<string, unknown>
): DiataxisType | null {
  const type = frontmatter.type as string | undefined

  if (!type) return null

  // Normalize type values
  const normalized = type.toLowerCase().replace(/\s+/g, '-')

  if (normalized === 'tutorial' || normalized === 'tutorials') {
    return 'tutorial'
  }
  if (normalized === 'how-to' || normalized === 'howto' || normalized === 'how_to') {
    return 'how-to'
  }
  if (normalized === 'reference' || normalized === 'ref') {
    return 'reference'
  }
  if (normalized === 'explanation' || normalized === 'explain') {
    return 'explanation'
  }

  return null
}

/**
 * Get Tailwind classes for document type
 */
export function getDocumentTypeClasses(type: DiataxisType): string {
  const classes = {
    tutorial: 'diataxis-tutorial',
    'how-to': 'diataxis-howto',
    reference: 'diataxis-reference',
    explanation: 'diataxis-explanation',
  }

  return classes[type] || ''
}

/**
 * Get document type icon
 */
export function getDocumentTypeIcon(type: DiataxisType): string {
  const icons = {
    tutorial: '📖',
    'how-to': '🔧',
    reference: '📚',
    explanation: '💡',
  }

  return icons[type] || '📄'
}

/**
 * Get document type label
 */
export function getDocumentTypeLabel(type: DiataxisType): string {
  const labels = {
    tutorial: 'Tutorial',
    'how-to': 'How-To',
    reference: 'Reference',
    explanation: 'Explanation',
  }

  return labels[type] || 'Document'
}

/**
 * Get document type description
 */
export function getDocumentTypeDescription(type: DiataxisType): string {
  const descriptions = {
    tutorial:
      'This is a learning-oriented guide. We will work through this together, step by step.',
    'how-to':
      'This is a problem-oriented guide. Follow these steps to accomplish a specific task.',
    reference:
      'This is a reference document. Look up specific information about how something works.',
    explanation:
      'This is an explanation document. Understand the background and reasoning behind concepts.',
  }

  return descriptions[type] || ''
}
