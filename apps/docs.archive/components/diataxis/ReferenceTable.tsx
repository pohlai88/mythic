/**
 * Reference Table Component
 *
 * Structured table for Reference documentation
 * Clean, technical, information-focused
 * Uses Tailwind intelligence-driven styling
 */

import {
  cn,
  intelligentStatusStyles,
  intelligentTransitionStyles,
} from '@mythic/shared-utils'
import { transitions } from '../../lib/transitions'

interface ReferenceTableProps {
  title?: string
  columns: Array<{
    header: string
    accessor: string
  }>
  data: Array<Record<string, React.ReactNode>>
  className?: string
}

export function ReferenceTable({
  title,
  columns,
  data,
  className,
}: ReferenceTableProps) {
  // Use intelligence-driven styling for reference tables
  const borderStyles = intelligentStatusStyles('LISTENING', 'border')
  const hoverTransition = intelligentTransitionStyles('hover')

  return (
    <div className={cn('@container my-6 sm:my-8', className)}>
      {title && (
        <h3 className="mb-3 sm:mb-4 font-serif text-base sm:text-lg md:text-xl font-semibold text-parchment">
          {title}
        </h3>
      )}
      <div
        className={cn(
          // ELITE: Enhanced responsive table with better scrolling and container queries
          'overflow-x-auto rounded-lg border',
          'shadow-sm hover:shadow-md',
          borderStyles,
          transitions.illuminate,
          // Container query: adapt table layout to container width
          '@md:overflow-x-visible'
        )}
        role="region"
        aria-label={title || 'Reference table'}
      >
        <table className="w-full border-collapse min-w-full md:min-w-0">
          <thead>
            <tr className="border-b border-charcoal/30 bg-obsidian/50">
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-left font-serif text-xs sm:text-sm font-semibold text-parchment"
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  // ELITE: Enhanced hover and focus states
                  'border-b border-charcoal/20',
                  hoverTransition,
                  'hover:bg-obsidian/30 hover:shadow-sm',
                  'focus-within:bg-obsidian/40 focus-within:ring-2 focus-within:ring-gold/30',
                  transitions.illuminate
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-ash font-mono"
                  >
                    {row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
