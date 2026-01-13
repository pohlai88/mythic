/**
 * Audience Selector Component
 *
 * Palantir-style horizontal tab navigation.
 * Compact, monospace-accented, minimal visual noise.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { cn } from "@mythic/nextjs-shared-utils"

interface Audience {
  id: "developers" | "users" | "business"
  code: string
  label: string
  path: string
}

const audiences: readonly Audience[] = [
  { id: "developers", code: "DEV", label: "Developers", path: "/developers" },
  { id: "users", code: "OPS", label: "Operators", path: "/users" },
  { id: "business", code: "GOV", label: "Governance", path: "/business" },
] as const

export function AudienceSelector() {
  const pathname = usePathname()

  const activeAudienceId = useMemo(() => {
    if (!pathname) return null
    return audiences.find((audience) => pathname.startsWith(audience.path))?.id ?? null
  }, [pathname])

  return (
    <div className="flex h-9 items-center gap-1" role="tablist" aria-label="Audience selection">
      {audiences.map((audience) => {
        const isActive = activeAudienceId === audience.id

        return (
          <Link
            key={audience.id}
            href={audience.path}
            role="tab"
            aria-selected={isActive}
            aria-label={`Switch to ${audience.label} documentation`}
            className={cn(
              "group relative flex h-full items-center gap-2 px-3 transition-colors duration-500",
              isActive ? "text-parchment" : "text-muted/60 hover:text-muted"
            )}
          >
            {/* Code badge */}
            <span
              className={cn(
                "font-mono text-[0.55rem] uppercase tracking-[0.12em] transition-colors duration-500",
                isActive ? "text-gold" : "text-muted/40 group-hover:text-muted/60"
              )}
            >
              {audience.code}
            </span>

            {/* Label */}
            <span className="text-[0.7rem] font-medium tracking-wide">{audience.label}</span>

            {/* Active indicator: bottom border */}
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-px bg-gold" aria-hidden="true" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
