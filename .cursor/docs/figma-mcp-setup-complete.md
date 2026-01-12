# Figma MCP Setup - Complete Guide

**Date**: 2026-01-11
**Status**: ✅ **MCP Server Available**

---

## Current Status

✅ **MCP Server**: Connected and working
✅ **File Key**: `mbsMTEqv9RB7LpNamx3QUj`
✅ **File**: Empty (ready for initial token sync)
⚠️ **API Token**: Needs `file_variables:write` scope for pushing tokens

---

## Two-Way Sync Workflow

### Push Tokens TO Figma (Code → Figma)

**Use**: Direct Figma API (MCP is read-only)

```bash
# Requires API token with file_variables:write scope
pnpm tokens:sync-to-figma --file-key=mbsMTEqv9RB7LpNamx3QUj
```

**What it does**:
- Extracts tokens from `handoff-colors.ts`
- Creates collection: "BEASTMODE Gold Palette"
- Creates 7 color variables in Figma

### Pull Tokens FROM Figma (Figma → Code)

**Use**: Figma MCP (read-only, perfect for this)

```bash
# Step 1: Get variables via MCP (in Cursor chat)
# "Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj"

# Step 2: Save MCP response to JSON
# Step 3: Sync to codebase
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:full-sync-mcp
```

---

## Setup Steps

### 1. Configure MCP Server (One-Time)

**Option A: Cursor Settings UI**
1. Open Cursor Settings
2. Navigate to **MCP Servers**
3. Add new server:
   - **Name**: `figma`
   - **Command**: `npx`
   - **Args**: `["-y", "@figma/mcp-server", "--stdio"]`
   - **Environment Variables**:
     - `FIGMA_API_KEY`: `${FIGMA_API_TOKEN}`

**Option B: Configuration File**

Create `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "${FIGMA_API_TOKEN}"
      }
    }
  }
}
```

### 2. Set Environment Variables

Your `.env` already has:
```bash
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

### 3. Restart Cursor

Restart Cursor to load MCP configuration.

---

## Initial Token Push (Since File is Empty)

### Step 1: Fix API Token Scope

1. Go to Figma → Account Settings → Personal Access Tokens
2. Create/edit token
3. **Enable `file_variables:write` scope** (required)
4. Update `.env` with new token

### Step 2: Push Tokens to Figma

```bash
$env:FIGMA_API_TOKEN="your_new_token"; pnpm tokens:sync-to-figma --file-key=mbsMTEqv9RB7LpNamx3QUj
```

**Expected Output**:
```
🎨 Syncing Design Tokens to Figma
📦 Found 7 tokens in codebase
📦 Collection "BEASTMODE Gold Palette" not found, will create new collection
🚀 Syncing variables to Figma...
✅ Synced 7 variables to Figma
```

### Step 3: Verify with MCP

**In Cursor Chat**:
```
Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj
```

**Or use MCP tool directly**:
- Tool: `get_variable_defs`
- File Key: `mbsMTEqv9RB7LpNamx3QUj`

---

## Regular Workflow

### When Code Changes (Push to Figma)

```bash
# 1. Update tokens in codebase
# Edit: packages/design-system/src/tokens/handoff-colors.ts

# 2. Push to Figma
pnpm tokens:sync-to-figma --file-key=mbsMTEqv9RB7LpNamx3QUj

# 3. Verify in Figma (via MCP)
# In Cursor: "Get variables from Figma file mbsMTEqv9RB7LpNamx3QUj"
```

### When Figma Changes (Pull from Figma)

```bash
# 1. Get variables via MCP
# In Cursor: "Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj"

# 2. Save MCP response to JSON file
# Copy the response and save as figma-variables.json

# 3. Sync to codebase
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:update-css
pnpm tokens:rebuild
```

---

## Available MCP Tools

### `get_variable_defs`

**Purpose**: Get design variables from Figma

**Usage** (in Cursor chat):
```
Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj
```

**Returns**: Variable definitions with names, values, types, descriptions

### `get_design_context`

**Purpose**: Get full design context (components, layout, etc.)

**Usage**:
```
Get design context for Figma file mbsMTEqv9RB7LpNamx3QUj, node <node-id>
```

### `get_metadata`

**Purpose**: Get file structure metadata

**Usage**:
```
Get metadata for Figma file mbsMTEqv9RB7LpNamx3QUj
```

---

## Troubleshooting

### MCP Tools Not Available

1. **Check MCP configuration**: Verify `.cursor/mcp.json` exists
2. **Verify environment variable**: `FIGMA_API_TOKEN` must be set
3. **Restart Cursor**: MCP servers load on startup
4. **Check MCP status**: Look for "figma" in Cursor's MCP server list

### API Token Scope Error

**Error**: `403 - Invalid scope(s)... file_variables:write required`

**Solution**:
1. Go to Figma → Account Settings → Personal Access Tokens
2. Create new token with `file_variables:write` scope
3. Update `.env` file

### File Not Found

**Error**: `404 Not Found`

**Solution**:
1. Verify file key: `mbsMTEqv9RB7LpNamx3QUj`
2. Check file access permissions
3. Ensure file exists in your Figma account

---

## Quick Reference

### Commands

```bash
# Push tokens to Figma (Code → Figma)
pnpm tokens:sync-to-figma --file-key=mbsMTEqv9RB7LpNamx3QUj

# Pull tokens from Figma (Figma → Code)
# Step 1: Get via MCP in Cursor chat
# Step 2: Save to JSON
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:full-sync-mcp

# Validate tokens
pnpm tokens:validate

# Update CSS
pnpm tokens:update-css
pnpm tokens:rebuild
```

### MCP Chat Commands

```
# Get variables
Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj

# Get specific node variables
Get variable definitions for Figma file mbsMTEqv9RB7LpNamx3QUj, node <node-id>

# Get design context
Get design context for Figma file mbsMTEqv9RB7LpNamx3QUj
```

---

## Next Steps

1. ✅ MCP server is configured and working
2. ⚠️ **Fix API token scope** (add `file_variables:write`)
3. 🚀 **Push tokens to Figma** (initial sync)
4. ✅ **Verify with MCP** (read back variables)

---

**See Also**:
- `docs/guides/FIGMA_MCP_INTEGRATION.md` - Full MCP documentation
- `docs/guides/SYNC_TOKENS_TO_FIGMA.md` - Push tokens guide
- `.cursor/docs/figma-mcp-quick-start.md` - Quick reference
