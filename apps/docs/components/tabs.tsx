'use client'

import React, { useState } from 'react'

interface TabsProps {
  items: string[]
  children: React.ReactNode
  defaultIndex?: number
  onChange?: (index: number) => void
}

export function Tabs({ items, children, defaultIndex = 0, onChange }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const childrenArray = React.Children.toArray(children)

  const handleTabChange = (index: number) => {
    setActiveIndex(index)
    onChange?.(index)
  }

  return (
    <div className="my-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-8" aria-label="Tabs">
          {items.map((item, index) => (
            <button
              type="button"
              key={item}
              onClick={() => handleTabChange(index)}
              className={`
                whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                ${
                  activeIndex === index
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
              aria-selected={activeIndex === index}
              role="tab"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4" role="tabpanel">
        {childrenArray[activeIndex]}
      </div>
    </div>
  )
}
