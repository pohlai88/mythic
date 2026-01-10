'use client'

import type React from 'react'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { icon: string; className: string }> = {
  info: {
    icon: 'ℹ️',
    className: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
  },
  warning: {
    icon: '⚠️',
    className:
      'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
  },
  error: {
    icon: '❌',
    className: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
  },
  success: {
    icon: '✅',
    className:
      'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
  },
  tip: {
    icon: '💡',
    className:
      'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = calloutStyles[type]

  return (
    <div className={`my-4 rounded-lg border-l-4 p-4 ${style.className}`} role="alert">
      <div className="flex items-start">
        <span className="mr-3 text-xl">{style.icon}</span>
        <div className="flex-1">
          {title && <h4 className="mb-2 font-semibold">{title}</h4>}
          <div className="callout-content">{children}</div>
        </div>
      </div>
    </div>
  )
}
