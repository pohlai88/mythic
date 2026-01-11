/**
 * Optimization Utilities
 *
 * KISS: Simple optimization helpers
 * DRY: Reusable across all domains
 */

/**
 * Image Optimization Config
 */
export interface ImageConfig {
  src: string
  width?: number
  height?: number
  quality?: number
}

/**
 * Optimize image URL
 *
 * KISS: Simple image optimization wrapper
 * Note: Actual optimization is handled by next/image
 * This is just a helper for consistent usage
 */
export function optimizeImage(config: ImageConfig): string {
  // In Next.js, use next/image component
  // This is just a placeholder for URL construction if needed
  return config.src
}

/**
 * Font Optimization Config
 */
export interface FontConfig {
  family: string
  weight?: number | number[]
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
}

/**
 * Optimize font loading
 *
 * KISS: Simple font optimization helper
 * Note: Actual optimization is handled by next/font
 * This is just a configuration helper
 */
export function optimizeFont(config: FontConfig): FontConfig {
  return {
    family: config.family,
    weight: config.weight || 400,
    display: config.display || 'swap',
  }
}
