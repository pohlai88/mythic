/**
 * ReferenceBenchmark Component
 *
 * Displays X/Y/Z cluster reference benchmarks from the governance playbook.
 * Used to show progress metrics against established benchmarks.
 */

import type React from 'react'

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

function getProgressColor(current: number, cluster: BenchmarkCluster): string {
  if (current >= cluster.z) return 'bg-purple-500' // Exceeds stretch goal
  if (current >= cluster.y) return 'bg-emerald-500' // Meets target
  if (current >= cluster.x) return 'bg-amber-500' // Meets baseline
  return 'bg-red-500' // Below baseline
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

  return (
    <div className="my-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-3">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      {/* X/Y/Z Cluster */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded bg-gray-100 p-2 text-center dark:bg-gray-700">
          <div className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
            X (Baseline)
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
            {cluster.x}
            {unit}
          </div>
        </div>
        <div className="rounded bg-blue-100 p-2 text-center dark:bg-blue-900/50">
          <div className="text-xs font-medium uppercase text-blue-600 dark:text-blue-400">
            Y (Target)
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-blue-900 dark:text-blue-100">
            {cluster.y}
            {unit}
          </div>
        </div>
        <div className="rounded bg-purple-100 p-2 text-center dark:bg-purple-900/50">
          <div className="text-xs font-medium uppercase text-purple-600 dark:text-purple-400">
            Z (Stretch)
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-purple-900 dark:text-purple-100">
            {cluster.z}
            {unit}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && hasCurrentValue && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Current: {current}
              {unit}
            </span>
            <span
              className={`font-medium ${getProgressColor(current, cluster).replace('bg-', 'text-')}`}
            >
              {getProgressLabel(current, cluster)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(current, cluster)}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>X: {cluster.x}</span>
            <span>Y: {cluster.y}</span>
            <span>Z: {cluster.z}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReferenceBenchmark
