'use client'

import type React from 'react'
import { useState } from 'react'

interface CodeBlockProps {
  children: React.ReactNode
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    const text = typeof children === 'string' ? children : String(children)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {filename}
              </span>
            )}
            {language && (
              <span className="text-xs px-2 py-1 rounded-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {language}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            title="Copy code"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
      <div className="relative">
        <pre
          className={`
            overflow-x-auto p-4 text-sm
            ${showLineNumbers ? 'line-numbers' : ''}
          `}
        >
          <code className={`language-${language || 'text'}`}>{children}</code>
        </pre>
      </div>
    </div>
  )
}
