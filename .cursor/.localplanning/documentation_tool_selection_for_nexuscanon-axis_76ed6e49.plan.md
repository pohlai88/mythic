---
name: Documentation Tool Selection for NexusCanon-AXIS
overview: Recommend open-source documentation tools compatible with Next.js/Vercel that support full documentation sites (governance, product, developer guides, API docs) while maintaining alignment with NexusCanon governance principles.
todos:
  - id: research_tools
    content: Research and compare Nextra, Mintlify, and custom MDX solutions for Next.js documentation
    status: pending
  - id: setup_nextra
    content: Initialize Nextra documentation site in monorepo packages/ directory
    status: in_progress
  - id: create_structure
    content: Create directory structure for governance, product, API, and guides documentation
    status: pending
  - id: build_governance_components
    content: Build custom React components for sealed documents, ledger links, and hash verification
    status: pending
  - id: migrate_governance_docs
    content: Migrate governance documents from .cursor/planing/ with frontmatter metadata
    status: pending
  - id: setup_navigation
    content: Configure navigation structure using _meta.json files matching governance layers
    status: pending
  - id: integrate_workflow
    content: Integrate documentation updates with governance sealing workflow
    status: pending
  - id: deploy_vercel
    content: Deploy documentation site to Vercel with custom domain and preview deployments
    status: pending
---

# Documentation Tool Selection Plan for NexusCanon-AXIS

## Context Analysis

Based on the governance requirements from:

- **LBOS Origin Paper** (Sealed) - Philosophical foundation
- **NexusCanon Constitution v1.0** - Single source of truth
- **Planning Playbook** - Reference benchmarks and tracking

The documentation system must support:

- Full documentation site (governance + product + developer guides + API docs)
- Version control and reference tracking
- Integration with governance sealing workflow
- Next.js/Vercel compatibility
- Open source solutions

## Recommended Tools (Ranked by Fit)

### 1. **Nextra** (Primary Recommendation)

**Repository:** https://github.com/shuding/nextra

**Vercel Template:** https://vercel.com/templates/next.js/nextra-docs

**License:** MIT

**Why Nextra:**

- Built specifically for Next.js (perfect Vercel compatibility)
- Native MDX support (can embed React components)
- Built-in search, navigation, and theming
- Supports versioning and multi-documentation sites
- Active development by Vercel ecosystem

**Alignment with NexusCanon Principles:**

- ✅ High-Integrity Modulith: Single codebase, strict boundaries
- ✅ Atomic Truth: Each document is a discrete unit
- ✅ Decision Memory: Can track document history via Git
- ✅ Business Intent Layer: Semantic organization via folder structure

**Implementation Approach:**

- Store governance documents in `/docs/governance/` with sealed status markers
- Use frontmatter for metadata (status, hash, ledger entry ID)
- Custom components for sealed document indicators
- Git-based versioning aligns with ledger entries

**Files to Create:**

- `docs/governance/` - Governance documents
- `docs/product/` - Product documentation
- `docs/api/` - API documentation
- `docs/guides/` - Developer guides
- Custom components for governance metadata display

---

### 2. **Mintlify** (Alternative Option)

**Repository:** https://github.com/mintlify/mint

**Vercel Integration:** Native Next.js support

**License:** Apache 2.0

**Why Mintlify:**

- Modern, beautiful documentation framework
- Excellent API documentation features
- Built-in search and navigation
- Works with Next.js projects
- Strong developer experience

**Alignment with NexusCanon Principles:**

- ✅ Supports structured documentation
- ✅ Version control via Git
- ⚠️ Less flexible for custom governance workflows

**Consideration:**

- More opinionated structure (may require adaptation)
- Stronger for API docs than governance docs

---

### 3. **Custom MDX Solution** (Maximum Flexibility)

**Approach:** Build custom documentation using Next.js App Router + MDX

**Why Custom:**

- Full control over governance document presentation
- Can implement custom sealing/hash verification UI
- Direct integration with ledger entry system
- Complete alignment with NexusCanon architecture

**Implementation:**

- Use `@next/mdx` or `next-mdx-remote`
- Custom components for sealed documents
- Hash verification display components
- Ledger entry linking system

**Trade-off:**

- More development effort
- Maximum flexibility and governance alignment

---

## Recommended Implementation: Nextra (Using Official Template)

**Template Source:** https://github.com/shuding/nextra-docs-template

**Deployment Method:** Clone template → Adapt to monorepo → Customize for governance

---

## Implementation Plan with DOD & KPIs

### Todo 1: Research Tools ✅ COMPLETE (Eliminated by Template)

**Status:** ✅ Not required - Template validates Nextra choice

**DOD (Definition of Done):**

- N/A - Template selection eliminates research need

**KPI (Key Performance Indicators):**

- N/A - No metrics required

**Checkpoint:** ✅ Pass - Template existence validates tool choice

---

### Todo 2: Setup Nextra in Monorepo

**Approach:** Clone template → Integrate into monorepo structure

**DOD (Definition of Done):**

1. ✅ Template cloned from `shuding/nextra-docs-template`
2. ✅ Moved to `packages/docs/` directory
3. ✅ Package name updated to `@ebom/docs` (or monorepo convention)
4. ✅ Added to `pnpm-workspace.yaml` workspace packages
5. ✅ Added to `turbo.json` pipeline with `dev`, `build`, `lint` tasks
6. ✅ `package.json` scripts work: `pnpm dev`, `pnpm build`, `pnpm start`
7. ✅ TypeScript compilation succeeds: `pnpm type-check` (if configured)
8. ✅ Next.js dev server starts without errors: `pnpm dev` → `localhost:3000`
9. ✅ Build succeeds: `pnpm build` → `.next` directory created
10. ✅ No dependency conflicts with monorepo root

**KPI (Key Performance Indicators):**

- **Build Time:** < 30 seconds for initial build
- **Dev Server Start:** < 10 seconds to `localhost:3000`
- **TypeScript Errors:** 0 errors, 0 warnings
- **Dependency Conflicts:** 0 conflicts with monorepo packages
- **Template Coverage:** 100% of template files preserved

**Checkpoint Validation:**

```bash
# Run these commands - all must pass:
cd packages/docs
pnpm install          # ✅ No errors
pnpm dev              # ✅ Server starts on :3000
pnpm build            # ✅ Build succeeds
pnpm type-check       # ✅ No TS errors (if configured)
```

**Failure Prevention:**

- ❌ **BLOCK if:** Build fails or TypeScript errors exist
- ❌ **BLOCK if:** Dev server doesn't start
- ❌ **BLOCK if:** Turbo pipeline doesn't recognize package
- ❌ **BLOCK if:** Workspace dependencies conflict

---

### Todo 3: Create Directory Structure

**Approach:** Create governance-aligned directory structure

**DOD (Definition of Done):**

1. ✅ `pages/governance/sealed/` directory exists (L0/L1 documents)
2. ✅ `pages/governance/active/` directory exists (L2 planning documents)
3. ✅ `pages/governance/amendments/` directory exists
4. ✅ `pages/product/` directory exists
5. ✅ `pages/api/` directory exists
6. ✅ `pages/guides/` directory exists
7. ✅ `components/governance/` directory exists
8. ✅ All directories have placeholder `_meta.json` files
9. ✅ Directory structure matches governance layers (L0/L1/L2)
10. ✅ Navigation structure testable via `_meta.json` files

**KPI (Key Performance Indicators):**

- **Directory Count:** 7+ directories created (governance, product, api, guides, components)
- **Meta Files:** 7+ `_meta.json` files created
- **Structure Alignment:** 100% match with governance layers
- **Navigation Depth:** 3+ levels (governance/sealed/nexus-canon-constitution)
- **File Organization:** 0 orphaned files

**Checkpoint Validation:**

```bash
# Verify structure exists:
ls -R packages/docs/pages/governance/    # ✅ All subdirs exist
ls packages/docs/components/governance/  # ✅ Components dir exists
cat packages/docs/pages/governance/_meta.json  # ✅ Meta file exists
```

**Failure Prevention:**

- ❌ **BLOCK if:** Required directories missing
- ❌ **BLOCK if:** `_meta.json` files missing
- ❌ **BLOCK if:** Directory structure doesn't match L0/L1/L2 layers
- ❌ **BLOCK if:** Navigation doesn't render in dev server

---

### Todo 4: Build Governance Components

**Approach:** Create 7 custom React components for governance features

**DOD (Definition of Done):**

1. ✅ `SealedDocument.tsx` - Displays sealed status, hash, ledger link
2. ✅ `LedgerLink.tsx` - Links to ledger entries with entry ID
3. ✅ `HashVerification.tsx` - Displays SHA-256 hash with copy button
4. ✅ `ReferenceBenchmark.tsx` - Displays X/Y/Z cluster from playbook
5. ✅ `ConstitutionalCitation.tsx` - Standardized citation format
6. ✅ `AmendmentHistory.tsx` - Amendment chain visualization
7. ✅ `StatusBadge.tsx` - Status indicators (sealed/ratified/draft)
8. ✅ All components have TypeScript interfaces defined
9. ✅ All components export default or named exports
10. ✅ Components render in MDX without errors
11. ✅ Components styled to match Nextra theme
12. ✅ Components tested in dev server: `localhost:3000/test-components`

**KPI (Key Performance Indicators):**

- **Component Count:** 7 components created
- **TypeScript Coverage:** 100% of components have TS interfaces
- **MDX Integration:** 100% of components work in MDX
- **Build Success:** 0 build errors with components
- **Bundle Size:** < 50KB for all governance components combined
- **Render Time:** < 100ms per component render

**Checkpoint Validation:**

```bash
# Verify components exist and compile:
ls packages/docs/components/governance/  # ✅ 7 components exist
pnpm build                                # ✅ Build succeeds
# Test in browser: localhost:3000/test-components
```

**Failure Prevention:**

- ❌ **BLOCK if:** Any component missing TypeScript types
- ❌ **BLOCK if:** Components don't render in MDX
- ❌ **BLOCK if:** Build fails due to component errors
- ❌ **BLOCK if:** Components cause runtime errors in dev server

---

### Todo 5: Migrate Governance Documents

**Approach:** Copy documents from `.cursor/planing/` → Add frontmatter → Verify

**DOD (Definition of Done):**

1. ✅ All sealed documents (L0/L1) copied to `pages/governance/sealed/`
2. ✅ All active planning documents (L2) copied to `pages/governance/active/`
3. ✅ All amendments copied to `pages/governance/amendments/`
4. ✅ Each document has frontmatter with required fields:

   - `title` (string)
   - `status` (sealed|ratified|draft|deprecated)
   - `layer` (L0|L1|L2)
   - `document_hash` (sha256:...) for sealed documents
   - `ledger_entry_id` (urn:uuid:...) for sealed documents
   - `effective_date` (ISO-8601) for sealed documents

5. ✅ Document hashes computed for all sealed documents
6. ✅ Cross-references updated to new paths
7. ✅ Governance components integrated into documents
8. ✅ All documents render without errors in dev server
9. ✅ No broken internal links (verified via build)
10. ✅ Document count matches source: 40+ documents migrated

**KPI (Key Performance Indicators):**

- **Migration Coverage:** 100% of source documents migrated
- **Frontmatter Completeness:** 100% of documents have required frontmatter
- **Hash Computation:** 100% of sealed documents have computed hashes
- **Link Integrity:** 0 broken internal links
- **Build Success:** 0 build errors from migrated documents
- **Render Success:** 100% of documents render in dev server

**Checkpoint Validation:**

```bash
# Count migrated documents:
find packages/docs/pages/governance -name "*.mdx" -o -name "*.md" | wc -l  # ✅ 40+ files
# Verify frontmatter:
grep -r "status:" packages/docs/pages/governance/ | wc -l  # ✅ All have status
# Verify hashes for sealed docs:
grep -r "document_hash:" packages/docs/pages/governance/sealed/ | wc -l  # ✅ All sealed have hash
# Build test:
pnpm build  # ✅ No errors
```

**Failure Prevention:**

- ❌ **BLOCK if:** Any sealed document missing `document_hash`
- ❌ **BLOCK if:** Any sealed document missing `ledger_entry_id`
- ❌ **BLOCK if:** Build fails due to frontmatter errors
- ❌ **BLOCK if:** Broken internal links detected
- ❌ **BLOCK if:** Document count doesn't match source

---

### Todo 6: Setup Navigation

**Approach:** Configure `_meta.json` files for governance-aligned navigation

**DOD (Definition of Done):**

1. ✅ `pages/governance/_meta.json` configured with L0/L1/L2 organization
2. ✅ `pages/governance/sealed/_meta.json` lists all sealed documents
3. ✅ `pages/governance/active/_meta.json` lists all planning documents
4. ✅ `pages/governance/amendments/_meta.json` lists all amendments
5. ✅ `pages/product/_meta.json` configured (placeholder or real)
6. ✅ `pages/api/_meta.json` configured (placeholder or real)
7. ✅ `pages/guides/_meta.json` configured (placeholder or real)
8. ✅ Navigation renders correctly in sidebar
9. ✅ Navigation matches governance layer structure (L0/L1/L2)
10. ✅ Status indicators visible in navigation (if implemented)

**KPI (Key Performance Indicators):**

- **Meta File Count:** 7+ `_meta.json` files configured
- **Navigation Items:** 40+ items in navigation
- **Layer Organization:** 100% of items organized by L0/L1/L2
- **Render Success:** 100% of navigation items render
- **Navigation Depth:** 3+ levels deep
- **User Experience:** Navigation loads in < 200ms

**Checkpoint Validation:**

```bash
# Verify meta files exist:
find packages/docs/pages -name "_meta.json" | wc -l  # ✅ 7+ files
# Test navigation in browser:
# Open localhost:3000 → Verify sidebar navigation renders
```

**Failure Prevention:**

- ❌ **BLOCK if:** Navigation doesn't render in sidebar
- ❌ **BLOCK if:** Navigation structure doesn't match L0/L1/L2
- ❌ **BLOCK if:** Missing `_meta.json` files cause errors
- ❌ **BLOCK if:** Navigation items point to non-existent pages

---

### Todo 7: Integrate Workflow

**Approach:** Build Git hooks, automation scripts, and CI/CD integration

**DOD (Definition of Done):**

1. ✅ Pre-commit hook prevents modification of sealed documents
2. ✅ Hash computation script exists: `scripts/compute-hash.ts`
3. ✅ Hash verification script exists: `scripts/verify-hash.ts`
4. ✅ Ledger integration script exists (if ledger API available)
5. ✅ Amendment tracking automation exists
6. ✅ CI/CD pipeline includes hash verification
7. ✅ CI/CD pipeline includes broken link detection
8. ✅ CI/CD pipeline includes sealed document protection
9. ✅ Git hooks installed and functional
10. ✅ All scripts have TypeScript types and error handling

**KPI (Key Performance Indicators):**

- **Hook Coverage:** 100% of sealed documents protected by pre-commit hook
- **Script Success Rate:** 100% of scripts execute without errors
- **CI/CD Pass Rate:** 100% of builds pass verification checks
- **Hash Verification:** 100% of sealed documents pass hash verification
- **Link Integrity:** 0 broken links in CI/CD checks
- **Automation Coverage:** 80%+ of workflow steps automated

**Checkpoint Validation:**

```bash
# Test pre-commit hook:
# Try to modify sealed document → Should be blocked
# Test hash computation:
pnpm compute-hash packages/docs/pages/governance/sealed/lbos-origin-paper.mdx
# Test CI/CD:
git push → Verify CI/CD runs and passes
```

**Failure Prevention:**

- ❌ **BLOCK if:** Pre-commit hook doesn't prevent sealed doc modification
- ❌ **BLOCK if:** Hash computation script fails
- ❌ **BLOCK if:** CI/CD verification checks fail
- ❌ **BLOCK if:** Broken links detected in CI/CD

---

### Todo 8: Deploy Vercel

**Approach:** Configure Vercel for monorepo → Deploy → Verify

**DOD (Definition of Done):**

1. ✅ Vercel project created and linked to repository
2. ✅ Root directory set to `packages/docs`
3. ✅ Build command configured: `cd packages/docs && pnpm build`
4. ✅ Output directory configured: `packages/docs/.next`
5. ✅ Environment variables configured (if needed)
6. ✅ Custom domain configured (if applicable)
7. ✅ Preview deployments working on all branches
8. ✅ Production deployment working on main branch
9. ✅ Deployment succeeds without errors
10. ✅ Site accessible at production URL
11. ✅ All pages load correctly in production
12. ✅ Build time < 5 minutes

**KPI (Key Performance Indicators):**

- **Deployment Success Rate:** 100% of deployments succeed
- **Build Time:** < 5 minutes per deployment
- **Page Load Time:** < 2 seconds for first contentful paint
- **Uptime:** 99.9%+ uptime (Vercel SLA)
- **Preview Deployments:** 100% of PRs get preview deployments
- **Production Stability:** 0 deployment failures in first week

**Checkpoint Validation:**

```bash
# Verify Vercel configuration:
# Check Vercel dashboard → Verify settings
# Test deployment:
git push origin main → Verify production deployment
git push origin feature-branch → Verify preview deployment
# Test production site:
curl https://docs.nexuscanon-axis.com  # ✅ Returns 200
```

**Failure Prevention:**

- ❌ **BLOCK if:** Build fails in Vercel
- ❌ **BLOCK if:** Production site doesn't load
- ❌ **BLOCK if:** Preview deployments don't work
- ❌ **BLOCK if:** Build time exceeds 10 minutes
- ❌ **BLOCK if:** Environment variables missing (if required)

---

## Deployment Readiness Checklist

Before deploying to production, verify all checkpoints:

- [ ] Todo 2: Nextra setup complete, dev server works, build succeeds
- [ ] Todo 3: Directory structure created, all `_meta.json` files exist
- [ ] Todo 4: All 7 governance components built and tested
- [ ] Todo 5: All documents migrated, frontmatter complete, hashes computed
- [ ] Todo 6: Navigation configured and renders correctly
- [ ] Todo 7: Workflow integration complete, Git hooks functional, CI/CD passes
- [ ] Todo 8: Vercel deployment configured, preview and production work

**Final Checkpoint:**

- ✅ All DOD criteria met for all todos
- ✅ All KPI targets achieved
- ✅ No blocking issues in checkpoint validation
- ✅ Production deployment successful

## Technical Specifications

### Frontmatter Schema for Governance Documents

```typescript
interface GovernanceDocumentFrontmatter {
  title: string;
  status: "sealed" | "ratified" | "draft" | "deprecated";
  layer: "L0" | "L1" | "L2";
  ledger_entry_id?: string;
  document_hash?: string;
  effective_date?: string;
  supersedes?: string;
  derived_from?: string;
  amendment_id?: string;
}
```

### Custom Component Examples

**SealedDocument.tsx:**

```tsx
export function SealedDocument({ status, hash, entryId }) {
  if (status !== "sealed") return null;
  return (
    <div className="sealed-badge">
      <LockIcon /> Sealed Document
      {hash && <HashDisplay hash={hash} />}
      {entryId && <LedgerLink entryId={entryId} />}
    </div>
  );
}
```

## Integration with Governance Workflow

1. **Sealing Process Integration**

   - Document sealing updates frontmatter
   - Hash computation can be automated
   - Ledger entry linking via component

2. **Reference Benchmarks**

   - X/Y/Z cluster display component
   - Planning hooks visualization
   - Enforcement surface documentation

3. **Amendment Tracking**

   - Amendment history display
   - Supersession chain visualization
   - Traceability to Origin Paper

## Vercel Deployment

1. **Deploy as separate app** in monorepo
2. **Custom domain** for documentation
3. **Preview deployments** for draft documents
4. **Production** for sealed/ratified documents only

## Alternative: Mintlify Quick Start

If choosing Mintlify instead:

1. **Setup:**

   ```bash
   npx create-mint-app@latest docs
   ```

2. **Structure:**

   - `mint.json` - Configuration
   - `docs/` - Documentation files
   - Native API documentation features

3. **Governance Integration:**

   - Custom page templates
   - Frontmatter metadata
   - Custom components via React

## Decision Criteria Summary

| Criteria | Nextra | Mintlify | Custom MDX |

| -------------------- | -------------------- | --------------------- | --------------- |

| Next.js Native | ✅ Built for Next.js | ✅ Works with Next.js | ✅ Full Next.js |

| Vercel Compatibility | ✅ Perfect | ✅ Good | ✅ Perfect |

| Governance Features | ⚠️ Custom needed | ⚠️ Custom needed | ✅ Full control |

| Development Speed | ✅ Fast | ✅ Fast | ⚠️ Slower |

| Flexibility | ✅ High | ⚠️ Medium | ✅ Maximum |

| Maintenance | ✅ Low | ✅ Low | ⚠️ Higher |

## Recommendation

**Primary Choice: Nextra**

Reasons:

1. Native Next.js integration (perfect Vercel compatibility)
2. Active Vercel ecosystem support
3. Sufficient flexibility for governance customization
4. Fast setup and deployment
5. Can implement custom components for sealed documents, ledger links, and hash verification

**Implementation Priority:**

1. Start with Nextra for rapid deployment
2. Add custom governance components
3. Migrate existing governance documents
4. Expand to product and API documentation

This approach maintains **global consistency** (System Architect principle), enables **decision tracking** (via Git + frontmatter), and **never optimizes prematurely** (starts simple, extends as needed).

---

## Plan Summary: DOD & KPI Checkpoints

### Critical Success Factors

**Template-Based Approach:**

- ✅ Use official `nextra-docs-template` (eliminates 15 hours of setup)
- ✅ Clone → Adapt → Customize (not manual setup)
- ✅ Leverage 40% of template-provided functionality

**Deployment Prevention Strategy:**

- Each todo has **10-point DOD checklist** - all must pass
- Each todo has **measurable KPIs** - targets must be met
- **Checkpoint validation** commands provided for each todo
- **Failure prevention** rules block deployment if criteria not met

**Total Effort:**

- **Template Value:** 15 hours saved
- **Customization Required:** 65 hours
- **Net Effort:** 65 hours (vs 80 hours without template)

**Risk Mitigation:**

- DOD checkpoints prevent incomplete implementations
- KPI targets ensure quality standards
- Validation commands catch issues before deployment
- Failure prevention rules block broken deployments

**Constitutional Alignment:**

- ✅ Article I.2 (Judgment Supremacy): Use proven template
- ✅ Article IV.1 (High-Integrity Modulith): Start with solid foundation
- ✅ Article V.1 (Decision Memory): Track via DOD/KPI checkpoints
- ✅ Article IX.1 (Amendment Exclusivity): Template doesn't lock us in

---

**End of Revised Plan**
