/**
 * Handoff Configuration
 *
 * Configures Handoff CLI for syncing design tokens from Figma to codebase.
 * This enables automated Figma → Code design token synchronization.
 *
 * @see https://www.handoff.com/docs
 */

module.exports = {
  // Figma file configuration
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    token: process.env.FIGMA_API_TOKEN,
  },

  // Output configuration
  output: {
    // TypeScript color tokens
    colors: {
      path: "packages/design-system/src/tokens/handoff-colors.ts",
      format: "typescript",
      transform: (tokens) => {
        // Transform Figma tokens to our Handoff-compatible structure
        // This maintains the BEASTMODE Gold palette structure
        return {
          handoffColors: {
            void: {
              value: tokens.colors?.void || "#0a0a0b",
              description: "Absence / Authority - Deepest black",
            },
            obsidian: {
              value: tokens.colors?.obsidian || "#141416",
              description: "Surface / Weight - Dark surface",
            },
            parchment: {
              value: tokens.colors?.parchment || "#f8f5f0",
              description: "Knowledge - NOT pure white, warm off-white",
            },
            ash: {
              value: tokens.colors?.ash || "#d4cfc4",
              description: "Commentary - Neutral gray",
            },
            gold: {
              value: tokens.colors?.gold || "#c9a961",
              description: "Ratified Authority - Primary accent",
            },
            ember: {
              value: tokens.colors?.ember || "#9d7a4a",
              description: "Consequence - Secondary accent",
            },
            charcoal: {
              value: tokens.colors?.charcoal || "#2a2a2c",
              description: "Border / Divider - Subtle border color",
            },
          },
        }
      },
    },
  },

  // Validation
  validate: {
    requiredTokens: ["void", "obsidian", "parchment", "ash", "gold", "ember", "charcoal"],
    validateFormat: true,
  },
}
