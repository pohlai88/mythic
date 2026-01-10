'use client'

import type React from 'react'

interface CardProps {
  title?: string
  href?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, href, children, className = '' }: CardProps) {
  const content = (
    <div
      className={`
        rounded-lg border border-gray-200 bg-white p-6 shadow-sm
        transition-shadow hover:shadow-md
        dark:border-gray-700 dark:bg-gray-800
        ${className}
      `}
    >
      {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
      <div className="card-content">{children}</div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {content}
      </a>
    )
  }

  return content
}
