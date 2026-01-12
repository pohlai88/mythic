# Pillar Design System - Figma Analysis & Integration Guide

**Date**: 2026-01-12
**Status**: Analysis & Integration Planning
**Figma File**: [Pillar Design System](https://www.figma.com/design/1391479088934839347/pillar-design-system)
**File Key**: `1391479088934839347`

---

## Executive Summary

The **Pillar Design System** is a comprehensive Figma community design system designed to help designers create consistent and efficient user interfaces. This document provides:

1. **Analysis** of the Pillar Design System structure
2. **Comparison** with our current AXIS Visual Canon design system
3. **Integration strategy** for adopting Pillar components/tokens
4. **Access instructions** for using Figma MCP to explore the system

---

## Current System: AXIS Visual Canon

### Our Design System Foundation

**Package**: `@mythic/design-system`
**Version**: 1.0.0
**Architecture**: Tailwind v4 CSS-first with `@theme` directive

### Key Features

- ✅ **BEASTMODE Gold Palette**: Brand-specific color system
  - Primary: `void`, `obsidian`, `charcoal`
  - Accent: `parchment`, `ash`, `gold`, `ember`
- ✅ **Complete Token System**: Colors, typography, spacing, shadows, animations
- ✅ **37+ Components**: UI, forms, navigation, data display, feedback, layout
- ✅ **Accessibility First**: Radix UI primitives (WCAG 2.1 AA)
- ✅ **Figma Integration**: Handoff sync for design tokens
- ✅ **Intelligence-Driven**: Context-aware styling utilities

### Current Token Structure

```typescript
// Color Tokens (Handoff-synced from Figma)
- BEASTMODE Gold Palette (7 colors)
- Semantic scales (success, warning, error, info, neutral)
- Component-specific tokens

// Typography
- Font families: sans, serif, mono
- Font sizes: xs through 9xl
- Font weights: thin through black

// Spacing
- Tailwind default scale (0-96)

// Shadows
- Tailwind default scale

// Border Radius
- Custom scale: xs, sm, md, lg, xl, 2xl, full
```

---

## Pillar Design System: Overview

### What is Pillar?

Pillar is a **Figma community design system** that provides:

- **Comprehensive component library** for UI design
- **Design tokens** (colors, typography, spacing)
- **Design patterns** and best practices
- **Accessibility guidelines**
- **Component variants** and states

### Access Requirements

**Important**: Community files in Figma typically require:

1. **Duplication** to your own Figma account
2. **Authentication** via Figma API token
3. **File permissions** to access via MCP

### Accessing via Figma MCP

**Current Status**: ⚠️ **Requires File Duplication**

The Figma MCP tools are configured but returning debug UUIDs, which suggests:

1. The file needs to be duplicated to your account first
2. The file key may need to be updated after duplication
3. API permissions may need verification

**Steps to Access**:

1. **Duplicate the File**:
   - Visit: https://www.figma.com/design/1391479088934839347/pillar-design-system
   - Click "Duplicate" to add to your drafts
   - Note the new file key from the URL

2. **Update File Key**:
   ```bash
   # After duplication, update .env
   FIGMA_FILE_KEY=<new-file-key-from-duplicated-file>
   ```

3. **Access via MCP**:
   ```typescript
   // In Cursor chat:
   "Get variable definitions for Figma file <new-file-key>"
   "Get design context for node 0:1 in file <new-file-key>"
   ```

---

## Comparison: Pillar vs AXIS Visual Canon

### Design Philosophy

| Aspect              | Pillar Design System      | AXIS Visual Canon              |
| ------------------- | ------------------------- | ------------------------------ |
| **Purpose**         | General-purpose UI system | Luxury business OS (BEASTMODE) |
| **Brand Identity**  | Neutral, adaptable        | Brand-specific (Gold palette)  |
| **Architecture**    | Figma-first               | Code-first (Tailwind v4)       |
| **Token Source**    | Figma Variables           | Handoff sync (Figma → Code)    |
| **Component Count** | Unknown (community file)  | 37+ components                 |
| **Accessibility**   | Likely comprehensive      | Radix UI (WCAG 2.1 AA)         |

### Token System Comparison

#### Colors

**Pillar** (Expected):
- Likely includes: primary, secondary, neutral scales
- Semantic colors: success, warning, error, info
- Component-specific tokens

**AXIS Visual Canon** (Current):
- ✅ BEASTMODE Gold palette (7 brand colors)
- ✅ Semantic scales (50-950 for each)
- ✅ Component-specific mappings

#### Typography

**Pillar** (Expected):
- Font families, sizes, weights
- Line heights, letter spacing
- Heading styles

**AXIS Visual Canon** (Current):
- ✅ Font families: sans, serif, mono
- ✅ Font sizes: xs-9xl (rem-based)
- ✅ Font weights: thin-black
- ✅ Custom font stack (Inter, JetBrains Mono)

#### Spacing

**Pillar** (Expected):
- Spacing scale (likely 4px or 8px base)
- Component spacing tokens

**AXIS Visual Canon** (Current):
- ✅ Tailwind default scale (0-96)
- ✅ Custom spacing utilities

---

## Integration Strategy

### Option 1: Reference & Inspiration (Recommended)

**Approach**: Use Pillar as a **reference** for:
- Component patterns and best practices
- Accessibility implementations
- Design token organization
- Component API design

**Action Items**:
1. ✅ Explore Pillar components in Figma
2. ✅ Document patterns that align with our system
3. ✅ Extract accessibility patterns
4. ✅ Compare token structures

**Benefits**:
- ✅ No breaking changes to current system
- ✅ Maintains brand identity (BEASTMODE Gold)
- ✅ Learn from industry best practices
- ✅ Selective adoption of patterns

### Option 2: Selective Token Adoption

**Approach**: Adopt specific tokens from Pillar that complement our system

**Potential Additions**:
- Additional semantic color scales
- Typography refinements
- Spacing optimizations
- Shadow/effect tokens

**Process**:
1. Extract tokens via Figma MCP
2. Map to our token structure
3. Integrate via Handoff sync
4. Update `input.css` with new tokens

### Option 3: Component Pattern Adoption

**Approach**: Adopt component patterns while maintaining our tokens

**Examples**:
- Component variants (size, state, style)
- Accessibility patterns (ARIA, keyboard navigation)
- Component composition patterns
- Animation/transition patterns

---

## Figma MCP Integration Workflow

### Step 1: Duplicate & Access

```bash
# 1. Duplicate file in Figma
# 2. Get new file key from URL
# 3. Update environment
FIGMA_FILE_KEY=<new-file-key>
```

### Step 2: Explore via MCP

**Get Variable Definitions**:
```
Get variable definitions for Figma file <file-key>
```

**Get Design Context**:
```
Get design context for node 0:1 in file <file-key>
```

**Get Screenshot**:
```
Get screenshot of node 0:1 in file <file-key>
```

### Step 3: Extract & Analyze

**Save MCP Response**:
```bash
# Save to JSON file
echo '<mcp-response>' > pillar-variables.json
```

**Analyze Structure**:
```typescript
// Review token structure
// Compare with current tokens
// Identify integration opportunities
```

### Step 4: Integrate (If Desired)

**Sync Tokens**:
```bash
# If adopting tokens
pnpm tokens:sync-mcp --json=pillar-variables.json
```

**Update Documentation**:
- Document adopted patterns
- Update token registry
- Add integration notes

---

## Recommended Next Steps

### Immediate Actions

1. **✅ Duplicate Pillar File**
   - Visit Figma community file
   - Duplicate to your account
   - Note new file key

2. **✅ Access via MCP**
   - Update `FIGMA_FILE_KEY` in `.env`
   - Use MCP tools to explore structure
   - Document findings

3. **✅ Analyze Components**
   - Review component library
   - Identify patterns
   - Compare with current system

### Short-Term (Week 1-2)

1. **Document Patterns**
   - Create pattern comparison document
   - Identify best practices
   - Document accessibility patterns

2. **Selective Adoption**
   - Choose 2-3 patterns to adopt
   - Plan integration
   - Update components

### Long-Term (Month 1-3)

1. **Component Enhancement**
   - Adopt accessibility patterns
   - Enhance component variants
   - Improve documentation

2. **Token Refinement**
   - Refine token structure based on learnings
   - Optimize spacing/typography
   - Enhance semantic tokens

---

## MCP Tool Reference

### Available Tools

1. **`get_variable_defs`**
   - Purpose: Get design variables (colors, spacing, typography)
   - Parameters: `fileKey`, `nodeId` (optional)
   - Returns: Variable definitions object

2. **`get_design_context`**
   - Purpose: Get UI code and component structure
   - Parameters: `fileKey`, `nodeId`, `forceCode` (optional)
   - Returns: Code string + asset URLs

3. **`get_metadata`**
   - Purpose: Get file structure (nodes, layers)
   - Parameters: `fileKey`, `nodeId`
   - Returns: XML metadata

4. **`get_screenshot`**
   - Purpose: Generate screenshot of node
   - Parameters: `fileKey`, `nodeId`
   - Returns: Screenshot image

### Example Usage

```typescript
// Get all variables
mcp_Figma_get_variable_defs({
  fileKey: "1391479088934839347",
  nodeId: "0:1" // Root page
})

// Get specific component
mcp_Figma_get_design_context({
  fileKey: "1391479088934839347",
  nodeId: "1:2", // Specific component node
  forceCode: true
})

// Get file structure
mcp_Figma_get_metadata({
  fileKey: "1391479088934839347",
  nodeId: "0:1"
})
```

---

## Troubleshooting

### Issue: MCP Returns Debug UUIDs Only

**Cause**: File not accessible or requires duplication

**Solution**:
1. Duplicate file to your account
2. Update `FIGMA_FILE_KEY` with new key
3. Verify API token has correct permissions
4. Restart Cursor

### Issue: Variables Not Found

**Cause**: Variables may not exist or have different names

**Solution**:
1. Check Figma file for variable names
2. Verify variable collection exists
3. Try different node IDs
4. Use `get_metadata` to explore structure

### Issue: Permission Denied

**Cause**: API token lacks required scopes

**Solution**:
1. Verify token has `file_read` scope
2. Check file permissions in Figma
3. Ensure file is in your account (duplicated)

---

## Conclusion

The **Pillar Design System** is a valuable reference for:

- ✅ **Component patterns** and best practices
- ✅ **Accessibility implementations**
- ✅ **Token organization** strategies
- ✅ **Design system architecture**

**Recommended Approach**: Use Pillar as a **reference and inspiration** source while maintaining our unique **AXIS Visual Canon** brand identity and architecture.

**Next Action**: Duplicate the file and explore via Figma MCP to extract specific patterns and tokens for potential integration.

---

## References

- **Pillar Design System**: https://www.figma.com/design/1391479088934839347/pillar-design-system
- **Figma MCP Documentation**: https://developers.figma.com/docs/figma-mcp-server
- **Current Design System**: `packages/design-system/README.md`
- **Token Governance**: `packages/design-system/src/tokens/governance.ts`
- **Figma MCP Setup**: `.cursor/docs/figma-mcp-setup-complete.md`

---

**Status**: Ready for exploration
**Last Updated**: 2026-01-12
**Next Review**: After file duplication and MCP access
