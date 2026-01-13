#!/usr/bin/env tsx
/**
 * Validate Figma API Token
 *
 * Tests a Figma API token by making a simple authenticated request.
 * Validates token format and authentication status.
 *
 * Usage:
 *   pnpm validate:figma-token
 *   pnpm validate:figma-token --token=figd_xxxxx
 */

/**
 * Validate Figma token format
 */
function validateTokenFormat(token: string): boolean {
  // Figma tokens start with "figd_" followed by alphanumeric characters, hyphens, and underscores
  const tokenPattern = /^figd_[A-Za-z0-9_-]+$/
  return tokenPattern.test(token)
}

/**
 * Test token by calling Figma API /v1/me endpoint
 */
async function validateTokenWithAPI(token: string): Promise<{
  valid: boolean
  user?: {
    id: string
    email: string
    handle: string
    img_url: string
  }
  error?: string
  scopes?: string[]
}> {
  try {
    const response = await fetch("https://api.figma.com/v1/me", {
      headers: {
        "X-Figma-Token": token,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `HTTP ${response.status}: ${errorText}`

      if (response.status === 403) {
        errorMessage = "Token is invalid or expired"
      } else if (response.status === 401) {
        errorMessage = "Token authentication failed"
      }

      return {
        valid: false,
        error: errorMessage,
      }
    }

    const data = await response.json()

    return {
      valid: true,
      user: {
        id: data.id || "unknown",
        email: data.email || "unknown",
        handle: data.handle || "unknown",
        img_url: data.img_url || "",
      },
      scopes: data.scopes || [],
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Main validation function
 */
async function validateFigmaToken(token?: string): Promise<void> {
  console.log("\n🔐 Validating Figma API Token\n")

  // Get token from argument or environment
  let apiToken = token

  if (!apiToken) {
    // Try to get from environment
    apiToken = process.env.FIGMA_API_TOKEN
  }

  if (!apiToken) {
    console.error("❌ No token provided")
    console.log("\nUsage:")
    console.log("  pnpm validate:figma-token --token=figd_xxxxx")
    console.log("  Or set FIGMA_API_TOKEN environment variable")
    process.exit(1)
  }

  // Mask token for display (show first 8 chars)
  const maskedToken = apiToken.substring(0, 12) + "..." + apiToken.substring(apiToken.length - 4)
  console.log(`Token: ${maskedToken}\n`)

  // Step 1: Validate format
  console.log("📋 Step 1: Validating token format...")
  if (!validateTokenFormat(apiToken)) {
    console.error("❌ Invalid token format")
    console.log("\nExpected format: figd_<alphanumeric-characters>")
    console.log("Example: figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    process.exit(1)
  }
  console.log("✅ Token format is valid\n")

  // Step 2: Test with API
  console.log("🌐 Step 2: Testing token with Figma API...")
  const result = await validateTokenWithAPI(apiToken)

  if (!result.valid) {
    console.error(`❌ Token validation failed: ${result.error}`)
    console.log("\n💡 Troubleshooting:")
    console.log("  1. Check if token is correct")
    console.log("  2. Verify token hasn't expired")
    console.log("  3. Ensure token has required scopes")
    console.log("  4. Check your Figma account status")
    process.exit(1)
  }

  // Success!
  console.log("✅ Token is valid!\n")
  console.log("📊 Token Information:")
  console.log(`   User ID: ${result.user?.id}`)
  console.log(`   Email: ${result.user?.email}`)
  console.log(`   Handle: ${result.user?.handle}`)

  if (result.scopes && result.scopes.length > 0) {
    console.log(`\n🔑 Token Scopes:`)
    result.scopes.forEach((scope) => {
      console.log(`   - ${scope}`)
    })
  } else {
    console.log("\n⚠️  No scopes information available")
  }

  // Check for required scopes
  const requiredScopes = ["file_read", "file_variables:read"]
  const optionalScopes = ["file_variables:write"]

  if (result.scopes) {
    const hasRequired = requiredScopes.every((scope) =>
      result.scopes?.some((s) => s.includes(scope))
    )
    const hasWrite = optionalScopes.some((scope) => result.scopes?.some((s) => s.includes(scope)))

    console.log("\n📋 Scope Check:")
    if (hasRequired) {
      console.log("   ✅ Has read access (file_read, file_variables:read)")
    } else {
      console.log("   ⚠️  Missing some read scopes")
    }

    if (hasWrite) {
      console.log("   ✅ Has write access (file_variables:write)")
      console.log("   💡 Can push tokens to Figma")
    } else {
      console.log("   ⚠️  Missing write access (file_variables:write)")
      console.log("   💡 Token can only read from Figma, not write")
    }
  }

  console.log("\n✅ Validation complete!")
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const tokenArg = args.find((arg) => arg.startsWith("--token="))

  const token = tokenArg ? tokenArg.split("=")[1] : undefined

  try {
    await validateFigmaToken(token)
  } catch (error) {
    console.error("\n❌ Validation error:", error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error("Validation error:", error)
  process.exit(1)
})
