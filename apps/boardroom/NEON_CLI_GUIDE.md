# Neon CLI Quick Reference Guide

## Installation

```bash
npm install -g neonctl
```

## Authentication

```bash
# Authenticate with Neon (opens browser)
neonctl auth

# Check current user
neonctl me
```

## Common Commands

### Projects

```bash
# List all projects
neonctl projects list

# Get project details
neonctl projects get <project-id>

# Create a new project
neonctl projects create --name "My Project"

# Delete a project
neonctl projects delete <project-id>
```

### Connection Strings

```bash
# Get connection string (interactive - selects project/branch)
neonctl connection-string

# Get pooled connection string (recommended for serverless)
neonctl connection-string --pooled

# Get connection string for specific project
neonctl connection-string --project-id <project-id> --pooled

# Get connection string with SSL require
neonctl connection-string --pooled --ssl require

# Get connection string for specific database
neonctl connection-string --pooled --database-name neondb

# Get connection string for specific role
neonctl connection-string --pooled --role-name neondb_owner
```

### Databases

```bash
# List databases in a project
neonctl databases list --project-id <project-id>

# Create a database
neonctl databases create --project-id <project-id> --name mydb

# Delete a database
neonctl databases delete --project-id <project-id> <database-id>
```

### Branches

```bash
# List branches
neonctl branches list --project-id <project-id>

# Create a branch
neonctl branches create --project-id <project-id> --name mybranch

# Get connection string for a specific branch
neonctl connection-string main --pooled
```

### Operations

```bash
# List operations (migrations, etc.)
neonctl operations list --project-id <project-id>

# Get operation status
neonctl operations get <operation-id> --project-id <project-id>
```

## Quick Workflows

### Get Your Connection String

```bash
# Interactive mode (recommended)
neonctl connection-string --pooled

# With project ID (non-interactive)
neonctl connection-string --project-id <project-id> --pooled --ssl require
```

### Update .env File

After getting your connection string:

```bash
# Copy the output and add to .env file
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require
```

### Test Connection

```bash
# From boardroom directory
cd apps/boardroom
pnpm validate:db
```

## Output Formats

```bash
# JSON output (useful for scripts)
neonctl projects list --output json

# YAML output
neonctl projects list --output yaml

# Table output (default)
neonctl projects list --output table
```

## Context Management

```bash
# Set default context (avoids interactive prompts)
neonctl set-context --project-id <project-id>

# View current context
neonctl set-context
```

## Examples

### Get Connection String for Current Project

```bash
neonctl connection-string --pooled --ssl require
```

### List All Projects in JSON

```bash
neonctl projects list --output json
```

### Create Database

```bash
neonctl databases create \
  --project-id <project-id> \
  --name my_new_database
```

### Get Connection String with Specific Options

```bash
neonctl connection-string \
  --project-id <project-id> \
  --pooled \
  --database-name neondb \
  --role-name neondb_owner \
  --ssl require
```

## Troubleshooting

### Multiple Projects Found

If you have multiple projects, use `--project-id`:

```bash
neonctl connection-string --project-id <project-id> --pooled
```

### Authentication Issues

```bash
# Re-authenticate
neonctl auth
```

### Check Current User

```bash
neonctl me
```

## Integration with Your Project

### 1. Get Connection String

```bash
neonctl connection-string --pooled --ssl require
```

### 2. Add to .env

```env
DATABASE_URL=<connection-string-from-step-1>
```

### 3. Validate Connection

```bash
cd apps/boardroom
pnpm validate:db
```

### 4. Push Schema

```bash
cd apps/boardroom
pnpm db:push
```

## Useful Aliases

```bash
# Connection string (short alias)
neonctl cs --pooled

# Projects (short alias)
neonctl project list

# Databases (short alias)
neonctl db list --project-id <project-id>
```

## Documentation

Full documentation: https://neon.com/docs/reference/neon-cli

---

**Quick Start**: `neonctl connection-string --pooled` to get your connection string! 🚀
