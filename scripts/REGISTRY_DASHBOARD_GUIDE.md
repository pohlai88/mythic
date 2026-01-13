# Registry Dashboard Guide

Complete guide to using the Function & Script Registry Dashboard.

## Quick Start

### One-Command Launch

```bash
# Scan registry and start dashboard (default port 3000)
pnpm registry:all

# Or use the explicit command
pnpm registry:dashboard

# Custom port
pnpm registry:dashboard --port 4000
```

The dashboard will be available at: **http://localhost:3000/registry**

## What It Does

1. **Scans the codebase** - Detects all functions and scripts
2. **Updates registry** - Maintains JSON registry with metadata
3. **Starts dashboard** - Launches interactive web interface

## Dashboard Features

### Search & Filter
- **Search**: Find functions/scripts by name, description, or file path
- **View Mode**: Filter by functions, scripts, or view all
- **Category Filter**: Filter by category (utility, validation, generation, etc.)

### Interactive Details
- Click any item to see full details:
  - Parameters with types
  - Return types
  - Usage examples
  - JSDoc descriptions
  - Tags and categories
  - Last modified date
  - Content hash

### Statistics
- Total items count
- Functions count
- Scripts count
- Filtered results count

## Integration

### Build Integration

The registry scan is automatically integrated into the StratonHub build:

```bash
# Build includes registry scan
cd apps/StratonHub
pnpm build
```

### Manual Commands

```bash
# Scan registry only
pnpm registry:scan

# Scan and show changes
pnpm registry:scan --diff

# Query registry from CLI
pnpm registry:query <name>
pnpm registry:query --category validation
pnpm registry:query --tag zod

# Build with registry
pnpm registry:build
```

## Architecture

### Files Created

1. **API Route**: `apps/StratonHub/app/api/registry/route.ts`
   - Serves registry JSON data
   - Cached responses (60s)

2. **Dashboard Page**: `apps/StratonHub/app/registry/page.tsx`
   - Interactive React dashboard
   - Search, filter, and detail views
   - Responsive design with dark mode

3. **Dashboard Launcher**: `scripts/registry-dashboard.ts`
   - Orchestrates scan + dashboard startup
   - Handles custom ports

### Registry Location

- **Registry JSON**: `scripts/function-registry.json`
- **Scanner**: `scripts/registry-scanner.ts`
- **Query Tool**: `scripts/registry-query.ts`

## Usage Examples

### Development Workflow

```bash
# 1. Start dashboard (scans automatically)
pnpm registry:all

# 2. Open browser
# Navigate to http://localhost:3000/registry

# 3. Search for functions
# Type in search box: "validate"

# 4. Filter by category
# Select "validation" from category dropdown

# 5. View details
# Click any function/script to see full details
```

### CI/CD Integration

```bash
# In your CI pipeline
pnpm registry:scan
pnpm registry:build
```

### Custom Port

```bash
# Run on port 4000
pnpm registry:dashboard --port 4000

# Access at http://localhost:4000/registry
```

## Best Practices

### 1. Regular Updates

Scan registry regularly to keep it up to date:

```bash
# Before major releases
pnpm registry:scan

# After adding new functions/scripts
pnpm registry:scan
```

### 2. Build Integration

The registry scan is integrated into the build process, so it runs automatically during builds.

### 3. Dashboard for Discovery

Use the dashboard to:
- Discover available functions
- Understand function signatures
- Find usage examples
- Explore script capabilities

### 4. CLI for Automation

Use CLI commands for:
- CI/CD pipelines
- Pre-commit hooks
- Automated documentation
- Change detection

## Troubleshooting

### Dashboard Not Loading

```bash
# Ensure registry exists
pnpm registry:scan

# Check if dashboard route exists
ls apps/StratonHub/app/registry/page.tsx
```

### Port Already in Use

```bash
# Use different port
pnpm registry:dashboard --port 4000
```

### Registry Not Found

```bash
# Run initial scan
pnpm registry:scan

# Verify registry exists
cat scripts/function-registry.json
```

### Build Fails

```bash
# Check if registry scan works
pnpm registry:scan

# Check build separately
cd apps/StratonHub
pnpm build
```

## Advanced Usage

### Watch Mode

```bash
# Auto-scan on file changes (future feature)
pnpm registry:scan --watch
```

### Change Detection

```bash
# See what changed since last scan
pnpm registry:scan --diff
```

### Query from CLI

```bash
# Find specific function
pnpm registry:query --function validateInput

# Find specific script
pnpm registry:query --script validate-docs

# List all items
pnpm registry:query --list
```

## Performance

- **Scan Time**: ~5-10 seconds for 500+ items
- **Dashboard Load**: <1 second (cached API)
- **Search**: Instant (client-side filtering)

## Next Steps

1. ✅ Dashboard created and integrated
2. ✅ Build integration complete
3. ✅ One-command launch available
4. ⏭️ Watch mode (future enhancement)
5. ⏭️ Export functionality (future enhancement)
6. ⏭️ Analytics dashboard (future enhancement)

## Related Documentation

- `scripts/REGISTRY_README.md` - Registry system overview
- `scripts/registry-scanner.ts` - Scanner implementation
- `scripts/registry-query.ts` - CLI query tool
