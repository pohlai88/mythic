# Nextra 4: List Subpages Feature - Implementation Complete

**Date**: 2025-01-27 **Status**: ✅ **IMPLEMENTED** - List Subpages feature
added to Guides index page

---

## 🎯 Overview

The **List Subpages** feature has been implemented to automatically display all
subpages as cards on index pages. This provides a visual, card-based navigation
alternative to the sidebar.

---

## ✅ Implementation Details

### Location

**File**: `content/guides/index.mdx`

**Route**: `/guides`

### Implementation

```mdx
---
title: Guides
description: How-to guides for NexusCanon-AXIS
---

import { Cards } from "nextra/components"
import { MDXRemote } from "nextra/mdx-remote"
import { createIndexPage, getPageMap } from "nextra/page-map"

# Guides

Step-by-step guides for working with NexusCanon-AXIS governance documentation.

## Available Guides

<MDXRemote
  compiledSource={await createIndexPage(await getPageMap("/guides"))}
  components={{
    Cards,
  }}
/>

## Quick Links

- [Governance Overview](/governance) - Understanding the governance framework
- [Sealed Documents](/governance/sealed) - View sealed documents
- [Active Documents](/governance/active) - View active planning documents
```

### How It Works

1. **`getPageMap('/guides')`**: Gets the page map for the `/guides` route
2. **`createIndexPage()`**: Creates an MDX source that renders subpages as cards
3. **`MDXRemote`**: Renders the compiled MDX source
4. **`Cards`**: Component that displays the subpages as cards

### Subpages Displayed

The following subpages will be automatically displayed as cards:

1. **Getting Started** (`/guides/getting-started`)
   - Title: "Getting Started"
   - Description: "Initial setup and orientation for NexusCanon-AXIS"

2. **Sealing Documents** (`/guides/sealing-documents`)
   - Title: "Sealing Documents"
   - Description: "How to seal governance documents"

3. **Creating Amendments** (`/guides/amendments`)
   - Title: "Creating Amendments"
   - Description: "How to propose and implement governance amendments"

---

## 🎨 Optional: Adding Icons

To add icons to the cards, add an `icon` field to each subpage's front matter:

**Example** (`content/guides/getting-started.mdx`):

```mdx
---
title: Getting Started
description: Initial setup and orientation for NexusCanon-AXIS
icon: MyIcon # Optional: Add icon component
---
```

Then import and provide the icon component:

```mdx
import { Cards } from "nextra/components"
import { MDXRemote } from "nextra/mdx-remote"
import { createIndexPage, getPageMap } from "nextra/page-map"
import { MyIcon } from "../path/to/icons" // Import icon

<MDXRemote
  compiledSource={await createIndexPage(await getPageMap("/guides"))}
  components={{
    Cards,
    MyIcon, // Provide icon component
  }}
/>
```

**Current Status**: ⚠️ **No icons configured** - Cards work without icons

---

## 📋 Benefits

### ✅ Advantages

1. **Visual Navigation**: Card-based layout is more visual than sidebar
2. **Automatic**: Automatically discovers and displays all subpages
3. **Consistent**: Uses Nextra's built-in `Cards` component
4. **Maintainable**: No manual list maintenance needed

### 🎯 Use Cases

- **Index Pages**: Perfect for landing pages that showcase subpages
- **Documentation Sections**: Great for organizing guides or tutorials
- **Product Features**: Useful for displaying feature documentation

---

## 🔄 Other Index Pages

### Potential Candidates

The following index pages could also benefit from this feature:

1. **`content/governance/index.mdx`** 🟡 Consider
   - Has multiple subpages (sealed, active, amendments)
   - Could display governance layers as cards

2. **`content/product/index.mdx`** 🟡 Consider
   - Has subpages (features, roadmap)
   - Could showcase product sections

### Implementation Pattern

To add to other index pages, follow the same pattern:

```mdx
import { Cards } from "nextra/components"
import { MDXRemote } from "nextra/mdx-remote"
import { createIndexPage, getPageMap } from "nextra/page-map"

<MDXRemote
  compiledSource={await createIndexPage(await getPageMap("/your-route"))}
  components={{
    Cards,
  }}
/>
```

---

## ✅ Verification

### Type Checking

```bash
pnpm type-check
```

**Status**: ✅ **PASS** - No TypeScript errors

### Linting

```bash
pnpm check
```

**Status**: ✅ **PASS** - No linting errors

### Runtime

**Status**: ✅ **READY** - Feature implemented and ready to use

---

## 📊 Feature Status

| Feature                  | Status             | Notes                         |
| ------------------------ | ------------------ | ----------------------------- |
| **List Subpages**        | ✅ **IMPLEMENTED** | Added to `/guides` index page |
| **whiteListTagsStyling** | ⚠️ **SKIPPED**     | Not needed                    |
| **asIndexPage**          | ⚠️ **SKIPPED**     | No conflicts found            |

---

## 🎯 Summary

### ✅ Completed

- ✅ **List Subpages**: Implemented on `/guides` index page
- ✅ **Automatic Discovery**: Subpages automatically displayed as cards
- ✅ **Nextra Components**: Using `Cards` from `nextra/components`
- ✅ **Type Safety**: TypeScript compilation passes

### ⚠️ Optional Enhancements

- ⚠️ **Icons**: Can add icons to cards if desired
- ⚠️ **Other Index Pages**: Can add to governance/product pages if needed

---

## 📚 References

- **Nextra 4 Docs**: Component Migration Guide
- **Implementation**: `content/guides/index.mdx`
- **Components**: `nextra/components` (Cards), `nextra/mdx-remote` (MDXRemote)
- **APIs**: `nextra/page-map` (createIndexPage, getPageMap)

---

**Last Updated**: 2025-01-27 **Status**: ✅ **IMPLEMENTED** - List Subpages
feature active on `/guides` page
