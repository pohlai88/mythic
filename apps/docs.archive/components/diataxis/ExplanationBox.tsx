/**
 * Explanation Box Component
 *
 * For conceptual understanding and background information
 * Uses Tailwind intelligence styling with emphasis on clarity
 */

import {
  cn,
  intelligentStatusStyles,
  intelligentPriorityStyles,
  intelligentTransitionStyles,
  type ProposalStatus,
  type PriorityLevel,
} from '@mythic/shared-utils'

interface ExplanationBoxProps {
  title?: string
  children: React.ReactNode
  type?: 'concept' | 'background' | 'rationale' | 'context'
  className?: string
}

/**
 * Map explanation types to proposal statuses for intelligence-driven styling
 */
const typeToStatusMap: Record<
  'concept' | 'background' | 'rationale' | 'context',
  ProposalStatus
> = {
  concept: 'APPROVED', // Concept = positive understanding
  background: 'LISTENING', // Background = neutral information
  rationale: 'LISTENING', // Rationale = neutral reasoning
  context: 'APPROVED', // Context = positive understanding
}

const typeConfig = {
  concept: {
    icon: '🧠',
    border: 'border-primary-500/30',
    bg: 'bg-primary-500/10',
    title: 'Concept',
  },
  background: {
    icon: '📜',
    border: 'border-neutral-500/30',
    bg: 'bg-neutral-500/10',
    title: 'Background',
  },
  rationale: {
    icon: '💭',
    border: 'border-warning-500/30',
    bg: 'bg-warning-500/10',
    title: 'Rationale',
  },
  context: {
    icon: '🌐',
    border: 'border-success-500/30',
    bg: 'bg-success-500/10',
    title: 'Context',
  },
}

export function ExplanationBox({
  title,
  children,
  type = 'concept',
  className,
}: ExplanationBoxProps) {
  const config = typeConfig[type]
  const status = typeToStatusMap[type]

  // Use intelligence-driven styling
  const borderStyles = intelligentStatusStyles(status, 'border')
  const transitionStyles = intelligentTransitionStyles('illuminate')

  return (
    <div
      className={cn(
        // ELITE: Full responsive design with enhanced states
        'my-4 sm:my-6 rounded-lg border',
        'p-4 sm:p-5 md:p-6',
        borderStyles,
        transitionStyles,
        'hover:shadow-md hover:bg-obsidian/20',
        'focus-within:ring-2 focus-within:ring-gold/30 focus-within:ring-offset-2',
        className
      )}
      role="complementary"
      aria-label={title || config.title}
    >
      <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span className="text-lg sm:text-xl" aria-hidden="true">{config.icon}</span>
        <h4 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-parchment">
          {title || config.title}
        </h4>
      </div>
      <div className="text-ash text-xs sm:text-sm leading-relaxed">{children}</div>
    </div>
  )
}
