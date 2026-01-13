#!/usr/bin/env tsx
/**
 * Sync Design Tokens TO Figma
 *
 * Pushes design tokens from codebase to Figma file.
 * This is the reverse direction: Code → Figma
 *
 * Usage: pnpm tokens:sync-to-figma --file-key=<FIGMA_FILE_KEY>
 */

import { readFileSync, existsSync } from "fs"
import { resolve } from "path"

const PROJECT_ROOT = resolve(__dirname, "..")
const TOKEN_FILE = resolve(PROJECT_ROOT, "packages/TailwindCSS-V4/Design-System/src/tokens/handoff-colors.ts")

interface Token {
  name: string
  value: string
  description: string
}

/**
 * Extract tokens from handoff-colors.ts
 */
function extractTokens(): Token[] {
  if (!existsSync(TOKEN_FILE)) {
    console.error(`❌ Token file not found: ${TOKEN_FILE}`)
    process.exit(1)
  }

  const content = readFileSync(TOKEN_FILE, "utf-8")
  const tokens: Token[] = []

  // Match pattern: tokenName: { value: '#hex', description: '...' }
  const tokenRegex = /(\w+):\s*\{\s*value:\s*['"]([^'"]+)['"],\s*description:\s*['"]([^'"]+)['"]/g
  let match

  while ((match = tokenRegex.exec(content)) !== null) {
    tokens.push({
      name: match[1],
      value: match[2],
      description: match[3],
    })
  }

  return tokens
}

/**
 * Convert HEX to RGB (0-1 range) for Figma API
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  return { r, g, b }
}

/**
 * Create or update Figma variables via bulk API
 *
 * Figma API requires bulk operations with collections.
 * POST https://api.figma.com/v1/files/{file_key}/variables
 *
 * Note: Requires Enterprise organization membership with Editor access
 */
async function syncVariablesToFigma(
  fileKey: string,
  tokens: Token[],
  apiToken: string,
  collectionId?: string,
  modeId?: string
): Promise<void> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables`

  // Use temporary IDs for collection and mode if creating new
  const tempCollectionId = "temp_collection_1"
  const tempModeId = "temp_mode_1"

  // Build bulk operation payload
  const payload: any = {
    variableCollections: [],
    variableModes: [],
    variables: [],
    variableModeValues: [],
  }

  // Create collection if not provided
  if (!collectionId) {
    payload.variableCollections.push({
      action: "CREATE",
      id: tempCollectionId,
      name: "BEASTMODE Gold Palette",
      modes: [tempModeId],
    })

    payload.variableModes.push({
      action: "CREATE",
      id: tempModeId,
      name: "Default",
      variableCollectionId: tempCollectionId,
    })
  }

  // Create variables
  for (const token of tokens) {
    const rgb = hexToRgb(token.value)
    const tempVarId = `temp_var_${token.name}`

    payload.variables.push({
      action: "CREATE",
      id: tempVarId,
      name: token.name,
      variableCollectionId: collectionId || tempCollectionId,
      resolvedType: "COLOR",
      description: token.description,
    })

    // Set variable values
    payload.variableModeValues.push({
      action: "CREATE",
      variableId: tempVarId,
      modeId: modeId || tempModeId, // Use actual mode ID if collection exists
      value: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: 1,
      },
    })
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-Figma-Token": apiToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Figma API error: ${response.status} - ${error}`)
    }

    const result = await response.json()
    console.log(`✅ Synced ${tokens.length} variables to Figma`)

    // Log created variables
    if (result.meta?.variableCollections) {
      console.log(`📦 Created collection: BEASTMODE Gold Palette`)
    }

    return result
  } catch (error) {
    console.error(`❌ Failed to sync variables:`, error)
    throw error
  }
}

/**
 * Get existing variables and collections from Figma
 */
async function getFigmaVariables(
  fileKey: string,
  apiToken: string
): Promise<{
  collections: Map<string, { id: string; defaultModeId: string }>
  variables: Map<string, { id: string; collectionId: string }>
}> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables`

  try {
    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": apiToken,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Figma API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const collections = new Map<string, { id: string; defaultModeId: string }>()
    const variables = new Map<string, { id: string; collectionId: string }>()

    // Map collections with their default mode IDs
    if (data.meta?.variableCollections) {
      for (const [id, collection] of Object.entries(data.meta.variableCollections)) {
        const coll = collection as any
        if (coll.name && coll.defaultModeId) {
          collections.set(coll.name, {
            id,
            defaultModeId: coll.defaultModeId,
          })
        }
      }
    }

    // Map variables
    if (data.meta?.variables) {
      for (const [id, variable] of Object.entries(data.meta.variables)) {
        const varData = variable as any
        if (varData.name && varData.variableCollectionId) {
          variables.set(varData.name, {
            id,
            collectionId: varData.variableCollectionId,
          })
        }
      }
    }

    return { collections, variables }
  } catch (error) {
    console.error("❌ Failed to get Figma variables:", error)
    throw error
  }
}

/**
 * Main sync function
 */
async function syncTokensToFigma(fileKey: string, apiToken: string): Promise<void> {
  console.log("\n🎨 Syncing Design Tokens to Figma\n")
  console.log(`File Key: ${fileKey}\n`)

  // Extract tokens from codebase
  const tokens = extractTokens()
  console.log(`📦 Found ${tokens.length} tokens in codebase\n`)

  // Get existing variables and collections from Figma
  console.log("📥 Fetching existing variables from Figma...")
  let existingData
  try {
    existingData = await getFigmaVariables(fileKey, apiToken)
    console.log(`✅ Found ${existingData.variables.size} existing variables`)
    console.log(`✅ Found ${existingData.collections.size} collections\n`)
  } catch (error) {
    console.log("⚠️  Could not fetch existing variables (file may be empty)\n")
    existingData = { collections: new Map(), variables: new Map() }
  }

  // Check if collection exists, otherwise create new
  const collectionName = "BEASTMODE Gold Palette"
  const collectionData = existingData.collections.get(collectionName)
  const collectionId = collectionData?.id
  const modeId = collectionData?.defaultModeId

  if (!collectionId) {
    console.log(`📦 Collection "${collectionName}" not found, will create new collection\n`)
  } else {
    console.log(`📦 Using existing collection: "${collectionName}" (${collectionId})`)
    console.log(`   Mode ID: ${modeId}\n`)
  }

  // Sync all variables in bulk
  console.log("🚀 Syncing variables to Figma...\n")
  await syncVariablesToFigma(fileKey, tokens, apiToken, collectionId, modeId)

  console.log("\n✅ Token sync to Figma complete!")
  console.log(`📝 Synced ${tokens.length} tokens`)
  console.log("\n💡 Note: Requires Enterprise organization with Editor access")
  console.log("   If sync fails, check your Figma organization plan and file permissions")
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const fileKeyArg = args.find((arg) => arg.startsWith("--file-key="))
  const apiToken = process.env.FIGMA_API_TOKEN

  if (!fileKeyArg) {
    console.error("❌ Missing --file-key argument")
    console.log("\nUsage: pnpm tokens:sync-to-figma --file-key=<FIGMA_FILE_KEY>")
    console.log("Requires: FIGMA_API_TOKEN environment variable")
    process.exit(1)
  }

  if (!apiToken) {
    console.error("❌ Missing FIGMA_API_TOKEN environment variable")
    console.log("\nSet it in .env.local:")
    console.log("FIGMA_API_TOKEN=your_figma_token_here")
    process.exit(1)
  }

  let fileKey = fileKeyArg.split("=")[1]

  // Extract file key from URL if full URL provided
  // Handles: https://www.figma.com/design/FILE_KEY/file-name
  if (fileKey.includes("figma.com")) {
    const match = fileKey.match(/\/design\/([^\/]+)/)
    if (match) {
      fileKey = match[1]
      console.log(`📝 Extracted file key from URL: ${fileKey}\n`)
    } else {
      console.error("❌ Could not extract file key from URL")
      console.log("Expected format: https://www.figma.com/design/FILE_KEY/file-name")
      process.exit(1)
    }
  }

  try {
    await syncTokensToFigma(fileKey, apiToken)
  } catch (error) {
    console.error("\n❌ Sync failed:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Sync error:", error)
  process.exit(1)
})

export { extractTokens, hexToRgb, syncTokensToFigma }
