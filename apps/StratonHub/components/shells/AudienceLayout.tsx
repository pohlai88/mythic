/**
 * AudienceLayout - Shared Layout Shell for All Audiences
 *
 * DOCTRINE: Single source of truth for audience-specific layouts.
 * - Operator (Users)
 * - Architect (Developers)
 * - Sovereign (Business)
 *
 * Design Language: Palantir-inspired operational interface.
 * - Flat, dark surfaces with minimal visual noise
 * - Monospace typography for system data
 * - Status indicators that feel "operational"
 * - Information-dense but not cluttered
 */

import Link from "next/link"
import { AudienceSelector } from "@/components/docs/AudienceSelector"

type AudienceRole = "Operator" | "Architect" | "Sovereign"

interface AudienceLayoutProps {
  children: React.ReactNode
  role: AudienceRole
}

// Role configuration with operational codes
const roleConfig: Record<AudienceRole, { code: string; label: string }> = {
  Operator: { code: "OPS", label: "Operator Console" },
  Architect: { code: "DEV", label: "Foundry Deck" },
  Sovereign: { code: "GOV", label: "Governance Suite" },
}

export function AudienceLayout({ children, role }: AudienceLayoutProps) {
  const config = roleConfig[role]

  return (
    <div className="flex min-h-dvh flex-col bg-void text-parchment antialiased selection:bg-gold/20 selection:text-signal">
      {/* MASTHEAD: Palantir-style operational header
          - Single compact row
          - Monospace system identifiers
          - Minimal borders (bottom only)
          - No blur effects (flat, solid)
      */}
      <header className="sticky top-0 z-50 w-full border-b border-charcoal bg-void">
        <div className="mx-auto flex h-11 w-full max-w-axis items-center justify-between px-6">
          {/* Left: System Identity */}
          <div className="flex items-center gap-6">
            {/* Brand Mark */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-colors duration-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
              aria-label="Return to StratonHub Root"
            >
              {/* Status Line (Apex pattern) */}
              <span
                className="h-px w-5 bg-gold/50 transition-all duration-700 group-hover:w-7 group-hover:bg-gold"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gold/90 transition-colors duration-700 group-hover:text-gold">
                StratonHub
              </span>
            </Link>

            {/* Divider */}
            <span className="h-3 w-px bg-charcoal" aria-hidden="true" />

            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted/60">
                {config.code}
              </span>
              <span className="text-[0.65rem] font-medium text-muted/80">{config.label}</span>
            </div>
          </div>

          {/* Right: System Status */}
          <div className="hidden items-center gap-5 md:flex">
            {/* Environment Indicator */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted/40">
                ENV
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-emerald-500/80">
                PROD
              </span>
            </div>

            {/* Divider */}
            <span className="h-3 w-px bg-charcoal" aria-hidden="true" />

            {/* Status Beacon */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.15em] text-muted/40">
                SYS
              </span>
              <div
                className="gold-dot relative flex h-1.5 w-1.5 items-center justify-center"
                aria-hidden="true"
                title="System Online"
              >
                <span
                  className="absolute h-full w-full animate-pulse rounded-full bg-emerald-500/30"
                  style={{ animationDuration: "2s" }}
                />
                <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_3px_rgba(16,185,129,0.5)]" />
              </div>
              <span className="font-mono text-[0.6rem] uppercase tracking-wider text-emerald-500/80">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Row: Audience Selector */}
        <nav
          className="mx-auto w-full max-w-axis border-t border-charcoal/50 px-6"
          aria-label="Audience navigation"
        >
          <AudienceSelector />
        </nav>
      </header>

      {/* VIEWPORT: Clean, focused content area */}
      <main className="mx-auto w-full max-w-axis flex-1 px-6 py-12">{children}</main>
    </div>
  )
}
