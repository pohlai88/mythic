/**
 * DefinitionPeek - Inline Definition Popover
 *
 * CONCIERGE FEATURE: Hover to see definitions without context switching.
 * - Respects reading flow (no page jumps)
 * - Vanishes instantly if ignored
 * - Optional "Learn more" link
 */
"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@mythic/nextjs-shared-utils"

interface DefinitionPeekProps {
  term: string
  definition: string
  related?: string
  children: React.ReactNode
}

export function DefinitionPeek({ term, definition, related, children }: DefinitionPeekProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<"bottom" | "top">("bottom")
  const triggerRef = useRef<HTMLSpanElement>(null)

  // Determine if popover should appear above or below
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setPosition(spaceBelow < 150 ? "top" : "bottom")
    }
  }, [isVisible])

  return (
    <span
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span
        className="border-b border-dotted border-muted/50 cursor-help"
        tabIndex={0}
        role="button"
        aria-describedby={isVisible ? `def-${term}` : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <span
          id={`def-${term}`}
          role="tooltip"
          className={cn(
            "absolute left-0 z-50 w-64 p-3 bg-surface border border-divider text-sm shadow-none",
            "animate-in fade-in duration-700",
            position === "bottom" && "top-full mt-2",
            position === "top" && "bottom-full mb-2"
          )}
        >
          <span className="block font-mono text-micro text-gold mb-1 uppercase tracking-widest">
            {term}
          </span>
          <span className="block text-muted leading-relaxed">{definition}</span>
          {related && (
            <a
              href={related}
              className="block mt-2 text-micro text-gold hover:text-parchment transition-colors duration-700"
            >
              Learn more →
            </a>
          )}
        </span>
      )}
    </span>
  )
}
