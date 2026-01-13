# Next.js Production Checklist - Hierarchy Compliant Implementation

**Date**: 2026-01-13
**Reference**: [Next.js Production Checklist](https://nextjs.org/docs/app/guides/production-checklist)
**App**: `apps/StratonHub`
**Import Hierarchy Rule**: Top can import from bottom, bottom CANNOT import from top

---

## Import Hierarchy Rule

### ✅ CORRECT Pattern

```
app/ (TOP LEVEL)
  ├── layout.tsx          → Can import from @/components, @/lib, @/hooks
  ├── page.tsx            → Can import from @/components, @/lib, @/hooks
  ├── global-error.tsx    → Can import from @/components, @/lib (bottom level)
  └── (audiences)/        → Can import from @/components, @/lib, @/hooks
      └── developers/
          └── page.tsx    → Can import from @/components, @/lib, @/hooks

components/ (BOTTOM LEVEL)
  └── CenteredShell.tsx   → ❌ CANNOT import from app/
lib/ (BOTTOM LEVEL)
  └── utils.ts            → ❌ CANNOT import from app/
```

**Rule**:
- ✅ Top (`app/`) can import from bottom (`components/`, `lib/`, `hooks/`)
- ❌ Bottom (`components/`, `lib/`) CANNOT import from top (`app/`)

---

## Corrected Implementation Guide

### 1. Global Error UI (`app/global-error.tsx`)

**Status**: ❌ **MISSING** (but must respect hierarchy)

**Next.js Requirement**: Must be at root of `app/` directory

**Hierarchy Compliance**:
- ✅ Can import from `@/components` (bottom level)
- ✅ Can import from `@/lib` (bottom level)
- ❌ CANNOT import from `app/(audiences)/` or other app routes

**Correct Implementation**:
```typescript
// app/global-error.tsx
'use client'

// ✅ CORRECT: Import from bottom level
import { CenteredShell } from "@/components"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en-GB">
      <body>
        <CenteredShell width="narrow">
          <h2>Something went wrong!</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()}>Try again</button>
        </CenteredShell>
      </body>
    </html>
  )
}
```

**Why This Works**:
- ✅ File is at root of `app/` (Next.js requirement)
- ✅ Only imports from `@/components` (bottom level)
- ✅ No imports from `app/` subdirectories (respects hierarchy)

---

### 2. Global 404 (`app/global-not-found.tsx`)

**Status**: ❌ **MISSING** (but must respect hierarchy)

**Next.js Requirement**: Must be at root of `app/` directory

**Hierarchy Compliance**:
- ✅ Can import from `@/components` (bottom level)
- ✅ Can reuse existing `CenteredShell` component
- ❌ CANNOT import from `app/(audiences)/` or other app routes

**Correct Implementation**:
```typescript
// app/global-not-found.tsx
import Link from "next/link"
import type { Metadata } from "next"
// ✅ CORRECT: Import from bottom level
import { CenteredShell } from "@/components"

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function GlobalNotFound() {
  return (
    <CenteredShell width="narrow" filaments>
      <span className="micro-status mb-6">Coordinate 404</span>
      <h1 className="h1-apex mb-6">
        <span className="text-divergence block text-6xl sm:text-7xl">Silence.</span>
      </h1>
      <p className="mb-12 text-body font-light leading-relaxed text-muted opacity-80">
        The record you are looking for is not held within the current canon.
      </p>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <Link href="/" className="btn-axis" aria-label="Return to safe harbor">
          Return to Axis
        </Link>
        <Link
          href="/?search=true"
          className="btn-axis opacity-60 hover:opacity-100"
          aria-label="Search the documentation"
        >
          Search Docs
        </Link>
      </div>
    </CenteredShell>
  )
}
```

**Why This Works**:
- ✅ File is at root of `app/` (Next.js requirement)
- ✅ Only imports from `@/components` (bottom level)
- ✅ Reuses existing `CenteredShell` component (no duplication)
- ✅ No imports from `app/` subdirectories (respects hierarchy)

---

### 3. Core Web Vitals (`useReportWebVitals`)

**Status**: ❌ **MISSING**

**Hierarchy Compliance**:
- ✅ Can be added to `app/layout.tsx` (top level)
- ✅ Can import from `@/lib` for analytics utilities (bottom level)
- ❌ CANNOT import from `app/` routes

**Correct Implementation**:

**Option A: In Root Layout (Server Component)**
```typescript
// app/layout.tsx
import { WebVitalsReporter } from "@/components/web-vitals"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  )
}
```

**Option B: Separate Client Component (Recommended)**
```typescript
// components/web-vitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Send to analytics (e.g., Vercel Analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  })
  return null
}
```

**Why This Works**:
- ✅ Component is in `components/` (bottom level)
- ✅ Can be imported by `app/layout.tsx` (top level)
- ✅ No hierarchy violations

---

### 4. Content Security Policy

**Status**: ⚠️ **PARTIAL**

**Hierarchy Compliance**: ✅ No hierarchy concerns (config file)

**Current Implementation** (in `next.config.mjs`):
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        // ... existing headers
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
        },
      ],
    },
  ]
}
```

**Why This Works**:
- ✅ Configuration file (no import hierarchy concerns)
- ✅ Can be updated without violating boundaries

---

### 5. Sitemap Generation

**Status**: ❌ **MISSING**

**Hierarchy Compliance**: ✅ No hierarchy concerns (special file)

**Correct Implementation**:
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nexuscanon.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/developers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/users`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

**Why This Works**:
- ✅ Special Next.js file (no import hierarchy concerns)
- ✅ Can import from `@/lib` if needed for route generation (bottom level)

---

### 6. Data Tainting

**Status**: ❌ **MISSING**

**Hierarchy Compliance**: ✅ No hierarchy concerns (utility function)

**Correct Implementation**:
```typescript
// lib/taint.ts (bottom level - can be imported by app/)
import { experimental_taintObjectReference, experimental_taintUniqueValue } from 'react'

export function taintSensitiveData(data: unknown, message: string) {
  if (typeof data === 'object' && data !== null) {
    experimental_taintObjectReference(message, data)
  } else if (typeof data === 'string' || typeof data === 'number') {
    experimental_taintUniqueValue(message, data)
  }
}

// Usage in app/ (top level)
// app/api/user/route.ts
import { taintSensitiveData } from "@/lib/taint"

export async function GET() {
  const user = await getUser()
  taintSensitiveData(user.password, 'Password should not be exposed to client')
  return Response.json(user)
}
```

**Why This Works**:
- ✅ Utility in `lib/` (bottom level)
- ✅ Can be imported by `app/` routes (top level)
- ✅ Respects hierarchy

---

## Summary: Hierarchy Compliance

| Item                   | Location          | Imports From      | Hierarchy Compliant? |
| ---------------------- | ----------------- | ----------------- | -------------------- |
| `global-error.tsx`     | `app/` (root)     | `@/components`    | ✅ YES                |
| `global-not-found.tsx` | `app/` (root)     | `@/components`    | ✅ YES                |
| `useReportWebVitals`   | `components/`     | `next/web-vitals` | ✅ YES                |
| CSP Header             | `next.config.mjs` | N/A               | ✅ YES                |
| Sitemap                | `app/sitemap.ts`  | `next`            | ✅ YES                |
| Data Tainting          | `lib/taint.ts`    | `react`           | ✅ YES                |

**All implementations respect the hierarchy rule**: Top can import from bottom, bottom cannot import from top.

---

## Key Principles

1. **Next.js Special Files** (`global-error.tsx`, `global-not-found.tsx`, `sitemap.ts`) must be at root of `app/`, but should only import from bottom level (`@/components`, `@/lib`).

2. **Reuse Existing Components**: `global-error.tsx` and `global-not-found.tsx` should reuse `CenteredShell` from `@/components` (no duplication).

3. **Client Components**: Place in `components/` (bottom level) and import from `app/` (top level).

4. **Utilities**: Place in `lib/` (bottom level) and import from `app/` (top level).

---

**Status**: ✅ **HIERARCHY COMPLIANT**
**Last Updated**: 2026-01-13
