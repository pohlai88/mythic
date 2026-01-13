#!/usr/bin/env tsx
/**
 * Drizzle MCP Server
 *
 * Model Context Protocol server for Drizzle ORM operations.
 * Enables AI assistants (Cursor, Claude Desktop) to interact with Drizzle Kit CLI.
 *
 * Usage: Configure in .cursor/mcp.json or Cursor Settings
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
  type ListToolsResult,
} from "@modelcontextprotocol/sdk/types.js"
import { execSync } from "child_process"
import { existsSync, readFileSync, readdirSync } from "fs"
import { resolve } from "path"
import { z } from "zod"

const PROJECT_ROOT = resolve(__dirname, "..")

// Default config paths
const ROOT_CONFIG = resolve(PROJECT_ROOT, ".config/drizzle.config.ts")
const BOARDROOM_CONFIG = resolve(PROJECT_ROOT, "apps/boardroom/drizzle.config.ts")

/**
 * Execute drizzle-kit command safely
 */
function execDrizzleKit(
  command: string,
  configPath?: string,
  additionalArgs: string[] = []
): { success: boolean; output: string; error?: string } {
  try {
    const configFlag = configPath ? `--config ${configPath}` : ""
    const args = additionalArgs.join(" ")
    const fullCommand = `drizzle-kit ${command} ${configFlag} ${args}`.trim()

    const output = execSync(fullCommand, {
      cwd: PROJECT_ROOT,
      encoding: "utf-8",
      stdio: "pipe",
      timeout: 60000, // 60 second timeout
    })

    return {
      success: true,
      output: output || `Command executed successfully: ${command}`,
    }
  } catch (error: any) {
    return {
      success: false,
      output: "",
      error: error.message || String(error),
    }
  }
}

/**
 * Find available drizzle config files
 */
function findConfigFiles(): string[] {
  const configs: string[] = []

  if (existsSync(ROOT_CONFIG)) {
    configs.push(ROOT_CONFIG)
  }
  if (existsSync(BOARDROOM_CONFIG)) {
    configs.push(BOARDROOM_CONFIG)
  }

  return configs
}

/**
 * Get schema information
 */
function getSchemaInfo(configPath?: string): {
  tables: string[]
  migrations: string[]
  configPath: string
} {
  const config = configPath || ROOT_CONFIG
  const schemaDir = resolve(PROJECT_ROOT, "src/db/schema")
  const migrationsDir = resolve(PROJECT_ROOT, "drizzle")

  const tables: string[] = []
  const migrations: string[] = []

  // Find schema files
  if (existsSync(schemaDir)) {
    try {
      const files = readdirSync(schemaDir, { withFileTypes: true })
      tables.push(
        ...files
          .filter((f) => f.isFile() && f.name.endsWith(".ts"))
          .map((f) => f.name)
      )
    } catch {
      // Ignore errors
    }
  }

  // Find migration files
  if (existsSync(migrationsDir)) {
    try {
      const files = readdirSync(migrationsDir, { withFileTypes: true })
      migrations.push(
        ...files
          .filter((f) => f.isFile() && f.name.endsWith(".sql"))
          .map((f) => f.name)
      )
    } catch {
      // Ignore errors
    }
  }

  return {
    tables,
    migrations,
    configPath: config,
  }
}

// Create MCP server
const server = new Server(
  {
    name: "drizzle-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async (): Promise<ListToolsResult> => {
  return {
    tools: [
      {
        name: "drizzle_generate",
        description: "Generate migration files from schema changes",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional, defaults to .config/drizzle.config.ts)",
            },
            dryRun: {
              type: "boolean",
              description: "Preview changes without generating files",
            },
          },
        },
      },
      {
        name: "drizzle_push",
        description: "Push schema changes directly to database (development only)",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional)",
            },
            force: {
              type: "boolean",
              description: "Force push even if there are conflicts (dangerous)",
            },
          },
        },
      },
      {
        name: "drizzle_migrate",
        description: "Run pending migrations",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional)",
            },
          },
        },
      },
      {
        name: "drizzle_introspect",
        description: "Pull schema from existing database",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional)",
            },
            output: {
              type: "string",
              description: "Output directory for schema files (optional)",
            },
          },
        },
      },
      {
        name: "drizzle_check",
        description: "Check for schema drift between files and database",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional)",
            },
          },
        },
      },
      {
        name: "drizzle_schema_info",
        description: "Get information about current schema structure",
        inputSchema: {
          type: "object",
          properties: {
            config: {
              type: "string",
              description: "Path to drizzle.config.ts (optional)",
            },
            table: {
              type: "string",
              description: "Specific table name to get info for (optional)",
            },
          },
        },
      },
      {
        name: "drizzle_list_configs",
        description: "List available drizzle config files",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params

  try {
    switch (name) {
      case "drizzle_generate": {
        const schema = z.object({
          config: z.string().optional(),
          dryRun: z.boolean().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG
        const additionalArgs = validated.dryRun ? ["--dry-run"] : []

        const result = execDrizzleKit("generate", configPath, additionalArgs)

        return {
          content: [
            {
              type: "text",
              text: result.success
                ? `✅ Migration generation ${validated.dryRun ? "preview" : "completed"}:\n\n${result.output}`
                : `❌ Migration generation failed:\n\n${result.error}`,
            },
          ],
          isError: !result.success,
        }
      }

      case "drizzle_push": {
        const schema = z.object({
          config: z.string().optional(),
          force: z.boolean().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG
        const additionalArgs = validated.force ? ["--force"] : []

        const result = execDrizzleKit("push", configPath, additionalArgs)

        return {
          content: [
            {
              type: "text",
              text: result.success
                ? `✅ Schema pushed to database:\n\n${result.output}`
                : `❌ Schema push failed:\n\n${result.error}`,
            },
          ],
          isError: !result.success,
        }
      }

      case "drizzle_migrate": {
        const schema = z.object({
          config: z.string().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG

        const result = execDrizzleKit("migrate", configPath)

        return {
          content: [
            {
              type: "text",
              text: result.success
                ? `✅ Migrations executed:\n\n${result.output}`
                : `❌ Migration execution failed:\n\n${result.error}`,
            },
          ],
          isError: !result.success,
        }
      }

      case "drizzle_introspect": {
        const schema = z.object({
          config: z.string().optional(),
          output: z.string().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG
        const additionalArgs = validated.output ? [`--out ${validated.output}`] : []

        const result = execDrizzleKit("introspect", configPath, additionalArgs)

        return {
          content: [
            {
              type: "text",
              text: result.success
                ? `✅ Schema introspection completed:\n\n${result.output}`
                : `❌ Schema introspection failed:\n\n${result.error}`,
            },
          ],
          isError: !result.success,
        }
      }

      case "drizzle_check": {
        const schema = z.object({
          config: z.string().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG

        const result = execDrizzleKit("check", configPath)

        return {
          content: [
            {
              type: "text",
              text: result.success
                ? `✅ Schema check completed:\n\n${result.output}`
                : `⚠️ Schema drift detected or check failed:\n\n${result.error || result.output}`,
            },
          ],
          isError: false, // Check failures are warnings, not errors
        }
      }

      case "drizzle_schema_info": {
        const schema = z.object({
          config: z.string().optional(),
          table: z.string().optional(),
        })
        const validated = schema.parse(args || {})

        const configPath = validated.config || ROOT_CONFIG
        const info = getSchemaInfo(configPath)

        let output = `📊 Schema Information\n\n`
        output += `**Config:** ${info.configPath}\n\n`
        output += `**Schema Files:** ${info.tables.length}\n`
        if (info.tables.length > 0) {
          output += `- ${info.tables.join("\n- ")}\n\n`
        } else {
          output += `(No schema files found)\n\n`
        }

        output += `**Migration Files:** ${info.migrations.length}\n`
        if (info.migrations.length > 0) {
          const recentMigrations = info.migrations.slice(-5)
          output += `- ${recentMigrations.join("\n- ")}\n`
          if (info.migrations.length > 5) {
            output += `\n... and ${info.migrations.length - 5} more\n`
          }
        } else {
          output += `(No migration files found)\n`
        }

        if (validated.table) {
          output += `\n**Table Filter:** ${validated.table}\n`
          output += `(Table-specific info not yet implemented)`
        }

        return {
          content: [
            {
              type: "text",
              text: output,
            },
          ],
        }
      }

      case "drizzle_list_configs": {
        const configs = findConfigFiles()

        let output = `📁 Available Drizzle Config Files\n\n`
        if (configs.length > 0) {
          configs.forEach((config, index) => {
            const isDefault = config === ROOT_CONFIG
            output += `${index + 1}. ${config}${isDefault ? " (default)" : ""}\n`
          })
        } else {
          output += `No drizzle.config.ts files found.\n`
          output += `Expected locations:\n`
          output += `- ${ROOT_CONFIG}\n`
          output += `- ${BOARDROOM_CONFIG}\n`
        }

        return {
          content: [
            {
              type: "text",
              text: output,
            },
          ],
        }
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `❌ Unknown tool: ${name}`,
            },
          ],
          isError: true,
        }
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error executing tool ${name}: ${error.message || String(error)}`,
        },
      ],
      isError: true,
    }
  }
})

// Start server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("Drizzle MCP server running on stdio")
}

main().catch((error) => {
  console.error("Failed to start Drizzle MCP server:", error)
  process.exit(1)
})
