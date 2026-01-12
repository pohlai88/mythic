# Handoff Integration Guide

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Status**: ✅ **Active**

---

## Overview

Handoff is a design token synchronization tool that enables seamless Figma → Code workflow. This guide covers the complete integration setup and usage for the AXIS Luxury Business Operating System.

---

## What is Handoff?

Handoff syncs design tokens from Figma to your codebase, ensuring design and code stay in sync. It supports:

- **Design Tokens**: Colors, typography, spacing, shadows
- **Components**: Component documentation and specs
- **Custom Transformations**: Transform tokens to match your codebase structure

**Official Documentation**: https://www.handoff.com/docs

---

## Architecture

### Design System Philosophy

**KISS Principle**: Only theme colors are synced via Handoff. Everything else uses Tailwind defaults.

- ✅ **Theme Colors**: Handoff tokens (Figma → Code)
- ✅ **Spacing**: Tailwind defaults
- ✅ **Typography**: Tailwind defaults
- ✅ **Shadows**: Tailwind defaults
- ✅ **Border Radius**: Tailwind defaults

### File Structure

```
packages/design-system/src/tokens/
├── handoff-colors.ts      # Handoff-compatible color tokens (synced from Figma)
├── fallback.ts            # Fallback tokens (used when sync fails)
├── input.css              # Tailwind v4 @theme configuration (manually maintained)
├── style.css              # Compiled CSS output (generated)
└── README.md              # Token documentation
```

---

## Installation

### 1. Install Handoff CLI

```bash
# Global installation (recommended)
npm install -g @handoff/cli

# Or local installation
pnpm add -D @handoff/cli
```

### 2. Verify Installation

```bash
handoff --version
```

---

## Configuration

### 1. Figma Setup

**Requirements**:
- Figma file with design tokens
- Figma API token
- Access to the design file

**Get Figma API Token**:
1. Go to Figma → Account Settings
2. Generate a personal access token
3. Store securely (use environment variables)

### 2. Environment Variables

Create `.env.local` in project root:

```bash
# Figma Configuration
FIGMA_API_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

**Security**: Never commit `.env.local` to git. Add to `.gitignore`.

### 3. Handoff Configuration

Create `handoff.config.js` in project root:

```javascript
/**
 * Handoff Configuration
 * 
 * Configures Handoff CLI for syncing design tokens from Figma
 */

module.exports = {
  // Figma file configuration
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    token: process.env.FIGMA_API_TOKEN,
  },

  // Output configuration
  output: {
    // TypeScript color tokens
    colors: {
      path: 'packages/design-system/src/tokens/handoff-colors.ts',
      format: 'typescript',
      transform: (tokens) => {
        // Transform Figma tokens to our structure
        return {
          handoffColors: {
            void: { value: tokens.colors.void, description: 'Absence / Authority' },
            obsidian: { value: tokens.colors.obsidian, description: 'Surface / Weight' },
            parchment: { value: tokens.colors.parchment, description: 'Knowledge' },
            ash: { value: tokens.colors.ash, description: 'Commentary' },
            gold: { value: tokens.colors.gold, description: 'Ratified Authority' },
            ember: { value: tokens.colors.ember, description: 'Consequence' },
            charcoal: { value: tokens.colors.charcoal, description: 'Border / Divider' },
          },
        }
      },
    },
  },

  // Validation
  validate: {
    requiredTokens: ['void', 'obsidian', 'parchment', 'ash', 'gold', 'ember', 'charcoal'],
    validateFormat: true,
  },
}
```

---

## Usage

### Sync Tokens from Figma

#### Basic Sync

```bash
# Sync all tokens from Figma
handoff sync

# Or with explicit file key
handoff sync --figma-file=your_file_key --output=packages/design-system/src/tokens/handoff-colors.ts
```

#### Using npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "tokens:sync": "handoff sync",
    "tokens:validate": "tsx scripts/validate-handoff-tokens.ts",
    "tokens:update-css": "tsx scripts/update-css-from-handoff.ts"
  }
}
```

Then run:

```bash
# Sync tokens
pnpm tokens:sync

# Validate synced tokens
pnpm tokens:validate

# Update CSS from Handoff tokens
pnpm tokens:update-css
```

### Manual Sync Workflow

1. **Sync from Figma**:
   ```bash
   handoff sync --figma-file=xxx --output=packages/design-system/src/tokens/handoff-colors.ts
   ```

2. **Validate Tokens**:
   ```bash
   pnpm tokens:validate
   ```

3. **Update CSS** (if needed):
   ```bash
   pnpm tokens:update-css
   ```

4. **Rebuild CSS**:
   ```bash
   cd packages/design-system && pnpm build:css
   ```

5. **Test Changes**:
   ```bash
   pnpm type-check
   pnpm lint
   ```

---

## Token Structure

### Handoff Color Tokens

**File**: `packages/design-system/src/tokens/handoff-colors.ts`

```typescript
export const handoffColors = {
  void: {
    value: '#0a0a0b',
    description: 'Absence / Authority - Deepest black',
  },
  obsidian: {
    value: '#141416',
    description: 'Surface / Weight - Dark surface',
  },
  // ... more colors
} as const
```

### Tailwind CSS Integration

Handoff tokens (HEX format) are converted to HSL format for Tailwind v4:

**File**: `packages/design-system/src/tokens/input.css`

```css
@theme {
  /* Converted from Handoff HEX to HSL */
  --color-void: 240 10% 4%;        /* From #0a0a0b */
  --color-obsidian: 240 8% 8%;     /* From #141416 */
  --color-parchment: 40 20% 96%;    /* From #f8f5f0 */
  /* ... */
}
```

**Why HSL?**
- Enables opacity modifiers (`bg-void/50`)
- Better color manipulation
- Tailwind v4 best practice

---

## Automated Sync Workflow

### GitHub Actions Integration

Create `.github/workflows/sync-design-tokens.yml`:

```yaml
name: Sync Design Tokens

on:
  schedule:
    # Sync daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Manual trigger

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Handoff CLI
        run: npm install -g @handoff/cli
      
      - name: Sync tokens from Figma
        env:
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: pnpm tokens:sync
      
      - name: Validate tokens
        run: pnpm tokens:validate
      
      - name: Update CSS
        run: pnpm tokens:update-css
      
      - name: Rebuild CSS
        run: cd packages/design-system && pnpm build:css
      
      - name: Create PR if changes
        uses: peter-evans/create-pull-request@v5
        with:
          commit-message: 'chore: sync design tokens from Figma'
          title: 'Sync Design Tokens from Figma'
          body: 'Automated sync of design tokens from Figma'
          branch: sync/design-tokens
```

---

## Token Validation

### Validation Script

**File**: `scripts/validate-handoff-tokens.ts`

Validates:
- ✅ All required tokens present
- ✅ Token format correct
- ✅ Values match expected structure
- ✅ CSS variables updated correctly

**Run Validation**:

```bash
pnpm tokens:validate
```

### Required Tokens

The following tokens must be present after sync:

- `void` - Absence / Authority
- `obsidian` - Surface / Weight
- `parchment` - Knowledge
- `ash` - Commentary
- `gold` - Ratified Authority
- `ember` - Consequence
- `charcoal` - Border / Divider

---

## CSS Update Workflow

### Converting HEX to HSL

Handoff provides HEX colors, but Tailwind v4 requires HSL format.

**Automated Conversion Script**: `scripts/update-css-from-handoff.ts`

This script:
1. Reads `handoff-colors.ts`
2. Converts HEX → HSL
3. Updates `input.css` with new values
4. Validates conversion

**Run**:

```bash
pnpm tokens:update-css
```

### Manual Conversion

If needed, convert manually:

```typescript
// HEX to HSL conversion
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  // Convert to HSL
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  // Format as space-separated HSL (Tailwind v4 format)
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
```

---

## Best Practices

### ✅ DO

- **Sync regularly**: Keep tokens in sync with design
- **Validate after sync**: Always run validation
- **Test changes**: Verify CSS builds correctly
- **Use fallback tokens**: Handle sync failures gracefully
- **Document changes**: Commit with clear messages

### ❌ DON'T

- **Don't edit `handoff-colors.ts` manually**: Let Handoff sync it
- **Don't skip validation**: Always validate after sync
- **Don't commit API tokens**: Use environment variables
- **Don't sync without testing**: Test CSS rebuild after sync

---

## Troubleshooting

### Sync Fails

**Problem**: `handoff sync` fails with authentication error

**Solution**:
1. Verify `FIGMA_API_TOKEN` is set correctly
2. Check token hasn't expired
3. Verify file key is correct
4. Check network connectivity

### Tokens Missing

**Problem**: Some tokens not synced from Figma

**Solution**:
1. Verify tokens exist in Figma file
2. Check token naming matches expected format
3. Review Handoff configuration
4. Check validation script requirements

### CSS Build Fails

**Problem**: CSS build fails after token sync

**Solution**:
1. Verify HEX → HSL conversion correct
2. Check `input.css` syntax
3. Validate all required tokens present
4. Review PostCSS configuration

### Type Errors

**Problem**: TypeScript errors after sync

**Solution**:
1. Run `pnpm type-check`
2. Verify token structure matches types
3. Check `handoff-colors.ts` format
4. Update types if needed

---

## Integration with Tailwind v4

### Auto-Generated Utilities

After syncing tokens and updating CSS, Tailwind v4 automatically generates utilities:

```tsx
// These utilities are auto-generated from @theme
<div className="bg-void">        {/* From --color-void */}
<div className="text-gold">      {/* From --color-gold */}
<div className="border-charcoal"> {/* From --color-charcoal */}
```

### Opacity Modifiers

HSL format enables opacity modifiers:

```tsx
<div className="bg-void/50">     {/* 50% opacity */}
<div className="text-gold/75">    {/* 75% opacity */}
```

---

## Workflow Summary

### Complete Sync Workflow

```bash
# 1. Sync from Figma
pnpm tokens:sync

# 2. Validate tokens
pnpm tokens:validate

# 3. Update CSS (convert HEX → HSL)
pnpm tokens:update-css

# 4. Rebuild CSS
cd packages/design-system && pnpm build:css

# 5. Type check
pnpm type-check

# 6. Lint
pnpm lint

# 7. Test
pnpm test
```

---

## Related Documentation

- [Design Tokens Reference](../reference/TAILWIND_DESIGN_TOKENS.md)
- [Tailwind v4 Design System](../../_system/DOC-0126_tailwind-v4-design-system.md)
- [Handoff Official Docs](https://www.handoff.com/docs)

---

## Support

For issues or questions:
1. Check Handoff documentation: https://www.handoff.com/docs
2. Review token validation errors
3. Check Figma file structure
4. Verify environment variables

---

**Last Updated**: 2026-01-11  
**Maintained By**: Architecture Team
