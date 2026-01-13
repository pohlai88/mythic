/**
 * Test Fixtures for Database Connection Testing
 *
 * Provides test data and connection strings for various scenarios.
 */

import type { ValidationResult } from "../../../scripts/validate-db-connection"

/**
 * Valid Docker connection strings
 */
export const dockerConnectionStrings = {
  valid: "postgresql://postgres:password@localhost:5432/mythic",
  withSSL: "postgresql://postgres:password@localhost:5432/mythic?sslmode=require",
  customPort: "postgresql://postgres:password@localhost:5433/mythic",
}

/**
 * Valid Neon connection strings
 */
export const neonConnectionStrings = {
  withChannelBinding:
    "postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require",
  withoutChannelBinding:
    "postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require",
  directEndpoint: "postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require",
}

/**
 * Invalid connection strings
 */
export const invalidConnectionStrings = {
  missingProtocol: "localhost:5432/mythic",
  invalidProtocol: "http://localhost:5432/mythic",
  missingHost: "postgresql://postgres:password@/mythic",
  missingDatabase: "postgresql://postgres:password@localhost:5432",
  malformed: "not-a-connection-string",
}

/**
 * Mock validation results
 */
export const mockValidationResults = {
  dockerSuccess: {
    success: true,
    method: "docker" as const,
    connectionString: dockerConnectionStrings.valid,
    connectionTime: 15,
    databaseInfo: {
      version: "PostgreSQL 15.3 on x86_64-pc-linux-gnu",
      database: "mythic",
      user: "postgres",
    },
    tables: ["proposals", "circles", "broadcasts", "board_comments"],
    schemaExists: true,
    errors: [],
    warnings: [],
  } as ValidationResult,

  neonSuccess: {
    success: true,
    method: "direct" as const,
    connectionString: neonConnectionStrings.withChannelBinding,
    connectionTime: 120,
    databaseInfo: {
      version: "PostgreSQL 15.3",
      database: "neondb",
      user: "neondb_owner",
    },
    tables: ["proposals", "circles", "broadcasts", "board_comments"],
    schemaExists: true,
    errors: [],
    warnings: [],
  } as ValidationResult,

  connectionFailed: {
    success: false,
    method: "docker" as const,
    connectionString: dockerConnectionStrings.valid,
    connectionTime: 5000,
    databaseInfo: {
      version: "Unknown",
      database: "Unknown",
      user: "Unknown",
    },
    tables: [],
    schemaExists: false,
    errors: ["Error connecting to database: fetch failed"],
    warnings: [],
  } as ValidationResult,

  noTables: {
    success: true,
    method: "docker" as const,
    connectionString: dockerConnectionStrings.valid,
    connectionTime: 10,
    databaseInfo: {
      version: "PostgreSQL 15.3",
      database: "mythic",
      user: "postgres",
    },
    tables: [],
    schemaExists: false,
    errors: [],
    warnings: ["No tables found - schema may need to be created"],
  } as ValidationResult,
}

/**
 * Expected table names
 */
export const expectedTables = [
  "proposals",
  "circles",
  "circle_members",
  "board_comments",
  "thanos_events",
  "proposal_stencils",
  "broadcasts",
  "broadcast_reads",
  "global_config",
  "user_configs",
  "case_whatif_budgets",
  "case_whatif_milestones",
  "todos",
  "analytics_events",
  "variance",
]

/**
 * Test environment configurations
 */
export const testEnvironments = {
  docker: {
    DB_HOST: "localhost",
    DB_PORT: "5432",
    DB_USER: "postgres",
    DB_PASSWORD: "postgres",
    DB_NAME: "test_db",
    DB_SSL: "false",
  },
  neon: {
    DATABASE_URL:
      "postgresql://user:pass@ep-test-pooler.region.aws.neon.tech/test?sslmode=require&channel_binding=require",
  },
  missing: {},
}
