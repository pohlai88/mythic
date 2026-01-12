# @mythic/design-system

Axis Visual Canon v1.0.0 - Design System Package

## Overview

This package provides design tokens and UI components for the ERP system, following Tailwind CSS v4 best practices.

## Usage

### Import Design Tokens

```css
/* In your app's globals.css */
@import "tailwindcss";
@import "@mythic/design-system/tokens/theme.css";
@source "../../packages/design-system";
```

### Import Components

```typescript
import { Button, Card } from '@mythic/design-system'
```

## Structure

```
packages/design-system/
├── src/
│   ├── tokens/
│   │   └── theme.css      # Design tokens (CSS-first)
│   ├── components/         # UI Components
│   └── lib/                # Utilities
└── package.json
```

## Status

🚧 **Under Development** - Minimal structure created to unblock installation.
