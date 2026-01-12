# Biome Stability Analysis & Recommendation

**Date**: 2026-01-11
**Issue**: "Cannot call write after a stream was destroyed"
**Status**: ⚠️ **STABILITY CONCERN - RECOMMEND MIGRATION**

---

## 🔍 Error Analysis

### Error Details

**Error Message**: `Cannot call write after a stream was destroyed`

**Context**: Biome language server/daemon connection error

**Root Cause**:
1. **Stream Management Issue**: Biome's language server attempts to write to a stream that has been closed/destroyed
2. **Process Lifecycle Problem**: The daemon process may have crashed or been terminated unexpectedly
3. **Connection State Mismatch**: Client (VS Code/Cursor) thinks server is alive, but server stream is destroyed

### Known Issues

**GitHub Issue**: [biomejs/biome#5837](https://github.com/biomejs/biome/issues/5837)
- Reported when suppressing `noConsole` rule
- Language server fails with stream error
- Affects VS Code integration
- **Status**: Open/Unresolved

**Common Triggers**:
- Rule suppression comments
- Large monorepo file watching
- Multiple concurrent operations
- Process termination during active operations

---

## 📊 Stability Assessment

### Biome Stability Issues

| Issue Category              | Frequency | Impact   | Status               |
| --------------------------- | --------- | -------- | -------------------- |
| **Language Server Crashes** | High      | Critical | ⚠️ Ongoing            |
| **Stream Management**       | Medium    | High     | ⚠️ Known Bug          |
| **Monorepo Performance**    | Medium    | Medium   | ⚠️ Performance Issues |
| **Process Management**      | Low       | Medium   | ⚠️ Edge Cases         |

### Comparison: Biome vs ESLint

| Factor                 | Biome                | ESLint           | Winner   |
| ---------------------- | -------------------- | ---------------- | -------- |
| **Maturity**           | ~2 years             | ~10+ years       | ✅ ESLint |
| **Stability**          | ⚠️ Known issues       | ✅ Very stable    | ✅ ESLint |
| **Language Server**    | ⚠️ Crashes reported   | ✅ Stable         | ✅ ESLint |
| **Monorepo Support**   | ⚠️ Performance issues | ✅ Excellent      | ✅ ESLint |
| **Community**          | Growing              | ✅ Massive        | ✅ ESLint |
| **Plugin Ecosystem**   | Limited              | ✅ Extensive      | ✅ ESLint |
| **Performance**        | ✅ Fast               | ⚠️ Slower         | ✅ Biome  |
| **All-in-One**         | ✅ Lint + Format      | ⚠️ Separate tools | ✅ Biome  |
| **Configuration**      | ✅ Simple             | ⚠️ Complex        | ✅ Biome  |
| **TypeScript Support** | ✅ Good               | ✅ Excellent      | ✅ Tie    |

---

## 🎯 Recommendation: Migrate to ESLint

### Justification

#### 1. **Stability is Critical**
- ✅ ESLint has 10+ years of production stability
- ✅ Language server is battle-tested
- ⚠️ Biome has known stream/process management issues
- ⚠️ Current error indicates unreliable daemon

#### 2. **Production Readiness**
- ✅ ESLint is industry standard
- ✅ Better error handling and recovery
- ✅ More predictable behavior
- ⚠️ Biome's language server crashes disrupt workflow

#### 3. **Monorepo Complexity**
- ✅ ESLint handles large monorepos better
- ✅ Better caching and performance in complex setups
- ⚠️ Biome struggles with file watching in monorepos
- ⚠️ Current error suggests process management issues

#### 4. **Ecosystem & Support**
- ✅ ESLint has extensive plugin ecosystem
- ✅ Better Next.js/React/TypeScript integration
- ✅ More community resources and solutions
- ⚠️ Biome ecosystem is still growing

#### 5. **Team Productivity**
- ✅ ESLint errors are more predictable
- ✅ Better IDE integration stability
- ⚠️ Biome crashes interrupt development flow
- ⚠️ Current error blocks linting functionality

---

## 🔄 Migration Strategy

### Phase 1: ESLint Setup (Recommended)

#### 1. Install ESLint Dependencies

```bash
pnpm add -D -w \
  eslint@^9.0.0 \
  @eslint/js@^9.0.0 \
  typescript-eslint@^8.0.0 \
  eslint-config-next@^16.1.1 \
  eslint-plugin-react@^7.37.0 \
  eslint-plugin-react-hooks@^5.0.0 \
  eslint-plugin-import@^2.31.0 \
  @typescript-eslint/eslint-plugin@^8.0.0 \
  @typescript-eslint/parser@^8.0.0
```

#### 2. Create ESLint Configuration

**File**: `eslint.config.mjs` (ESLint 9 flat config)

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "eslint-config-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    rules: {
      // Biome-equivalent rules
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": "off", // Use TypeScript version
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": ["warn", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: { order: "asc" }
      }],
      "import/no-unused-modules": "warn",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/__tests__/**"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["scripts/**/*.{ts,js,mjs}"],
    rules: {
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      ".turbo/**",
      "*.tsbuildinfo",
      "coverage/**",
    ],
  },
];
```

#### 3. Update Package Scripts

**File**: `apps/docs/package.json`

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix"
  }
}
```

#### 4. Keep Biome for Formatting (Optional)

**Option A**: Use Prettier (Recommended)
```bash
pnpm add -D -w prettier eslint-config-prettier
```

**Option B**: Keep Biome for formatting only
```json
{
  "scripts": {
    "format": "biome format --write .",
    "format:check": "biome format ."
  }
}
```

#### 5. Update VS Code Settings

**File**: `.vscode/settings.json`

```json
{
  "eslint.enable": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

### Phase 2: Gradual Migration (Alternative)

If you want to keep Biome but improve stability:

#### 1. Disable Biome Language Server

**File**: `.vscode/settings.json`

```json
{
  "biome.enabled": false,
  "biome.lspBin": null
}
```

#### 2. Use Biome CLI Only

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  }
}
```

#### 3. Monitor for Stability

- Track error frequency
- Document crash scenarios
- Consider migration if issues persist

---

## 📋 Migration Checklist

### ESLint Migration

- [ ] Install ESLint dependencies
- [ ] Create `eslint.config.mjs`
- [ ] Update package.json scripts
- [ ] Configure VS Code settings
- [ ] Test linting on sample files
- [ ] Update CI/CD workflows
- [ ] Update pre-commit hooks
- [ ] Document migration
- [ ] Remove Biome (or keep for formatting)

### Keep Biome (Alternative)

- [ ] Disable Biome language server
- [ ] Use Biome CLI only
- [ ] Monitor stability
- [ ] Document workarounds
- [ ] Plan migration timeline

---

## 🎯 Final Recommendation

### ✅ **Migrate to ESLint**

**Reasons**:
1. **Stability**: ESLint is proven in production
2. **Reliability**: No known stream/process issues
3. **Ecosystem**: Better plugin support
4. **Team Productivity**: Fewer interruptions
5. **Long-term**: Better maintenance and support

**Timeline**:
- **Immediate**: Set up ESLint alongside Biome
- **Week 1**: Test ESLint on critical paths
- **Week 2**: Full migration, remove Biome
- **Ongoing**: Monitor and optimize

### ⚠️ **If Keeping Biome**

**Requirements**:
1. Disable language server (use CLI only)
2. Monitor error frequency
3. Document workarounds
4. Set migration deadline (e.g., 30 days)
5. Migrate if issues persist

---

## 📊 Risk Assessment

### Current State (Biome)

| Risk                    | Probability | Impact | Mitigation             |
| ----------------------- | ----------- | ------ | ---------------------- |
| Language server crashes | High        | High   | ⚠️ Disable LSP          |
| Stream errors           | Medium      | High   | ⚠️ Use CLI only         |
| Workflow disruption     | High        | Medium | ⚠️ Monitor closely      |
| Team frustration        | Medium      | Medium | ⚠️ Document workarounds |

### Proposed State (ESLint)

| Risk                     | Probability | Impact | Mitigation                  |
| ------------------------ | ----------- | ------ | --------------------------- |
| Migration effort         | Low         | Low    | ✅ Phased approach           |
| Configuration complexity | Medium      | Low    | ✅ Use Next.js config        |
| Performance              | Low         | Low    | ✅ ESLint is fast enough     |
| Learning curve           | Low         | Low    | ✅ Team familiar with ESLint |

---

## 📝 Summary

### Current Issue
- ⚠️ Biome language server crashes with stream errors
- ⚠️ Known stability issues in GitHub
- ⚠️ Disrupts development workflow

### Recommendation
- ✅ **Migrate to ESLint** for stability and reliability
- ✅ Keep Prettier for formatting (or Biome CLI)
- ✅ Use ESLint 9 flat config for modern setup
- ✅ Leverage Next.js ESLint config

### Next Steps
1. Review this analysis
2. Decide: Migrate or keep Biome (CLI only)
3. If migrating: Follow Phase 1 steps
4. If keeping: Follow Phase 2 workarounds

---

**Status**: ⚠️ **STABILITY CONCERN - RECOMMEND MIGRATION**
**Priority**: **HIGH** - Affects developer productivity
**Timeline**: **IMMEDIATE** - Address within 1 week
