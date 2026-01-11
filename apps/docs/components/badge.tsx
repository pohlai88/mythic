'use client'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'info' | 'success' | 'error' | 'warning'
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xs px-2 py-0.5 text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  )
}
