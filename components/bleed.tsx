'use client'

import type React from 'react'

interface BleedProps {
  full?: boolean
  children: React.ReactNode
}

/**
 * Bleed component allows content to extend beyond the standard container width.
 * Useful for images, iframes, and other wide content.
 */
export function Bleed({ full = false, children }: BleedProps) {
  return (
    <div
      className={`my-6 ${
        full ? '-mx-6 sm:-mx-8 md:-mx-12 lg:-mx-16 xl:-mx-24' : '-mx-4 sm:-mx-6 md:-mx-8'
      }`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
