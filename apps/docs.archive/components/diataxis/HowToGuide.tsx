/**
 * How-To Guide Component
 *
 * Structured component for How-To guides with problem-solving focus
 * Uses Tailwind intelligence styling
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

interface HowToGuideProps {
  problem: string
  solution: string
  steps: Array<{
    title: string
    description: string
    code?: string
    warning?: string
  }>
  className?: string
}

// Memoized step component to prevent unnecessary re-renders
const HowToStep = memo(function HowToStep({
  step,
  index,
  stepStyles,
  hoverTransition,
}: {
  step: { title: string; description: string; code?: string; warning?: string }
  index: number
  stepStyles: string
  hoverTransition: string
}) {
  return (
    <div
      className={cn(
        // ELITE: Enhanced hover and focus states
        'rounded-lg border bg-obsidian/30',
        'p-4 sm:p-5',
        stepStyles,
        hoverTransition,
        'hover:border-gold/30 hover:bg-obsidian/40 hover:shadow-md',
        'focus-within:ring-2 focus-within:ring-gold/50 focus-within:ring-offset-2',
        hoverTransition
      )}
      role="article"
      aria-label={`Step ${index + 1}: ${step.title}`}
    >
      <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
        <span
          className={cn('flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/20 text-gold font-mono text-xs sm:text-sm font-semibold border border-gold/30 hover:bg-gold/30', transitions.illuminate)}
          aria-label={`Step ${index + 1}`}
        >
          {index + 1}
        </span>
        <h4 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-parchment">
          {step.title}
        </h4>
      </div>
      <p className="mb-2 sm:mb-3 text-ash text-xs sm:text-sm leading-relaxed">
        {step.description}
      </p>
      {step.code && (
        <pre className="mb-2 sm:mb-3 rounded-xs bg-void p-3 sm:p-4 border border-charcoal overflow-x-auto">
          <code className="font-mono text-xs text-parchment">
            {step.code}
          </code>
        </pre>
      )}
      {step.warning && (
        <div className="rounded-xs bg-warning-500/10 p-2 sm:p-3 border border-warning-500/30">
          <p className="text-xs text-warning-600 dark:text-warning-400">
            ⚠️ <strong>Warning:</strong> {step.warning}
          </p>
        </div>
      )}
    </div>
  )
})

export function HowToGuide({
  problem,
  solution,
  steps,
  className,
}: HowToGuideProps) {
  // Use intelligence-driven styling
  const problemStyles = intelligentStatusStyles('VETOED', 'border') // Problem = error state
  const solutionStyles = intelligentStatusStyles('APPROVED', 'border') // Solution = approved state
  const stepStyles = intelligentStatusStyles('LISTENING', 'border')
  const transitionStyles = intelligentTransitionStyles('illuminate')
  const hoverTransition = intelligentTransitionStyles('hover')

  return (
    <div className={cn('my-6 sm:my-8 space-y-4 sm:space-y-6', className)}>
      {/* Problem Statement */}
      <div
        className={cn(
          // ELITE: Full responsive design
          'rounded-lg border',
          'p-4 sm:p-5 md:p-6',
          problemStyles,
          transitionStyles,
          'hover:shadow-md'
        )}
        role="alert"
        aria-label="Problem statement"
      >
        <h3 className="mb-2 font-serif text-base sm:text-lg md:text-xl font-semibold text-error-600 dark:text-error-400">
          🎯 Problem
        </h3>
        <p className="text-ash text-sm sm:text-base leading-relaxed">{problem}</p>
      </div>

      {/* Solution Overview */}
      <div
        className={cn(
          'rounded-lg border',
          'p-4 sm:p-5 md:p-6',
          solutionStyles,
          transitionStyles,
          'hover:shadow-md'
        )}
        role="status"
        aria-label="Solution overview"
      >
        <h3 className="mb-2 font-serif text-base sm:text-lg md:text-xl font-semibold text-success-600 dark:text-success-400">
          ✅ Solution
        </h3>
        <p className="text-ash text-sm sm:text-base leading-relaxed">{solution}</p>
      </div>

      {/* Steps */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="font-serif text-base sm:text-lg md:text-xl font-semibold text-parchment">
          Steps
        </h3>
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              // ELITE: Enhanced hover and focus states
              'rounded-lg border bg-obsidian/30',
              'p-4 sm:p-5',
              stepStyles,
              hoverTransition,
              'hover:border-gold/30 hover:bg-obsidian/40 hover:shadow-md',
              'focus-within:ring-2 focus-within:ring-gold/50 focus-within:ring-offset-2',
              transitions.illuminate
            )}
            role="article"
            aria-label={`Step ${index + 1}: ${step.title}`}
          >
            <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <span
                className={cn('flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gold/20 text-gold font-mono text-xs sm:text-sm font-semibold border border-gold/30 hover:bg-gold/30', transitions.illuminate)}
                aria-label={`Step ${index + 1}`}
              >
                {index + 1}
              </span>
              <h4 className="font-serif text-sm sm:text-base md:text-lg font-semibold text-parchment">
                {step.title}
              </h4>
            </div>
            <p className="mb-2 sm:mb-3 text-ash text-xs sm:text-sm leading-relaxed">
              {step.description}
            </p>
            {step.code && (
              <pre className="mb-2 sm:mb-3 rounded-xs bg-void p-3 sm:p-4 border border-charcoal overflow-x-auto">
                <code className="font-mono text-xs text-parchment">
                  {step.code}
                </code>
              </pre>
            )}
            {step.warning && (
              <div className="rounded-xs bg-warning-500/10 p-2 sm:p-3 border border-warning-500/30">
                <p className="text-xs text-warning-600 dark:text-warning-400">
                  ⚠️ <strong>Warning:</strong> {step.warning}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
