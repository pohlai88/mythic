# Nextra 4: GitHub Alert Syntax Support

**Status**: ✅ **Automatic Support Enabled** **Date**: 2025-01-27

## Overview

Nextra 4 automatically converts **GitHub Alert Syntax** to `<Callout>`
components in `.md` and `.mdx` files. No configuration needed - it works out of
the box!

---

## Supported Syntax

### Note

```markdown
> [!NOTE]
>
> Useful information that users should know, even when skimming content.
```

**Renders as**:

> **Note**
>
> Useful information that users should know, even when skimming content.

---

### Tip

```markdown
> [!TIP]
>
> Helpful advice for doing things better or more easily.
```

**Renders as**:

> **Tip**
>
> Helpful advice for doing things better or more easily.

---

### Important

```markdown
> [!IMPORTANT]
>
> Key information users need to know to achieve their goal.
```

**Renders as**:

> **Important**
>
> Key information users need to know to achieve their goal.

---

### Warning

```markdown
> [!WARNING]
>
> Urgent info that needs immediate user attention to avoid problems.
```

**Renders as**:

> **Warning**
>
> Urgent info that needs immediate user attention to avoid problems.

---

### Caution

```markdown
> [!CAUTION]
>
> Advises about risks or negative outcomes of certain actions.
```

**Renders as**:

> **Caution**
>
> Advises about risks or negative outcomes of certain actions.

---

## How It Works

### Automatic Conversion

Nextra 4 automatically converts GitHub Alert Syntax to `<Callout>` components:

**Input** (Markdown):

```markdown
> [!NOTE]
>
> This is a note.
```

**Output** (Rendered):

```tsx
<Callout type="note">This is a note.</Callout>
```

### No Configuration Needed

✅ **Works automatically** - No setup required ✅ **Built-in support** - Part of
Nextra 4 ✅ **MDX compatible** - Works in `.md` and `.mdx` files

---

## Usage Examples

### Basic Usage

```markdown
> [!NOTE]
>
> This is a basic note callout.
```

### With Content

```markdown
> [!TIP]
>
> Here's a helpful tip:
>
> - Use GitHub Alert Syntax for callouts
> - It's automatically converted to Callout components
> - No configuration needed
```

### Multiple Callouts

```markdown
> [!WARNING]
>
> This is a warning.

> [!IMPORTANT]
>
> This is important information.
```

---

## Supported Files

- ✅ `.md` files
- ✅ `.mdx` files
- ✅ Files in `content/` directory
- ✅ Files in `app/**/page.mdx` (Page File Convention)

---

## Callout Types Mapping

| GitHub Syntax  | Callout Type | Visual Style     |
| -------------- | ------------ | ---------------- |
| `[!NOTE]`      | `note`       | Blue/Info        |
| `[!TIP]`       | `tip`        | Green/Success    |
| `[!IMPORTANT]` | `important`  | Yellow/Attention |
| `[!WARNING]`   | `warning`    | Orange/Warning   |
| `[!CAUTION]`   | `caution`    | Red/Danger       |

---

## Best Practices

### ✅ Do

- ✅ Use GitHub Alert Syntax for callouts
- ✅ Keep content concise and clear
- ✅ Use appropriate alert types
- ✅ Place callouts where contextually relevant

### ❌ Don't

- ❌ Overuse callouts (clutters content)
- ❌ Use wrong alert types
- ❌ Nest callouts (not supported)
- ❌ Use HTML inside callouts (use Markdown)

---

## Examples in Content

### Documentation Example

```markdown
# Getting Started

> [!NOTE]
>
> Before you begin, make sure you have Node.js 18+ installed.

## Installation

> [!TIP]
>
> Use `pnpm` for faster installs and better monorepo support.

## Configuration

> [!WARNING]
>
> Changing these settings may affect your build. Test thoroughly.

## Deployment

> [!IMPORTANT]
>
> Remember to set environment variables before deploying.

## Troubleshooting

> [!CAUTION]
>
> Incorrect configuration may cause build failures.
```

---

## Customization

### Using Callout Component Directly

If you need more control, use `<Callout>` component directly:

```mdx
import { Callout } from "nextra/components"

<Callout type="note" emoji="📝">
  Custom callout with emoji
</Callout>
```

### Styling

Callout styles are handled by Nextra theme automatically. No custom CSS needed.

---

## Migration from Custom Callouts

### Before (Custom Syntax)

```markdown
:::note This is a note. :::
```

### After (GitHub Alert Syntax)

```markdown
> [!NOTE]
>
> This is a note.
```

**Benefits**:

- ✅ Standard GitHub syntax
- ✅ Better compatibility
- ✅ Automatic conversion
- ✅ No custom syntax needed

---

## Troubleshooting

### Callouts Not Rendering

**Problem**: GitHub Alert Syntax not converted

**Solutions**:

1. Check file extension (`.md` or `.mdx`)
2. Verify syntax is correct: `> [!TYPE]`
3. Ensure Nextra 4 is installed
4. Check for typos in alert type

### Wrong Styling

**Problem**: Callout doesn't match expected style

**Solutions**:

1. Verify alert type is correct
2. Check Nextra theme is loaded
3. Verify CSS is imported: `import 'nextra-theme-docs/style.css'`

---

## References

- [GitHub Alert Syntax](https://github.com/orgs/community/discussions/16925)
- [Nextra Callout Component](https://nextra.site/docs/docs-theme/callout)
- Current implementation: Automatic in Nextra 4

---

## Summary

✅ **Automatic Support**: GitHub Alert Syntax works out of the box ✅ **5 Types
Supported**: NOTE, TIP, IMPORTANT, WARNING, CAUTION ✅ **No Configuration**:
Built into Nextra 4 ✅ **MDX Compatible**: Works in all Markdown files

**Status**: ✅ **Ready to Use**

---

**Last Updated**: 2025-01-27 **Usage**: Just use GitHub Alert Syntax in your
Markdown files!
