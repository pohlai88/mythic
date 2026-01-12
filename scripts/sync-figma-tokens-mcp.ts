#!/usr/bin/env tsx
/**
 * Sync Design Tokens from Figma via MCP
 *
 * Uses Figma MCP server to extract design tokens (variables) from Figma
 * and sync them to handoff-colors.ts format.
 *
 * This provides an alternative to Handoff CLI, using Figma's native MCP integration.
 *
 * Usage: pnpm tokens:sync-mcp --file-key=<FIGMA_FILE_KEY> --node-id=<NODE_ID>
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { execSync } from 'child_process'

const PROJECT_ROOT = resolve(__dirname, '..')
const TOKEN_FILE = resolve(PROJECT_ROOT, 'packages/design-system/src/tokens/handoff-colors.ts')

interface FigmaVariable {
  name: string
  value: string
  type: 'COLOR' | 'FLOAT' | 'STRING'
  description?: string
}

interface TokenMapping {
  figmaName: string
  tokenName: string
  description: string
}

/**
 * Map Figma variable names to our token names
 */
const TOKEN_MAPPING: TokenMapping[] = [
  { figmaName: 'void', tokenName: 'void', description: 'Absence / Authority - Deepest black' },
  { figmaName: 'obsidian', tokenName: 'obsidian', description: 'Surface / Weight - Dark surface' },
  { figmaName: 'parchment', tokenName: 'parchment', description: 'Knowledge - NOT pure white, warm off-white' },
  { figmaName: 'ash', tokenName: 'ash', description: 'Commentary - Neutral gray' },
  { figmaName: 'gold', tokenName: 'gold', description: 'Ratified Authority - Primary accent' },
  { figmaName: 'ember', tokenName: 'ember', description: 'Consequence - Secondary accent' },
  { figmaName: 'charcoal', tokenName: 'charcoal', description: 'Border / Divider - Subtle border color' },
]

/**
 * Convert Figma color value to HEX format
 */
function figmaColorToHex(value: any): string {
  // Figma returns colors in various formats
  // Handle RGB object: { r: 0.04, g: 0.04, b: 0.04 }
  if (typeof value === 'object' && value.r !== undefined) {
    const r = Math.round(value.r * 255)
    const g = Math.round(value.g * 255)
    const b = Math.round(value.b * 255)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  
  // Handle HEX string
  if (typeof value === 'string' && value.startsWith('#')) {
    return value
  }
  
  // Handle HSL string
  if (typeof value === 'string' && value.includes('hsl')) {
    // Convert HSL to HEX (simplified - would need proper parsing)
    console.warn(`⚠️  HSL color detected: ${value}. Please provide HEX format.`)
    return '#000000' // Fallback
  }
  
  console.warn(`⚠️  Unknown color format: ${JSON.stringify(value)}`)
  return '#000000' // Fallback
}

/**
 * Extract tokens from Figma MCP response
 * 
 * Note: This is a placeholder. In practice, you would call the MCP server
 * using the MCP SDK or via a configured MCP client.
 * 
 * For now, this script provides the structure. To use it:
 * 1. Configure Figma MCP server in your MCP client (Cursor/Claude Desktop)
 * 2. Use the MCP tools to get variables
 * 3. Pass the results to this script
 */
function extractTokensFromMCP(mcpResponse: any): Record<string, string> {
  const tokens: Record<string, string> = {}
  
  // Parse MCP response (structure depends on MCP server implementation)
  if (mcpResponse.variables) {
    for (const variable of mcpResponse.variables) {
      const mapping = TOKEN_MAPPING.find(m => 
        m.figmaName.toLowerCase() === variable.name.toLowerCase()
      )
      
      if (mapping && variable.type === 'COLOR') {
        tokens[mapping.tokenName] = figmaColorToHex(variable.value)
      }
    }
  }
  
  return tokens
}

/**
 * Update handoff-colors.ts with synced tokens
 */
function updateHandoffColors(tokens: Record<string, string>): void {
  const template = `/**
 * Handoff Design Tokens - Theme Colors Only
 *
 * Handoff-compatible color tokens for Figma → Code workflow
 * Synced via Figma MCP: ${new Date().toISOString()}
 * Only theme colors are defined here. All other tokens (spacing, typography, shadows)
 * use Tailwind defaults.
 *
 * @see https://handoff.design
 */

/**
 * Theme Color Palette
 *
 * Material-based color system for AXIS Luxury Business Operating System
 * These colors represent material states, not UI states.
 */
export const handoffColors = {
  // Primary Palette
${TOKEN_MAPPING.map(mapping => {
  const value = tokens[mapping.tokenName] || '#000000'
  return `  ${mapping.tokenName}: {
    value: '${value}',
    description: '${mapping.description}',
  },`
}).join('\n')}
} as const

/**
 * Handoff-compatible token structure
 *
 * Format compatible with Handoff CLI for Figma sync
 */
export const handoffTokens = {
  colors: handoffColors,
} as const

/**
 * Type exports
 */
export type HandoffColorName = keyof typeof handoffColors
`

  writeFileSync(TOKEN_FILE, template, 'utf-8')
  console.log(`✅ Updated ${TOKEN_FILE}`)
}

/**
 * Main function
 * 
 * Note: This script expects MCP response data. In practice, you would:
 * 1. Configure Figma MCP server
 * 2. Use MCP client to call get_variable_defs
 * 3. Pass results to this script
 * 
 * For manual testing, you can provide a JSON file with MCP response structure.
 */
async function main() {
  const args = process.argv.slice(2)
  const fileKeyArg = args.find(arg => arg.startsWith('--file-key='))
  const nodeIdArg = args.find(arg => arg.startsWith('--node-id='))
  const jsonFileArg = args.find(arg => arg.startsWith('--json='))
  
  console.log('\n🎨 Figma MCP Token Sync\n')
  
  // Option 1: Use provided JSON file (for testing)
  if (jsonFileArg) {
    const jsonFile = jsonFileArg.split('=')[1]
    if (!existsSync(jsonFile)) {
      console.error(`❌ JSON file not found: ${jsonFile}`)
      process.exit(1)
    }
    
    const mcpResponse = JSON.parse(readFileSync(jsonFile, 'utf-8'))
    const tokens = extractTokensFromMCP(mcpResponse)
    updateHandoffColors(tokens)
    console.log('\n✅ Token sync complete!')
    console.log('📝 Next step: Run `pnpm tokens:update-css` to convert HEX → HSL')
    return
  }
  
  // Option 2: Instructions for MCP integration
  console.log('📋 Figma MCP Integration Instructions:\n')
  console.log('1. Configure Figma MCP server in your MCP client')
  console.log('2. Use the MCP tool: get_variable_defs')
  console.log('3. Pass the response to this script via --json=<file>\n')
  console.log('Example workflow:')
  console.log('  a. In Cursor/Claude, ask: "Get variables from Figma file <file-key>"')
  console.log('  b. Save the MCP response to a JSON file')
  console.log('  c. Run: pnpm tokens:sync-mcp --json=<file>\n')
  console.log('Or use Handoff CLI: pnpm tokens:sync\n')
}

main().catch(error => {
  console.error('Sync error:', error)
  process.exit(1)
})

export { extractTokensFromMCP, updateHandoffColors, figmaColorToHex }
