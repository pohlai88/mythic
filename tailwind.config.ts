/**
 * Tailwind CSS v4 Configuration
 *
 * ⚠️ NOTE: Tailwind CSS v4 uses CSS-first configuration via @theme directive.
 * This config file is kept minimal for compatibility - only content paths are needed.
 * All design tokens should be defined in CSS files using @theme directive.
 *
 * @see https://tailwindcss.com/docs/v4-beta
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // All theme configuration is done in CSS files using @theme directive
  // This is the Tailwind v4 CSS-first approach
}

export default config
