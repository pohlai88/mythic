# Next.js 16.1.1 ESLint Integration Plan (Next.js‑First, Zero Debugging Hell)

**Goal:** Production‑ready ESLint for a Turborepo monorepo that **respects Next.js as the framework constitution**, avoids plugin/version mismatch traps, and minimizes “typed linting” performance + configuration pain.

**Monorepo:** `apps/docs`, `apps/boardroom` (App Router)

---

## Executive Rules (Non‑Negotiable)

1) **Next.js is the constitution**
   - We extend **only** `next/core-web-vitals` and `next/typescript` as the base.

2) **Do not install React plugins manually**
   - **Never** add `eslint-plugin-react`, `eslint-plugin-react-hooks`, or `eslint-plugin-react-refresh` to devDependencies.
   - Reason: `eslint-config-next` already includes and pins compatible versions; manual installs are the #1 source of “plugin not found / wrong version” failures.

3) **Avoid type‑aware linting across the whole repo by default**
   - Type‑aware rules are where monorepos go to die (slow, tsconfig drift, false negatives).
   - We start with **fast, non‑type‑aware** linting. Then **opt‑in** typed linting only in CI or for specific folders.

4) **Single source of truth config**
   - One root `eslint.config.mjs` covers the entire repo.
   - No shareable config package unless/until the config stabilizes (shareable packages add tooling + dependency surface).

---

## Phase 1 — Dependencies (Root)

### 1.1 Install only what you need

**Root `package.json` → devDependencies:**

```json
{
  "devDependencies": {
    "eslint": "^9.26.0",
    "@eslint/js": "^9.0.0",
    "@eslint/eslintrc": "^3.2.0",
    "eslint-config-next": "^16.1.1",
    "eslint-config-prettier": "^9.1.0"
  }
}
```

**Optional (only if you truly want these):**
- `eslint-plugin-import` (import order hygiene)
- `eslint-plugin-jsx-a11y` (extra a11y beyond Next’s defaults)

**DO NOT INSTALL:**
- ❌ `eslint-plugin-react`
- ❌ `eslint-plugin-react-hooks`
- ❌ `eslint-plugin-react-refresh`

> Why so minimal?
> Next.js already ships the React+Hooks rulesets through `eslint-config-next`, and Next Fast Refresh doesn’t need the Vite plugin.

---

## Phase 2 — Root ESLint Config (Flat Config, Next.js‑First)

### 2.1 Create `eslint.config.mjs` at repo root

This config is designed to be:
- **Fast** (no project tsconfig scanning)
- **Monorepo‑safe** (explicit Next rootDir)
- **App Router‑safe** (avoid the known pages‑router rule trap)
- **Prettier‑safe** (prettier last)

```js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

// Optional plugins (uncomment only if installed)
// import importPlugin from "eslint-plugin-import";
// import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  // 0) Ignore generated/large dirs early
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/coverage/**",
      "**/*.tsbuildinfo",
      "**/.eslintcache",
      "**/eslint-report.*"
    ]
  },

  // 1) Base JS sanity
  js.configs.recommended,

  // 2) NEXT.JS CONSTITUTION (must come before everything else)
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),

  // 3) Your repo policy layer (minimal overrides)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    // Optional plugins (only if installed)
    // plugins: {
    //   import: importPlugin,
    //   "jsx-a11y": jsxA11y
    // },

    settings: {
      // CRITICAL: Tell Next ESLint where the apps live (monorepo)
      "@next/next": {
        rootDir: ["apps/docs", "apps/boardroom"]
      }
    },

    rules: {
      // App Router: disable pages-router assumption rule
      "@next/next/no-html-link-for-pages": "off",

      // Keep console usable
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // Basic hygiene
      "prefer-const": "warn",
      "no-var": "error"

      // Optional import ordering (only if eslint-plugin-import is installed)
      // "import/order": [
      //   "warn",
      //   {
      //     "groups": ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
      //     "newlines-between": "always",
      //     "alphabetize": { "order": "asc", "caseInsensitive": true },
      //     "pathGroups": [
      //       { "pattern": "react", "group": "external", "position": "before" },
      //       { "pattern": "next/**", "group": "external", "position": "before" },
      //       { "pattern": "@mythic/**", "group": "internal", "position": "before" }
      //     ],
      //     "pathGroupsExcludedImportTypes": ["react", "next"]
      //   }
      // ],

      // Optional a11y extras (only if eslint-plugin-jsx-a11y is installed)
      // "jsx-a11y/alt-text": "warn",
      // "jsx-a11y/anchor-is-valid": [
      //   "error",
      //   {
      //     "components": ["Link"],
      //     "specialLink": ["hrefLeft", "hrefRight"],
      //     "aspects": ["invalidHref", "preferButton"]
      //   }
      // ]
    }
  },

  // 4) Pages router only: if you have pages/ somewhere, enable the rule there
  {
    files: ["**/pages/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "error"
    }
  },

  // 5) Tests: reduce noise
  {
    files: [
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "**/__tests__/**"
    ],
    rules: {
      "no-console": "off"
    }
  },

  // 6) Config/scripts: allow console
  {
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/next.config.*",
      "scripts/**/*.{js,ts,mjs}"
    ],
    rules: {
      "no-console": "off"
    }
  },

  // 7) Prettier last (disables formatting rules)
  prettier
];
```

### 2.2 Why this avoids debugging hell

- No manual React plugin installs → no version mismatch.
- No `typescript-eslint` typed configs by default → no tsconfig rootDir / project scanning issues.
- Next.js configs are first → framework authority wins.
- App Router rule trap handled explicitly.

---

## Phase 3 — Scripts (Root + Apps)

### 3.1 Root `package.json` scripts

```json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix"
  }
}
```

### 3.2 App scripts (each Next app)

`apps/docs/package.json` and `apps/boardroom/package.json`:

```json
{
  "scripts": {
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix --max-warnings 0"
  }
}
```

**Why `next lint` here?**
- It is the most “Next.js‑native” path and ensures plugin resolution behaves as Next expects.
- It respects your root `eslint.config.mjs`.

---

## Phase 4 — Turborepo

### 4.1 `turbo.json` lint tasks

```json
{
  "tasks": {
    "lint": {
      "outputs": [".eslintcache", "**/.eslintcache"],
      "cache": true,
      "inputs": [
        "**/*.{ts,tsx,js,jsx}",
        "eslint.config.*",
        "package.json",
        "pnpm-lock.yaml"
      ]
    },
    "lint:fix": {
      "outputs": [],
      "cache": false
    }
  }
}
```

---

## Phase 5 — VS Code (Flat Config)

`.vscode/settings.json`:

```json
{
  "eslint.enable": true,
  "eslint.useFlatConfig": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.workingDirectories": [{ "pattern": "apps/*" }, { "pattern": "packages/*" }],

  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

`.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

---

## Phase 6 — Cursor MCP (ESLint MCP)

Create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "eslint": {
      "command": "npx",
      "args": ["@eslint/mcp@latest", "--stdio"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

---

## Phase 7 — Pre-commit (Optional, Keep Simple)

If you already have Husky/lint-staged, add ESLint carefully.

`.lintstagedrc.json`:

```json
{
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix --max-warnings 0",
    "prettier --write"
  ],
  "*.{md,mdx,mdc}": ["markdownlint-cli2 --fix"],
  "*.{json,jsonc,css,scss}": ["prettier --write"]
}
```

---

## Typed Linting (Deliberately Deferred)

Typed linting is useful, but it is where speed and stability degrade.

**Policy:**
- Start **without** type-aware rules.
- After the baseline is stable, add an **opt‑in CI script** for typed linting only.

### Optional future (CI only)
Add `typescript-eslint` and enable typed configs in a separate config file or via an env flag. Do not mix into the default developer loop.

---

## Validation Checklist (Do This in Order)

1) Install deps: `pnpm install`
2) From each app:
   - `pnpm -C apps/docs lint`
   - `pnpm -C apps/boardroom lint`
3) From root:
   - `pnpm lint`
4) Confirm monorepo Next rules apply by intentionally adding a violation (e.g., `<img>` usage) and seeing `@next/next/no-img-element` fire.
5) Restart VS Code and confirm diagnostics appear.
6) Restart Cursor and run MCP test prompts:
   - “Lint `apps/docs/app/layout.tsx`”

---

## What We Intentionally Do NOT Do (to prevent debugging hell)

- ❌ Shareable config package on day 1
- ❌ Manual React plugin installs
- ❌ Repo-wide type-aware linting in developer loop
- ❌ Over-customizing rules that Next already governs

---

## Files to Create/Modify

**Create:**
- `eslint.config.mjs`
- `.cursor/mcp.json`

**Modify:**
- `package.json` (root scripts + deps)
- `apps/docs/package.json` (lint scripts)
- `apps/boardroom/package.json` (lint scripts)
- `turbo.json`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.lintstagedrc.json` (optional)
- `.gitignore` (add `.eslintcache`, `eslint-report.*`)

---

## When to Introduce Advanced Features (Later)

Only after you have **2 weeks of stable linting**:
- Shareable config package (`@mythic/eslint-config`)
- Import order plugin (`eslint-plugin-import`)
- Extra a11y plugin (`eslint-plugin-jsx-a11y`)
- Typed linting in CI
- Custom formatters + report uploads

