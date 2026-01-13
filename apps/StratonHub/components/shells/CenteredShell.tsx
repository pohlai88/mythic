/**
 * CenteredShell - Centered System Pages (404, Error, Confirmation)
 *
 * DOCTRINE: Pages must not paint. This shell owns:
 * - Centered flex layout
 * - Background (closed set: void, surface)
 * - Content width (closed set: narrow, prose)
 * - Optional decorative gold filaments
 *
 * NO className prop. Escape hatches are closed.
 */

import { cn } from "@mythic/nextjs-shared-utils"
import { GoldFilament } from "../blocks/GoldFilament"

type Width = "narrow" | "prose"
type Background = "void" | "surface"

interface CenteredShellProps {
  children: React.ReactNode
  width?: Width
  background?: Background
  filaments?: boolean
  // NO className prop - contracts are closed
}

const widthClasses: Record<Width, string> = {
  narrow: "max-w-narrow",
  prose: "max-w-prose",
}

const backgroundClasses: Record<Background, string> = {
  void: "surface-void",
  surface: "surface-obsidian",
}

export function CenteredShell({
  children,
  width = "narrow",
  background = "void",
  filaments = true,
}: CenteredShellProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-full flex-col items-center justify-center px-8 text-center",
        backgroundClasses[background]
      )}
    >
      {filaments && <GoldFilament position="top" />}

      <div className={cn("relative z-10 flex flex-col items-center", widthClasses[width])}>
        {children}
      </div>

      {filaments && <GoldFilament position="bottom" />}
    </div>
  )
}
