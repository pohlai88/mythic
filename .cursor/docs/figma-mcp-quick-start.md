# Figma MCP Quick Start

**Quick reference for syncing design tokens via Figma MCP**

---

## Setup (One-Time)

### 1. Configure MCP Server

**Cursor Settings** → MCP Servers → Add:

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

**Environment Variable**:
```bash
# .env.local
FIGMA_API_TOKEN=your_figma_token_here
```

### 2. Restart Cursor

Restart Cursor to load MCP server configuration.

---

## Usage

### Step 1: Get Variables from Figma

**In Cursor Chat**, ask:

```
Get the variable names and values for Figma file <your-file-key>
```

Or be specific:

```
Get the color variables used in Figma file <file-key>, specifically the BEASTMODE Gold palette colors: void, obsidian, parchment, ash, gold, ember, charcoal
```

### Step 2: Save MCP Response

The MCP server will return variable data. Copy the JSON response and save to a file (e.g., `figma-variables.json`).

**Example Response Structure**:
```json
{
  "variables": [
    {
      "name": "gold",
      "type": "COLOR",
      "value": { "r": 0.788, "g": 0.663, "b": 0.380 },
      "description": "Ratified Authority - Primary accent"
    }
  ]
}
```

### Step 3: Sync Tokens

```bash
pnpm tokens:sync-mcp --json=figma-variables.json
```

### Step 4: Complete Workflow

```bash
pnpm tokens:full-sync-mcp
```

Or step-by-step:
```bash
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:validate
pnpm tokens:update-css
pnpm tokens:rebuild
```

---

## Quick Commands

```bash
# Full MCP sync workflow
pnpm tokens:full-sync-mcp

# Just sync (after getting variables)
pnpm tokens:sync-mcp --json=<file>

# Validate tokens
pnpm tokens:validate

# Update CSS (HEX → HSL)
pnpm tokens:update-css

# Rebuild CSS
pnpm tokens:rebuild
```

---

## Troubleshooting

### MCP Tools Not Available

1. Check MCP server configuration
2. Verify `FIGMA_API_TOKEN` is set
3. Restart Cursor
4. Check Cursor MCP server status

### Variables Not Found

1. Verify Figma file key
2. Check variable names match: `void`, `obsidian`, `parchment`, `ash`, `gold`, `ember`, `charcoal`
3. Ensure variables exist in Figma file

---

## Alternative: Handoff CLI

If MCP doesn't work, use Handoff CLI:

```bash
pnpm tokens:full-sync
```

Both methods produce the same output format.

---

**See**: `docs/guides/FIGMA_MCP_INTEGRATION.md` for complete documentation
