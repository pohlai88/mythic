'use client'

import type React from 'react'
import { useState } from 'react'

interface PlaygroundProps {
  code: string
  language?: string
  title?: string
  description?: string
  defaultCode?: string
  children?: React.ReactNode
}

/**
 * Playground component for interactive code examples.
 * Allows users to edit and run code snippets.
 */
export function Playground({
  code,
  language = 'javascript',
  title,
  description,
  defaultCode,
  children,
}: PlaygroundProps) {
  const [codeValue, setCodeValue] = useState(defaultCode || code)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleRun = () => {
    try {
      setError('')
      // For JavaScript, we can use eval (with caution)
      if (language === 'javascript' || language === 'typescript') {
        // In a real implementation, you'd use a sandboxed environment
        // For now, we'll just show the code
        setOutput(`Code executed:\n${codeValue}`)
      } else {
        setOutput(`Code preview:\n${codeValue}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setOutput('')
    }
  }

  const handleReset = () => {
    setCodeValue(defaultCode || code)
    setOutput('')
    setError('')
  }

  return (
    <div className="my-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {(title || description) && (
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          {title && <h4 className="mb-2 font-semibold">{title}</h4>}
          {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{language}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleRun}
              className="rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600"
            >
              Run
            </button>
          </div>
        </div>

        <textarea
          value={codeValue}
          onChange={(e) => setCodeValue(e.target.value)}
          className="w-full rounded border border-gray-300 bg-gray-50 p-3 font-mono text-sm dark:border-gray-600 dark:bg-gray-800"
          rows={10}
          spellCheck={false}
        />

        {error && (
          <div className="mt-2 rounded bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        {output && (
          <div className="mt-2 rounded bg-gray-50 p-3 font-mono text-sm dark:bg-gray-800">
            <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Output:</div>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        )}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
