/**
 * Tutorial Steps Component
 *
 * Enhanced version of Steps component specifically for Tutorials
 * Uses Diátaxis "we" language and Tailwind intelligence styling
 *
 * Optimized with React.memo() for performance
 */

import { memo } from 'react'
import {
  cn,
  intelligentStatusStyles,
  intelligentTransitionStyles,
} from '@mythic/shared-utils'
import { transitions } from '../../lib/transitions'

interface TutorialStepsProps {
  steps: Array<{
    title: string
    description?: string
    code?: string
    note?: string
  }>
  className?: string
}

// Memoized step component to prevent unnecessary re-renders
const TutorialStep = memo(function TutorialStep({
  step,
  index,
  totalSteps,
}: {
  step: { title: string; description?: string; code?: string; note?: string }
  index: number
  totalSteps: number
}) {
  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0">
          <div
            className={cn('flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/20 text-gold font-mono text-xs sm:text-sm font-semibold border border-gold/30 hover:bg-gold/30', transitions.illuminate)}
            aria-label={`Step ${index + 1}`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <>
              <div className="hidden sm:block mt-2 h-full w-0.5 bg-charcoal/30" />
              <div className="sm:hidden w-full h-0.5 bg-charcoal/30" />
            </>
          )}
        </div>
        <div className="flex-1 pb-4 sm:pb-6 min-w-0">
          <h3 className="mb-2 sm:mb-3 font-serif text-base sm:text-lg md:text-xl font-semibold text-parchment">
            {step.title}
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {step.description && (
              <p className="text-ash text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            )}
            {step.code && (
              <pre className="rounded-xs bg-void p-3 sm:p-4 border border-charcoal overflow-x-auto">
                <code className="font-mono text-xs text-parchment">
                  {step.code}
                </code>
              </pre>
            )}
            {step.note && (
              <div className="rounded-xs bg-ash/10 p-2 sm:p-3 border border-ash/20">
                <p className="text-xs text-ash italic">{step.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export function TutorialSteps({ steps, className }: TutorialStepsProps) {
  // Use intelligence-driven styling
  const reminderStyles = intelligentStatusStyles('LISTENING', 'border')
  const successStyles = intelligentStatusStyles('APPROVED', 'border')
  const transitionStyles = intelligentTransitionStyles('illuminate')

  return (
    <div className={cn('@container my-6 sm:my-8', className)}>
      <div
        className={cn(
          // ELITE: Responsive padding and spacing
          'mb-4 sm:mb-6 rounded-xs border',
          'p-3 sm:p-4 md:p-5',
          reminderStyles,
          transitionStyles,
          'hover:shadow-md'
        )}
        role="alert"
        aria-label="Tutorial reminder"
      >
        <p className="text-xs sm:text-sm text-gold font-medium">
          💡 <strong>Remember:</strong> In this tutorial, we will work through
          this together. Follow each step in order.
        </p>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {steps.map((step, index) => (
          <TutorialStep key={index} step={step} index={index} totalSteps={steps.length} />
        ))}
      </div>
      <div
        className={cn(
          'mt-4 sm:mt-6 rounded-xs border',
          'p-3 sm:p-4 md:p-5',
          successStyles,
          transitionStyles,
          'hover:shadow-md'
        )}
        role="status"
        aria-label="Tutorial completion"
      >
        <p className="text-xs sm:text-sm text-success-600 dark:text-success-400 font-medium">
          ✅ <strong>Congratulations!</strong> You have completed this tutorial.
          You now know how to accomplish this task.
        </p>
      </div>
    </div>
  )
}
