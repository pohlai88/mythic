'use client'

import type React from 'react'
import { useState } from 'react'

interface FileTreeProps {
  children: React.ReactNode
}

interface FileTreeFolderProps {
  name: string
  defaultOpen?: boolean
  children: React.ReactNode
}

interface FileTreeFileProps {
  name: string
  icon?: React.ReactNode
}

function FileTreeFolder({ name, defaultOpen = false, children }: FileTreeFolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="my-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <span className="select-none">{isOpen ? '📂' : '📁'}</span>
        <span className="font-medium">{name}</span>
      </button>
      {isOpen && (
        <div className="ml-4 border-l-2 border-gray-200 pl-2 dark:border-gray-700">{children}</div>
      )}
    </div>
  )
}

function FileTreeFile({ name, icon }: FileTreeFileProps) {
  return (
    <div className="my-1 flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
      <span>{icon || '📄'}</span>
      <span className="font-mono text-xs">{name}</span>
    </div>
  )
}

/**
 * FileTree component for displaying hierarchical file structures.
 */
export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="font-mono">{children}</div>
    </div>
  )
}

FileTree.Folder = FileTreeFolder
FileTree.File = FileTreeFile
