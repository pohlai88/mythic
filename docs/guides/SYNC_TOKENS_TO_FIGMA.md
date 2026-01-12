# Sync Design Tokens TO Figma

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Status**: ✅ **Active**

---

## Overview

This guide covers syncing design tokens **FROM your codebase TO Figma**. This is the reverse direction of the Handoff/MCP sync (which goes Figma → Code).

**Use Case**: When your Figma file is empty or you want to push your codebase tokens to Figma.

---

## Architecture

### Sync Direction

**Code → Figma**:
```
handoff-colors.ts → sync-tokens-to-figma.ts → Figma API → Figma Variables
```

**Figma → Code** (existing):
```
Figma Variables → Handoff/MCP → handoff-colors.ts → input.css
```

---

## Prerequisites

1. **Figma API Token**: Get from Figma → Account Settings
2. **Figma File Key**: Extract from Figma file URL
3. **Design Tokens**: Must exist in `packages/design-system/src/tokens/handoff-colors.ts`

---

## Setup

### 1. Get Figma API Token

1. Go to Figma → Account Settings → Personal Access Tokens
2. **Create a new token** (or edit existing)
3. **Enable the `file_variables:write` scope** (required for Variables API)
4. Copy the token
5. Store in `.env.local`:

```bash
FIGMA_API_TOKEN=your_figma_token_here
```

**Important**: The token **must** have the `file_variables:write` scope enabled, otherwise you'll get a 403 error.

### 2. Get Figma File Key

From your Figma file URL:
```
https://www.figma.com/file/FILE_KEY/file-name
```

The `FILE_KEY` is the long string between `/file/` and `/file-name`.

---

## Usage

### Basic Sync

```bash
pnpm tokens:sync-to-figma --file-key=<your-figma-file-key>
```

**What it does**:
1. Extracts tokens from `handoff-colors.ts`
2. Gets existing variables from Figma
3. Creates new variables or updates existing ones
4. Syncs all 7 BEASTMODE Gold palette tokens

### Example

```bash
# Set environment variable
export FIGMA_API_TOKEN=your_token_here

# Sync tokens to Figma
pnpm tokens:sync-to-figma --file-key=abc123xyz789
```

---

## Token Mapping

The script syncs these tokens to Figma:

| Token Name | HEX Value | Description |
|------------|-----------|-------------|
| `void` | `#0a0a0b` | Absence / Authority |
| `obsidian` | `#141416` | Surface / Weight |
| `parchment` | `#f8f5f0` | Knowledge |
| `ash` | `#d4cfc4` | Commentary |
| `gold` | `#c9a961` | Ratified Authority |
| `ember` | `#9d7a4a` | Consequence |
| `charcoal` | `#2a2a2c` | Border / Divider |

---

## How It Works

### 1. Extract Tokens

Reads `handoff-colors.ts` and extracts:
- Token names
- HEX color values
- Descriptions

### 2. Get Existing Variables

Fetches existing variables from Figma to check:
- Which variables already exist
- Which need to be created

### 3. Create or Update

- **If variable exists**: Updates the color value and description
- **If variable doesn't exist**: Creates new variable

### 4. Color Conversion

Converts HEX → RGB (0-1 range) for Figma API:
```typescript
// HEX: #c9a961
// RGB: { r: 0.788, g: 0.663, b: 0.380 }
```

---

## Figma API Details

### Create Variable

**Endpoint**: `POST /v1/files/{file_key}/variables`

**Payload**:
```json
{
  "name": "gold",
  "type": "COLOR",
  "valuesByMode": {
    "Default": {
      "r": 0.788,
      "g": 0.663,
      "b": 0.380,
      "a": 1
    }
  },
  "description": "Ratified Authority - Primary accent",
  "scopes": ["ALL_SCOPES"]
}
```

### Update Variable

**Endpoint**: `PUT /v1/files/{file_key}/variables/{variable_id}`

**Payload**:
```json
{
  "valuesByMode": {
    "Default": {
      "r": 0.788,
      "g": 0.663,
      "b": 0.380,
      "a": 1
    }
  },
  "description": "Ratified Authority - Primary accent"
}
```

---

## Workflow

### Initial Setup (Empty Figma File)

```bash
# 1. Sync tokens from code to Figma
pnpm tokens:sync-to-figma --file-key=<file-key>

# 2. Verify in Figma
# Open Figma file → Variables panel → Check variables created

# 3. Future: Sync from Figma to code (if needed)
pnpm tokens:full-sync
```

### Regular Workflow

**Option A: Code → Figma** (when code changes)
```bash
pnpm tokens:sync-to-figma --file-key=<file-key>
```

**Option B: Figma → Code** (when Figma changes)
```bash
pnpm tokens:full-sync
```

---

## Troubleshooting

### API Token Invalid

**Error**: `401 Unauthorized`

**Solution**:
1. Verify `FIGMA_API_TOKEN` is set correctly
2. Check token hasn't expired
3. Regenerate token if needed

### File Key Invalid

**Error**: `404 Not Found`

**Solution**:
1. Verify file key is correct
2. Check you have access to the file
3. Ensure file exists

### Variable Creation Fails

**Error**: `Variable already exists` or similar

**Solution**:
- Script handles this automatically (updates existing)
- If issues persist, check variable names in Figma
- Ensure variable names match exactly: `void`, `obsidian`, etc.

### Permission Issues

**Error**: `403 Forbidden` - "Invalid scope(s)... This endpoint requires the file_variables:write scope"

**Solution**:
1. **Regenerate your Figma API token with the correct scope**:
   - Go to Figma → Account Settings → Personal Access Tokens
   - Create a new token or edit existing token
   - **Enable the `file_variables:write` scope** (required for Variables API)
   - Copy the new token
   - Update `FIGMA_API_TOKEN` in your `.env` file

2. **Verify Enterprise organization membership**:
   - Variables API requires a Full seat in an Enterprise organization
   - Guests cannot use the Variables API
   - Check your organization plan

3. **Check file access**:
   - Ensure you have Editor access to the Figma file
   - Verify file sharing settings allow your account

**Required Scopes for Variables API**:
- `file_variables:write` - **Required** for creating/updating variables
- `file_variables:read` - Required for reading variables (optional if only writing)

---

## Best Practices

### 1. Version Control

Commit token changes before syncing:
```bash
git add packages/design-system/src/tokens/handoff-colors.ts
git commit -m "chore: update design tokens"
pnpm tokens:sync-to-figma --file-key=<file-key>
```

### 2. Verify Before Sync

Check tokens are correct:
```bash
# View tokens
cat packages/design-system/src/tokens/handoff-colors.ts

# Validate format
pnpm tokens:validate
```

### 3. Document Changes

When syncing, document what changed:
```bash
# Sync
pnpm tokens:sync-to-figma --file-key=<file-key>

# Document
git commit -m "chore: sync tokens to Figma - updated gold color"
```

---

## Related Documentation

- [Handoff Integration](./HANDOFF_INTEGRATION.md) - Figma → Code sync
- [Figma MCP Integration](./FIGMA_MCP_INTEGRATION.md) - MCP-based sync
- [Design Tokens Reference](../reference/TAILWIND_DESIGN_TOKENS.md) - Token usage

---

## Support

For issues:
1. Check Figma API documentation: https://www.figma.com/developers/api
2. Verify environment variables
3. Check file permissions
4. Review script error messages

---

**Last Updated**: 2026-01-11  
**Maintained By**: Architecture Team
