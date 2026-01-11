/**
 * StatusBadge Component
 *
 * Displays status indicators for governance documents:
 * - sealed: Document is immutable and hash-verified
 * - ratified: Document has been formally approved
 * - draft: Document is still being developed
 * - deprecated: Document has been superseded
 */

import type React from 'react'

export type DocumentStatus = 'sealed' | 'ratified' | 'draft' | 'deprecated' | 'active'

interface StatusBadgeProps {
  status: DocumentStatus
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const statusConfig: Record<
  DocumentStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  sealed: {
    label: 'Sealed',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    icon: '🔒',
  },
  ratified: {
    label: 'Ratified',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-200',
    icon: '✓',
  },
  draft: {
    label: 'Draft',
    bgColor: 'bg-amber-100 dark:bg-amber-900',
    textColor: 'text-amber-800 dark:text-amber-200',
    icon: '📝',
  },
  deprecated: {
    label: 'Deprecated',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-600 dark:text-gray-400',
    icon: '⚠️',
  },
  active: {
    label: 'Active',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-800 dark:text-purple-200',
    icon: '⚡',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: StatusBadgeProps): React.ReactElement {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  )
}

export default StatusBadge
