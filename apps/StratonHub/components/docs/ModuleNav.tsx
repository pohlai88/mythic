/**
 * Module Navigation Component
 *
 * Navigation for StratonHub surfaces/domains.
 * Provides navigation links to different documentation surfaces/modules.
 *
 * Performance Optimizations:
 * - Pre-computed module data with labels
 * - Memoized active module calculation
 * - Pre-computed className variants
 * - Tailwind v4 token syntax
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { cn } from "@mythic/nextjs-shared-utils"
import type { Audience } from "@/lib/search/types"

// Module slugs (surfaces/domains)
// NOTE: Aligned with lib/content/schemas.ts SURFACE_VALUES
// Only surfaces with published routes are included here.
// See: apps/StratonHub/.360audit.implementation.md for upgrade plan
const MODULE_SLUGS = [
  "boardroom",
  // Future surfaces (pending implementation):
  // 'accounting',
  // 'finance',
  // 'crm',
  // 'manufacturing',
  // 'supply-chain',
  // 'procurement',
  // 'marketing',
  // 'investor-relations',
  // 'global-config',
  // 'individual-config',
] as const

type ModuleSlug = (typeof MODULE_SLUGS)[number]

interface ModuleData {
  slug: ModuleSlug
  label: string
}

/**
 * Convert slug to title case
 * Example: "supply-chain" → "Supply Chain"
 */
function titleCaseSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

// Pre-compute module data with labels (performance optimization)
const MODULES: readonly ModuleData[] = MODULE_SLUGS.map((slug) => ({
  slug,
  label: titleCaseSlug(slug),
}))

/**
 * Extract active module from pathname
 * Expected shape: /{audience}/{module}/...
 */
function getActiveModuleFromPath(pathname: string | null | undefined): string | null {
  if (!pathname) return null
  const parts = pathname.split("/").filter(Boolean)
  if (parts.length < 2) return null
  return parts[1] ?? null
}

interface ModuleNavProps {
  audience?: Audience
  currentModule?: string
  title?: string
}

// Pre-computed className variants
const baseClasses = [
  "block px-3 py-2 text-sm transition-colors",
  "border border-transparent bg-transparent",
  "rounded-none", // Apex: sharp
]

const activeClasses = ["text-(--color-text)", "border-(--color-accent)", "bg-(--color-surface)"]

const inactiveClasses = [
  "text-(--color-muted)",
  "hover:text-(--color-text)",
  "hover:bg-(--color-surface)",
  "hover:border-(--color-divider)",
]

export function ModuleNav({
  audience = "users",
  currentModule,
  title = "Surfaces",
}: ModuleNavProps) {
  const pathname = usePathname()

  // Memoize active module calculation
  const activeModule = useMemo(() => {
    const activeFromPath = getActiveModuleFromPath(pathname)
    return currentModule ?? activeFromPath
  }, [pathname, currentModule])

  return (
    <nav aria-label={title} className="space-y-1">
      <div className="micro-status mb-3 flex items-center gap-3">
        <span aria-hidden="true" className="inline-block h-px w-6 bg-(--color-accent) opacity-50" />
        {title}
      </div>

      {MODULES.map((module) => {
        const href = `/${audience}/${module.slug}`
        const isActive = activeModule === module.slug

        return (
          <Link
            key={module.slug}
            href={href}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Navigate to ${module.label} documentation`}
            className={cn(...baseClasses, ...(isActive ? activeClasses : inactiveClasses))}
          >
            {module.label}
          </Link>
        )
      })}
    </nav>
  )
}
