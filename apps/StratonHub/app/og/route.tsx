import { ImageResponse } from "next/og"

export const runtime = "edge"

// OG Image dimensions (standard Open Graph size)
// Note: size and contentType are passed directly to ImageResponse in Next.js 16
const size = { width: 1200, height: 630 } as const
const contentType = "image/png"

// Design tokens (aligned with design system)
const COLORS = {
  bg: "#050505",
  gold: "#C5A059",
  white: "#FFFFFF",
} as const

// Typography
const FONTS = {
  sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

// Layout constants
const LAYOUT = {
  axisLeft: 96,
  axisTop: 105,
  axisHeight: 420,
  textLeft: 120, // axisLeft + 24 gap
  textTop: 200,
  textWidth: 980,
  footerBottom: 60,
} as const

// Typography constants
const TYPOGRAPHY = {
  title: {
    fontSize: 92,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  subtitle: {
    fontSize: 34,
    fontWeight: 500,
    opacity: 0.82,
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    marginTop: 18,
  },
  footer: {
    fontSize: 22,
    fontWeight: 400,
    opacity: 0.75,
    letterSpacing: "0.02em",
  },
} as const

// Pre-computed style objects (performance optimization - avoids recreation on each render)
const containerStyle: React.CSSProperties = {
  width: size.width,
  height: size.height,
  background: COLORS.bg,
  position: "relative",
  display: "flex",
  color: COLORS.white,
  fontFamily: FONTS.sans,
}

const axisLineStyle: React.CSSProperties = {
  position: "absolute",
  left: LAYOUT.axisLeft,
  top: LAYOUT.axisTop,
  width: 1,
  height: LAYOUT.axisHeight,
  background: COLORS.gold,
}

const textBlockStyle: React.CSSProperties = {
  position: "absolute",
  left: LAYOUT.textLeft,
  top: LAYOUT.textTop,
  width: LAYOUT.textWidth,
  display: "flex",
  flexDirection: "column",
}

const titleStyle: React.CSSProperties = {
  ...TYPOGRAPHY.title,
}

const subtitleStyle: React.CSSProperties = {
  ...TYPOGRAPHY.subtitle,
}

const footerStyle: React.CSSProperties = {
  position: "absolute",
  left: LAYOUT.textLeft,
  bottom: LAYOUT.footerBottom,
  ...TYPOGRAPHY.footer,
  fontFamily: FONTS.mono,
}

const imageOptions = {
  width: size.width,
  height: size.height,
} as const

/**
 * OG Image — NexusCanon (Sealed)
 * - Void background (no gradients)
 * - Single 1px brass axis line
 * - NexusCanon (dominant)
 * - The Canonical Architecture (secondary)
 * - Prevision. Precision. Decision. (footer)
 *
 * Next.js 16 Route Handler: Uses named GET export for type safety
 */
export async function GET() {
  return new ImageResponse(
    <div style={containerStyle}>
      {/* Axis Line */}
      <div style={axisLineStyle} />

      {/* Text Block */}
      <div style={textBlockStyle}>
        <div style={titleStyle}>NexusCanon</div>
        <div style={subtitleStyle}>The Canonical Architecture</div>
      </div>

      {/* Footer Doctrine */}
      <div style={footerStyle}>Prevision. Precision. Decision.</div>
    </div>,
    imageOptions
  )
}
