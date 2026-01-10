# VS Code Workspace Configuration

This directory contains VS Code workspace-specific configuration files for the eBOM project.

## 📁 Directory Structure

```
.vscode/
├── README.md (this file)
├── settings.json          # Workspace settings
├── extensions.json        # Recommended extensions
├── launch.json            # Debug configurations (if added)
├── tasks.json             # Task definitions (if added)
├── check-extensions.ps1   # Extension validation script
├── install-extensions.ps1 # Extension installation script
└── archive/               # Historical documentation (archived)
```

## 📋 Essential Files

### `settings.json`

Workspace-specific VS Code settings including:

- TypeScript/JavaScript configuration
- Biome integration (linter and formatter)
- Tailwind CSS IntelliSense setup
- Editor preferences
- Git configuration

### `extensions.json`

Recommended VS Code extensions for this project:

- Core: Biome (replaces ESLint + Prettier)
- React/Next.js: React snippets, JSX helpers
- Tailwind CSS: IntelliSense, Headwind
- Supabase: Postgres tools
- Code Quality: Error Lens, EditorConfig
- Git: GitLens, Git Graph
- Testing: Jest Runner, Jest
- Productivity: Todo Tree, Auto Import

### Scripts

- **`check-extensions.ps1`**: Validates which recommended extensions are installed
- **`install-extensions.ps1`**: Installs all recommended extensions

## 🚀 Quick Start

### Install Recommended Extensions

**Option 1: Automatic (Recommended)**

- Open VS Code in this workspace
- Click "Install All" when prompted

**Option 2: Manual Script**

```powershell
.\vscode\install-extensions.ps1
```

**Option 3: Check Status**

```powershell
.\vscode\check-extensions.ps1
```

## 📚 Archived Documentation

Historical validation reports and setup documentation have been moved to `.vscode/archive/` to keep the directory clean. These files are preserved for reference but are not needed for daily development.

## 🔧 Next.js Best Practices

This configuration follows Next.js best practices:

- ✅ TypeScript/JavaScript path aliases configured
- ✅ Biome auto-fix on save (linter and formatter)
- ✅ Tailwind CSS IntelliSense enabled
- ✅ Next.js-specific file exclusions
- ✅ Editor formatting standards

## 📖 Additional Resources

- [Next.js VS Code Setup](https://nextjs.org/docs/getting-started/installation)
- [VS Code Settings Reference](https://code.visualstudio.com/docs/getstarted/settings)
- [Extension Recommendations](https://code.visualstudio.com/docs/editor/extension-marketplace)

---

**Last Updated:** 2025-01-09
