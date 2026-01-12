/**
 * Environment Variable Utilities
 *
 * Centralized environment variable loading and validation.
 * Ensures .env file is loaded before accessing process.env
 */

import { config } from 'dotenv'

// Load .env file from project root
config()

/**
 * Get environment variable with optional default
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

/**
 * Get optional environment variable
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] ?? defaultValue
}

/**
 * Database configuration from environment
 */
export const dbConfig = {
  url: getOptionalEnv('DATABASE_URL'),
  host: getOptionalEnv('DB_HOST', 'localhost'),
  port: Number(getOptionalEnv('DB_PORT', '5432')),
  user: getOptionalEnv('DB_USER', 'postgres'),
  password: getOptionalEnv('DB_PASSWORD', ''),
  database: getOptionalEnv('DB_NAME', 'mythic'),
  ssl: getOptionalEnv('DB_SSL', 'false') === 'true',
}

/**
 * Get database connection string
 */
export function getDatabaseUrl(): string {
  if (dbConfig.url) {
    return dbConfig.url
  }
  return `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}${dbConfig.ssl ? '?sslmode=require' : ''}`
}

/**
 * Application environment
 */
export const appEnv = {
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),
  isDevelopment: getOptionalEnv('NODE_ENV', 'development') === 'development',
  isProduction: getOptionalEnv('NODE_ENV', 'development') === 'production',
  isTest: getOptionalEnv('NODE_ENV') === 'test',
}
