/**
 * Tailwind CSS v4 Configuration for BoardRoom App
 *
 * ⚠️ NOTE: Tailwind CSS v4 uses CSS-first configuration via @theme directive.
 * All design tokens (colors, fonts, etc.) are defined in styles/globals.css using @theme.
 * This config file is kept minimal for compatibility - only content paths are needed.
 *
 * @see https://tailwindcss.com/docs/v4-beta
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // All theme configuration is in styles/globals.css using @theme directive
  // This is the Tailwind v4 CSS-first approach
}

export default config
