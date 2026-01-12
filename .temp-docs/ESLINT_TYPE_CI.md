# Next.js ESLint Typed Linting (CI-Only) Extension Config

This is the **intentionally omitted “full protection” layer** you can add **without destabilizing** the developer loop.

**Policy:**

* **Default dev lint stays fast** (your current `eslint.config.mjs`).
* **Typed lint runs only in CI** or on-demand (`pnpm lint:typed`).
* **Next.js remains the constitution**: Next configs first; typed rules only add what Next doesn’t cover.

---

## 1) Install the CI-only dependencies (Root)

Add these to **root** `devDependencies`:

```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

Notes:

* `typescript-eslint` v8 is the modern stack for ESLint v9.
* Keep your existing: `eslint`, `@eslint/js`, `@eslint/eslintrc`, `eslint-config-next`, `eslint-config-prettier`.

---

## 2) Create a separate typed config file

Create **`eslint.typed.config.mjs`** at repo root.

✅ This file **imports your baseline** and then adds typed rules in a controlled way.

```js
import baseConfig from "./eslint.config.mjs";
import tseslint from "typescript-eslint";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // 1) Start from the stable, Next.js-first baseline
  ...baseConfig,

  // 2) Add TypeScript-ESLint typed recommendations (CI-only)
  //    These are the *typed* rule sets (more protection, slower)
  ...tseslint.configs.recommendedTypeChecked,

  // 3) Typed lint scope + safe overrides
  {
    files: [
      "apps/**/*.{ts,tsx}",
      "packages/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}"
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },

        // v8 best practice for monorepos
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      // ====== “FULL PROTECTION” (high value, low conflict) ======

      // Catch missing awaits + accidental promise leaks
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // Prevent async patterns that commonly break in Node/Next runtimes
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            // Keep React event handlers ergonomic
            attributes: false
          }
        }
      ],

      // Make TS directives disciplined
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          minimumDescriptionLength: 10
        }
      ],

      // Don’t fight Next.js / TS inference
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Avoid noisy strictness in server actions / route handlers (see overrides below)

      // Keep developer intent clean
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },

  // 4) Next.js App Router: Server Components can be async; relax a few typed rules
  {
    files: ["**/app/**/*.{ts,tsx}", "**/src/app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/require-await": "off"
    }
  },

  // 5) Route Handlers / API: pragmatic overrides
  {
    files: [
      "**/app/**/route.{ts,tsx}",
      "**/app/**/api/**/*.{ts,tsx}",
      "**/pages/api/**/*.{ts,tsx}"
    ],
    rules: {
      // Route handlers often intentionally return Promises; reduce friction
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off"
    }
  }
];
```

Why this is safe:

* Baseline config still defines Next rules, ignores, monorepo rootDir, and Prettier.
* Typed rules are applied **only** to TS/TSX under `apps/`, `packages/`, `scripts/`.
* We intentionally avoid rules that frequently conflict with Next conventions.

---

## 3) Add CI scripts (Root)

In root `package.json`:

```json
{
  "scripts": {
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint:fix",

    "lint:typed": "eslint -c eslint.typed.config.mjs . --ext .ts,.tsx --max-warnings 0",
    "lint:typed:report": "eslint -c eslint.typed.config.mjs . --ext .ts,.tsx --format json --output-file eslint-typed-report.json"
  }
}
```

**Recommendation:** run `lint` on every PR; run `lint:typed` on PRs that touch core runtime / shared packages.

---

## 4) Staged Escalation Policy (Zero-Drama Rollout)

**Objective:** Adopt typed linting without blocking delivery, then steadily raise the bar.

### Stage 0 — Baseline (Day 0)

* ✅ `pnpm lint` (fast) is required.
* ⛔ Typed lint is **not** run yet.

### Stage 1 — Advisory (Week 1)

* ✅ `pnpm lint` required.
* 🟡 `pnpm lint:typed` runs but does **not** fail the pipeline.
* Output is uploaded as an artifact so the team can fix opportunistically.

### Stage 2 — Scoped Enforcement (Week 2)

Typed lint becomes **blocking only for high-integrity code paths**:

* `packages/**`
* `apps/**/lib/**`
* `apps/**/server/**`
* `apps/**/src/**` (optional, depending on your repo layout)

Everything else remains advisory.

### Stage 3 — Full Enforcement (Week 3+)

* Typed lint becomes blocking for all TS/TSX in the repo.

### Escape Hatch Policy (Allowed, Disciplined)

* `// eslint-disable-next-line` is allowed only with a short reason.
* `@ts-expect-error` allowed only with a description (enforced by `ban-ts-comment`).
* Any new disables must be fixed or justified within 7–14 days.

---

## 5) CI usage (GitHub Actions snippets)

### 5.1 Always run fast lint

```yaml
- name: Lint (fast)
  run: pnpm lint
```

### 5.2 Stage 1: Typed lint advisory

```yaml
- name: Lint (typed, advisory)
  run: pnpm lint:typed
  continue-on-error: true

- name: Upload typed lint report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: eslint-typed-report
    path: eslint-typed-report.json
```

To generate the report, use:

```yaml
- name: Lint (typed, report)
  run: pnpm lint:typed:report
  continue-on-error: true
```

### 5.3 Stage 2: Scoped enforcement (blocking)

Use Turbo filters (or run ESLint with globs) to gate only critical paths.

**Option A: ESLint globs (simplest)**

```yaml
- name: Lint (typed, scoped)
  run: pnpm lint:typed -- packages apps/docs/lib apps/boardroom/lib
```

**Option B: Separate script for scoped lint (recommended)**
Add a script:

```json
{
  "scripts": {
    "lint:typed:scoped": "eslint -c eslint.typed.config.mjs \"packages/**/*.{ts,tsx}\" \"apps/**/lib/**/*.{ts,tsx}\" \"apps/**/server/**/*.{ts,tsx}\" --max-warnings 0"
  }
}
```

Then in CI:

```yaml
- name: Lint (typed, scoped - blocking)
  run: pnpm lint:typed:scoped
```

### 5.4 Stage 3: Typed lint full enforcement

```yaml
- name: Lint (typed, blocking)
  run: pnpm lint:typed
```

---

## 5) What NOT to do (to avoid conflict)

* ❌ Do not add `eslint-plugin-react` / `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh`.
* ❌ Do not replace `next/core-web-vitals` or `next/typescript` with third-party “style configs”.
* ❌ Do not run typed linting on every save; keep it CI-only.

---

## 6) Quick smoke tests

1. `pnpm install`
2. `pnpm lint` (baseline)
3. `pnpm lint:typed` (CI-only)
4. Intentionally add `Promise` without `await` in a TS file → expect `no-floating-promises` to fail.

---

## Optional: make typed lint even safer

If `projectService: true` ever causes friction, swap to explicit projects:

```js
parserOptions: {
  project: ["./tsconfig.json", "./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
  tsconfigRootDir: __dirname
}
```

Only do this if you need it; explicit project lists increase maintenance.
