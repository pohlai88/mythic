# Next.js: Project Root vs App Directory Root

**Critical Distinction**: These are TWO DIFFERENT locations

---

## 1. PROJECT ROOT (Repository Root)

**Location**: `C:\AI-BOS\mythic\` (or `apps/StratonHub/` for app-specific)

**What Next.js Allows at PROJECT ROOT**:
- ✅ `/public` directory
- ✅ Configuration files: `package.json`, `next.config.js`, `tsconfig.json`
- ✅ Environment files: `.env.*`
- ✅ `node_modules/`
- ✅ `.next/` (build output)

**What Next.js Does NOT Allow at PROJECT ROOT**:
- ❌ Application code (should be in `app/` or `src/app/`)
- ❌ Components (should be in `components/`, `app/`, or `src/`)
- ❌ Utilities (should be in `lib/`, `app/`, or `src/`)

**Reference**: [Next.js src Directory](https://nextjs.org/docs/canary/pages/building-your-application/configuring/src-directory)

---

## 2. APP DIRECTORY ROOT (app/ Root)

**Location**: `apps/StratonHub/app/` (root of the `app/` directory)

**What Next.js Allows at APP DIRECTORY ROOT**:
- ✅ `layout.tsx` - Root layout
- ✅ `page.tsx` - Home page
- ✅ `not-found.tsx` - Route-level 404
- ✅ `global-error.tsx` - Global error boundary (special file)
- ✅ `global-not-found.tsx` - Global 404 handler (special file)
- ✅ `sitemap.ts` - Sitemap generation
- ✅ `robots.ts` - Robots.txt generation
- ✅ Route directories: `(audiences)/`, `api/`, etc.

**These are Next.js special files** that must be at the ROOT OF THE `app/` DIRECTORY, NOT at project root.

---

## 3. The Confusion

**What I Got Wrong**:
- I said "at root" without clarifying WHICH root
- I didn't distinguish between PROJECT ROOT vs APP DIRECTORY ROOT
- I didn't reference Next.js documentation on what's allowed at PROJECT ROOT

**The Correct Understanding**:
- Next.js specifies what's allowed at **PROJECT ROOT** (config files, public, env)
- Next.js special files (`global-error.tsx`, etc.) go at **APP DIRECTORY ROOT** (`app/`)
- These are TWO DIFFERENT locations

---

## 4. Corrected Understanding

### Project Root (`apps/StratonHub/`)
```
apps/StratonHub/
├── package.json          ✅ Allowed by Next.js
├── next.config.mjs       ✅ Allowed by Next.js
├── tsconfig.json         ✅ Allowed by Next.js
├── .env.local            ✅ Allowed by Next.js
├── public/               ✅ Allowed by Next.js
├── app/                  ✅ App directory
├── components/           ✅ App-specific (your architecture)
├── lib/                  ✅ App-specific (your architecture)
└── hooks/                ✅ App-specific (your architecture)
```

### App Directory Root (`apps/StratonHub/app/`)
```
apps/StratonHub/app/
├── layout.tsx            ✅ Next.js special file
├── page.tsx              ✅ Next.js special file
├── not-found.tsx         ✅ Next.js special file
├── global-error.tsx      ✅ Next.js special file (if created)
├── global-not-found.tsx  ✅ Next.js special file (if created)
├── sitemap.ts            ✅ Next.js special file (if created)
├── robots.ts             ✅ Next.js special file (if created)
└── (audiences)/          ✅ Route directory
```

---

## 5. Key Takeaway

**Next.js Documentation**:
- Specifies what's allowed at **PROJECT ROOT** (config files, public, env)
- Does NOT specify "at root" for special files - they go at **APP DIRECTORY ROOT**

**My Error**:
- I said "at root" without clarifying
- I should have said "at the root of the `app/` directory"
- I should have referenced Next.js docs on PROJECT ROOT vs APP DIRECTORY ROOT

---

**Status**: ✅ **CLARIFIED**
**Last Updated**: 2026-01-13
