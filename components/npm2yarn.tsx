'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Tabs } from './tabs'

interface Npm2YarnProps {
  npm?: string
  yarn?: string
  pnpm?: string
  bun?: string
  children?: React.ReactNode
}

/**
 * Npm2Yarn component for displaying package manager commands.
 * Automatically converts npm commands to yarn, pnpm, and bun equivalents.
 *
 * Note: The @theguild/remark-npm2yarn plugin automatically handles
 * code blocks with `npm2yarn` metadata. This component is for manual usage.
 */
export function Npm2Yarn({ npm, yarn, pnpm, bun, children }: Npm2YarnProps) {
  const [selectedManager, setSelectedManager] = useState<string>('npm')

  useEffect(() => {
    // Load preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('package-manager-preference')
      if (saved && ['npm', 'yarn', 'pnpm', 'bun'].includes(saved)) {
        setSelectedManager(saved)
      }
    }
  }, [])

  // If children provided, use them (for code blocks with npm2yarn metadata)
  if (children) {
    return <div className="my-4">{children}</div>
  }

  // Otherwise, use explicit props
  const commands = [
    { name: 'npm', cmd: npm },
    { name: 'yarn', cmd: yarn },
    { name: 'pnpm', cmd: pnpm },
    { name: 'bun', cmd: bun },
  ].filter((c) => c.cmd)

  if (commands.length === 0) {
    return null
  }

  const tabs = commands.map((c) => c.name)

  const handleChange = (index: number) => {
    const manager = tabs[index]
    setSelectedManager(manager)
    if (typeof window !== 'undefined') {
      localStorage.setItem('package-manager-preference', manager)
    }
  }
  const currentIndex = tabs.indexOf(selectedManager)
  const activeIndex = currentIndex >= 0 ? currentIndex : 0

  return (
    <div className="my-4">
      <Tabs items={tabs} defaultIndex={activeIndex} onChange={handleChange}>
        {commands.map((cmd) => (
          <div key={cmd.name}>
            <pre className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
              <code className="text-sm">{cmd.cmd}</code>
            </pre>
          </div>
        ))}
      </Tabs>
    </div>
  )
}
