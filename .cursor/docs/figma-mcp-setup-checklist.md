# Figma MCP Integration Setup Checklist

**Quick setup guide to begin using Figma MCP for token sync**

---

## ✅ Pre-requisites

- [ ] Figma account with API access
- [ ] Figma file with design tokens (variables)
- [ ] Cursor IDE (or Claude Desktop)
- [ ] Node.js and pnpm installed

---

## Step 1: Get Figma API Token

1. Go to Figma → Account Settings
2. Generate a personal access token
3. Copy the token (you'll need it for Step 2)

**Security**: Never commit tokens to git. Use environment variables.

---

## Step 2: Configure MCP Server in Cursor

### Option A: Via Cursor Settings UI

1. Open Cursor Settings
2. Navigate to **MCP Servers** or **Extensions**
3. Add new MCP server:
   - **Name**: `figma`
   - **Command**: `npx`
   - **Args**: `["-y", "@figma/mcp-server", "--stdio"]`
   - **Environment Variables**:
     - `FIGMA_API_KEY`: Your Figma API token

### Option B: Via Configuration File

Create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "your_figma_token_here"
      }
    }
  }
}
```

**Note**: Replace `your_figma_token_here` with your actual token.

---

## Step 3: Set Environment Variables

Create `.env.local` in project root:

```bash
# Figma Configuration
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

**To get your Figma file key**:
- Open your Figma file
- Look at the URL: `https://www.figma.com/file/FILE_KEY/file-name`
- The `FILE_KEY` is the long string between `/file/` and `/file-name`

---

## Step 4: Restart Cursor

Restart Cursor to load the MCP server configuration.

**Verify MCP is loaded**:
- Check Cursor's MCP server status
- Look for "figma" in the list of available servers

---

## Step 5: Test MCP Connection

**In Cursor Chat**, try:

```
Get the variable names and values for Figma file <your-file-key>
```

Or:

```
Use Figma MCP to get color variables from file <your-file-key>
```

**Expected**: MCP server should return variable data.

---

## Step 6: Get Variables and Sync

### Method A: Via Cursor Chat

1. **Ask Cursor**:
   ```
   Get the color variables used in Figma file <file-key>, specifically the BEASTMODE Gold palette: void, obsidian, parchment, ash, gold, ember, charcoal
   ```

2. **Save the response** to a JSON file (e.g., `figma-variables.json`)

3. **Run sync**:
   ```bash
   pnpm tokens:sync-mcp --json=figma-variables.json
   pnpm tokens:full-sync-mcp
   ```

### Method B: Direct Script (if you have the JSON)

If you already have the MCP response JSON:

```bash
# Sync tokens
pnpm tokens:sync-mcp --json=figma-variables.json

# Validate
pnpm tokens:validate

# Update CSS (HEX → HSL)
pnpm tokens:update-css

# Rebuild CSS
pnpm tokens:rebuild

# Or all at once:
pnpm tokens:full-sync-mcp
```

---

## Step 7: Verify Integration

### Check Token File

```bash
# View synced tokens
cat packages/design-system/src/tokens/handoff-colors.ts
```

### Validate Tokens

```bash
pnpm tokens:validate
```

**Expected**: ✅ All 7 tokens valid

### Check CSS

```bash
# View updated CSS variables
grep -A 1 "color-gold" packages/design-system/src/tokens/input.css
```

---

## Troubleshooting

### MCP Server Not Loading

**Problem**: Figma MCP server not available in Cursor

**Solutions**:
1. Check MCP configuration file syntax
2. Verify `FIGMA_API_KEY` is set correctly
3. Restart Cursor
4. Check Cursor logs for MCP errors

### Variables Not Found

**Problem**: `get_variable_defs` returns empty or wrong variables

**Solutions**:
1. Verify file key is correct
2. Check variable names in Figma match: `void`, `obsidian`, `parchment`, `ash`, `gold`, `ember`, `charcoal`
3. Ensure variables exist in Figma file
4. Try with a specific node ID

### Token Sync Fails

**Problem**: `pnpm tokens:sync-mcp` fails

**Solutions**:
1. Check JSON file format matches MCP response structure
2. Verify all required tokens are present
3. Check color format (should be RGB object or HEX string)
4. Review script logs for errors

---

## Quick Reference

### Commands

```bash
# Full MCP sync workflow
pnpm tokens:full-sync-mcp

# Step-by-step
pnpm tokens:sync-mcp --json=<file>
pnpm tokens:validate
pnpm tokens:update-css
pnpm tokens:rebuild
```

### Alternative: Handoff CLI

If MCP doesn't work, use Handoff CLI:

```bash
pnpm tokens:full-sync
```

---

## Next Steps

Once integration is working:

1. **Automate**: Set up scheduled syncs (if needed)
2. **Document**: Add your Figma file key to team docs
3. **Test**: Verify tokens update correctly when Figma changes
4. **Integrate**: Use in your development workflow

---

**Status**: Ready to begin integration  
**See**: `docs/guides/FIGMA_MCP_INTEGRATION.md` for complete documentation
