/**
 * Variance Display Component
 *
 * Displays budget variance analysis using intelligence-driven styling.
 * Shows Budgeted/Planned/Actual with automatic risk-based color coding.
 *
 * @see PRD Section 4.3 Weapon 8: The Oracle
 */

'use client'

import { Card } from '@mythic/design-system'
import {
  intelligentRiskStyles,
  intelligentVarianceStyles,
  calculateRiskStatus,
  type RiskStatus,
} from '@mythic/shared-utils'
import { useMemo, memo } from 'react'
import { cn } from '@mythic/shared-utils'

interface VarianceData {
  budgeted: number
  planned: number
  actual: number
  budgetedAt?: Date
  plannedAt?: Date
  actualAt?: Date
}

interface VarianceDisplayProps {
  variance: VarianceData
  className?: string
  showBreakdown?: boolean
}

/**
 * Calculate variance percentage from budgeted to actual
 */
function calculateVariancePct(budgeted: number, actual: number): number {
  if (budgeted === 0) return 0
  return ((actual - budgeted) / budgeted) * 100
}

/**
 * Variance Display Component
 *
 * Displays the Tri-Vector model (Budgeted/Planned/Actual) with
 * intelligence-driven styling based on variance percentages.
 */
export const VarianceDisplay = memo(function VarianceDisplay({
  variance,
  className,
  showBreakdown = false,
}: VarianceDisplayProps) {
  const budgetedVariance = useMemo(
    () => calculateVariancePct(variance.budgeted, variance.actual),
    [variance.budgeted, variance.actual]
  )

  const plannedVariance = useMemo(
    () => calculateVariancePct(variance.planned, variance.actual),
    [variance.planned, variance.actual]
  )

  const riskStatus = useMemo(
    () => calculateRiskStatus(budgetedVariance),
    [budgetedVariance]
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tri-Vector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Past Vector: Budgeted */}
        <Card
          elevation="sm"
          className={intelligentRiskStyles('on_track', 'past', 'p-4 border-l-4')}
        >
          <h4 className="text-sm font-semibold mb-2 text-ash">📋 Budgeted</h4>
          <p className="text-2xl font-bold font-mono text-parchment">
            ${variance.budgeted.toLocaleString()}
          </p>
          {variance.budgetedAt && (
            <p className="text-xs text-ash mt-2">
              {variance.budgetedAt.toLocaleDateString()}
            </p>
          )}
        </Card>

        {/* Present Vector: Planned */}
        <Card
          elevation="sm"
          className={intelligentRiskStyles('on_track', 'present', 'p-4 border-l-4')}
        >
          <h4 className="text-sm font-semibold mb-2 text-ash">📊 Planned</h4>
          <p className="text-2xl font-bold font-mono text-parchment">
            ${variance.planned.toLocaleString()}
          </p>
          {variance.plannedAt && (
            <p className="text-xs text-ash mt-2">
              {variance.plannedAt.toLocaleDateString()}
            </p>
          )}
        </Card>

        {/* Future Vector: Actual (with risk-based styling) */}
        <Card
          elevation="sm"
          className={intelligentRiskStyles(budgetedVariance, 'future', 'p-4 border-l-4')}
        >
          <h4 className="text-sm font-semibold mb-2 text-ash">🎯 Actual</h4>
          <p className="text-2xl font-bold font-mono text-parchment">
            ${variance.actual.toLocaleString()}
          </p>
          {variance.actualAt && (
            <p className="text-xs text-ash mt-2">
              {variance.actualAt.toLocaleDateString()}
            </p>
          )}
        </Card>
      </div>

      {/* Variance Summary */}
      <Card elevation="sm" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-gold font-serif">Variance Analysis</h4>
          <span
            className={intelligentVarianceStyles(
              budgetedVariance,
              'badge',
              'px-3 py-1 rounded-full text-sm font-medium'
            )}
          >
            {budgetedVariance > 0 ? '+' : ''}
            {budgetedVariance.toFixed(1)}%
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ash">Budgeted → Actual:</span>
            <span className={intelligentVarianceStyles(budgetedVariance, 'text', 'font-mono')}>
              {budgetedVariance > 0 ? '+' : ''}
              {budgetedVariance.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ash">Planned → Actual:</span>
            <span className={intelligentVarianceStyles(plannedVariance, 'text', 'font-mono')}>
              {plannedVariance > 0 ? '+' : ''}
              {plannedVariance.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-charcoal">
            <span className="text-ash">Risk Status:</span>
            <span
              className={intelligentRiskStyles(riskStatus, 'future', 'px-2 py-1 rounded-xs text-xs font-medium')}
            >
              {riskStatus.toUpperCase().replace('_', ' ')}
            </span>
          </div>
        </div>
      </Card>

      {/* Breakdown (optional) */}
      {showBreakdown && (
        <Card elevation="sm" className="p-4">
          <h4 className="text-gold font-serif mb-4">Breakdown</h4>
          <div className="text-xs text-ash italic">
            Detailed breakdown feature coming soon
          </div>
        </Card>
      )}
    </div>
  )
})
