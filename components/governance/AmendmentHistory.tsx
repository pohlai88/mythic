/**
 * AmendmentHistory Component
 *
 * Displays amendment chain visualization for governance documents.
 * Shows the history of amendments and their relationships.
 */

import type React from 'react'
import { StatusBadge } from './StatusBadge'
import type { DocumentStatus } from './StatusBadge'

interface Amendment {
  id: string
  title: string
  date: string
  status: DocumentStatus
  summary: string
  href?: string
}

interface AmendmentHistoryProps {
  documentTitle: string
  amendments: Amendment[]
  showTimeline?: boolean
}

export function AmendmentHistory({
  documentTitle,
  amendments,
  showTimeline = true,
}: AmendmentHistoryProps): React.ReactElement {
  return (
    <div className="my-6 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
          <span className="text-lg">📜</span>
          Amendment History
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Tracking changes to: {documentTitle}
        </p>
      </div>

      {/* Amendment List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {amendments.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            No amendments recorded
          </div>
        ) : (
          amendments.map((amendment, index) => (
            <div key={amendment.id} className="relative flex gap-4 px-4 py-4">
              {/* Timeline */}
              {showTimeline && (
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {amendments.length - index}
                  </div>
                  {index < amendments.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {amendment.href ? (
                      <a
                        href={amendment.href}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {amendment.title}
                      </a>
                    ) : (
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {amendment.title}
                      </span>
                    )}
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {amendment.id} • {amendment.date}
                    </p>
                  </div>
                  <StatusBadge status={amendment.status} size="sm" />
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{amendment.summary}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {amendments.length > 0 && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
          Total Amendments: {amendments.length}
        </div>
      )}
    </div>
  )
}

export default AmendmentHistory
