/**
 * PageShell - Canonical Page Container
 *
 * DOCTRINE: Pages must not paint. This shell owns:
 * - min-h-dvh
 * - Background (void or surface)
 * - Container width (closed set: axis, prose, wide, full)
 * - Padding insets (closed set: default, tight, loose)
 * - Vertical alignment (top or center)
 *
 * NO className prop. Escape hatches are closed.
 */

import { cn } from "@mythic/nextjs-shared-utils"

const presets = {
  hub: { width: "axis", background: "void", inset: "default", align: "top" },
  doc: { width: "wide", background: "void", inset: "default", align: "top" },
  landing: { width: "axis", background: "void", inset: "loose", align: "center" },
} as const

type Width = "axis" | "prose" | "wide" | "full"
type Background = "void" | "surface"
type Inset = "default" | "tight" | "loose"
type Align = "top" | "center"
type Preset = keyof typeof presets

interface PageShellProps {
  children: React.ReactNode
  width?: Width
  background?: Background
  inset?: Inset
  align?: Align
  preset?: Preset
  // NO className prop - contracts are closed
}

const widthClasses: Record<Width, string> = {
  axis: "max-w-axis",
  prose: "max-w-prose",
  wide: "max-w-wide",
  full: "w-full",
}

const backgroundClasses: Record<Background, string> = {
  void: "surface-void",
  surface: "surface-obsidian",
}

const insetClasses: Record<Inset, string> = {
  default: "shell-pad",
  tight: "shell-pad-tight",
  loose: "shell-pad-loose",
}

const alignClasses: Record<Align, string> = {
  top: "items-start",
  center: "items-center justify-center",
}

export function PageShell({ children, width, background, inset, align, preset }: PageShellProps) {
  // Apply preset defaults, then allow overrides
  const resolved = {
    width: width ?? ((preset ? presets[preset].width : "axis") as Width),
    background: background ?? ((preset ? presets[preset].background : "void") as Background),
    inset: inset ?? ((preset ? presets[preset].inset : "default") as Inset),
    align: align ?? ((preset ? presets[preset].align : "top") as Align),
  }

  return (
    <main
      className={cn(
        "min-h-dvh flex flex-col",
        backgroundClasses[resolved.background],
        resolved.align === "center" && alignClasses[resolved.align]
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          resolved.width !== "full" && widthClasses[resolved.width],
          insetClasses[resolved.inset]
        )}
      >
        {children}
      </div>
    </main>
  )
}
