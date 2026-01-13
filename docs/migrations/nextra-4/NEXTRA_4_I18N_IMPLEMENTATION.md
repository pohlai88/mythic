# Nextra 4: RSC i18n Implementation Guide

**Status**: ✅ **Infrastructure Ready** **Date**: 2025-01-27

## Overview

Nextra 4 supports **Server Components i18n** using dynamic dictionary loading.
Translations are loaded server-side and passed as props to components,
eliminating the need to ship translation files to the client.

## Implementation Status

### ✅ Infrastructure Created

1. **Dictionary Files**: Created for 8 languages
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Russian (ru)
   - ✅ Hebrew (he) - RTL support

2. **Dictionary Loader**: `lib/i18n/get-dictionary.ts`
   - ✅ Server-only imports
   - ✅ Dynamic loading
   - ✅ Direction detection (RTL/LTR)
   - ✅ Locale fallback

3. **Example Layout**: `app/[lang]/layout.example.tsx`
   - ✅ Complete i18n implementation example
   - ✅ All components with translations
   - ✅ RTL support

### ⚠️ Current Setup

**Current**: Single-language setup (`app/layout.tsx`) **Option**: i18n setup
(`app/[lang]/layout.tsx`)

**Note**: To enable i18n, you need to restructure the app directory (see
Migration section).

---

## How It Works

### Server Components i18n

**Benefits**:

- ✅ No client-side translation files
- ✅ Dynamic loading in server components
- ✅ Better performance (smaller bundles)
- ✅ SEO-friendly (server-rendered)

**Process**:

1. Server component loads dictionary dynamically
2. Translations passed as props to components
3. No translation files shipped to client
4. Better performance and SEO

---

## Dictionary Structure

### Dictionary Files

**Location**: `lib/i18n/dictionaries/{locale}.json`

**Structure**:

```json
{
  "banner": "🎉 NexusCanon Governance Docs are now live!",
  "bannerLink": "Explore →",
  "footer": "{year} © NexusCanon. Powered by Nextra",
  "editPage": "Edit this page on GitHub →",
  "feedback": "Question? Give us feedback →",
  "lastUpdated": "Last updated on",
  "searchPlaceholder": "Search documentation...",
  "searchLoading": "Loading search...",
  "searchError": "Failed to load search results",
  "searchEmptyResult": "No results found",
  "dark": "Dark",
  "light": "Light",
  "system": "System",
  "backToTop": "Back to top",
  "tocTitle": "On this page",
  "nextPage": "Next",
  "previousPage": "Previous"
}
```

### Dictionary Loader

**File**: `lib/i18n/get-dictionary.ts`

```typescript
import "server-only"

const dictionaries = {
  en: () => import("./dictionaries/en.json"),
  fr: () => import("./dictionaries/fr.json"),
  // ... other locales
}

export async function getDictionary(locale: string) {
  const normalizedLocale = locale.toLowerCase().split("-")[0]
  const dictionaryLoader = dictionaries[normalizedLocale] || dictionaries.en
  const { default: dictionary } = await dictionaryLoader()
  return dictionary
}

export function getDirection(locale: string): "ltr" | "rtl" {
  const rtlLocales = ["he", "ar", "fa", "ur"]
  const normalizedLocale = locale.toLowerCase().split("-")[0]
  return rtlLocales.includes(normalizedLocale) ? "rtl" : "ltr"
}
```

---

## Usage Examples

### Current Setup (Single Language)

**File**: `app/layout.tsx`

```tsx
export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr">
      {/* ... */}
    </html>
  )
}
```

**Routes**: `/`, `/docs`, `/guides`

---

### i18n Setup (Multi-Language)

**File**: `app/[lang]/layout.tsx`

```tsx
export default async function RootLayout({ children, params }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const direction = getDirection(lang)
  const pageMap = await getPageMap(lang)

  return (
    <html lang={lang} dir={direction}>
      <Layout
        i18n={[
          { locale: "en", name: "English" },
          { locale: "fr", name: "Français" },
        ]}
        // ... other props with translations
      >
        {children}
      </Layout>
    </html>
  )
}
```

**Routes**: `/en`, `/fr`, `/en/docs`, `/fr/docs`

---

## Migration Guide

### Option 1: Keep Single Language (Current)

**No changes needed** - Current setup works fine for single-language sites.

### Option 2: Enable i18n

**Steps**:

1. **Restructure app directory**:

   ```bash
   # Create [lang] directory
   mkdir -p app/[lang]

   # Move layout
   mv app/layout.tsx app/[lang]/layout.tsx

   # Move catch-all route
   mv app/[[...mdxPath]] app/[lang]/[[...mdxPath]]
   ```

2. **Update layout.tsx**:
   - Use example from `app/[lang]/layout.example.tsx`
   - Add `params` parameter
   - Load dictionary and direction
   - Pass translations to components

3. **Update routes**:
   - All routes now require `[lang]` parameter
   - `/` → `/en` (or redirect)
   - `/docs` → `/en/docs`

4. **Add middleware** (optional):

   ```typescript
   // middleware.ts
   import { NextResponse } from "next/server"
   import type { NextRequest } from "next/server"

   export function middleware(request: NextRequest) {
     const pathname = request.nextUrl.pathname
     if (pathname === "/") {
       return NextResponse.redirect(new URL("/en", request.url))
     }
   }
   ```

---

## Component Translations

### Layout Component

```tsx
<Layout
  i18n={[
    { locale: "en", name: "English" },
    { locale: "fr", name: "Français" },
  ]}
  // ... other props
/>
```

### Banner Component

```tsx
<Banner storageKey="key">{dictionary.banner}</Banner>
```

### Footer Component

```tsx
<Footer>
  {dictionary.footer.replace("{year}", new Date().getFullYear().toString())}
</Footer>
```

### Search Component

```tsx
<Search
  placeholder={dictionary.searchPlaceholder}
  loading={dictionary.searchLoading}
  errorText={dictionary.searchError}
  emptyResult={dictionary.searchEmptyResult}
/>
```

### Theme Switch Component

```tsx
<ThemeSwitch
  dark={dictionary.dark}
  light={dictionary.light}
  system={dictionary.system}
/>
```

### TOC Component

```tsx
<Layout
  toc={{
    backToTop: dictionary.backToTop,
    title: dictionary.tocTitle,
  }}
/>
```

### Navigation Component

```tsx
<Layout
  navigation={{
    prev: dictionary.previousPage,
    next: dictionary.nextPage,
  }}
/>
```

---

## RTL Support

### Right-to-Left Languages

**Supported**: Hebrew (he), Arabic (ar), Persian (fa), Urdu (ur)

**Implementation**:

```tsx
const direction = getDirection(lang) // Returns 'rtl' or 'ltr'

<html lang={lang} dir={direction}>
```

**Automatic**:

- Text direction set via `dir` attribute
- Nextra theme handles RTL styling
- Components adapt automatically

---

## Adding New Languages

### Step 1: Create Dictionary File

**File**: `lib/i18n/dictionaries/{locale}.json`

```json
{
  "banner": "Translation here",
  "footer": "Translation here"
  // ... other keys
}
```

### Step 2: Add to Dictionary Loader

**File**: `lib/i18n/get-dictionary.ts`

```typescript
const dictionaries = {
  // ... existing
  newLocale: () => import("./dictionaries/newLocale.json"),
}
```

### Step 3: Add to Layout

**File**: `app/[lang]/layout.tsx`

```tsx
i18n={[
  // ... existing
  { locale: 'newLocale', name: 'Language Name' },
]}
```

---

## Best Practices

### ✅ Do

- ✅ Use `server-only` in dictionary loader
- ✅ Load dictionaries dynamically
- ✅ Provide fallback to English
- ✅ Support RTL languages
- ✅ Use locale in `lang` attribute
- ✅ Set `dir` attribute for RTL

### ❌ Don't

- ❌ Ship dictionaries to client
- ❌ Use client components for dictionary loading
- ❌ Hardcode translations
- ❌ Forget RTL support
- ❌ Skip locale fallback

---

## Troubleshooting

### Dictionary Not Loading

**Problem**: Translations not appearing

**Solutions**:

1. Check dictionary file exists: `lib/i18n/dictionaries/{locale}.json`
2. Verify `server-only` import in get-dictionary.ts
3. Check locale matches dictionary key
4. Verify async/await usage

### RTL Not Working

**Problem**: RTL languages not displaying correctly

**Solutions**:

1. Check `getDirection()` function
2. Verify `dir` attribute set on `<html>`
3. Check locale is in RTL list: `['he', 'ar', 'fa', 'ur']`

### Routes Not Working

**Problem**: Routes return 404 after enabling i18n

**Solutions**:

1. Verify `[lang]` parameter in route structure
2. Check middleware redirects (if used)
3. Verify all routes include `[lang]` segment

---

## References

- [Next.js i18n Documentation](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Nextra 4 Migration Guide](https://the-guild.dev/blog/nextra-4)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- Example: `app/[lang]/layout.example.tsx`
- Dictionary loader: `lib/i18n/get-dictionary.ts`

---

## Summary

✅ **Infrastructure Ready**: Dictionary files and loader created ✅ **8
Languages Supported**: en, fr, es, de, zh, ja, ru, he ✅ **RTL Support**: Hebrew
and other RTL languages ✅ **Example Provided**: Complete i18n layout example ⚠️
**Migration Required**: Restructure app directory to enable

**Status**: ✅ **Ready for i18n Migration** (when needed)

---

**Last Updated**: 2025-01-27 **Next Steps**: Migrate to `app/[lang]` structure
when i18n needed
