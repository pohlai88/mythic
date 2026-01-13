# Vitest Setup Documentation

## Overview

Vitest has been successfully configured for the monorepo. This document provides
information about the setup, configuration, and usage.

## Installation

The following packages have been installed at the root level:

- `vitest` - Fast unit test framework
- `@vitest/ui` - Web UI for test results
- `@vitest/coverage-v8` - Code coverage support
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - DOM matchers for assertions
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM environment for browser-like testing

## Configuration Files

### Root Configuration

**`vitest.config.ts`** - Main Vitest configuration at repository root:

- Environment: `jsdom` for browser-like testing
- Setup file: `vitest.setup.ts` for global test configuration
- Path aliases configured for all workspace packages
- Coverage configuration with v8 provider

**`vitest.setup.ts`** - Global test setup:

- Imports `@testing-library/jest-dom` for DOM matchers
- Configures cleanup after each test

### App-Specific Configuration

**`apps/boardroom/vitest.config.ts`** - Boardroom app configuration:

- Extends root configuration
- Includes app-specific path aliases (`@/`, `@/components`, etc.)
- Same environment and setup as root

## Test Scripts

### Root Level (`package.json`)

```json
{
  "test": "turbo run test",
  "test:watch": "turbo run test:watch",
  "test:ui": "turbo run test:ui",
  "test:coverage": "turbo run test:coverage"
}
```

### Boardroom App (`apps/boardroom/package.json`)

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

## Usage

### Running Tests

**Option 1: Via pnpm scripts (Recommended)**

```bash
# Run all tests in watch mode (from root)
pnpm test:watch

# Run all tests once (from root)
pnpm test

# Run tests for specific app
cd apps/boardroom
pnpm test

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

**Option 2: Via npx (No global install needed)**

```bash
# Run tests in watch mode
npx vitest

# Run tests once
npx vitest run

# Run with UI
npx vitest --ui

# Generate coverage
npx vitest run --coverage
```

**Option 3: Via global CLI (Already installed)**

```bash
# Run tests in watch mode
vitest

# Run tests once
vitest run

# Run with UI
vitest --ui

# Generate coverage
vitest run --coverage
```

> **Note**: Vitest is installed globally, so you can use `vitest` directly from
> any directory. The global installation is optional - you can also use
> `pnpm test` or `npx vitest` which work without global installation.

### Writing Tests

#### Unit Tests

Create test files with `.test.ts` or `.spec.ts` extension:

```typescript
import { describe, it, expect } from "vitest"

describe("MyFunction", () => {
  it("should do something", () => {
    expect(true).toBe(true)
  })
})
```

#### Component Tests

Use React Testing Library for component tests:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Example Tests

Two example test files have been created:

1. **`apps/boardroom/src/lib/env.test.ts`** - Tests for environment variable
   validation
2. **`apps/boardroom/components/__tests__/example.test.tsx`** - Example React
   component test

## Path Aliases

The following path aliases are configured and available in tests:

- `@mythic/shared-utils` → `packages/NextJS/Shared-Utils/src`
- `@mythic/shared-types` → `packages/TypeScript/Shared-Types/src`
- `@mythic/design-system` → `packages/TailwindCSS-V4/Design-System/src`
- `@mythic/axis-theme` → `packages/axis-theme/src`
- `@mythic/domain-core` → `packages/NextJS/Domain-Core/src`
- `@mythic/performance` → `packages/NodeJS/Performance/src`
- `@mythic/monitoring` → `packages/NodeJS/Monitoring/src`

App-specific aliases (in boardroom):

- `@/` → `apps/boardroom/`
- `@/components` → `apps/boardroom/components`
- `@/lib` → `apps/boardroom/src/lib`
- `@/app` → `apps/boardroom/app`
- `@/src` → `apps/boardroom/src`

## Coverage Configuration

Coverage reports are generated using the v8 provider and include:

- Text output in terminal
- JSON report for CI/CD
- HTML report for detailed viewing

Coverage excludes:

- `node_modules/`
- Config files
- Build outputs (`.next`, `dist`, `.turbo`)
- Test files themselves
- Scripts directory

## Integration with Turborepo

Tests are integrated with Turborepo:

- Root `test` script runs tests across all apps via Turbo
- Individual apps can run tests independently
- Turbo caching enabled for test results
- Test outputs configured in `turbo.json`

## Next Steps

1. Add tests for your components and utilities
2. Set up CI/CD to run tests on every PR
3. Configure coverage thresholds if needed
4. Add E2E tests with Playwright (separate setup)

## VS Code Extension

### Installation

Install the official Vitest extension for VS Code:

**Recommended Extension**: Vitest Explorer by Zixuan Chen

1. Open VS Code Extensions (Ctrl+Shift+X / Cmd+Shift+X)
2. Search for "Vitest Explorer" by Zixuan Chen
3. Install the extension

Or install via CLI:

```bash
code --install-extension ZixuanChen.vitest-explorer
```

**Alternative**: Vitest by Anthony Fu (official maintainer)

```bash
code --install-extension antfu.vitest-explorer
```

> **Note**: The extension is already added to `.vscode/extensions.json` as a
> recommended extension. VS Code will prompt you to install it when you open the
> workspace.

### Features

The Vitest extension provides:

- **Test Explorer** - Visual test tree in sidebar
- **Inline Test Results** - See pass/fail status next to test code
- **Run/Debug Tests** - Click to run individual tests or suites
- **Watch Mode** - Automatic test re-running on file changes
- **Coverage Highlighting** - See code coverage directly in editor
- **Error Messages** - Click to jump to failing assertions

### Configuration

Add to `.vscode/settings.json`:

```json
{
  "vitest.enable": true,
  "vitest.commandLine": "pnpm test",
  "vitest.include": ["**/*.{test,spec}.{ts,tsx}"],
  "vitest.exclude": ["node_modules", "dist", ".next", ".turbo"],
  "vitest.workspaceConfig": "./vitest.config.ts"
}
```

### Usage

1. **Test Explorer**: Open the Test Explorer panel (beaker icon in sidebar)
2. **Run Tests**: Click the play icon next to any test
3. **Debug Tests**: Click the debug icon to debug tests
4. **Watch Mode**: Enable watch mode from the extension settings
5. **Coverage**: Enable coverage highlighting from command palette

## CLI Commands

### Basic Commands

```bash
# Run all tests once
vitest run

# Run tests in watch mode (default)
vitest

# Run tests with UI
vitest --ui

# Run specific test file
vitest run src/lib/env.test.ts

# Run tests matching pattern
vitest run -t "environment"
```

### Watch Mode Options

```bash
# Watch mode (default)
vitest

# Watch mode with UI
vitest --ui

# Watch mode, re-run only changed tests
vitest --changed

# Watch mode, run tests related to changed files
vitest --related
```

### Filtering Tests

```bash
# Run tests matching name pattern
vitest -t "env"

# Run tests in specific file
vitest src/lib/env.test.ts

# Run tests in directory
vitest src/lib/

# Exclude tests matching pattern
vitest -t "env" --exclude "coverage"
```

### Coverage Commands

```bash
# Generate coverage report
vitest run --coverage

# Coverage with specific provider
vitest run --coverage --coverage.provider=v8

# Coverage with thresholds
vitest run --coverage --coverage.lines=80 --coverage.functions=80

# Coverage for specific files
vitest run --coverage src/lib/
```

### Output Options

```bash
# Silent mode (no output)
vitest run --silent

# Verbose output
vitest run --reporter=verbose

# JSON reporter
vitest run --reporter=json

# JUnit reporter (for CI)
vitest run --reporter=junit --outputFile=test-results.xml

# Multiple reporters
vitest run --reporter=default --reporter=json --reporter=html
```

### Performance Options

```bash
# Run tests in parallel (default)
vitest run

# Run tests sequentially
vitest run --no-threads

# Limit thread pool size
vitest run --threads=4

# Use threads for isolation
vitest run --isolate
```

### Environment Options

```bash
# Use node environment
vitest run --environment=node

# Use jsdom environment
vitest run --environment=jsdom

# Use happy-dom environment
vitest run --environment=happy-dom

# Use custom environment
vitest run --environment=custom
```

### Configuration Options

```bash
# Use specific config file
vitest run --config=vitest.config.ts

# Override config options
vitest run --coverage.enabled=true --coverage.provider=v8

# Show config
vitest run --showConfig
```

### UI Mode

```bash
# Open UI in browser
vitest --ui

# UI on specific port
vitest --ui --ui.port=51204

# UI with host
vitest --ui --ui.host=0.0.0.0
```

### Debugging

```bash
# Run with Node.js inspector
node --inspect-brk node_modules/.bin/vitest run

# Run with Chrome DevTools
vitest run --inspect-brk

# Run with specific test timeout
vitest run --test-timeout=10000
```

### CI/CD Commands

```bash
# Run once (no watch)
vitest run

# Run with coverage for CI
vitest run --coverage --coverage.reporter=json --coverage.reporter=text

# Run with JUnit output
vitest run --reporter=junit --outputFile=test-results.xml

# Run with specific environment
CI=true vitest run
```

### Common CLI Flags

| Flag                    | Description                        |
| ----------------------- | ---------------------------------- |
| `--run`                 | Run tests once (no watch)          |
| `--watch`               | Watch mode (default)               |
| `--ui`                  | Open UI in browser                 |
| `--coverage`            | Generate coverage report           |
| `-t, --testNamePattern` | Filter tests by name               |
| `-r, --reporter`        | Specify reporter                   |
| `--threads`             | Number of worker threads           |
| `--no-threads`          | Run tests sequentially             |
| `--isolate`             | Isolate each test file             |
| `--environment`         | Test environment                   |
| `--config`              | Config file path                   |
| `--silent`              | Suppress output                    |
| `--reporter=verbose`    | Verbose output                     |
| `--changed`             | Run only changed tests             |
| `--related`             | Run tests related to changed files |

### Example Workflows

```bash
# Development workflow
vitest                    # Watch mode

# Pre-commit workflow
vitest run --changed      # Only changed tests

# CI workflow
vitest run --coverage --reporter=junit --outputFile=test-results.xml

# Debugging workflow
vitest run -t "failing test" --reporter=verbose

# Coverage workflow
vitest run --coverage --coverage.lines=80 --coverage.functions=80
```

## Resources

- [Vitest Documentation](https://vitest.dev)
- [Vitest CLI Reference](https://vitest.dev/guide/cli.html)
- [Vitest VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer)
- [React Testing Library](https://testing-library.com/react)
- [Vitest Browser Mode](https://vitest.dev/guide/browser/) - For testing in real
  browsers
