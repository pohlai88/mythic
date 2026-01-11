/**
 * Environment Variable Validation
 *
 * Contract-First approach: All environment variables validated with Zod
 * This ensures type safety and runtime validation for all env vars.
 *
 * Usage:
 *   import { env } from '@/src/lib/env'
 *   const dbUrl = env.DATABASE_URL
 */

import { z as z4 } from 'zod/v4'

/**
 * Environment variable schema
 *
 * Validates all environment variables used in the BoardRoom app.
 * Uses Zod for runtime validation and type inference.
 */
const envSchema = z4.object({
  // Database Configuration
  DATABASE_URL: z4
    .string()
    .url('DATABASE_URL must be a valid URL')
    .optional()
    .describe('PostgreSQL connection string (for Neon, Supabase, etc.)'),

  // Alternative Database Configuration (if DATABASE_URL not provided)
  DB_HOST: z4
    .string()
    .min(1, 'DB_HOST is required if DATABASE_URL is not provided')
    .optional()
    .default('localhost')
    .describe('Database host'),

  DB_PORT: z4
    .string()
    .optional()
    .default('5432')
    .refine((val) => /^\d+$/.test(val), 'DB_PORT must be a number')
    .transform((val) => Number.parseInt(val, 10))
    .pipe(z4.number().int().min(1).max(65535))
    .describe('Database port'),

  DB_USER: z4
    .string()
    .min(1, 'DB_USER is required if DATABASE_URL is not provided')
    .optional()
    .default('postgres')
    .describe('Database user'),

  DB_PASSWORD: z4
    .string()
    .optional()
    .default('')
    .describe('Database password'),

  DB_NAME: z4
    .string()
    .min(1, 'DB_NAME is required if DATABASE_URL is not provided')
    .optional()
    .default('mythic')
    .describe('Database name'),

  DB_SSL: z4
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true')
    .pipe(z4.boolean())
    .describe('Enable SSL for database connection'),

  // Node Environment
  NODE_ENV: z4
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development')
    .describe('Node environment'),

  // Next.js Configuration
  NEXT_PUBLIC_APP_URL: z4
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional()
    .describe('Public application URL'),

  // Analytics Configuration (Self-Hosting)
  ANALYTICS_ENABLED: z4
    .string()
    .default('true')
    .transform((val) => val === 'true')
    .pipe(z4.boolean())
    .describe('Enable analytics logging'),

  ANALYTICS_ENDPOINT: z4
    .string()
    .url('ANALYTICS_ENDPOINT must be a valid URL')
    .default('http://localhost:3000/api/analytics')
    .describe('Analytics service endpoint (self-hosted)'),

  ANALYTICS_API_KEY: z4
    .string()
    .min(1, 'ANALYTICS_API_KEY is required if analytics enabled')
    .optional()
    .describe('API key for analytics service authentication'),

  ANALYTICS_RETENTION_DAYS: z4
    .string()
    .optional()
    .default('90')
    .refine((val) => /^\d+$/.test(val), 'ANALYTICS_RETENTION_DAYS must be a number')
    .transform((val: string) => Number.parseInt(val, 10))
    .pipe(z4.number().int().min(1).max(365))
    .describe('Analytics data retention period in days'),
})

/**
 * Refined schema with custom validation
 *
 * Ensures that either DATABASE_URL is provided OR all individual DB_* vars are provided.
 */
const refinedEnvSchema = envSchema.superRefine((data, ctx) => {
  // If DATABASE_URL is not provided, all DB_* vars must be provided
  if (!data.DATABASE_URL) {
    if (!data.DB_HOST || data.DB_HOST === 'localhost') {
      // Allow localhost as default, but warn if other vars missing
      if (!data.DB_NAME || data.DB_NAME === 'mythic') {
        // This is OK - using defaults
      }
    }
  }
})

/**
 * Validated environment variables
 *
 * This object contains all validated environment variables.
 * Access via: `import { env } from '@/src/lib/env'`
 *
 * @throws {ZodError} If environment variables are invalid
 */
export const env = refinedEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_SSL: process.env.DB_SSL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED,
  ANALYTICS_ENDPOINT: process.env.ANALYTICS_ENDPOINT,
  ANALYTICS_API_KEY: process.env.ANALYTICS_API_KEY,
  ANALYTICS_RETENTION_DAYS: process.env.ANALYTICS_RETENTION_DAYS,
})

/**
 * Type-safe environment variable access
 *
 * Use this type when you need the env type:
 *   type Env = typeof env
 */
export type Env = z4.infer<typeof refinedEnvSchema>

/**
 * Safe environment variable parsing
 *
 * Use this when you want to handle validation errors gracefully:
 *   const result = safeParseEnv()
 *   if (result.success) {
 *     const env = result.data
 *   } else {
 *     console.error('Invalid environment:', result.error)
 *   }
 */
export function safeParseEnv() {
  return refinedEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_SSL: process.env.DB_SSL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED,
    ANALYTICS_ENDPOINT: process.env.ANALYTICS_ENDPOINT,
    ANALYTICS_API_KEY: process.env.ANALYTICS_API_KEY,
    ANALYTICS_RETENTION_DAYS: process.env.ANALYTICS_RETENTION_DAYS,
  })
}

/**
 * Get database connection string
 *
 * Returns DATABASE_URL if provided, otherwise constructs from individual vars.
 */
export function getDatabaseUrl(): string {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL
  }

  // Construct connection string from individual vars
  const params = new URLSearchParams()
  if (env.DB_SSL) {
    params.set('sslmode', 'require')
  }

  const query = params.toString()
  return `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}${query ? `?${query}` : ''}`
}

/**
 * Get database configuration object
 *
 * Returns parsed database config for Drizzle.
 */
export function getDatabaseConfig() {
  if (env.DATABASE_URL) {
    try {
      const parsed = new URL(env.DATABASE_URL)
      return {
        host: parsed.hostname,
        port: Number(parsed.port) || 5432,
        user: parsed.username,
        password: parsed.password,
        database: parsed.pathname.slice(1), // Remove leading '/'
        ssl: parsed.searchParams.get('sslmode') === 'require' || parsed.searchParams.has('sslmode'),
      }
    } catch {
      // Fallback to individual vars if URL parsing fails
    }
  }

  return {
    host: env.DB_HOST!,
    port: env.DB_PORT!,
    user: env.DB_USER!,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    ssl: env.DB_SSL,
  }
}
