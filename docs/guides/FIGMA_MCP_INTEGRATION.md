# Figma MCP Integration Guide

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Status**: ✅ **Active**

---

## Overview

This guide covers integrating Figma's Model Context Protocol (MCP) server for
syncing design tokens directly from Figma to your codebase. This provides an
alternative to Handoff CLI, using Figma's native MCP integration.

---

## What is Figma MCP?

Figma MCP is a Model Context Protocol server that provides AI agents with direct
access to Figma design data, including:

- **Design Variables**: Colors, spacing, typography tokens
- **Components**: Component definitions and properties
- **Layout Data**: Frame structure and positioning
- **Code Connect**: Mapping between Figma components and code

**Official Documentation**: https://developers.figma.com/docs/figma-mcp-server

---

## Architecture

### Two Sync Methods

**Method 1: Handoff CLI** (Current)

```
Figma → Handoff CLI → handoff-colors.ts → update-css-from-handoff.ts → input.css
```

**Method 2: Figma MCP** (New)

```
Figma → MCP Server → get_variable_defs → sync-figma-tokens-mcp.ts → handoff-colors.ts → update-css-from-handoff.ts → input.css
```

Both methods produce the same output format (`handoff-colors.ts`), ensuring
compatibility.

---

## Installation

### 1. Configure Figma MCP Server

Figma MCP server can be used in two ways:

#### Option A: Remote MCP Server (Recommended)

**For Cursor/Claude Desktop**, add to your MCP configuration:

**Cursor** (`.cursor/mcp.json` or Cursor Settings):

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

**Claude Desktop**
(`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

#### Option B: Local MCP Server (Desktop App)

Requires Figma Desktop app installed. See
[Figma MCP Local Installation](https://developers.figma.com/docs/figma-mcp-server/local-server-installation).

---

## Usage

### Method 1: Via MCP Client (Cursor/Claude)

**Step 1: Get Variables from Figma**

In Cursor or Claude Desktop, ask:

```
Get the variable names and values for Figma file <file-key>
```

Or be more specific:

```
Get the color variables used in Figma file <file-key>, node <node-id>
```

**Step 2: Save MCP Response**

The MCP server will return variable data. Save this to a JSON file (e.g.,
`figma-variables.json`).

**Step 3: Sync Tokens**

```bash
pnpm tokens:sync-mcp --json=figma-variables.json
```

**Step 4: Complete Workflow**

```bash
pnpm tokens:full-sync-mcp
# Or step-by-step:
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:validate
pnpm tokens:update-css
pnpm tokens:rebuild
```

### Method 2: Direct MCP Tool Call

If you have programmatic access to MCP tools, you can call `get_variable_defs`
directly:

```typescript
// Example: Using MCP SDK (pseudo-code)
const mcpClient = new MCPClient({ server: "figma" })
const variables = await mcpClient.callTool("get_variable_defs", {
  fileKey: process.env.FIGMA_FILE_KEY,
  nodeId: "<node-id>", // Optional
})

// Save to JSON file
writeFileSync("figma-variables.json", JSON.stringify(variables, null, 2))

// Run sync
execSync("pnpm tokens:sync-mcp --json=figma-variables.json")
```

---

## Available MCP Tools

### `get_variable_defs`

**Purpose**: Get design variables (colors, spacing, typography) from Figma

**Parameters**:

- `fileKey` (required): Figma file key
- `nodeId` (optional): Specific node ID to get variables from

**Returns**: Object with variables array

**Example Response**:

```json
{
  "variables": [
    {
      "name": "gold",
      "type": "COLOR",
      "value": { "r": 0.788, "g": 0.663, "b": 0.38 },
      "description": "Ratified Authority - Primary accent"
    },
    {
      "name": "void",
      "type": "COLOR",
      "value": { "r": 0.039, "g": 0.039, "b": 0.043 },
      "description": "Absence / Authority - Deepest black"
    }
  ]
}
```

### Other Useful Tools

- `get_design_context`: Get full design context for code generation
- `get_code_connect_map`: Get mapping between Figma and code components
- `get_metadata`: Get basic layer properties (IDs, names, positions)

---

## Token Mapping

The sync script maps Figma variable names to our token structure:

| Figma Variable | Token Name  | Description         |
| -------------- | ----------- | ------------------- |
| `void`         | `void`      | Absence / Authority |
| `obsidian`     | `obsidian`  | Surface / Weight    |
| `parchment`    | `parchment` | Knowledge           |
| `ash`          | `ash`       | Commentary          |
| `gold`         | `gold`      | Ratified Authority  |
| `ember`        | `ember`     | Consequence         |
| `charcoal`     | `charcoal`  | Border / Divider    |

**Custom Mapping**: Edit `scripts/sync-figma-tokens-mcp.ts` to add/modify
mappings.

---

## Workflow Comparison

### Handoff CLI Workflow

```bash
# Requires: FIGMA_API_TOKEN, FIGMA_FILE_KEY in .env.local
pnpm tokens:full-sync
```

**Pros**:

- ✅ Fully automated
- ✅ No manual steps
- ✅ Works in CI/CD

**Cons**:

- ⚠️ Requires Handoff CLI installation
- ⚠️ Separate tool dependency

### Figma MCP Workflow

```bash
# Step 1: Get variables via MCP (in Cursor/Claude)
# Step 2: Save to JSON file
# Step 3: Sync
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:validate
pnpm tokens:update-css
pnpm tokens:rebuild
```

**Pros**:

- ✅ Native Figma integration
- ✅ Works with AI agents directly
- ✅ No additional CLI tools needed
- ✅ Can get variables from specific nodes

**Cons**:

- ⚠️ Requires MCP client setup
- ⚠️ Manual step to get variables (can be automated)

---

## Integration with Existing Workflow

Both methods produce the same output format (`handoff-colors.ts`), so they're
fully compatible:

```typescript
// Both methods produce this format:
export const handoffColors = {
  void: { value: "#0a0a0b", description: "..." },
  gold: { value: "#c9a961", description: "..." },
  // ...
}
```

**You can use either method** - they're interchangeable!

---

## Troubleshooting

### MCP Tools Not Loading

**Problem**: MCP tools not available in Cursor/Claude

**Solution**:

1. Verify MCP server configuration
2. Check `FIGMA_API_KEY` environment variable
3. Restart Cursor/Claude Desktop
4. Check MCP server logs

### Variables Not Found

**Problem**: `get_variable_defs` returns empty or wrong variables

**Solution**:

1. Verify file key is correct
2. Check node ID (if using specific node)
3. Ensure variables exist in Figma file
4. Check variable naming matches mapping

### Color Format Issues

**Problem**: Colors not converting correctly

**Solution**:

1. Ensure Figma variables are COLOR type
2. Check color format (RGB object vs HEX string)
3. Review `figmaColorToHex` function in sync script

---

## Best Practices

### 1. Use Consistent Variable Names

In Figma, use the exact variable names that match your token mapping:

- `void`, `obsidian`, `parchment`, `ash`, `gold`, `ember`, `charcoal`

### 2. Add Descriptions

Include descriptions in Figma variables - they'll be synced to code:

```
gold: "Ratified Authority - Primary accent"
```

### 3. Organize Variables

Group variables in Figma for easier management:

- Create variable collections: "BEASTMODE Gold Palette"
- Use consistent naming conventions

### 4. Version Control

Commit `handoff-colors.ts` to git after syncing:

```bash
git add packages/TailwindCSS-V4/Design-System/src/tokens/handoff-colors.ts
git commit -m "chore: sync design tokens from Figma"
```

---

## Related Documentation

- [Handoff Integration Guide](./HANDOFF_INTEGRATION.md) - Alternative sync
  method
- [Design Tokens Reference](../reference/TAILWIND_DESIGN_TOKENS.md) - Token
  usage
- [Figma MCP Server Docs](https://developers.figma.com/docs/figma-mcp-server) -
  Official documentation

---

## Support

For issues or questions:

1. Check
   [Figma MCP Server Documentation](https://developers.figma.com/docs/figma-mcp-server)
2. Review MCP server configuration
3. Verify environment variables
4. Check variable names in Figma match token mapping

---

**Last Updated**: 2026-01-11  
**Maintained By**: Architecture Team
