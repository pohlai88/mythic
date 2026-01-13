# ESLint Quick Start Guide

**Quick reference for ESLint integration in your monorepo**

---

## 🚀 Three Integration Methods

### 1. ESLint CLI (Standard)

**Best for**: CI/CD, scripts, pre-commit hooks

```bash
# Install
pnpm add -D eslint@^9.26.0 @eslint/js typescript-eslint eslint-config-next

# Create config: eslint.config.mjs (see full guide)
# Run
pnpm lint
```

### 2. ESLint Scaffold (Initialization)

**Best for**: First-time setup, migration

```bash
# Interactive setup
npx eslint --init

# Or use the config template from full guide
```

### 3. ESLint MCP (AI Integration) ⭐ NEW

**Best for**: AI-assisted development in Cursor

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "eslint": {
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest", "--stdio"]
    }
  }
}
```

**Then in Cursor Chat**:

```
"Lint src/components/Button.tsx"
"Fix all ESLint errors in this file"
```

---

## 📋 Recommended Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
pnpm add -D -w \
  eslint@^9.26.0 \
  @eslint/js@^9.0.0 \
  typescript-eslint@^8.0.0 \
  eslint-config-next@^16.1.1 \
  eslint-plugin-react@^7.37.0 \
  eslint-plugin-react-hooks@^5.0.0 \
  eslint-plugin-import@^2.31.0 \
  eslint-config-prettier@^9.1.0
```

### Step 2: Create Config

Create `eslint.config.mjs` in project root (see full guide for complete config).

### Step 3: Update Scripts

```json
// package.json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix"
  }
}
```

### Step 4: (Optional) Setup MCP

Add to `.cursor/mcp.json` (see MCP section above).

---

## 🎯 Which Method Should I Use?

| Scenario                  | Method                             |
| ------------------------- | ---------------------------------- |
| Setting up for first time | **Scaffold** (`npx eslint --init`) |
| CI/CD pipelines           | **CLI**                            |
| Pre-commit hooks          | **CLI**                            |
| AI-assisted development   | **MCP**                            |
| Custom tooling            | **Node.js API**                    |

**Recommendation**: Use **CLI** for standard workflows, add **MCP** for AI
assistance.

---

## 📚 Full Documentation

See `docs/guides/ESLINT_INTEGRATION_BEST_PRACTICES.md` for:

- Complete configuration examples
- Monorepo best practices
- Migration from Biome
- Performance optimization
- Troubleshooting

---

**Quick Links**:

- [Full Guide](./ESLINT_INTEGRATION_BEST_PRACTICES.md)
- [ESLint Docs](https://eslint.org/docs/latest/)
- [ESLint MCP](https://eslint.org/docs/latest/use/mcp)
