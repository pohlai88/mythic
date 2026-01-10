# Biome Environment Variables

**Last Updated:** 2026-01-10

## Overview

Biome supports environment variables to customize behavior without modifying configuration files. This is particularly useful for CI/CD pipelines and monorepo setups.

## Available Variables

### `BIOME_CONFIG_PATH`

**Purpose:** Override the default Biome configuration file location.

**Use Case:** Monorepos with multiple `biome.json` files or custom config locations.

**Example:**
```bash
export BIOME_CONFIG_PATH=./packages/frontend/biome.json
biome check .
```

### `BIOME_LOG_PATH`

**Purpose:** Specify the directory where Biome daemon logs are saved.

**Use Case:** Centralized logging for debugging, especially in CI/CD environments.

**Example:**
```bash
export BIOME_LOG_PATH=./logs
biome check .
```

### `BIOME_LOG_PREFIX_NAME`

**Purpose:** Set a prefix for log filenames.

**Use Case:** Multiple Biome instances or distinguishing between different runs.

**Example:**
```bash
export BIOME_LOG_PATH=./logs
export BIOME_LOG_PREFIX_NAME=ci-check
biome ci .
```

### `BIOME_BINARY`

**Purpose:** Override the default Biome binary location.

**Use Case:** System-wide installations or specific version requirements.

**Example:**
```bash
export BIOME_BINARY=/usr/local/bin/biome
biome check .
```

## CI/CD Configuration

### GitHub Actions

```yaml
- name: Run Biome CI
  run: pnpm check:ci:github
  env:
    BIOME_LOG_PATH: /tmp/biome-logs
    BIOME_LOG_PREFIX_NAME: github-actions
```

### Local Development

Create a `.env` file (not committed):

```bash
# .env
BIOME_CONFIG_PATH=./biome.json
BIOME_LOG_PATH=./logs
BIOME_LOG_PREFIX_NAME=dev
```

## Usage in Scripts

### package.json

```json
{
  "scripts": {
    "check:ci": "biome ci .",
    "check:ci:verbose": "BIOME_LOG_PATH=./logs biome ci --verbose ."
  }
}
```

### PowerShell (Windows)

```powershell
$env:BIOME_LOG_PATH = "./logs"
$env:BIOME_LOG_PREFIX_NAME = "dev"
pnpm check
```

### Bash (Linux/Mac)

```bash
export BIOME_LOG_PATH=./logs
export BIOME_LOG_PREFIX_NAME=dev
pnpm check
```

## Best Practices

1. **CI/CD:** Always set `BIOME_LOG_PATH` for debugging
2. **Monorepos:** Use `BIOME_CONFIG_PATH` for workspace-specific configs
3. **Local Dev:** Optional - only if you need custom behavior
4. **Documentation:** Document any custom environment variables in README

## References

- [Biome Environment Variables Documentation](https://biomejs.dev/reference/environment-variables)
- [Biome CI/CD Guide](https://biomejs.dev/guides/continuous-integration)
