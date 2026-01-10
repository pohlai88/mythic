# Node.js Version Management

## 📋 Current Configuration

### Installed Version
- **Current:** Node.js v22.20.0
- **Recommended:** Node.js 20.18.0 (LTS)
- **Minimum:** Node.js 18.0.0

### Next.js Requirements
- **Next.js 16.1.1** requires Node.js >= 18.0.0
- **Recommended:** Node.js 20.x (LTS) for best compatibility

---

## 🔧 Version Management Files

### 1. `.nvmrc` (for nvm users)
```
20.18.0
```

**Usage:**
```bash
nvm use          # Automatically uses version from .nvmrc
nvm install      # Installs the version if not available
```

### 2. `.node-version` (for asdf/nodenv users)
```
20.18.0
```

**Usage:**
```bash
asdf install nodejs 20.18.0
asdf local nodejs 20.18.0
```

### 3. `package.json` engines field
```json
{
  "engines": {
    "node": ">=18.0.0 <23.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**Enforces version requirements** during installation.

---

## 🚀 Quick Setup

### Using nvm (Node Version Manager)

```bash
# Install nvm (if not installed)
# Windows: https://github.com/coreybutler/nvm-windows
# Mac/Linux: https://github.com/nvm-sh/nvm

# Install and use Node.js 20.18.0
nvm install 20.18.0
nvm use 20.18.0

# Set as default
nvm alias default 20.18.0
```

### Using asdf

```bash
# Install asdf plugin
asdf plugin add nodejs

# Install Node.js 20.18.0
asdf install nodejs 20.18.0

# Set local version
asdf local nodejs 20.18.0
```

### Verify Installation

```bash
node --version    # Should show v20.18.0
pnpm --version    # Should show >= 8.0.0
```

---

## ⚠️ Deprecation Warnings

The warnings you're seeing are from **subdependencies**, not your direct dependencies:

```
@babel/plugin-proposal-class-properties@7.18.6
@babel/plugin-proposal-object-rest-spread@7.20.7
@esbuild-kit/core-utils@3.3.2
@esbuild-kit/esm-loader@2.6.5
glob@7.2.3
inflight@1.0.6
mathjax-full@3.2.2
node-domexception@1.0.0
```

### Why These Warnings Appear

These are **transitive dependencies** (dependencies of your dependencies) that use deprecated packages. They don't affect functionality but indicate:

1. **Outdated subdependencies** - Some packages need updates
2. **Compatibility maintained** - Still work with current Node.js
3. **Future updates** - Will be resolved when parent packages update

### Action Items

1. **No immediate action needed** - These are warnings, not errors
2. **Monitor updates** - Check for package updates regularly
3. **Update dependencies** - Run `pnpm update` periodically
4. **Report issues** - If functionality breaks, report to package maintainers

---

## 📊 Version Compatibility Matrix

| Package | Node.js 18 | Node.js 20 | Node.js 22 |
|---------|------------|------------|------------|
| Next.js 16.1.1 | ✅ | ✅ | ✅ |
| React 18.3.1 | ✅ | ✅ | ✅ |
| TypeScript 5.7.2 | ✅ | ✅ | ✅ |
| pnpm 8+ | ✅ | ✅ | ✅ |

**Recommendation:** Use **Node.js 20.x (LTS)** for best compatibility and stability.

---

## 🔍 Checking Your Setup

### Verify Node.js Version
```bash
node --version
```

### Verify pnpm Version
```bash
pnpm --version
```

### Check Engine Requirements
```bash
pnpm check-engines
```

### List All Node.js Versions (nvm)
```bash
nvm list
```

---

## 🛠️ Troubleshooting

### Issue: Wrong Node.js Version

**Solution:**
```bash
# Using nvm
nvm use 20.18.0

# Using asdf
asdf local nodejs 20.18.0

# Verify
node --version
```

### Issue: pnpm Not Found

**Solution:**
```bash
# Install pnpm
npm install -g pnpm

# Or using corepack (Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

### Issue: Engine Mismatch

**Solution:**
```bash
# Update Node.js to required version
nvm install 20.18.0
nvm use 20.18.0

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📝 Best Practices

1. **Use LTS versions** - Node.js 20.x is the current LTS
2. **Pin versions** - Use `.nvmrc` or `.node-version`
3. **Specify engines** - Add to `package.json`
4. **CI/CD alignment** - Use same version in CI/CD
5. **Team consistency** - Share version files via Git

---

## 🔄 CI/CD Configuration

### GitHub Actions Example

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version-file: '.nvmrc'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
```

### Vercel Configuration

Vercel automatically detects Node.js version from:
- `.nvmrc`
- `.node-version`
- `package.json` engines field

---

## ✅ Checklist

- [x] `.nvmrc` file created (Node.js 20.18.0)
- [x] `.node-version` file created (Node.js 20.18.0)
- [x] `package.json` engines field added
- [x] Current Node.js version: v22.20.0 (compatible)
- [ ] Switch to Node.js 20.18.0 (recommended)
- [ ] Verify all scripts work
- [ ] Update CI/CD configuration

---

## 🎯 Recommended Actions

1. **Switch to Node.js 20.18.0** (LTS):
   ```bash
   nvm install 20.18.0
   nvm use 20.18.0
   ```

2. **Verify everything works:**
   ```bash
   pnpm install
   pnpm dev
   ```

3. **Monitor deprecation warnings:**
   - These are from subdependencies
   - Will be resolved in future updates
   - No immediate action needed

---

**Status:** ✅ **Version Management Configured**

Your project now has proper Node.js version management in place!
