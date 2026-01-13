# Tailwind CSS CLI & IntelliSense Setup

**Status**: ✅ Configured and Ready **Tailwind Version**: v4.1.18 **Last
Updated**: 2026-01-11

---

## 🎯 Quick Start

### IntelliSense (VS Code)

✅ **Already Configured** - Tailwind IntelliSense extension is set up and ready
to use.

**Extension**: `bradlc.vscode-tailwindcss` (recommended in
`.vscode/extensions.json`)

**Features Enabled**:

- ✅ Autocomplete for Tailwind classes
- ✅ Class name suggestions in `className`, `cn()`, `cva()`, `twMerge()`,
  `clsx()`
- ✅ Hover previews showing CSS output
- ✅ CSS validation and linting
- ✅ Emmet completions for Tailwind classes

### Verify IntelliSense is Working

1. Open any `.tsx` or `.ts` file
2. Type `className="` and start typing a Tailwind class (e.g., `flex`)
3. You should see autocomplete suggestions with previews
4. Hover over any Tailwind class to see the generated CSS

---

## 📦 Tailwind CLI Commands

### Root Level Commands

```bash
# Build CSS from shared styles (production)
pnpm tailwind:build

# Watch mode for shared styles (development)
pnpm tailwind:watch

# Watch mode for BoardRoom app
pnpm tailwind:boardroom

# Watch mode for Docs app
pnpm tailwind:docs
```

### Direct CLI Usage

```bash
# Using npx (if needed)
npx @tailwindcss/cli -i ./apps/styles/globals.css -o ./dist/tailwind.css

# Watch mode
npx @tailwindcss/cli -i ./apps/styles/globals.css -o ./dist/tailwind.css --watch

# Minified production build
npx @tailwindcss/cli -i ./apps/styles/globals.css -o ./dist/tailwind.css --minify
```

### App-Specific CLI Usage

**BoardRoom App**:

```bash
cd apps/boardroom
npx @tailwindcss/cli -i ./styles/globals.css -o ./dist/tailwind.css --watch
```

**Docs App**:

```bash
cd apps/docs
npx @tailwindcss/cli -i ./styles/globals.css -o ./dist/tailwind.css --watch
```

---

## 🔧 Configuration Files

### Tailwind Config Locations

- **Root**: `tailwind.config.ts`
- **BoardRoom**: `apps/boardroom/tailwind.config.ts`
- **Docs**: (uses root config)

### CSS Entry Points

- **Shared Base**: `apps/styles/globals.css`
- **BoardRoom**: `apps/boardroom/styles/globals.css` (imports shared base)
- **Docs**: `apps/docs/styles/globals.css` (imports shared base)

---

## 🎨 IntelliSense Configuration

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"],
    ["twMerge\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"],
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^\"'`]*)(?:'|\"|`)"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "tailwindCSS.emmetCompletions": true,
  "tailwindCSS.validate": true,
  "tailwindCSS.lint.cssConflict": "warning",
  "tailwindCSS.lint.invalidApply": "error",
  "tailwindCSS.lint.invalidConfigPath": "error",
  "tailwindCSS.lint.invalidScreen": "error",
  "tailwindCSS.lint.invalidTailwindDirective": "error",
  "tailwindCSS.lint.invalidVariant": "error",
  "tailwindCSS.lint.recommendedVariantOrder": "warning"
}
```

### Supported Patterns

IntelliSense works in:

- ✅ `className="..."`
- ✅ `cn(...)`
- ✅ `cva(...)`
- ✅ `twMerge(...)`
- ✅ `clsx(...)`
- ✅ Template literals
- ✅ String concatenation

---

## 🐛 Troubleshooting

### IntelliSense Not Working

1. **Check Extension Installation**:

   ```bash
   code --list-extensions | grep tailwind
   # Should show: bradlc.vscode-tailwindcss
   ```

2. **Install Missing Extension**:

   ```bash
   code --install-extension bradlc.vscode-tailwindcss
   ```

3. **Reload VS Code Window**:
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Developer: Reload Window"
   - Press Enter

4. **Check Config File Detection**:
   - IntelliSense auto-detects `tailwind.config.ts` files
   - If not working, check that config files exist in workspace root or app
     directories

5. **Verify CSS File Association**:
   - VS Code settings should have:
     `"files.associations": { "*.css": "tailwindcss" }`
   - ✅ Already configured in `.vscode/settings.json`

### CLI Not Working

1. **Check Installation**:

   ```bash
   pnpm list @tailwindcss/cli
   # Should show: @tailwindcss/cli@^4.1.18
   ```

2. **Verify Entry Point**:
   - Check that CSS files exist at specified paths
   - Entry point: `apps/styles/globals.css` or app-specific paths

3. **Check Output Directory**:
   - Ensure output directory exists or will be created
   - Default: `./dist/tailwind.css`

---

## 📚 Additional Resources

- **Tailwind CSS v4 Docs**: https://tailwindcss.com/docs/v4-beta
- **IntelliSense Extension**:
  https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
- **CLI Documentation**: https://tailwindcss.com/docs/cli

---

## ✅ Verification Checklist

- [x] Tailwind IntelliSense extension installed
- [x] VS Code settings configured
- [x] Tailwind config files present
- [x] CSS entry points defined
- [x] CLI scripts added to package.json
- [x] Class regex patterns configured for utility functions
- [x] CSS validation enabled
- [x] Linting rules configured

---

**Status**: Production Ready **Maintained By**: Development Team
