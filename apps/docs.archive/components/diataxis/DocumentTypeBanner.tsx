/**
 * Diátaxis Document Type Banner
 *
 * Full-width banner for document type identification
 * Uses Tailwind intelligence-driven styling with Axis Visual Canon
 */

import {
  cn,
  intelligentGradientStyles,
  intelligentTransitionStyles,
} from '@mythic/shared-utils'
import { DocumentTypeBadge, type DiataxisType } from './DocumentTypeBadge'

interface DocumentTypeBannerProps {
  type: DiataxisType
  title?: string
  description?: string
  className?: string
}

/**
 * Map Diátaxis document types to border colors using domain theme
 */
const typeBorderClasses: Record<DiataxisType, string> = {
  tutorial: 'border-diataxis-tutorial-border',
  'how-to': 'border-diataxis-howto-border',
  reference: 'border-diataxis-reference-border',
  explanation: 'border-diataxis-explanation-border',
}

/**
 * Map Diátaxis document types to gradient types for intelligence-driven styling
 */
const typeToGradientMap: Record<DiataxisType, 'approved' | 'success' | 'neutral' | 'warning'> = {
  tutorial: 'success',
  'how-to': 'approved',
  reference: 'neutral',
  explanation: 'warning',
}

const bannerConfig: Record<
  DiataxisType,
  {
    icon: string
    defaultTitle: string
    defaultDescription: string
  }
> = {
  tutorial: {
    icon: '📖',
    defaultTitle: 'Tutorial',
    defaultDescription:
      'This is a learning-oriented guide. We will work through this together, step by step.',
  },
  'how-to': {
    icon: '🔧',
    defaultTitle: 'How-To Guide',
    defaultDescription:
      'This is a problem-oriented guide. Follow these steps to accomplish a specific task.',
  },
  reference: {
    icon: '📚',
    defaultTitle: 'Reference',
    defaultDescription:
      'This is a reference document. Look up specific information about how something works.',
  },
  explanation: {
    icon: '💡',
    defaultTitle: 'Explanation',
    defaultDescription:
      'This is an explanation document. Understand the background and reasoning behind concepts.',
  },
}

export function DocumentTypeBanner({
  type,
  title,
  description,
  className,
}: DocumentTypeBannerProps) {
  const config = bannerConfig[type]
  const gradientType = typeToGradientMap[type]

  // Use domain theme colors for borders, intelligence functions for gradients and transitions
  const borderStyles = typeBorderClasses[type]
  const gradientStyles = intelligentGradientStyles(gradientType)
  const transitionStyles = intelligentTransitionStyles('illuminate')

  return (
    <div
      className={cn(
        // ELITE: Full responsive design with breakpoint system
        'mb-6 sm:mb-8 rounded-lg border',
        'p-4 sm:p-5 md:p-6',
        borderStyles,
        gradientStyles,
        transitionStyles,
        'bg-obsidian/50',
        // Hover enhancement
        'hover:bg-obsidian/60 hover:shadow-lg',
        className
      )}
      role="banner"
      aria-label={`${type} document type banner`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="text-2xl sm:text-3xl" aria-hidden="true">{config.icon}</div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <DocumentTypeBadge type={type} size="md" />
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-parchment">
              {title || config.defaultTitle}
            </h2>
          </div>
          <p className="text-ash text-xs sm:text-sm leading-relaxed">
            {description || config.defaultDescription}
          </p>
        </div>
      </div>
    </div>
  )
}
