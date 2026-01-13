/**
 * Path Resolver
 *
 * Dynamic path resolution following Next.js best practices
 * No hardcoded paths - all resolved dynamically
 */

import { existsSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import { getRegistryConfig } from "../config/registry.config"

/**
 * Get registry file path
 * Uses config system (env + defaults)
 */
export function getRegistryFilePath(): string {
  const config = getRegistryConfig()
  return config.registryPath
}

/**
 * Verify registry file exists
 */
export function registryFileExists(): boolean {
  const path = getRegistryFilePath()
  return existsSync(path)
}

/**
 * Get registry file stats
 */
export function getRegistryFileStats() {
  const path = getRegistryFilePath()
  if (!existsSync(path)) {
    return null
  }

  try {
    return statSync(path)
  } catch {
    return null
  }
}

/**
 * Get monorepo root
 * Handles both monorepo and standalone execution
 */
export function getMonorepoRoot(): string {
  const config = getRegistryConfig()
  return config.monorepoRoot
}

/**
 * Resolve path relative to monorepo root
 */
export function resolveFromMonorepoRoot(...paths: string[]): string {
  const root = getMonorepoRoot()
  return resolve(root, ...paths)
}

/**
 * Check if path is within monorepo
 */
export function isWithinMonorepo(filePath: string): boolean {
  const root = getMonorepoRoot()
  const resolved = resolve(filePath)
  return resolved.startsWith(root)
}
