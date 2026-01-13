/**
 * Update CSS from Handoff Tokens
 *
 * Converts Handoff HEX color tokens to HSL format and updates theme.css
 * This script bridges Handoff (HEX) → Tailwind v4 (HSL) format conversion.
 *
 * Usage: pnpm tokens:update-css
 */

import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const HANDOFF_COLORS_FILE = "packages/TailwindCSS-V4/Design-System/src/tokens/handoff-colors.ts"
const THEME_CSS_FILE = "packages/TailwindCSS-V4/Design-System/src/tokens/theme.css"

/**
 * Convert HEX color to HSL space-separated format (Tailwind v4)
 */
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "")

  // Convert to RGB (0-1 range)
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  // Format as space-separated HSL (Tailwind v4 format)
  // Round to nearest integer for H, percentage for S and L
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Extract color tokens from handoff-colors.ts
 */
function extractHandoffColors(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(filePath, "utf-8")
    const colors: Record<string, string> = {}

    // Match patterns like: void: { value: '#0a0a0b', ... }
    const colorRegex = /(\w+):\s*\{\s*value:\s*['"]([^'"]+)['"]/g
    let match

    while ((match = colorRegex.exec(content)) !== null) {
      colors[match[1]] = match[2]
    }

    return colors
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    process.exit(1)
  }
}

/**
 * Update theme.css with HSL values from Handoff tokens
 */
function updateThemeCss(cssFilePath: string, handoffColors: Record<string, string>): void {
  try {
    let cssContent = readFileSync(cssFilePath, "utf-8")

    // Color mapping: Handoff name → CSS variable name
    const colorMap: Record<string, string> = {
      void: "--color-void",
      obsidian: "--color-obsidian",
      charcoal: "--color-charcoal",
      parchment: "--color-parchment",
      ash: "--color-ash",
      gold: "--color-gold",
      ember: "--color-ember",
    }

    // Update each color in @theme block
    for (const [handoffName, cssVar] of Object.entries(colorMap)) {
      if (handoffColors[handoffName]) {
        const hexValue = handoffColors[handoffName]
        const hslValue = hexToHsl(hexValue)

        // Replace the CSS variable value
        // Match: --color-void: 240 10% 4%;
        const regex = new RegExp(`(${cssVar}:\\s*)[^;]+`, "g")
        cssContent = cssContent.replace(regex, `$1${hslValue}`)

        console.log(`✅ Updated ${cssVar}: ${hexValue} → ${hslValue}`)
      } else {
        console.warn(`⚠️  Warning: ${handoffName} not found in Handoff tokens`)
      }
    }

    // Write updated CSS
    writeFileSync(cssFilePath, cssContent, "utf-8")
    console.log(`\n✅ Updated ${cssFilePath}`)
  } catch (error) {
    console.error(`Error updating ${cssFilePath}:`, error)
    process.exit(1)
  }
}

/**
 * Main function
 */
function main() {
  console.log("🔄 Updating CSS from Handoff tokens...\n")

  // Extract colors from Handoff file
  const handoffColors = extractHandoffColors(HANDOFF_COLORS_FILE)
  console.log(`📦 Found ${Object.keys(handoffColors).length} colors in Handoff tokens\n`)

  // Update theme.css
  updateThemeCss(THEME_CSS_FILE, handoffColors)

  console.log("\n✅ CSS update complete!")
  console.log("📝 Apps will automatically pick up changes from theme.css (no build step needed)")
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { hexToHsl, extractHandoffColors, updateThemeCss }
