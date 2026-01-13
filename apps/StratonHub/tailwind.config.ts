/**
 * Tailwind CSS v4 Configuration for StratonHub
 *
 * ⚠️ NOTE: Tailwind CSS v4 uses CSS-first configuration via @theme directive.
 * All design tokens are defined in app/globals.css using @theme.
 * This config file controls content scanning paths only.
 *
 * @see https://tailwindcss.com/docs/v4-beta
 */

import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Exclude scripts directory to prevent scanning documentation patterns
    "!./scripts/**/*",
    "!./**/*.test.{js,ts,jsx,tsx}",
    "!./**/*.spec.{js,ts,jsx,tsx}",
  ],
  // All theme configuration is in app/globals.css using @theme directive
  // This is the Tailwind v4 CSS-first approach
}

export default config
