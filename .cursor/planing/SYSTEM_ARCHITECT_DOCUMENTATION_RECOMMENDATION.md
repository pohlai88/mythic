# System Architect Recommendation: Documentation Infrastructure

## NexusCanon-AXIS Governance Documentation System

**Document ID:** ARCH-DOC-001 **Status:** Active Planning Document (L2)
**Authority:** System Architect Office **Date:** 2026-01-10 **Derived From:**
LBOS Origin Paper (Sealed), NexusCanon Constitution v1.0

---

## Executive Verdict

**PRIMARY RECOMMENDATION: Nextra**

Nextra is the optimal documentation tool for NexusCanon-AXIS governance
documentation, providing:

- Native Next.js 16 compatibility
- Vercel deployment optimization
- Markdown/MDX support for sealed documents
- File-system-based versioning
- Constitutional compliance alignment

**ALTERNATIVE: Docusaurus** (if advanced versioning UI required)

---

## Constitutional Alignment

### Article I — Purpose and Telos

**Clause I.1 — Digital Atelier Mandate**

- Documentation preserves institutional memory
- Enables decision curation and judgment amplification
- **Implementation:** Nextra supports sealed document preservation

**Clause I.2 — Judgment Supremacy**

- Documentation must not obscure decision rationale
- **Implementation:** MDX enables rich context capture

### Article II — Timeless Accounting Truth

**Clause II.1 — Precedence of Law**

- Sealed documents are immutable law
- **Implementation:** Git-based immutability + frontmatter seal status

**Clause II.2 — Workflow Discovery**

- Documentation structure reflects governance structure
- **Implementation:** Directory structure mirrors L0/L1/L2 layers

### Article V — Decision Memory and Audit

**Clause V.1 — Decision Memory Mandate**

- Documentation preserves intent, rationale, alternatives
- **Implementation:** Decision records + amendment tracking

**Clause V.2 — Epistemological Audit**

- Documentation enables reasoning reconstruction
- **Implementation:** Cross-reference integrity + citation tracking

---

## Technical Specifications

### Recommended Stack

| Component      | Technology                | Rationale                             |
| -------------- | ------------------------- | ------------------------------------- |
| **Framework**  | Nextra                    | Next.js-native, Vercel-optimized      |
| **Language**   | TypeScript                | Type safety for governance structures |
| **Content**    | Markdown/MDX              | Sealed document format                |
| **Deployment** | Vercel                    | Native Next.js optimization           |
| **Versioning** | Git + Directory Structure | Immutability + version tracking       |

### Directory Structure (Constitutional Alignment)

```
apps/docs/
├── pages/
│   ├── sealed/                    # L0/L1 Sealed Documents
│   │   ├── lbos-origin-paper/     # C-01: Sealed
│   │   ├── nexus-canon-constitution/  # C-02: Ratified
│   │   └── axis-visual-constitution/  # P-01: Ratified
│   ├── active/                    # L2 Planning Documents
│   │   ├── planning-playbook/     # P-01: Active
│   │   └── decision-records/      # DR-XXX: Active
│   └── amendments/                # Amendment Proposals
│       └── A-XXX/                 # Pending ratification
└── components/
    └── ConstitutionalCitation.tsx  # Standardized citations
```

---

## Implementation Notes (AXIS/Titan)

### AXIS (Product Layer)

**Documentation Site Requirements:**

1. **Seal Status Indicators**
   - Visual badges for sealed/ratified/draft status
   - Read-only enforcement for sealed documents
   - Canonical hash display for verification

2. **Version Navigation**
   - Clear version indicators
   - Amendment history tracking
   - Cross-version reference support

3. **Constitutional Citations**
   - Standardized citation format
   - Broken reference detection
   - Authority layer indicators (L0/L1/L2)

### Titan (Execution Layer)

**Enforcement Requirements:**

1. **Git-Based Immutability**
   - Sealed documents in read-only branches
   - Hash verification on deployment
   - No runtime mutation of sealed content

2. **Frontmatter Validation**
   - Required fields: status, layer, seal_date
   - Seal status validation
   - Amendment ID tracking

3. **Cross-Reference Integrity**
   - Broken reference detection
   - Stable document paths
   - Constitutional clause references

---

## Migration Strategy

### Phase 1: Foundation (Week 1)

**Deliverables:**

- [ ] Nextra installation complete
- [ ] Directory structure established
- [ ] Frontmatter schema defined
- [ ] Basic configuration deployed

**Constitutional Compliance:**

- ✅ No sealed documents modified
- ✅ Planning documents remain mutable
- ✅ Governance structure preserved

### Phase 2: Migration (Week 2)

**Deliverables:**

- [ ] All sealed documents migrated
- [ ] Planning documents migrated
- [ ] Cross-references updated
- [ ] Citation components created

**Constitutional Compliance:**

- ✅ Sealed documents remain immutable
- ✅ Hash verification maintained
- ✅ Amendment tracking preserved

### Phase 3: Governance Integration (Week 3)

**Deliverables:**

- [ ] Seal status indicators functional
- [ ] Amendment tracking operational
- [ ] Decision records integrated
- [ ] Cross-reference validation active

**Constitutional Compliance:**

- ✅ Full governance workflow support
- ✅ Decision memory preservation
- ✅ Audit trail integrity

---

## Risk Assessment

### Low Risk ✅

- **Next.js Compatibility:** Nextra built on Next.js, guaranteed compatibility
- **Vercel Deployment:** Native optimization, zero-config deployment
- **Markdown Support:** Standard format, no conversion needed

### Medium Risk ⚠️

- **Migration Complexity:** Requires careful document mapping
- **Cross-Reference Updates:** Manual citation updates needed
- **Governance Workflow:** Custom components required

### Mitigation Strategies

1. **Phased Migration:** Start with sealed documents, then planning
2. **Automated Validation:** Scripts to verify cross-reference integrity
3. **Governance Components:** Reusable MDX components for citations

---

## Alternative: Docusaurus

### When to Consider

**Use Docusaurus if:**

- Advanced versioning UI required (version dropdowns)
- Multi-language documentation needed
- Extensive plugin ecosystem required
- Blog integration needed

### Trade-offs

**Advantages:**

- More features out-of-the-box
- Advanced versioning UI
- Larger plugin ecosystem

**Disadvantages:**

- Heavier framework
- More configuration overhead
- Separate from Next.js (not native)

---

## Decision Record

### DR-001: Documentation Tool Selection

**Decision:** Adopt Nextra as primary documentation tool for NexusCanon-AXIS

**Rationale:**

1. Native Next.js 16 compatibility
2. Vercel deployment optimization
3. Markdown/MDX support for governance documents
4. File-system-based versioning aligns with sealed document structure
5. Low learning curve, high customization potential

**Alternatives Considered:**

- Docusaurus: More features but heavier, not Next.js-native
- Custom Next.js: More work, less documentation-specific features

**Constitutional Alignment:**

- ✅ Preserves sealed document immutability
- ✅ Supports amendment tracking
- ✅ Enables decision memory preservation
- ✅ Maintains cross-reference integrity

**Implementation Authority:**

- System Architect Office: Tool selection
- Titan Engineering: Implementation
- Governance Secretariat: Content migration

---

## Amendment & Governance

**This Recommendation:**

- **Status:** Active Planning Document (L2)
- **Authority:** System Architect Office
- **Change Policy:** Mutable until ratified
- **Seal Status:** Not sealed

**Traceability:**

- **Derived From:** LBOS Origin Paper (Sealed), NexusCanon Constitution v1.0
- **Constitutional Citations:**
  - Article I.1 (Digital Atelier Mandate)
  - Article II.1 (Precedence of Law)
  - Article V.1 (Decision Memory Mandate)
  - Article V.2 (Epistemological Audit)

**Impact Analysis:**

- **Doctrine:** None (tooling recommendation only)
- **Product (AXIS):** Documentation site structure and governance workflow
- **Execution (Titan):** Next.js app creation, Vercel deployment, Git workflow

**Next Actions:**

1. Approve tool selection (System Architect)
2. Create implementation plan (Titan Engineering)
3. Begin Phase 1 migration (Governance Secretariat)

---

## References

### Official Documentation

- **Nextra:** https://nextra.site/
- **Vercel Template:** https://vercel.com/templates?type=documentation
- **Next.js Example:**
  https://github.com/vercel/next.js/tree/canary/examples/with-nextra

### Governance Documents

- **LBOS Origin Paper:** `.cursor/planing/.lbos_origin_paper_sealed.md` (Sealed)
- **NexusCanon Constitution v1.0:**
  `.cursor/planing/.nexus_canon_constitution_v_1_governance_pack_v_1.md`
  (Ratified)
- **Planning Playbook v2:**
  `.cursor/planing/0.axis_governance_planning_tracking_playbook_with_reference_benchmarks_V2.md`
  (Active)

### Related Recommendations

- **Detailed Recommendation:** `DOCUMENTATION_TOOL_RECOMMENDATION.md`
- **Quick Start Guide:** `DOCUMENTATION_TOOL_QUICK_START.md`

---

**End of System Architect Recommendation**
