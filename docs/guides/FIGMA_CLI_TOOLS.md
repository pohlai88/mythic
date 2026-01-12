# Figma CLI Tools Guide

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Status**: ✅ **Active**

---

## Overview

This guide covers all Figma CLI tools available in the project, including installation, configuration, and usage.

---

## Available Tools

### 1. **Handoff CLI** ✅ (Active)

**Purpose**: Design token synchronization (Figma → Code)

**Usage**:
```bash
pnpm tokens:sync
pnpm tokens:full-sync
```

**Documentation**: `docs/guides/HANDOFF_INTEGRATION.md`

---

### 2. **Figma MCP** ✅ (Active)

**Purpose**: Model Context Protocol integration for AI agents

**Usage**:
```bash
# Via Cursor MCP or:
pnpm tokens:sync-mcp --json=figma-variables.json
pnpm tokens:full-sync-mcp
```

**Documentation**: `docs/guides/FIGMA_MCP_INTEGRATION.md`

---

### 3. **@figma/code-connect** ✅ (Installed)

**Purpose**: Link code components to Figma designs

**Installation**: ✅ Installed globally (or via npx)

**Usage**:
```bash
# Initialize Code Connect
pnpm figma:code-connect --init

# Link a component
pnpm figma:code-connect --link --component=Button --figma-node=1:2

# Validate connections
pnpm figma:code-connect --validate
```

**Documentation**: https://developers.figma.com/docs/code-connect

---

### 4. **@figma-export/cli** ✅ (Installed)

**Purpose**: Export Figma components, styles, and assets

**Installation**: ✅ Installed as dev dependency

**Usage**:
```bash
# Export components
pnpm figma:export-components --file-key=<key>

# Export styles
pnpm figma:export-styles

# Export icons
pnpm figma:export-icons
```

**Configuration**: `figma-export.config.js`  
**Documentation**: https://github.com/marcomontalbano/figma-export

---

## Quick Reference

### List Figma Files

Find file keys for your Figma files:

```bash
pnpm figma:list-files
```

**Output**: Lists all teams, projects, and files with keys and URLs.

---

### Validate Token

Test your Figma API token:

```bash
pnpm validate:figma-token --token=figd_xxxxx
```

---

### Export Workflow

```bash
# 1. List files to find file key
pnpm figma:list-files

# 2. Export components
pnpm figma:export-components --file-key=<key>

# 3. Export styles
export FIGMA_FILE_KEY=<key>
pnpm figma:export-styles

# 4. Export icons
pnpm figma:export-icons
```

---

### Code Connect Workflow

```bash
# 1. Initialize Code Connect
pnpm figma:code-connect --init

# 2. Link components
pnpm figma:code-connect --link --component=Button --figma-node=1:2

# 3. Validate
pnpm figma:code-connect --validate
```

---

## Configuration

### Environment Variables

Required in `.env.local`:

```bash
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

### Figma Export Config

Edit `figma-export.config.js` to customize:
- Export paths
- Output formats
- Component filters

---

## All Available Commands

```bash
# Token Operations
pnpm tokens:sync                    # Sync tokens (Handoff)
pnpm tokens:sync-mcp                # Sync tokens (MCP)
pnpm tokens:sync-to-figma           # Push tokens to Figma
pnpm tokens:validate                 # Validate token structure
pnpm tokens:update-css              # Update CSS from tokens
pnpm tokens:rebuild                 # Rebuild CSS
pnpm tokens:full-sync                # Full sync workflow
pnpm tokens:full-sync-mcp           # Full MCP sync workflow

# Figma CLI Tools
pnpm figma:list-files               # List accessible Figma files
pnpm figma:export-components        # Export components
pnpm figma:export-styles            # Export styles
pnpm figma:export-icons             # Export icons
pnpm figma:code-connect             # Code Connect operations

# Validation
pnpm validate:figma-token           # Validate API token
```

---

## Troubleshooting

### Token Issues

```bash
# Validate token
pnpm validate:figma-token --token=your_token

# Check token format and API access
```

### File Key Issues

```bash
# List all accessible files
pnpm figma:list-files

# Shows file keys and URLs
```

### Export Issues

```bash
# Check configuration
cat figma-export.config.js

# Verify environment variables
echo $FIGMA_FILE_KEY
echo $FIGMA_API_TOKEN
```

---

## Resources

- **Handoff Integration**: `docs/guides/HANDOFF_INTEGRATION.md`
- **Figma MCP Integration**: `docs/guides/FIGMA_MCP_INTEGRATION.md`
- **Figma CLI Tools Reference**: `.temp-docs/TEMP-20260111-FIGMA-CLI-TOOLS-REFERENCE.md`
- **Setup Complete**: `.temp-docs/TEMP-20260111-FIGMA-CLI-SETUP-COMPLETE.md`

---

**Status**: ✅ **Production Ready**
