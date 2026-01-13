/**
 * Not Found Page (404)
 *
 * "The Silent Archive"
 *
 * DOCTRINE: Pages must not paint.
 * This page composes CenteredShell only. No layout primitives.
 */

import Link from "next/link"
import type { Metadata } from "next"
import { CenteredShell } from "@/components"

export const metadata: Metadata = {
  title: "Void · 404",
  description: "The record is silent.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <CenteredShell width="narrow" filaments>
      {/* The Coordinate ID - Monospaced, tiny, clinical */}
      <span className="micro-status mb-6">Coordinate 404</span>

      {/* The Main Art Piece - Typographic Hierarchy */}
      <h1 className="h1-apex mb-6">
        <span className="text-divergence block text-6xl sm:text-7xl">Silence.</span>
      </h1>

      {/* The Prose - Poetic, not technical */}
      <p className="mb-12 text-body font-light leading-relaxed text-muted opacity-80">
        The record you are looking for is not held within the current canon. It may have been
        redacted, moved, or dissolved into the void.
      </p>

      {/* The Wayfinding */}
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <Link href="/" className="btn-axis" aria-label="Return to safe harbor">
          Return to Axis
        </Link>

        <Link
          href="/?search=true"
          className="btn-axis opacity-60 hover:opacity-100"
          aria-label="Search the documentation"
        >
          Search Docs
        </Link>
      </div>
    </CenteredShell>
  )
}
