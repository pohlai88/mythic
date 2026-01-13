/**
 * DocHeader - Document Metadata Preamble
 *
 * DOCTRINE: Subordinate metadata display. Must NEVER compete with H1.
 * Matches Apex Prototype status line pattern:
 * - Ultra-small, ultra-muted
 * - Gold accent with reduced opacity
 * - Thin status line prefix
 *
 * EDITORIAL RULE #1: Metadata Must Be Subordinate or Silent
 */

import { cn } from "@mythic/nextjs-shared-utils"

type DocStatus = "draft" | "ratified" | "deprecated"

interface DocHeaderProps {
  id: string
  status: DocStatus
  version?: string
  lastUpdated?: string
}

const statusLabels: Record<DocStatus, string> = {
  draft: "DRAFT",
  ratified: "RATIFIED",
  deprecated: "DEPRECATED",
}

export function DocHeader({ id, status, version, lastUpdated }: DocHeaderProps) {
  return (
    <div className="mb-12 flex items-center gap-3 opacity-90">
      {/* Status line prefix - Apex Prototype pattern */}
      <span className="inline-block h-px w-5 bg-gold/50" aria-hidden="true" />

      {/* Collapsed metadata: ID · STATUS · VERSION */}
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-gold">
        {id}
        <span className="mx-2 text-gold/40">·</span>
        <span
          className={cn(
            status === "draft" && "text-ash",
            status === "ratified" && "text-gold",
            status === "deprecated" && "text-ember/70"
          )}
        >
          {statusLabels[status]}
        </span>
        {version && (
          <>
            <span className="mx-2 text-gold/40">·</span>
            <span className="text-ash">v{version}</span>
          </>
        )}
        {lastUpdated && (
          <>
            <span className="mx-2 text-gold/40">·</span>
            <span className="text-ash">Updated: {lastUpdated}</span>
          </>
        )}
      </span>
    </div>
  )
}
