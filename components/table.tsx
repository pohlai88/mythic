'use client'

import type React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  colSpan?: number
  rowSpan?: number
}

/**
 * Enhanced Table component for Nextra documentation.
 * Provides styled, accessible tables with dark mode support.
 */
export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table
        className={`min-w-full divide-y divide-gray-200 border border-gray-200 dark:divide-gray-700 dark:border-gray-700 ${className}`}
      >
        {children}
      </table>
    </div>
  )
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
}

function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
      {children}
    </tbody>
  )
}

function TableRow({ children, className = '' }: TableRowProps) {
  return <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}>{children}</tr>
}

function TableHeader({ children, className = '', ...props }: TableCellProps) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
}

function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </td>
  )
}

Table.Head = TableHead
Table.Body = TableBody
Table.Tr = TableRow
Table.Th = TableHeader
Table.Td = TableCell
