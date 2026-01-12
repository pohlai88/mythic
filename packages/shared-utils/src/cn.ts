/**
 * Class Name Utility
 *
 * Combines clsx and tailwind-merge for conditional class names
 * with Tailwind CSS class merging
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with Tailwind CSS class merging
 *
 * @param inputs - Class values to combine
 * @returns Merged class string
 *
 * @example
 * ```tsx
 * cn('px-2 py-1', 'bg-red-500', isActive && 'bg-blue-500')
 * // Returns: 'px-2 py-1 bg-blue-500' (if isActive is true)
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
