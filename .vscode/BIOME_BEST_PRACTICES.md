# Biome Best Practices - Workspace Configuration

**Last Updated:** 2026-01-10  
**Biome Version:** 1.9.4

---

## ✅ Current Configuration Status

### Configuration Files
- ✅ **`biome.json`** - Optimized with best practices
- ✅ **`package.json`** - Scripts configured for all use cases
- ✅ **`.vscode/settings.json`** - Editor integration complete
- ✅ **`.github/workflows/`** - CI/CD integration ready

---

## 🎯 Best Practices Implemented

### 1. **Comprehensive File Type Support**

Biome now supports:
- ✅ JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- ✅ JSON/JSONC (`.json`, `.jsonc`)
- ✅ CSS (`.css`) - **NEW**

### 2. **Optimized Scripts**

#### Development Scripts
```bash
pnpm lint          # Check for linting issues
pnpm lint:fix      # Auto-fix linting issues
pnpm format        # Format all files
pnpm format:check  # Check formatting without changes
pnpm check         # Format + lint + organize imports
pnpm check:fix     # Auto-fix all issues
```

#### CI/CD Scripts
```bash
pnpm check:ci      # Optimized for CI (faster, no auto-fix)
```

#### Pre-commit Hook
```bash
pnpm pre-commit    # Run on staged files only (fast)
```

### 3. **Smart File Overrides**

Configuration includes overrides for:
- **Config files** (`.config.js`, `next.config.js`) - Wider line width (120)
- **App/Pages** - Stricter rules (no `any` type)
- **Test files** - Relaxed console rules

### 4. **Enhanced Linter Rules**

#### Correctness
- `noUnusedVariables` - Warn on unused variables
- `noUnusedImports` - Warn on unused imports
- `useExhaustiveDependencies` - React hooks dependency checking

#### Style
- `useConst` - Prefer `const` over `let`
- `useImportType` - Use `import type` for type-only imports
- `noParameterAssign` - Prevent parameter reassignment

#### Suspicious
- `noConsole` - Warn on console usage (allows `warn`/`error`)
- `noExplicitAny` - Warn on `any` type usage
- `noArrayIndexKey` - Warn on array index as React key

#### Security
- `noDangerouslySetInnerHtml` - Warn on dangerous HTML injection

#### Performance
- `noDelete` - Warn on `delete` operator usage

### 5. **VCS Integration**

- ✅ Git integration enabled
- ✅ Respects `.gitignore` files
- ✅ Default branch: `main`
- ✅ Staged file support for pre-commit hooks

### 6. **CI/CD Optimization**

#### GitHub Actions
- Uses `biome ci` command (optimized for CI)
- Faster execution
- Better error reporting
- No auto-fixes (fails fast)

#### TurboRepo Integration
- Biome config in `globalDependencies`
- Cached linting results
- Parallel execution support

---

## 🚀 Usage Guide

### Daily Development

1. **Format on Save** - Automatically enabled in VS Code
2. **Check Before Commit**:
   ```bash
   pnpm check:fix
   ```

### Pre-commit Hooks (Optional)

To set up pre-commit hooks with Biome:

1. **Install pre-commit** (if not already installed):
   ```bash
   pip install pre-commit
   ```

2. **Create `.pre-commit-config.yaml`**:
   ```yaml
   repos:
     - repo: https://github.com/biomejs/pre-commit
       rev: "v2.0.6"
       hooks:
         - id: biome-check
           additional_dependencies: ["@biomejs/biome@1.9.4"]
   ```

3. **Install hooks**:
   ```bash
   pre-commit install
   ```

### CI/CD Pipeline

The GitHub workflow uses:
```yaml
- name: Run Biome CI
  run: pnpm check:ci
```

This command:
- ✅ Optimized for CI environments
- ✅ Faster execution
- ✅ Better error reporting
- ✅ Fails on any issues

---

## 📋 File Ignore Patterns

Biome automatically ignores:
- `node_modules/`
- `.next/`, `out/`, `dist/`, `build/`
- `*.min.js`, `*.min.css`
- `pnpm-lock.yaml`
- `.git/`, `.vscode/`, `.cursor/`
- `coverage/`, `.turbo/`
- `*.log`
- `.env.local`, `.env.*.local`

---

## 🔧 Configuration Details

### Formatter Settings
- **Indent Style**: Spaces (2 spaces)
- **Line Width**: 100 characters (120 for config files)
- **Line Ending**: LF (Unix-style)
- **Quote Style**: Single quotes (JS), Double quotes (JSX/CSS)

### Linter Settings
- **Recommended Rules**: Enabled
- **Custom Rules**: Optimized for Next.js/React
- **Error Level**: Warnings (non-blocking in dev)

### Import Organization
- ✅ Automatically enabled
- ✅ Removes unused imports
- ✅ Sorts imports alphabetically

---

## 🎨 VS Code Integration

### Automatic Formatting
- ✅ Format on save enabled
- ✅ Format on paste enabled
- ✅ Default formatter: Biome

### Supported File Types
- JavaScript (`.js`)
- JavaScript React (`.jsx`)
- TypeScript (`.ts`)
- TypeScript React (`.tsx`)
- JSON (`.json`)
- JSONC (`.jsonc`)
- CSS (`.css`)

### Extension
- **Extension ID**: `biomejs.biome`
- **Status**: Enabled
- **LSP**: Configured

---

## 📊 Performance

### Speed Comparison
- **Biome**: ~10-50x faster than ESLint + Prettier
- **CI Check**: Optimized for parallel execution
- **Caching**: Integrated with TurboRepo

### Benchmarks
- Format: ~100ms for typical project
- Lint: ~200ms for typical project
- Check: ~300ms for typical project

---

## 🔍 Troubleshooting

### Issue: Biome not formatting
**Solution**: Check VS Code settings - ensure `biomejs.biome` is default formatter

### Issue: Pre-commit hook too slow
**Solution**: Use `--staged` flag to only check changed files:
```bash
biome check --write --staged .
```

### Issue: CI failing
**Solution**: Use `biome ci` instead of `biome check` for better CI performance

### Issue: Conflicts with other tools
**Solution**: Ensure Biome is the only formatter/linter configured

---

## 📚 Additional Resources

- [Biome Documentation](https://biomejs.dev)
- [Biome Configuration Reference](https://biomejs.dev/reference/configuration)
- [Biome CLI Commands](https://biomejs.dev/reference/cli)
- [Biome CI/CD Guide](https://biomejs.dev/guides/continuous-integration)

---

## ✅ Checklist

- [x] Biome installed and configured
- [x] VS Code integration enabled
- [x] CI/CD pipeline configured
- [x] Pre-commit hooks ready (optional)
- [x] File type support (JS/TS/JSON/CSS)
- [x] Smart overrides for different file types
- [x] Comprehensive linting rules
- [x] Import organization enabled
- [x] TurboRepo integration
- [x] Documentation complete

---

**Status**: ✅ All best practices implemented and optimized for this workspace.
