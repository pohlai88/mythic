/**
 * GoldFilament - Decorative Vertical Gold Line
 *
 * A subtle vertical gold gradient used as a decorative element
 * in centered layouts (404, error, confirmation pages).
 */

import { cn } from "@mythic/nextjs-shared-utils"

interface GoldFilamentProps {
  position: "top" | "bottom"
}

export function GoldFilament({ position }: GoldFilamentProps) {
  return (
    <div
      className={cn(
        "absolute h-32 w-px",
        position === "top" && "top-0",
        position === "bottom" && "bottom-0",
        position === "top" && "bg-gradient-to-b from-transparent via-gold/40 to-transparent",
        position === "bottom" && "bg-gradient-to-t from-transparent via-gold/20 to-transparent"
      )}
      aria-hidden="true"
    />
  )
}
