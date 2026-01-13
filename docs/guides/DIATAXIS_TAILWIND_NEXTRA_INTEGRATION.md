---
doc_type: GUIDE
status: active
owner: architecture
source_of_truth: true
created: 2026-01-11
modified: 2026-01-11
tags: [diataxis, tailwind, nextra, integration, documentation]
related_docs:
  - DOC-0126_tailwind-v4-design-system.md
---

# Diátaxis + Tailwind CSS + Nextra: Synergistic Integration Guide

**Status**: ✅ **ACTIVE** **Version**: 1.0.0 **Last Updated**: 2026-01-11

---

## Executive Summary

This guide demonstrates how **Diátaxis documentation framework**, **Tailwind CSS
v4**, and **Nextra 4** work together synergistically in the `apps/docs`
application to achieve maximum documentation output effect.

### The Synergy

1. **Diátaxis** provides the structure (Tutorials, How-To, Reference,
   Explanation)
2. **Tailwind CSS v4** provides intelligence-driven styling and design tokens
3. **Nextra 4** provides the documentation platform and MDX rendering
4. **Together**: Beautiful, structured, intelligent documentation that adapts to
   user needs

---

## Architecture Overview

### Three-Layer Integration

```
┌─────────────────────────────────────────────────────────┐
│                    Nextra 4 (Platform)                   │
│  - MDX rendering                                         │
│  - Sidebar navigation                                    │
│  - Search (Pagefind)                                     │
│  - Theme system                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Diátaxis (Documentation Structure)         │
│  - Tutorials (learning-oriented)                        │
│  - How-To Guides (problem-oriented)                     │
│  - Reference (information-oriented)                     │
│  - Explanation (understanding-oriented)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         Tailwind CSS v4 (Intelligence-Driven Styling)   │
│  - Design tokens (@theme directive)                     │
│  - Intelligence utilities (risk, status, priority)      │
│  - Diátaxis utilities (document type styling)          │
│  - Axis Visual Canon (BEASTMODE Gold)                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Integration

### 1. Diátaxis Components (Tailwind-Enhanced)

All Diátaxis components are available in MDX files:

```tsx
// Document Type Badge
<DocumentTypeBadge type="tutorial" size="md" />

// Document Type Banner
<DocumentTypeBanner
  type="tutorial"
  title="Building Your First Component"
  description="We will work through this together, step by step."
/>

// Tutorial Steps
<TutorialSteps
  steps={[
    {
      title: "First, do X",
      description: "We must always do X before Y because...",
      code: "npm install",
      note: "Remember: This step is critical"
    }
  ]}
/>

// How-To Guide
<HowToGuide
  problem="You need to style a component"
  solution="Use Tailwind intelligence utilities"
  steps={[...]}
/>

// Reference Table
<ReferenceTable
  title="API Reference"
  columns={[
    { header: "Property", accessor: "property" },
    { header: "Type", accessor: "type" }
  ]}
  data={[...]}
/>

// Explanation Box
<ExplanationBox type="concept" title="Why This Works">
  Background and reasoning...
</ExplanationBox>
```

---

## Tailwind Utilities for Diátaxis

### Document Type Utilities

```tsx
// Tutorial styling
<div className="diataxis-tutorial p-4 rounded-lg">
  Tutorial content
</div>

// How-To styling
<div className="diataxis-howto p-4 rounded-lg">
  How-To content
</div>

// Reference styling
<div className="diataxis-reference p-4 rounded-lg">
  Reference content
</div>

// Explanation styling
<div className="diataxis-explanation p-4 rounded-lg">
  Explanation content
</div>
```

### Combined with Intelligence Utilities

```tsx
// Tutorial with success gradient
<div className="diataxis-tutorial gradient-success p-6 rounded-lg">
  <DocumentTypeBadge type="tutorial" />
  Tutorial content with intelligence-driven styling
</div>

// How-To with approved gradient
<div className="diataxis-howto gradient-approved p-6 rounded-lg transition-illuminate">
  How-To guide with smooth transitions
</div>
```

---

## File Structure

```
apps/docs/
├── components/
│   └── diataxis/
│       ├── DocumentTypeBadge.tsx      # Badge component
│       ├── DocumentTypeBanner.tsx      # Banner component
│       ├── TutorialSteps.tsx          # Tutorial-specific steps
│       ├── HowToGuide.tsx              # How-To structure
│       ├── ReferenceTable.tsx         # Reference tables
│       ├── ExplanationBox.tsx          # Explanation boxes
│       └── index.ts                    # Exports
├── content/
│   ├── tutorials/                      # Diátaxis: Tutorials
│   │   ├── _meta.json
│   │   └── getting-started.mdx
│   ├── how-to/                         # Diátaxis: How-To
│   │   ├── _meta.json
│   │   └── customize-button.mdx
│   ├── reference/                     # Diátaxis: Reference
│   │   ├── _meta.json
│   │   └── components/
│   └── explanation/                   # Diátaxis: Explanation
│       ├── _meta.json
│       └── server-components.mdx
└── mdx-components.tsx                  # MDX component registry
```

---

## Usage Examples

### Example 1: Tutorial Document

```mdx
---
title: Building Your First Component
type: tutorial
---

<DocumentTypeBanner
  type="tutorial"
  title="Building Your First Component"
  description="In this tutorial, we will build a component together, step by step."
/>

## Introduction

We are going to build a button component using Tailwind CSS and Diátaxis
principles.

<TutorialSteps
  steps={[
    {
      title: "First, create the component file",
      description: "We must create the file before we can write code.",
      code: "touch components/Button.tsx",
    },
    {
      title: "Now, add the basic structure",
      description: "We will use Tailwind utilities for styling.",
      code: `export function Button() {
  return <button className="bg-gold text-void">Click me</button>
}`,
    },
    {
      title: "Finally, test the component",
      description: "We should always test our components.",
      note: "Remember: Testing ensures quality",
    },
  ]}
/>

## What We Built

You have built a secure, three-layer component using Tailwind CSS and Diátaxis
principles.
```

### Example 2: How-To Guide

```mdx
---
title: How to Style Components with Intelligence
type: how-to
---

<DocumentTypeBanner
  type="how-to"
  title="How to Style Components with Intelligence"
  description="Follow these steps to style components using Tailwind intelligence utilities."
/>

<HowToGuide
  problem="You need to style a component based on risk status"
  solution="Use Tailwind intelligence-driven utilities"
  steps={[
    {
      title: "Import intelligence utilities",
      description: "Import the utilities from shared-utils",
      code: `import { intelligentRiskStyles } from '@mythic/nextjs-shared-utils'`,
    },
    {
      title: "Apply styles based on data",
      description: "Use the utility function with your data",
      code: `<div className={intelligentRiskStyles(15.5, 'future')}>
  Variance: +15.5%
</div>`,
      warning: "Always validate your data before applying styles",
    },
  ]}
/>
```

### Example 3: Reference Document

```mdx
---
title: Design Tokens Reference
type: reference
---

<DocumentTypeBanner
  type="reference"
  title="Design Tokens Reference"
  description="Complete reference for all available design tokens."
/>

## Color Tokens

<ReferenceTable
  title="BEASTMODE Gold Palette"
  columns={[
    { header: "Token", accessor: "token" },
    { header: "Value", accessor: "value" },
    { header: "Usage", accessor: "usage" },
  ]}
  data={[
    {
      token: "--color-void",
      value: "240 10% 4%",
      usage: "bg-void",
    },
    {
      token: "--color-gold",
      value: "40 45% 55%",
      usage: "bg-gold",
    },
  ]}
/>
```

### Example 4: Explanation Document

```mdx
---
title: Understanding Tailwind CSS v4 Architecture
type: explanation
---

<DocumentTypeBanner
  type="explanation"
  title="Understanding Tailwind CSS v4 Architecture"
  description="This document explains why Tailwind CSS v4 uses CSS-first configuration."
/>

<ExplanationBox type="concept" title="CSS-First Configuration">
  Tailwind CSS v4 uses CSS-first configuration because it provides better
  performance, easier customization, and better integration with design tools.
</ExplanationBox>

<ExplanationBox type="rationale" title="Why This Approach">
  The CSS-first approach allows us to define all design tokens in CSS files
  using the @theme directive, which is then processed by PostCSS. This creates a
  single source of truth for all design tokens.
</ExplanationBox>
```

---

## Synergistic Effects

### 1. Visual Consistency

- **Diátaxis** provides structure
- **Tailwind** provides consistent styling
- **Nextra** provides platform consistency
- **Result**: All documentation looks cohesive and professional

### 2. Intelligence-Driven Styling

- **Tailwind utilities** adapt to document type
- **Diátaxis components** use appropriate styling
- **Nextra** renders with proper context
- **Result**: Documentation that visually communicates its purpose

### 3. Developer Experience

- **Diátaxis** guides content structure
- **Tailwind** provides easy styling
- **Nextra** handles rendering
- **Result**: Fast, intuitive documentation authoring

### 4. User Experience

- **Diátaxis** organizes by user need
- **Tailwind** provides clear visual hierarchy
- **Nextra** provides navigation and search
- **Result**: Users find what they need quickly

---

## Best Practices

### 1. Use Document Type Badges

Always include a document type badge at the top of each document:

```mdx
<DocumentTypeBadge type="tutorial" />
```

### 2. Use Document Type Banners for Important Documents

For key documents, use a full banner:

```mdx
<DocumentTypeBanner
  type="tutorial"
  title="Your Title"
  description="Clear description of what this document teaches"
/>
```

### 3. Match Component to Document Type

- **Tutorials**: Use `<TutorialSteps>`
- **How-To**: Use `<HowToGuide>`
- **Reference**: Use `<ReferenceTable>`
- **Explanation**: Use `<ExplanationBox>`

### 4. Combine Tailwind Utilities

Use Diátaxis utilities with intelligence utilities:

```tsx
<div className="diataxis-tutorial gradient-success transition-illuminate">
  Content
</div>
```

### 5. Follow Diátaxis Language

- **Tutorials**: Use "we" (first-person plural)
- **How-To**: Use imperative ("Do X", "Now do Y")
- **Reference**: Use facts only, no explanation
- **Explanation**: Use "why" and "because"

---

## Integration Checklist

- [x] Diátaxis components created
- [x] Tailwind utilities added to design system
- [x] MDX components registered
- [x] Document structure organized
- [x] Examples created
- [x] Integration guide written

---

## Related Documentation

- [Tailwind CSS v4 Design System](../_system/DOC-0126_tailwind-v4-design-system.md)
- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Diátaxis Framework](https://diataxis.fr/)
- [Design Tokens Reference](../reference/TAILWIND_DESIGN_TOKENS.md)

---

**Status**: ✅ Production Ready **Version**: 1.0.0 **Last Updated**: 2026-01-11
**Maintained By**: Architecture Team
