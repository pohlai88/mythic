/**
 * Registry Configuration
 *
 * Centralized configuration with environment variable support
 * Follows Next.js best practices for config management
 */

import { z as z4 } from "zod/v4"
import { existsSync } from "node:fs"
import { join, resolve } from "node:path"

// ============================================================================
// Configuration Schema
// ============================================================================

const registryConfigSchema = z4
  .object({
    registryPath: z4.string().min(1).describe("Registry file path"),
    port: z4.number().int().positive().default(4000).describe("Admin app port"),
    monorepoRoot: z4.string().min(1).describe("Monorepo root directory"),
    sourcePaths: z4.array(z4.string().min(1)).describe("Source file patterns"),
    scriptPaths: z4.array(z4.string().min(1)).describe("Script file patterns"),
    excludePatterns: z4.array(z4.string().min(1)).describe("Exclude patterns"),
  })
  .describe("Registry configuration schema")

export type RegistryConfig = z4.infer<typeof registryConfigSchema>

const envSchema = z4
  .object({
    REGISTRY_ADMIN_PORT: z4.string().transform(Number).optional().describe("Admin port from env"),
    REGISTRY_PATH: z4.string().optional().describe("Registry path from env"),
    REGISTRY_MONOREPO_ROOT: z4.string().optional().describe("Monorepo root from env"),
  })
  .describe("Environment variables schema")

type Env = z4.infer<typeof envSchema>

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Get monorepo root directory
 * Handles both monorepo and standalone execution contexts
 */
function getMonorepoRoot(): string {
  const cwd = process.cwd()

  // Check if we're at monorepo root (has scripts directory)
  const scriptsDir = join(cwd, "scripts")
  if (existsSync(scriptsDir)) {
    return cwd
  }

  // Check if we're in the registry-admin directory
  if (cwd.endsWith("apps/registry-admin") || cwd.endsWith("apps\\registry-admin")) {
    return resolve(cwd, "..", "..")
  }

  // Check if we're in apps directory
  if (cwd.endsWith("apps") || cwd.endsWith("apps\\")) {
    return resolve(cwd, "..")
  }

  // Try to find monorepo root by looking for scripts directory
  let current = cwd
  for (let i = 0; i < 5; i++) {
    const scriptsPath = join(current, "scripts")
    if (existsSync(scriptsPath)) {
      return current
    }
    const parent = resolve(current, "..")
    if (parent === current) break // Reached filesystem root
    current = parent
  }

  // Fallback: assume we're at monorepo root
  return cwd
}

/**
 * Get registry file path
 * Uses environment variable or defaults to scripts/function-registry.json
 */
function getRegistryPath(monorepoRoot: string): string {
  const envPath = process.env.REGISTRY_PATH
  if (envPath) {
    return resolve(envPath)
  }

  return join(monorepoRoot, "scripts", "function-registry.json")
}

// ============================================================================
// Configuration Factory
// ============================================================================

/**
 * Load and validate configuration
 * Combines environment variables with defaults
 */
export function loadRegistryConfig(): RegistryConfig {
  const monorepoRoot = getMonorepoRoot()
  const envResult = envSchema.safeParse(process.env)
  if (!envResult.success) {
    throw new Error(`Invalid environment variables: ${envResult.error.message}`)
  }
  const env = envResult.data

  const config: RegistryConfig = {
    registryPath: getRegistryPath(monorepoRoot),
    port: env.REGISTRY_ADMIN_PORT ?? 4000,
    monorepoRoot,
    sourcePaths: [
      "src/**/*.ts",
      "packages/**/src/**/*.ts",
      "apps/**/src/**/*.ts",
      "apps/**/lib/**/*.ts",
      "apps/**/components/**/*.ts",
    ],
    scriptPaths: [
      "scripts/**/*.ts",
      "apps/**/scripts/**/*.ts",
    ],
    excludePatterns: [
      "node_modules",
      ".next",
      "dist",
      "build",
      ".turbo",
      ".test.ts",
      ".spec.ts",
      ".d.ts",
    ],
  }

  return registryConfigSchema.parse(config)
}

/**
 * Get configuration singleton
 * Cached for performance
 */
let cachedConfig: RegistryConfig | null = null

export function getRegistryConfig(): RegistryConfig {
  if (!cachedConfig) {
    cachedConfig = loadRegistryConfig()
  }
  return cachedConfig
}
