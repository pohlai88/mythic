---
doc_type: REFERENCE
status: active
owner: documentation-governance
source_of_truth: true
created: 2026-01-10
modified: 2026-01-10
tags: [features, reference, nextra]
migrated_from: README_FEATURES.md
---

# Nextra Maximum Features - Quick Reference

**Date:** 2024-12-19 **Status:** ✅ All Features Enabled

---

## 🚀 Quick Start

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm dev

# Visit http://localhost:3000/features to see all features
```

---

## ✨ Enabled Features

### Core Features

- ✅ **Search** - Full-text search (Pagefind)
- ✅ **Analytics** - Vercel Analytics + Speed Insights
- ✅ **Math Support** - KaTeX rendering
- ✅ **Code Highlighting** - Prism Plus with 100+ languages
- ✅ **GitHub Flavored Markdown** - Tables, task lists, strikethrough
- ✅ **Auto-linked Headings** - Clickable heading anchors
- ✅ **Dark Mode** - System preference detection
- ✅ **SEO** - Meta tags, sitemap, robots.txt

### Custom Components (9 Components)

1. **Callout** - Info/Warning/Error/Success/Tip boxes
2. **Tabs** - Tabbed content sections
3. **Card** - Content cards with links
4. **Badge** - Status badges
5. **Accordion** - Expandable sections
6. **CodeBlock** - Enhanced code blocks with copy
7. **ReadingTime** - Reading time calculator
8. **SocialShare** - Social media sharing
9. **APIReference** - API documentation component

---

## 📝 Usage Examples

### Callouts

```mdx
<Callout type="info" title="Note">
  Important information here.
</Callout>
```

### Tabs

```mdx
<Tabs items={["Tab 1", "Tab 2"]}>
  <div>Content 1</div>
  <div>Content 2</div>
</Tabs>
```

### Math

```mdx
Inline: $E = mc^2$

Block:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Code Blocks

```mdx
\`\`\`javascript // Your code here \`\`\`
```

---

## 📚 Documentation

- **Features Showcase:** `/features` - See all features in action
- **Implementation Guide:** `NEXTRA_FEATURES_IMPLEMENTED.md`
- **Maximization Plan:** `NEXTRA_FEATURES_MAXIMIZATION.md`

---

**Last Updated:** 2024-12-19 **Status:** ✅ **Maximum Features Enabled**
