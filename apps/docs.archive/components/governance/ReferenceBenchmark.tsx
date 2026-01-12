/**
 * ReferenceBenchmark Component
 *
 * Displays X/Y/Z cluster reference benchmarks from the governance playbook.
 * Uses design system tokens and intelligence utilities
 */

import type React from 'react'
import { cn } from '@mythic/shared-utils'
import { Card } from '../shared'
import { Badge } from '../shared'
import { tokens } from '../../lib/design-tokens'
import { intelligentRiskStyles } from '@mythic/shared-utils'
import { transitions } from '../../lib/transitions'

interface BenchmarkCluster {
  x: number // Baseline / Minimum
  y: number // Target / Expected
  z: number // Stretch / Aspirational
}

interface ReferenceBenchmarkProps {
  name: string
  description?: string
  cluster: BenchmarkCluster
  current?: number
  unit?: string
  showProgress?: boolean
}

/**
 * Calculate risk status from current value vs cluster
 */
function getRiskStatus(current: number, cluster: BenchmarkCluster): 'on_track' | 'warning' | 'overrun' | 'underrun' | 'critical' {
  if (current >= cluster.z) return 'on_track' // Exceeds stretch goal
  if (current >= cluster.y) return 'on_track' // Meets target
  if (current >= cluster.x) return 'warning' // Meets baseline
  const variance = ((current - cluster.x) / cluster.x) * 100
  if (variance <= -10) return 'critical' // Well below baseline
  return 'underrun' // Below baseline
}

function getProgressLabel(current: number, cluster: BenchmarkCluster): string {
  if (current >= cluster.z) return 'Exceeds Aspirational'
  if (current >= cluster.y) return 'Meets Target'
  if (current >= cluster.x) return 'Meets Baseline'
  return 'Below Baseline'
}

export function ReferenceBenchmark({
  name,
  description,
  cluster,
  current,
  unit = '',
  showProgress = true,
}: ReferenceBenchmarkProps): React.ReactElement {
  const hasCurrentValue = current !== undefined
  const progressPercent = hasCurrentValue ? Math.min((current / cluster.z) * 100, 100) : 0
  const riskStatus = hasCurrentValue ? getRiskStatus(current, cluster) : 'on_track'
  const riskStyles = hasCurrentValue ? intelligentRiskStyles(riskStatus, 'future') : ''

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <Card.Header>
        <Card.Title>{name}</Card.Title>
        {description && (
          <Card.Content className="mt-1">{description}</Card.Content>
        )}
      </Card.Header>

      {/* X/Y/Z Cluster */}
      <Card.Content>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          <div className={cn('rounded-xs p-2 text-center bg-obsidian/30', tokens.borders.subtle)}>
            <div className="text-xs font-medium uppercase text-ash">
              X (Baseline)
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-parchment">
              {cluster.x}
              {unit}
            </div>
          </div>
          <div className={cn('rounded-xs p-2 text-center bg-gold/10 border border-gold/30')}>
            <div className="text-xs font-medium uppercase text-gold">
              Y (Target)
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-gold">
              {cluster.y}
              {unit}
            </div>
          </div>
          <div className={cn('rounded-xs p-2 text-center bg-ember/10 border border-ember/30')}>
            <div className="text-xs font-medium uppercase text-ember">
              Z (Stretch)
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-ember">
              {cluster.z}
              {unit}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && hasCurrentValue && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-parchment">
                Current: {current}
                {unit}
              </span>
              <Badge status={riskStatus === 'on_track' ? 'APPROVED' : riskStatus === 'critical' ? 'VETOED' : 'LISTENING'} size="sm">
                {getProgressLabel(current, cluster)}
              </Badge>
            </div>
            <div className={cn('h-2 overflow-hidden rounded-full bg-obsidian/50', tokens.borders.subtle)}>
              <div
                className={cn('h-full', transitions.illuminate, riskStyles)}
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
              />
            </div>
            <div className="flex justify-between text-xs text-ash">
              <span>0</span>
              <span>X: {cluster.x}</span>
              <span>Y: {cluster.y}</span>
              <span>Z: {cluster.z}</span>
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

export default ReferenceBenchmark
