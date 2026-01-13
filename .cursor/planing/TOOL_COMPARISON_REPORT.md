# Documentation Tool Comparison Report: Nextra vs Docusaurus

## Practical Assessment Against NexusCanon-AXIS Requirements

**Document ID:** ARCH-COMP-002 **Status:** Analysis Report **Date:** 2026-01-10
**Authority:** System Architect Office **Source:** GitHub MCP Search + Web
Research + Template Analysis

---

## Executive Summary

**Most Practical Tool: Nextra** (with customizations)

**Rationale:**

- Next.js-native integration (critical for monorepo)
- Lower complexity for governance-specific customizations
- File-system versioning aligns with sealed document structure
- **60% of requirements need customization** (same for both tools)

**Docusaurus Alternative:**

- Better for advanced versioning UI (if needed)
- More plugins available (but governance features still need custom work)
- Heavier framework, not Next.js-native

---

## Requirement-by-Requirement Analysis

### Requirement 1: Sealed Document Management

| Criteria                   | Nextra                    | Docusaurus                | Gap Resolution                     |
| -------------------------- | ------------------------- | ------------------------- | ---------------------------------- |
| **Frontmatter Support**    | ✅ Native MDX frontmatter | ✅ Native MDX frontmatter | ✅ **Both support**                |
| **Custom Metadata Schema** | ⚠️ Manual validation      | ⚠️ Manual validation      | ⚠️ **Both need custom validation** |
| **Seal Status Indicators** | ❌ Not provided           | ❌ Not provided           | ❌ **Pure customization needed**   |
| **Hash Display**           | ❌ Not provided           | ❌ Not provided           | ❌ **Pure customization needed**   |
| **Read-Only Enforcement**  | ⚠️ Git-based only         | ⚠️ Git-based only         | ⚠️ **Both need Git hooks**         |

**Resolution Strategy:**

- **Nextra:** Build custom MDX components (`<SealedDocument>`,
  `<HashVerification>`)
- **Docusaurus:** Build custom React components (same approach)
- **Where:** `components/governance/` directory
- **Effort:** 8-10 hours (same for both)

**Verdict:** ✅ **Both equal** - Pure customization needed

---

### Requirement 2: Governance Directory Structure

| Criteria                     | Nextra                    | Docusaurus             | Gap Resolution      |
| ---------------------------- | ------------------------- | ---------------------- | ------------------- |
| **File-System Routing**      | ✅ Native Next.js routing | ✅ File-based routing  | ✅ **Both support** |
| **L0/L1/L2 Organization**    | ✅ Directory structure    | ✅ Directory structure | ✅ **Both support** |
| **Sealed/Active/Amendments** | ✅ Directory-based        | ✅ Directory-based     | ✅ **Both support** |
| **Nested Navigation**        | ✅ `_meta.json` support   | ✅ Sidebar config      | ✅ **Both support** |

**Resolution Strategy:**

- **Nextra:** Create directory structure manually, use `_meta.json` for
  navigation
- **Docusaurus:** Create directory structure, use `sidebars.js` for navigation
- **Where:** `pages/` or `docs/` directory
- **Effort:** 2 hours (same for both)

**Verdict:** ✅ **Both equal** - Standard feature

---

### Requirement 3: Amendment Tracking

| Criteria                    | Nextra                 | Docusaurus               | Gap Resolution                   |
| --------------------------- | ---------------------- | ------------------------ | -------------------------------- |
| **Amendment History**       | ❌ Not provided        | ❌ Not provided          | ❌ **Pure customization needed** |
| **Amendment Chain Display** | ❌ Not provided        | ❌ Not provided          | ❌ **Pure customization needed** |
| **Status Transitions**      | ❌ Not provided        | ❌ Not provided          | ❌ **Pure customization needed** |
| **Amendment Navigation**    | ⚠️ Manual `_meta.json` | ⚠️ Manual sidebar config | ⚠️ **Both need manual setup**    |

**Resolution Strategy:**

- **Nextra:** Build `<AmendmentHistory>` component, manual navigation setup
- **Docusaurus:** Build custom component (same), use plugins for enhanced UI
- **Where:** Custom components + frontmatter metadata
- **Effort:** 6-8 hours (Nextra) vs 4-6 hours (Docusaurus - plugins help)

**Verdict:** ⚠️ **Docusaurus slightly better** - Plugin ecosystem helps, but
still custom work

---

### Requirement 4: Versioning & Document History

| Criteria                   | Nextra                        | Docusaurus              | Gap Resolution                 |
| -------------------------- | ----------------------------- | ----------------------- | ------------------------------ |
| **Built-in Versioning**    | ❌ Not provided               | ✅ Native versioning UI | ✅ **Docusaurus has built-in** |
| **Version Dropdown**       | ❌ Not provided               | ✅ Built-in component   | ✅ **Docusaurus provides**     |
| **Version Navigation**     | ⚠️ Manual directory structure | ✅ Automatic navigation | ✅ **Docusaurus provides**     |
| **File-System Versioning** | ✅ Directory-based            | ✅ Directory-based      | ✅ **Both support**            |

**Resolution Strategy:**

- **Nextra:** Manual versioning via directory structure (`v1.0/`, `v2.0/`)
- **Docusaurus:** Use built-in `@docusaurus/plugin-content-docs` versioning
- **Where:** Nextra = manual, Docusaurus = plugin config
- **Effort:** 4 hours (Nextra) vs 1 hour (Docusaurus)

**Verdict:** ✅ **Docusaurus better** - Built-in versioning UI saves time

---

### Requirement 5: Cross-Reference & Citations

| Criteria                       | Nextra              | Docusaurus          | Gap Resolution                   |
| ------------------------------ | ------------------- | ------------------- | -------------------------------- |
| **MDX Link Support**           | ✅ Native MDX links | ✅ Native MDX links | ✅ **Both support**              |
| **Constitutional Citations**   | ❌ Not provided     | ❌ Not provided     | ❌ **Pure customization needed** |
| **Broken Reference Detection** | ❌ Not provided     | ⚠️ Plugin available | ⚠️ **Docusaurus has plugin**     |
| **Citation Components**        | ❌ Not provided     | ❌ Not provided     | ❌ **Pure customization needed** |

**Resolution Strategy:**

- **Nextra:** Build `<ConstitutionalCitation>` component, manual validation
- **Docusaurus:** Build component + use `remark-validate-links` plugin
- **Where:** Custom components + build-time validation
- **Effort:** 4 hours (Nextra) vs 2 hours (Docusaurus - plugin helps)

**Verdict:** ⚠️ **Docusaurus slightly better** - Plugin ecosystem helps

---

### Requirement 6: Governance Workflow Integration

| Criteria                    | Nextra          | Docusaurus      | Gap Resolution                          |
| --------------------------- | --------------- | --------------- | --------------------------------------- |
| **Git Hooks**               | ✅ Standard Git | ✅ Standard Git | ✅ **Both support**                     |
| **Hash Computation**        | ❌ Not provided | ❌ Not provided | ❌ **Both need custom scripts**         |
| **Ledger Integration**      | ❌ Not provided | ❌ Not provided | ❌ **Both need custom API integration** |
| **Sealing Workflow**        | ❌ Not provided | ❌ Not provided | ❌ **Both need custom automation**      |
| **TITAN Audit Integration** | ❌ Not provided | ❌ Not provided | ❌ **Both need custom integration**     |

**Resolution Strategy:**

- **Nextra:** Custom Node.js scripts, Git hooks, API integration
- **Docusaurus:** Custom Node.js scripts, Git hooks, API integration
- **Where:** Build scripts, Git hooks, CI/CD integration
- **Effort:** 20-25 hours (same for both)

**Verdict:** ✅ **Both equal** - Pure customization needed

---

### Requirement 7: Search & Discovery

| Criteria                  | Nextra                   | Docusaurus          | Gap Resolution             |
| ------------------------- | ------------------------ | ------------------- | -------------------------- |
| **Full-Text Search**      | ⚠️ Manual implementation | ✅ Built-in search  | ✅ **Docusaurus provides** |
| **Algolia Integration**   | ⚠️ Manual setup          | ✅ Plugin available | ✅ **Docusaurus easier**   |
| **Status Filtering**      | ❌ Not provided          | ❌ Not provided     | ❌ **Both need custom**    |
| **Layer-Based Filtering** | ❌ Not provided          | ❌ Not provided     | ❌ **Both need custom**    |

**Resolution Strategy:**

- **Nextra:** Manual search implementation or third-party (Algolia, Pagefind)
- **Docusaurus:** Built-in search + Algolia plugin
- **Where:** Nextra = custom, Docusaurus = plugin config
- **Effort:** 6-8 hours (Nextra) vs 2-3 hours (Docusaurus)

**Verdict:** ✅ **Docusaurus better** - Built-in search saves time

---

### Requirement 8: Monorepo Integration

| Criteria              | Nextra              | Docusaurus            | Gap Resolution       |
| --------------------- | ------------------- | --------------------- | -------------------- |
| **Next.js Native**    | ✅ Built on Next.js | ❌ Separate framework | ✅ **Nextra native** |
| **Turborepo Support** | ✅ Standard Next.js | ⚠️ Requires config    | ✅ **Nextra easier** |
| **pnpm Workspace**    | ✅ Standard package | ✅ Standard package   | ✅ **Both support**  |
| **Shared Components** | ✅ Direct import    | ⚠️ Requires config    | ✅ **Nextra easier** |

**Resolution Strategy:**

- **Nextra:** Standard Next.js monorepo setup
- **Docusaurus:** Requires additional config for monorepo
- **Where:** Package structure and build config
- **Effort:** 0.5 hours (Nextra) vs 2 hours (Docusaurus)

**Verdict:** ✅ **Nextra better** - Native Next.js integration

---

### Requirement 9: Vercel Deployment

| Criteria                | Nextra                | Docusaurus                 | Gap Resolution             |
| ----------------------- | --------------------- | -------------------------- | -------------------------- |
| **Vercel Optimization** | ✅ Native Next.js     | ⚠️ Works but not optimized | ✅ **Nextra optimized**    |
| **One-Click Deploy**    | ✅ Template available | ✅ Template available      | ✅ **Both have templates** |
| **Preview Deployments** | ✅ Automatic          | ✅ Automatic               | ✅ **Both support**        |
| **Build Performance**   | ✅ Fast (Next.js)     | ⚠️ Slower builds           | ✅ **Nextra faster**       |

**Resolution Strategy:**

- **Nextra:** Zero-config Vercel deployment
- **Docusaurus:** Works on Vercel but requires build config
- **Where:** Vercel project settings
- **Effort:** 0.5 hours (Nextra) vs 1-2 hours (Docusaurus)

**Verdict:** ✅ **Nextra better** - Native Vercel optimization

---

### Requirement 10: Customization & Extensibility

| Criteria                | Nextra                | Docusaurus               | Gap Resolution           |
| ----------------------- | --------------------- | ------------------------ | ------------------------ |
| **MDX Components**      | ✅ Full React support | ✅ Full React support    | ✅ **Both support**      |
| **Theme Customization** | ✅ Tailwind CSS       | ✅ CSS modules + themes  | ✅ **Both customizable** |
| **Plugin System**       | ⚠️ Limited plugins    | ✅ Rich plugin ecosystem | ✅ **Docusaurus better** |
| **Custom Layouts**      | ✅ Next.js layouts    | ✅ Custom layouts        | ✅ **Both support**      |

**Resolution Strategy:**

- **Nextra:** Custom React components, Tailwind styling
- **Docusaurus:** Custom components + plugins
- **Where:** Components directory + theme config
- **Effort:** Similar for governance-specific features

**Verdict:** ⚠️ **Docusaurus better** - More plugins, but governance features
still custom

---

## Summary Matrix: Missing Features & Resolution

### Features NOT Available (Require Pure Customization)

| Feature                       | Nextra | Docusaurus | Resolution Method            |
| ----------------------------- | ------ | ---------- | ---------------------------- |
| **Seal Status Indicators**    | ❌     | ❌         | Custom React component       |
| **Hash Verification UI**      | ❌     | ❌         | Custom React component       |
| **Amendment History Display** | ❌     | ❌         | Custom React component       |
| **Constitutional Citations**  | ❌     | ❌         | Custom MDX component         |
| **Ledger Integration**        | ❌     | ❌         | Custom API integration       |
| **Sealing Workflow**          | ❌     | ❌         | Custom Git hooks + scripts   |
| **TITAN Audit Integration**   | ❌     | ❌         | Custom CI/CD integration     |
| **Status Filtering**          | ❌     | ❌         | Custom search implementation |

**Resolution Location:**

- **Components:** `components/governance/` (both tools)
- **Scripts:** `scripts/` directory (both tools)
- **Git Hooks:** `.git/hooks/` (both tools)
- **CI/CD:** GitHub Actions / Vercel (both tools)

**Effort:** 40-50 hours of custom development (same for both)

---

### Features Partially Available (Need Configuration)

| Feature          | Nextra          | Docusaurus        | Resolution Method                       |
| ---------------- | --------------- | ----------------- | --------------------------------------- |
| **Versioning**   | ⚠️ Manual       | ✅ Built-in       | Nextra: manual, Docusaurus: plugin      |
| **Search**       | ⚠️ Manual       | ✅ Built-in       | Nextra: third-party, Docusaurus: plugin |
| **Navigation**   | ⚠️ `_meta.json` | ✅ Sidebar config | Both: manual config                     |
| **Broken Links** | ❌ Manual       | ⚠️ Plugin         | Docusaurus: `remark-validate-links`     |

**Resolution Location:**

- **Nextra:** Manual implementation or third-party tools
- **Docusaurus:** Plugin configuration in `docusaurus.config.js`

**Effort:** 10-15 hours (Nextra) vs 3-5 hours (Docusaurus)

---

### Features Fully Available (No Customization Needed)

| Feature                 | Nextra | Docusaurus |
| ----------------------- | ------ | ---------- |
| **MDX Support**         | ✅     | ✅         |
| **File-System Routing** | ✅     | ✅         |
| **TypeScript**          | ✅     | ✅         |
| **Vercel Deployment**   | ✅     | ✅         |
| **Git Integration**     | ✅     | ✅         |
| **Monorepo Support**    | ✅     | ✅         |

---

## Practical Recommendation

### ✅ **Nextra is Most Practical**

**Reasons:**

1. **Monorepo Integration (Critical)**
   - Native Next.js = seamless Turborepo integration
   - Shared components work out-of-the-box
   - **Saves 1.5 hours** vs Docusaurus

2. **Vercel Optimization (Important)**
   - Zero-config deployment
   - Faster builds
   - **Saves 1 hour** vs Docusaurus

3. **Governance Features (60% of work)**
   - **Same customization effort for both tools**
   - All governance-specific features need custom development
   - Nextra's simplicity = easier customization

4. **Versioning Trade-off**
   - Docusaurus has built-in versioning UI
   - **But:** File-system versioning (Nextra approach) aligns better with sealed
     documents
   - Governance structure (L0/L1/L2) doesn't need version dropdowns

5. **Search Trade-off**
   - Docusaurus has built-in search
   - **But:** Can add Pagefind or Algolia to Nextra (2-3 hours)
   - Not critical for governance docs (smaller corpus)

**Total Effort Comparison:**

| Task                      | Nextra  | Docusaurus | Difference |
| ------------------------- | ------- | ---------- | ---------- |
| **Monorepo Setup**        | 0.5h    | 2h         | **-1.5h**  |
| **Vercel Deployment**     | 0.5h    | 1.5h       | **-1h**    |
| **Versioning**            | 4h      | 1h         | **+3h**    |
| **Search**                | 6h      | 2h         | **+4h**    |
| **Governance Components** | 40h     | 40h        | **0h**     |
| **Workflow Integration**  | 20h     | 20h        | **0h**     |
| **Total**                 | **71h** | **66.5h**  | **+4.5h**  |

**Net Difference: 4.5 hours** (6% more effort for Nextra)

**But:** Nextra's advantages (monorepo, Vercel, simplicity) outweigh the
4.5-hour difference.

---

## Missing Features Resolution Guide

### 1. Seal Status Indicators

**Status:** ❌ Not available in either tool **Resolution:** Pure customization
**Where:** `components/governance/SealStatus.tsx` **How:**

```tsx
// Nextra: Custom MDX component
<SealStatus status="sealed" hash="sha256:..." />

// Docusaurus: Same approach
```

**Effort:** 2-3 hours

---

### 2. Amendment Tracking

**Status:** ❌ Not available in either tool **Resolution:** Pure customization
**Where:** `components/governance/AmendmentHistory.tsx` **How:**

- Build React component
- Parse frontmatter metadata
- Display amendment chain

**Effort:** 6-8 hours

---

### 3. Hash Verification

**Status:** ❌ Not available in either tool **Resolution:** Pure customization
**Where:** `components/governance/HashVerification.tsx` + build script **How:**

- Component: Display hash + copy button
- Script: Compute SHA-256 on build
- Validation: Compare against stored hash

**Effort:** 4-6 hours

---

### 4. Ledger Integration

**Status:** ❌ Not available in either tool **Resolution:** Custom API
integration **Where:** `lib/ledger-api.ts` + components **How:**

- Create API client
- Fetch ledger entries
- Display in components

**Effort:** 8-10 hours (depends on ledger API)

---

### 5. Sealing Workflow

**Status:** ❌ Not available in either tool **Resolution:** Custom Git hooks +
scripts **Where:** `.git/hooks/pre-commit` + `scripts/seal-document.ts` **How:**

- Pre-commit hook: Check sealed docs not modified
- Script: Compute hash, update frontmatter
- CI/CD: Verify on deployment

**Effort:** 10-12 hours

---

### 6. Versioning (Nextra Specific)

**Status:** ⚠️ Manual in Nextra **Resolution:** Directory structure + navigation
**Where:** `pages/sealed/nexus-canon-constitution/v1.0/` **How:**

- Create version directories
- Update `_meta.json` for navigation
- Link between versions

**Effort:** 4 hours

**Alternative:** Use Docusaurus if versioning UI is critical (saves 3 hours)

---

### 7. Search (Nextra Specific)

**Status:** ⚠️ Manual in Nextra **Resolution:** Third-party integration
**Where:** `lib/search.ts` + search component **Options:**

- **Pagefind:** Static search (recommended)
- **Algolia:** Full-text search (paid)
- **Custom:** Build search index

**Effort:** 6-8 hours

**Alternative:** Use Docusaurus if search is critical (saves 4-5 hours)

---

## Final Verdict

### ✅ **Nextra is Most Practical**

**Primary Reasons:**

1. Native Next.js = better monorepo integration
2. Vercel optimization = faster deployments
3. Simpler architecture = easier governance customization
4. File-system versioning aligns with sealed document structure

**When to Choose Docusaurus:**

- If versioning UI is critical (version dropdowns needed)
- If search is critical (large documentation corpus)
- If plugin ecosystem is important (many standard features needed)

**For NexusCanon-AXIS:**

- Governance docs are smaller corpus (search less critical)
- File-system versioning better for sealed documents
- Monorepo integration is critical
- **Nextra is the practical choice**

---

## Implementation Roadmap

### Phase 1: Foundation (Nextra)

1. ✅ Install Nextra template
2. ✅ Integrate into monorepo
3. ✅ Create governance directory structure
4. ⚠️ Configure navigation (`_meta.json`)

**Effort:** 3-4 hours

### Phase 2: Custom Components

1. ❌ Build governance components (7 components)
2. ❌ Create frontmatter schema
3. ❌ Add TypeScript interfaces

**Effort:** 10-12 hours

### Phase 3: Document Migration

1. ❌ Migrate sealed documents
2. ❌ Add frontmatter metadata
3. ❌ Compute hashes
4. ❌ Update cross-references

**Effort:** 20-24 hours

### Phase 4: Workflow Integration

1. ❌ Git hooks for sealed docs
2. ❌ Hash computation automation
3. ❌ Ledger integration (if API exists)
4. ❌ Amendment tracking

**Effort:** 20-25 hours

### Phase 5: Search & Polish

1. ⚠️ Add Pagefind search
2. ⚠️ Status filtering
3. ⚠️ Final testing

**Effort:** 8-10 hours

**Total Effort:** 61-75 hours

---

**End of Comparison Report**
