# Drizzle CLI & MCP Integration Guide

**Version**: 1.0.0
**Last Updated**: 2026-01-12
**Status**: ✅ **Active**

---

## Overview

This guide covers Drizzle ORM CLI commands and Model Context Protocol (MCP) integration for database schema management. Drizzle Kit provides powerful CLI tools for migrations, schema generation, and database introspection.

---

## Drizzle CLI Commands

### Available Commands

Drizzle Kit (`drizzle-kit`) provides the following commands:

| Command      | Purpose                                    | Usage                                    |
| ------------ | ------------------------------------------ | ---------------------------------------- |
| `generate`   | Generate migration files from schema        | `drizzle-kit generate`                    |
| `push`       | Push schema changes directly to database   | `drizzle-kit push`                       |
| `migrate`    | Run pending migrations                     | `drizzle-kit migrate`                    |
| `studio`     | Open Drizzle Studio (database GUI)         | `drizzle-kit studio`                    |
| `introspect` | Pull schema from existing database          | `drizzle-kit introspect`                 |
| `check`      | Check for schema drift                     | `drizzle-kit check`                      |
| `drop`       | Drop database objects                      | `drizzle-kit drop`                       |
| `export`     | Export schema to SQL                       | `drizzle-kit export`                     |

---

## Project-Specific Commands

### Root Level (Monorepo)

All root-level commands use the shared config at `.config/drizzle.config.ts`:

```bash
# Generate migrations
pnpm db:generate

# Push schema changes (development)
pnpm db:push

# Run migrations (production)
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio

# Generate schema + living schema docs
pnpm schema:generate
```

### Boardroom App

App-specific commands use `apps/boardroom/drizzle.config.ts`:

```bash
cd apps/boardroom

# Generate migrations
pnpm db:generate

# Push schema changes
pnpm db:push

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

---

## Configuration Files

### Root Config (`.config/drizzle.config.ts`)

```typescript
import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"
import { resolve } from "path"

// Load environment variables from root .env
const rootEnvPath = resolve(process.cwd(), ".env")
config({ path: rootEnvPath })

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Uses DATABASE_URL or individual env vars
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
```

### App-Specific Config (`apps/boardroom/drizzle.config.ts`)

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema/*.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Uses validated env vars from Zod schema
  },
  verbose: true,
  strict: true,
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
  breakpoints: true,
  schemaFilter: ["public"],
})
```

---

## Common Workflows

### Development Workflow

```bash
# 1. Make schema changes in src/db/schema/*.ts

# 2. Generate migration files
pnpm db:generate

# 3. Review generated migration files in drizzle/ directory

# 4. Push changes to development database
pnpm db:push

# Or run migrations (for production-like workflow)
pnpm db:migrate
```

### Production Workflow

```bash
# 1. Generate migrations from schema changes
pnpm db:generate

# 2. Review and test migrations locally
pnpm db:migrate

# 3. Commit migration files to git

# 4. Deploy and run migrations in production
# (via CI/CD or manually)
pnpm db:migrate
```

### Schema Introspection

```bash
# Pull schema from existing database
drizzle-kit introspect --config .config/drizzle.config.ts

# This generates schema files from your database
```

### Schema Validation

```bash
# Check for schema drift
drizzle-kit check --config .config/drizzle.config.ts

# Validates that schema files match database state
```

---

## MCP Integration

### Overview

The Drizzle MCP server enables AI assistants (Cursor, Claude Desktop) to:

- **Generate migrations** on-demand
- **Inspect schema** structure
- **Validate schema** changes
- **Run migrations** safely
- **Query database** schema metadata

### Installation

The Drizzle MCP server is already implemented in `scripts/drizzle-mcp-server.ts`.

**Dependencies**: Already installed
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `zod` - Input validation

### Setup

#### Step 1: Configure MCP Server in Cursor

**Option A: Via Cursor Settings UI**

1. Open Cursor Settings
2. Navigate to **MCP Servers** or **Extensions**
3. Add new MCP server:
   - **Name**: `drizzle`
   - **Command**: `tsx`
   - **Args**: `["scripts/drizzle-mcp-server.ts"]`
   - **Working Directory**: Project root
   - **Environment Variables**: Include `DATABASE_URL` or individual DB vars

**Option B: Via Configuration File**

Copy `.cursor/mcp-drizzle.example.json` to your MCP configuration:

**For Cursor** (`.cursor/mcp.json` or Cursor Settings):

```json
{
  "mcpServers": {
    "drizzle": {
      "command": "tsx",
      "args": ["scripts/drizzle-mcp-server.ts"],
      "cwd": "${workspaceFolder}",
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "drizzle": {
      "command": "tsx",
      "args": ["scripts/drizzle-mcp-server.ts"],
      "cwd": "${workspaceFolder}",
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

#### Step 2: Verify MCP Integration

**In Cursor Chat**, test with:

```
List available Drizzle config files
```

Or:

```
Get schema information for the database
```

### Available MCP Tools

The server provides the following tools:

```typescript
// Example MCP tool definitions
{
  "drizzle_generate": {
    "description": "Generate migration files from schema changes",
    "inputSchema": {
      "type": "object",
      "properties": {
        "config": { "type": "string", "description": "Path to drizzle.config.ts" },
        "dryRun": { "type": "boolean", "description": "Preview changes without generating" }
      }
    }
  },
  "drizzle_push": {
    "description": "Push schema changes directly to database",
    "inputSchema": {
      "type": "object",
      "properties": {
        "config": { "type": "string" },
        "force": { "type": "boolean", "description": "Force push (dangerous)" }
      }
    }
  },
  "drizzle_introspect": {
    "description": "Pull schema from existing database",
    "inputSchema": {
      "type": "object",
      "properties": {
        "config": { "type": "string" },
        "output": { "type": "string", "description": "Output directory for schema files" }
      }
    }
  },
  "drizzle_check": {
    "description": "Check for schema drift between files and database",
    "inputSchema": {
      "type": "object",
      "properties": {
        "config": { "type": "string" }
      }
    }
  },
  "drizzle_schema_info": {
    "description": "Get information about current schema structure",
    "inputSchema": {
      "type": "object",
      "properties": {
        "config": { "type": "string" },
        "table": { "type": "string", "description": "Specific table name (optional)" }
      }
    }
  }
}
```

### Implementation

The Drizzle MCP server is implemented in `scripts/drizzle-mcp-server.ts` following the standard MCP patterns:

- Uses `@modelcontextprotocol/sdk` for protocol implementation
- Stdio transport for local communication
- Zod validation for all tool inputs
- Error handling with proper error messages
- Timeout protection (60 seconds)

**Key Features**:
- ✅ Safe command execution with error handling
- ✅ Config file auto-detection
- ✅ Schema introspection
- ✅ Migration management
- ✅ Schema drift detection

### Usage Examples

**In Cursor Chat**, you can now ask:

```
Generate migrations from schema changes
```

```
Check for schema drift
```

```
Get information about the current schema
```

```
Push schema changes to the database
```

```
List available Drizzle config files
```

The MCP server will execute the appropriate drizzle-kit commands and return the results.

---

## Environment Variables

### Required Variables

All database credentials must be in the root `.env` file:

```bash
# Option 1: Connection string (recommended for Neon, etc.)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Option 2: Individual variables
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=mythic
DB_SSL=false
```

### Security

- ✅ All env vars in root `.env` only
- ✅ Never commit `.env` to git
- ✅ Use `.env.example` for documentation
- ❌ No env vars in app-specific `.env` files

See: `.cursor/rules/060_security-secrets.mdc`

---

## Troubleshooting

### Issue: "Cannot find drizzle.config.ts"

**Solution**: Ensure you're running from the correct directory or specify config path:

```bash
drizzle-kit generate --config .config/drizzle.config.ts
```

### Issue: "Connection refused" or "Authentication failed"

**Solution**: Verify environment variables:

```bash
# Check if DATABASE_URL is set
echo $DATABASE_URL

# Or check individual vars
echo $DB_HOST
echo $DB_USER
```

### Issue: "Schema drift detected"

**Solution**: Use `drizzle-kit check` to identify differences:

```bash
pnpm db:check  # If available
# Or
drizzle-kit check --config .config/drizzle.config.ts
```

Then either:
- Update schema files to match database
- Or run migrations to update database

### Issue: Migration conflicts

**Solution**: Review migration files and resolve conflicts:

```bash
# 1. Check migration files
ls -la drizzle/

# 2. Review conflicting migrations
cat drizzle/XXXX_migration_name.sql

# 3. Manually resolve or regenerate
```

---

## Best Practices

### 1. Always Review Generated Migrations

```bash
# Generate migrations
pnpm db:generate

# Review files in drizzle/ directory before committing
git diff drizzle/
```

### 2. Use `push` for Development, `migrate` for Production

- **Development**: `pnpm db:push` (fast, direct)
- **Production**: `pnpm db:migrate` (versioned, reversible)

### 3. Keep Schema Files Organized

```
src/db/schema/
├── index.ts          # Export all schemas
├── users.ts          # User-related tables
├── posts.ts          # Post-related tables
└── ...
```

### 4. Use Type-Safe Schema Definitions

```typescript
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
})
```

### 5. Validate Environment Variables

Use Zod schemas to validate database config:

```typescript
import { z } from "zod"

const dbSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().optional(),
  // ...
})
```

---

## Related Documentation

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit Docs](https://orm.drizzle.team/kit-docs/overview)
- [MCP Best Practices](./GITHUB_MCP_BEST_PRACTICES_REPORT.md)
- [Figma MCP Integration](./FIGMA_MCP_INTEGRATION.md)
- [ESLint MCP Integration](./ESLINT_INTEGRATION_BEST_PRACTICES.md)

---

## Quick Reference

```bash
# Generate migrations
pnpm db:generate

# Push to database (dev)
pnpm db:push

# Run migrations (prod)
pnpm db:migrate

# Open Studio
pnpm db:studio

# Check schema drift
drizzle-kit check --config .config/drizzle.config.ts

# Introspect database
drizzle-kit introspect --config .config/drizzle.config.ts
```

---

**Last Updated**: 2026-01-12
**Status**: ✅ Active - CLI commands documented, MCP integration planned
