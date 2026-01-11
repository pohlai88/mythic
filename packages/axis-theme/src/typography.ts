/**
 * Axis Visual Canon - Typography Doctrine
 *
 * Editorial Authority: Serif headings (written, not rendered)
 * Forensic Data: Monospaced for code/numeric (eliminate ambiguity)
 * Spoken White: Living neutral spectrum (NOT pure white)
 */

/**
 * Editorial Typography (Headings)
 *
 * Serif fonts for headings - must feel written, not rendered
 * High contrast strokes, generous spacing
 */
export const editorialFonts = {
  primary: 'Cormorant Garamond',
  secondary: 'Playfair Display',
} as const

/**
 * Forensic Typography (Data)
 *
 * Monospaced fonts for numeric or immutable data
 * Eliminates ambiguity, signals permanence
 */
export const forensicFonts = {
  primary: 'JetBrains Mono',
  secondary: 'Fira Code',
} as const

/**
 * Body Typography (Comfortable Reading)
 *
 * System font stack for maximum readability
 * Platform optimized, smooth rendering
 */
export const bodyFonts = {
  system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const

/**
 * Typography configuration
 */
export const axisTypography = {
  editorial: {
    fontFamily: editorialFonts.primary,
    fallback: editorialFonts.secondary,
    weights: {
      regular: 400,
      bold: 700,
    },
  },
  forensic: {
    fontFamily: forensicFonts.primary,
    fallback: forensicFonts.secondary,
    weights: {
      regular: 400,
      medium: 500,
    },
  },
  body: {
    fontFamily: bodyFonts.system,
  },
} as const

/**
 * Get font family for editorial (headings)
 */
export function getEditorialFont(): string {
  return `"${axisTypography.editorial.fontFamily}", ${axisTypography.editorial.fallback}, serif`
}

/**
 * Get font family for forensic (data)
 */
export function getForensicFont(): string {
  return `"${axisTypography.forensic.fontFamily}", ${axisTypography.forensic.fallback}, monospace`
}

/**
 * Get font family for body text
 */
export function getBodyFont(): string {
  return axisTypography.body.fontFamily
}
