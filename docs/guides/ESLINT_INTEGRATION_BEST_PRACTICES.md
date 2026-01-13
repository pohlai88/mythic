# ESLint Integration Best Practices Guide

**Version**: 1.0.0 **Last Updated**: 2026-01-12 **Status**: ✅ **Production
Ready**

---

## Overview

This guide covers all ESLint integration methods available for your Turborepo
monorepo, including:

1. **ESLint CLI** - Standard command-line integration
2. **ESLint Scaffold** - Automated configuration setup
3. **ESLint MCP** - Model Context Protocol integration (NEW in v9.26.0+)
4. **Best Practices** - Monorepo-specific optimizations

---

## Table of Contents

1. [Integration Methods](#integration-methods)
2. [ESLint CLI Setup](#eslint-cli-setup)
3. [ESLint Scaffold/Initialization](#eslint-scaffoldinitialization)
4. [ESLint MCP Integration](#eslint-mcp-integration)
5. [Monorepo Best Practices](#monorepo-best-practices)
6. [Migration from Biome](#migration-from-biome)
7. [Performance Optimization](#performance-optimization)

---

## Integration Methods

### Method Comparison

| Method          | Use Case                   | Complexity | Performance | AI Integration |
| --------------- | -------------------------- | ---------- | ----------- | -------------- |
| **CLI**         | CI/CD, scripts, pre-commit | Low        | High        | ❌             |
| **Scaffold**    | Initial setup, migration   | Low        | N/A         | ❌             |
| **MCP**         | AI-assisted development    | Medium     | Medium      | ✅             |
| **Node.js API** | Custom tooling, plugins    | High       | High        | ❌             |

**Recommendation**: Use **CLI** for standard workflows, **MCP** for AI-assisted
development.

---

## ESLint CLI Setup

### 1. Installation

```bash
# Install ESLint and required plugins
pnpm add -D -w \
  eslint@^9.26.0 \
  @eslint/js@^9.0.0 \
  typescript-eslint@^8.0.0 \
  eslint-config-next@^16.1.1 \
  eslint-plugin-react@^7.37.0 \
  eslint-plugin-react-hooks@^5.0.0 \
  eslint-plugin-import@^2.31.0 \
  @typescript-eslint/eslint-plugin@^8.0.0 \
  @typescript-eslint/parser@^8.0.0 \
  eslint-config-prettier@^9.1.0
```

### 2. Create ESLint Configuration

**File**: `eslint.config.mjs` (ESLint 9 flat config format)

```javascript
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import typescriptEslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import importPlugin from "eslint-plugin-import"
import prettierConfig from "eslint-config-prettier"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  // Base recommended rules
  js.configs.recommended,

  // Next.js configurations (via compat layer)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // TypeScript ESLint
  ...typescriptEslint.configs.recommended,

  // Main configuration
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: [
          "./tsconfig.json",
          "./apps/*/tsconfig.json",
          "./packages/*/tsconfig.json",
        ],
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: [
            "./tsconfig.json",
            "./apps/*/tsconfig.json",
            "./packages/*/tsconfig.json",
          ],
        },
      },
    },
    rules: {
      // Biome-equivalent rules
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // Use TypeScript version
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
      "react/prop-types": "off", // Using TypeScript
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-unused-modules": "warn",
    },
  },

  // Test files overrides
  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/__tests__/**",
      "**/__mocks__/**",
    ],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },

  // Script files overrides
  {
    files: ["scripts/**/*.{ts,js,mjs}", "**/*.config.{ts,js,mjs}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      ".turbo/**",
      "*.tsbuildinfo",
      "coverage/**",
      ".vercel/**",
      "public/sw.js",
      "public/workbox-*.js",
    ],
  },

  // Prettier integration (must be last)
  prettierConfig,
]
```

### 3. Update Package Scripts

**Root `package.json`**:

```json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",
    "lint:changed": "turbo run lint --filter=[HEAD^1]",
    "lint:staged": "turbo run lint:staged"
  }
}
```

**App-level `package.json`** (e.g., `apps/docs/package.json`):

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "lint:staged": "eslint --fix"
  }
}
```

### 4. CLI Usage Examples

```bash
# Lint all files
pnpm lint

# Lint and auto-fix
pnpm lint:fix

# Lint only changed files
pnpm lint:changed

# Lint specific app
cd apps/docs && pnpm lint

# Lint with specific formatter
eslint . --format=stylish
eslint . --format=json --output-file=eslint-report.json

# Lint specific file
eslint src/components/Button.tsx

# Lint with cache (faster)
eslint . --cache --cache-location=.eslintcache
```

---

## ESLint Scaffold/Initialization

### Method 1: Interactive Scaffold (Recommended)

```bash
# Initialize ESLint interactively
npx eslint --init

# Follow prompts:
# - How would you like to use ESLint? → To check syntax, find problems, and enforce code style
# - What type of modules? → JavaScript modules (import/export)
# - Which framework? → React
# - Does your project use TypeScript? → Yes
# - Where does your code run? → Browser, Node
# - How would you like to define a style? → Use a popular style guide
# - Which style guide? → Airbnb / Standard / Google
# - What format? → JavaScript
```

### Method 2: Programmatic Scaffold

Create a setup script: `scripts/setup-eslint.ts`

```typescript
import { execSync } from "child_process"
import { writeFileSync } from "fs"
import { join } from "path"

const config = `import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...typescriptEslint.configs.recommended,
];
`

writeFileSync(join(process.cwd(), "eslint.config.mjs"), config)

console.log("✅ ESLint configuration created!")
console.log(
  "Run: pnpm add -D eslint @eslint/js typescript-eslint eslint-config-next"
)
```

### Method 3: Copy from Template

```bash
# Use existing config as template
cp eslint.config.mjs apps/docs/eslint.config.mjs

# Customize for specific app
```

---

## ESLint MCP Integration

### Overview

ESLint MCP (Model Context Protocol) enables AI assistants (like Cursor, Claude
Desktop) to interact with ESLint directly, providing:

- **Real-time linting** in AI conversations
- **Code analysis** on-demand
- **Fix suggestions** with context
- **Rule explanations** and documentation

**Available since**: ESLint v9.26.0 (May 2025)

### Setup

#### Step 1: Install ESLint MCP Package

```bash
# The MCP server is included in ESLint v9.26.0+
# No additional package needed if using latest ESLint
pnpm add -D eslint@^9.26.0
```

#### Step 2: Configure MCP Server in Cursor

**Option A: Via Cursor Settings UI**

1. Open Cursor Settings
2. Navigate to **MCP Servers** or **Extensions**
3. Add new MCP server:
   - **Name**: `eslint`
   - **Command**: `npx`
   - **Args**: `["-y", "@eslint/mcp@latest", "--stdio"]`
   - **Working Directory**: Project root

**Option B: Via Configuration File**

Create or edit `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "eslint": {
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest", "--stdio"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

**Option C: Standalone MCP Server**

```bash
# Install globally or locally
pnpm add -D @eslint/mcp

# Run MCP server
npx @eslint/mcp --stdio
```

#### Step 3: Verify MCP Integration

**In Cursor Chat**, test with:

```
Check this code for linting errors:
[your code here]
```

Or:

```
Run ESLint on src/components/Button.tsx
```

### MCP Capabilities

The ESLint MCP server provides these tools:

1. **`lint_file`** - Lint a specific file
2. **`lint_code`** - Lint code snippet
3. **`fix_file`** - Auto-fix a file
4. **`get_rules`** - List available rules
5. **`explain_rule`** - Get rule documentation
6. **`get_config`** - View current ESLint config

### Usage Examples

**In Cursor Chat**:

```
# Lint a file
"Lint the file src/components/Button.tsx and show me the errors"

# Fix issues
"Fix all ESLint errors in src/components/Button.tsx"

# Explain a rule
"What does the @typescript-eslint/no-explicit-any rule do?"

# Check code snippet
"Check this code for linting issues:
const x = 1;
console.log(x);
"
```

### MCP vs CLI Comparison

| Feature                | CLI          | MCP                     |
| ---------------------- | ------------ | ----------------------- |
| **Batch processing**   | ✅ Excellent | ⚠️ File-by-file         |
| **CI/CD integration**  | ✅ Native    | ❌ Not suitable         |
| **AI integration**     | ❌ No        | ✅ Native               |
| **Interactive fixes**  | ⚠️ Limited   | ✅ Context-aware        |
| **Real-time feedback** | ❌ No        | ✅ Yes                  |
| **Performance**        | ✅ Fast      | ⚠️ Slower (per-request) |

**Best Practice**: Use **CLI** for scripts/CI, **MCP** for AI-assisted
development.

---

## Monorepo Best Practices

### 1. Shared Configuration

**Structure**:

```
.
├── eslint.config.mjs          # Root config (base)
├── apps/
│   ├── docs/
│   │   └── eslint.config.mjs # App-specific overrides
│   └── boardroom/
│       └── eslint.config.mjs
└── packages/
    └── shared-utils/
        └── eslint.config.mjs
```

**Root `eslint.config.mjs`**:

```javascript
import js from "@eslint/js"
import typescriptEslint from "typescript-eslint"

export default [
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Shared rules for all packages
    },
  },
]
```

**App-specific `apps/docs/eslint.config.mjs`**:

```javascript
import baseConfig from "../../eslint.config.mjs"
import nextConfig from "eslint-config-next"

export default [
  ...baseConfig,
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Docs-specific overrides
      "no-console": "off", // Allow console in docs
    },
  },
]
```

### 2. Turborepo Integration

**Update `turbo.json`**:

```json
{
  "tasks": {
    "lint": {
      "dependsOn": [],
      "outputs": [".eslintcache"],
      "cache": true,
      "inputs": ["**/*.{ts,tsx,js,jsx}", "eslint.config.*", ".eslintignore"]
    },
    "lint:fix": {
      "dependsOn": [],
      "outputs": [],
      "cache": false
    }
  }
}
```

### 3. Caching Strategy

```bash
# Enable ESLint cache
eslint . --cache --cache-location=.eslintcache

# Clear cache
rm -rf .eslintcache apps/*/.eslintcache packages/*/.eslintcache
```

**Add to `.gitignore`**:

```
.eslintcache
**/.eslintcache
```

### 4. Pre-commit Hooks

**`.husky/pre-commit`**:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Lint staged files
pnpm lint:staged
```

**`.lintstagedrc.json`**:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix --max-warnings 0", "prettier --write"]
}
```

### 5. CI/CD Integration

**.github/workflows/lint.yml**:

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm lint

      # Optional: Upload ESLint report
      - name: Upload ESLint report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: eslint-report
          path: eslint-report.json
```

---

## Migration from Biome

### Phase 1: Parallel Setup (Week 1)

1. **Install ESLint alongside Biome**

   ```bash
   pnpm add -D eslint@^9.26.0 @eslint/js typescript-eslint eslint-config-next
   ```

2. **Create ESLint config** (see [ESLint CLI Setup](#eslint-cli-setup))

3. **Test on sample files**

   ```bash
   eslint apps/docs/src/components --ext .tsx
   ```

4. **Compare outputs**
   ```bash
   biome check apps/docs/src/components > biome-report.txt
   eslint apps/docs/src/components --ext .tsx > eslint-report.txt
   ```

### Phase 2: Gradual Migration (Week 2-3)

1. **Update scripts to use ESLint**

   ```json
   {
     "scripts": {
       "lint": "eslint . --ext .ts,.tsx",
       "lint:biome": "biome check ."
     }
   }
   ```

2. **Migrate app by app**
   - Start with `apps/docs`
   - Then `apps/boardroom`
   - Finally `packages/*`

3. **Keep Biome for formatting** (optional)
   ```json
   {
     "scripts": {
       "format": "biome format --write .",
       "lint": "eslint . --ext .ts,.tsx"
     }
   }
   ```

### Phase 3: Complete Migration (Week 4)

1. **Remove Biome linting**

   ```bash
   pnpm remove @biomejs/biome
   ```

2. **Update `biome.json`** (if keeping for formatting)

   ```json
   {
     "linter": { "enabled": false },
     "formatter": { "enabled": true }
   }
   ```

3. **Update `turbo.json`**
   ```json
   {
     "globalDependencies": [
       "eslint.config.mjs" // Replace biome.json
     ]
   }
   ```

### Migration Checklist

- [ ] Install ESLint dependencies
- [ ] Create `eslint.config.mjs`
- [ ] Test on sample files
- [ ] Update package scripts
- [ ] Configure VS Code settings
- [ ] Update pre-commit hooks
- [ ] Update CI/CD workflows
- [ ] Migrate app-by-app
- [ ] Remove Biome (or keep for formatting)
- [ ] Update documentation

---

## Performance Optimization

### 1. Caching

```javascript
// eslint.config.mjs
export default [
  // ... config
  {
    // Enable caching
    cache: true,
    cacheLocation: ".eslintcache",
  },
]
```

### 2. Parallel Execution

```bash
# Use Turbo for parallel linting
pnpm turbo run lint --parallel

# Or use ESLint's built-in parallelization
eslint . --max-warnings 0 --cache --cache-location=.eslintcache
```

### 3. Selective Linting

```bash
# Lint only changed files
pnpm lint:changed

# Lint specific app
pnpm turbo run lint --filter=@mythic/docs

# Lint with file patterns
eslint "apps/**/*.{ts,tsx}" --ignore-pattern "**/*.test.ts"
```

### 4. Type-Aware Rules (Performance Trade-off)

```javascript
// Fast (no type checking)
{
  parserOptions: {
    project: false, // Disable type-aware rules
  },
}

// Slower (type checking enabled)
{
  parserOptions: {
    project: ["./tsconfig.json"], // Enable type-aware rules
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/await-thenable": "error",
  },
}
```

**Recommendation**: Use type-aware rules only in CI, disable in development for
speed.

### 5. Ignore Patterns

```javascript
// eslint.config.mjs
{
  ignores: [
    "node_modules/**",
    ".next/**",
    "dist/**",
    "build/**",
    ".turbo/**",
    "coverage/**",
    "*.min.js",
    "*.min.css",
  ],
}
```

---

## VS Code Integration

### Settings

**.vscode/settings.json**:

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.workingDirectories": [
    { "pattern": "apps/*" },
    { "pattern": "packages/*" }
  ]
}
```

### Extensions

**Required**:

- `dbaeumer.vscode-eslint` - ESLint extension

**Recommended**:

- `esbenp.prettier-vscode` - Prettier (if using)
- `bradlc.vscode-tailwindcss` - Tailwind IntelliSense

---

## Troubleshooting

### Issue: "Cannot find module '@eslint/js'"

**Solution**:

```bash
pnpm add -D @eslint/js
```

### Issue: "Parsing error: Unexpected token"

**Solution**: Ensure TypeScript parser is configured:

```javascript
import typescriptEslint from "typescript-eslint"

export default [...typescriptEslint.configs.recommended]
```

### Issue: "ESLint cache is stale"

**Solution**:

```bash
rm -rf .eslintcache
eslint . --cache
```

### Issue: "MCP server not connecting"

**Solution**:

1. Verify ESLint version: `pnpm list eslint` (must be v9.26.0+)
2. Check MCP config in `.cursor/mcp.json`
3. Restart Cursor
4. Check MCP server status in Cursor

### Issue: "Performance is slow"

**Solutions**:

1. Enable caching: `eslint . --cache`
2. Disable type-aware rules in development
3. Use `--max-warnings 0` to fail fast
4. Lint only changed files: `pnpm lint:changed`

---

## Quick Reference

### Installation

```bash
pnpm add -D eslint@^9.26.0 @eslint/js typescript-eslint eslint-config-next
```

### Basic Commands

```bash
# Lint
pnpm lint

# Fix
pnpm lint:fix

# Changed files only
pnpm lint:changed
```

### MCP Setup

```json
{
  "mcpServers": {
    "eslint": {
      "command": "npx",
      "args": ["-y", "@eslint/mcp@latest", "--stdio"]
    }
  }
}
```

---

## Resources

- **ESLint Docs**: https://eslint.org/docs/latest/
- **ESLint MCP**: https://eslint.org/docs/latest/use/mcp
- **TypeScript ESLint**: https://typescript-eslint.io/
- **Next.js ESLint**:
  https://nextjs.org/docs/app/building-your-application/configuring/eslint
- **Turborepo**: https://turbo.build/repo/docs

---

**Status**: ✅ Production Ready **Last Updated**: 2026-01-12 **Maintainer**:
Mythic Team
