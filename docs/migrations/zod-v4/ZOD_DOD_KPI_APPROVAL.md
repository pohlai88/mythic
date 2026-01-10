# Zod Mandatory Enforcement - DOD & KPI for Approval

## 📋 Document Purpose

This document defines the **Definition of Done (DOD)** and **Key Performance Indicators (KPI)** for the Zod Mandatory Enforcement implementation. This must be approved before starting the implementation process.

**Governance Model**: This proposal enforces schema correctness **without sacrificing velocity**, provides **auditable escape hatches**, and ensures **no silent regression**. Approval authorizes enforcement tooling, not architectural rigidity.

---

## 🔐 Enforcement Authority Model

**Critical**: This section defines **who can block whom** to prevent political erosion and silent drift.

| Layer                  | Authority             | Can Block       | Cannot Override        |
| ---------------------- | --------------------- | --------------- | ---------------------- |
| **Cursor Rules**       | Developer IDE         | Local edits     | CI failures            |
| **Pre-commit Hooks**   | Local Git             | Commits         | CI failures            |
| **Biome**              | Tooling               | Commits, CI     | Architecture decisions |
| **Validation Scripts** | Tooling               | Commits, CI     | Governance exceptions  |
| **CI/CD**              | System                | Merge, Release  | Approved waivers       |
| **Governance Waiver**  | Tech Lead / Architect | All enforcement | None                   |

**Enforcement Hierarchy**:
1. Developer (IDE) → Can fix locally, cannot override CI
2. Pre-commit → Can block commits, cannot override CI
3. CI/CD → Can block merges, cannot override waivers
4. Governance Waiver → Can override all, must be audited

---

## 🧾 Governance Waiver Policy

**Purpose**: Provide controlled escape hatch for legitimate exceptions without creating entropy.

### Waiver Eligibility

Waivers are allowed **only** for:
- Legacy migration blockers (time-boxed)
- External API incompatibility (documented)
- Time-boxed hotfixes (emergency only)

### Waiver Requirements

All waivers **MUST**:
- Be explicit with scope: `// @zod-waiver(scope: file/path#SchemaName, owner: @name): [reason] - expires: YYYY-MM-DD`
- Include **scope**: file path + exported schema name (or rule-id)
- Include **owner**: @name (accountable person)
- Include reason + expiry date
- Be tracked by validation script
- Fail CI after expiry (automatic enforcement)

**Waiver Format Example**:
```typescript
// @zod-waiver(scope: src/lib/api-schemas/user.ts#UserSchema, owner: @alice): legacy mismatch - expires: 2026-02-15
export const UserSchema = z.object({ ... })
```

### Waiver Duration Limits

**Maximum duration** by waiver type:
- **Hotfix waiver**: max **7 days**
- **Legacy migration**: max **30 days**
- **External API incompatibility**: max **90 days** (requires link to upstream contract)

Waivers exceeding these limits require **architect approval** and must be documented in `zod-waivers.json` with justification.

### Waiver Tracking

- All waivers logged in `zod-waivers.json`
- Validation script reports active waivers
- CI fails if waiver count exceeds limit
- Monthly waiver review required

---

## ⛔ Stop Conditions

**Critical**: Implementation must halt immediately if any of these occur:

1. **CI Pass Rate**: Drops below 95% for 2 consecutive days
2. **Developer Experience**: Score < 6 (out of 10)
3. **False Positives**: Validation script produces errors on valid schemas
4. **Regression**: Existing functionality breaks due to enforcement
5. **Violations Spike**: New violations created per day > 20 for 2 consecutive days

**Recovery Process**:
1. Immediate halt of enforcement
2. Root cause analysis (24 hours)
3. Fix or adjust enforcement
4. Resume only after validation

**Why This Matters**: Protects developer trust, which is harder to rebuild than code.

---

## ✅ Definition of Done (DOD)

### Phase 1: Foundation (DOD-1)

**Owner**: [Tech Lead / Senior Developer]
**Status**: ✅ **READY FOR APPROVAL**

#### Completion Criteria

- [ ] **Import Migration** (100% compliance)
  - [ ] All files use `'zod/v4'` import path
  - [ ] Zero instances of `'zod'` import remain
  - [ ] Migration script executed successfully
  - [ ] Validation script confirms 100% compliance

- [ ] **Type System** (100% compliance)
  - [ ] All types use `z.infer<typeof schema>`
  - [ ] Zero manual type definitions for schema-derived types
  - [ ] TypeScript compilation passes without errors
  - [ ] Type inference validation script passes

- [ ] **Schema Location** (100% compliance)
  - [ ] All API schemas in `src/lib/api-schemas/index.ts`
  - [ ] Database schemas in `src/db/schema/` (using drizzle-zod)
  - [ ] Zero schemas in incorrect locations
  - [ ] Validation script confirms location compliance

- [ ] **Documentation** (100% compliance)
  - [ ] All schemas include `.describe()`
  - [ ] All exported schemas have descriptions
  - [ ] Validation script confirms documentation coverage

**Acceptance Criteria**:
- ✅ `pnpm migrate:zod-imports` completes with 0 errors
- ✅ `pnpm validate:zod` shows 0 errors
- ✅ `pnpm check` passes with 0 errors
- ✅ `pnpm type-check` passes with 0 errors

**Deliverables**:
- [ ] Migration report (files changed, issues fixed)
- [ ] Validation report (compliance metrics)
- [ ] Updated documentation

---

### Phase 2: Enforcement (DOD-2)

**Owner**: [DevOps / CI/CD Lead]
**Status**: ✅ **READY FOR APPROVAL**

**Note**: Start at 70% completion of Phase 1 (overlap allowed)

#### Completion Criteria

- [ ] **Biome Integration** (100% active)
  - [ ] Schema-specific overrides configured
  - [ ] Error-level enforcement active
  - [ ] Import type checking enabled
  - [ ] All Biome checks pass

- [ ] **Cursor Rules** (100% active)
  - [ ] Rule file created and active
  - [ ] IDE shows rule guidance
  - [ ] Rules reference correct documentation
  - [ ] Rules follow Cursor best practices

- [ ] **Validation Scripts** (100% functional)
  - [ ] `pnpm validate:zod` works correctly
  - [ ] Script integrates with Biome
  - [ ] Script provides clear error messages
  - [ ] Script catches all mandatory violations

- [ ] **Pre-commit Hooks** (100% configured)
  - [ ] Biome check runs on pre-commit
  - [ ] Zod validation runs on pre-commit
  - [ ] Hooks prevent commits with violations
  - [ ] Hooks provide clear error messages

- [ ] **Non-Blocking Ramp Mode** (100% configured)
  - [ ] CI runs in **warn mode** for first 3 days
  - [ ] After baseline is stable, flip to **error/block mode**
  - [ ] Ramp mode prevents "CI suddenly blocks everything" shock
  - [ ] Ramp mode duration configurable (default: 3 days)

**Acceptance Criteria**:
- ✅ `pnpm check` catches import violations
- ✅ `pnpm validate:zod` catches pattern violations
- ✅ Pre-commit hooks prevent invalid commits
- ✅ CI/CD pipeline includes validation

**Deliverables**:
- [ ] Updated `biome.json` configuration
- [ ] Active Cursor rules file
- [ ] Working validation scripts
- [ ] Pre-commit hook configuration
- [ ] CI/CD integration documentation

---

### Phase 3: Patterns & Helpers (DOD-3)

**Owner**: [Senior Developer / Architect]
**Status**: ✅ **READY FOR APPROVAL**

**Note**: Start after Phase 2 tools compile successfully

#### Completion Criteria

- [ ] **Helper Functions** (100% implemented)
  - [ ] `createMandatoryString()` implemented
  - [ ] `createMandatoryNumber()` implemented
  - [ ] `createMandatoryObject()` implemented
  - [ ] `createMandatoryArray()` implemented
  - [ ] `createMandatoryEnum()` implemented
  - [ ] `mandatorySafeParse()` implemented
  - [ ] All helpers have TypeScript types
  - [ ] All helpers have JSDoc documentation

- [ ] **Pattern Library** (100% implemented)
  - [ ] `mandatoryStringPattern` implemented
  - [ ] `mandatoryNumberPattern` implemented
  - [ ] `mandatoryObjectPattern` implemented
  - [ ] `mandatoryArrayPattern` implemented
  - [ ] `mandatoryEnumPattern` implemented
  - [ ] `mandatoryCoercionPattern` implemented
  - [ ] `mandatoryWrapperPattern` implemented
  - [ ] All patterns have examples

- [ ] **Type Definitions** (100% implemented)
  - [ ] `MandatorySchema` type defined
  - [ ] `MandatoryStringSchema` type defined
  - [ ] `MandatoryNumberSchema` type defined
  - [ ] `MandatoryObjectSchema` type defined
  - [ ] `MandatoryArraySchema` type defined
  - [ ] All types enforce mandatory patterns

**Acceptance Criteria**:
- ✅ All helper functions compile without errors
- ✅ All patterns are usable and documented
- ✅ Type definitions enforce mandatory patterns
- ✅ Examples demonstrate correct usage

**Deliverables**:
- [ ] `src/lib/zod/helpers.ts` (complete)
- [ ] `src/lib/zod/types.ts` (complete)
- [ ] `src/lib/api-schemas/patterns.ts` (complete)
- [ ] Usage examples and documentation

---

### Phase 4: Migration & Compliance (DOD-4)

**Owner**: [Tech Lead / Team Lead]
**Status**: ✅ **READY FOR APPROVAL**

**Note**: Incremental migration, not "big bang" approach

#### Completion Criteria

- [ ] **Existing Code Migration** (100% complete)
  - [ ] All existing schemas use mandatory patterns
  - [ ] All existing schemas use helper functions
  - [ ] All existing schemas have documentation
  - [ ] Zero violations in existing code

- [ ] **New Code Compliance** (100% enforced)
  - [ ] Cursor rules prevent non-compliant code
  - [ ] Biome catches violations at development time
  - [ ] Validation scripts catch violations
  - [ ] Pre-commit hooks prevent invalid commits

- [ ] **Documentation** (100% complete)
  - [ ] Strategy document complete
  - [ ] Integration guide complete
  - [ ] Quick reference guide complete
  - [ ] Examples and patterns documented

- [ ] **Team Training** (if applicable)
  - [ ] Team aware of mandatory patterns
  - [ ] Team knows how to use helpers
  - [ ] Team knows validation workflow
  - [ ] Team knows how to fix violations

**Acceptance Criteria**:
- ✅ 100% of existing code compliant
- ✅ 100% of new code follows patterns
- ✅ Zero violations in codebase
- ✅ All documentation complete

**Deliverables**:
- [ ] Migrated codebase (100% compliant)
- [ ] Complete documentation
- [ ] Training materials (if applicable)
- [ ] Final validation report

---

## 📊 Key Performance Indicators (KPI)

### KPI-1: Import Compliance

**Metric**: Percentage of files using `'zod/v4'` import

**Target**: 100%

**Measurement**:
The validation script **MUST** output structured data:
```json
{
  "kpi_1": {
    "files_scanned": 45,
    "files_noncompliant": 12,
    "compliance_percent": 73.3
  }
}
```

**Command**: `pnpm validate:zod --format=json | jq '.kpi_1.compliance_percent'`

**Current**: 0% (needs migration)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

**Note**: KPI is computed by validation script, not grepped.

---

### KPI-2: Type Inference Compliance

**Metric**: Percentage of schema-derived types using `z.infer<>`

**Target**: 100%

**Measurement**:
The validation script **MUST** output structured data:
```json
{
  "kpi_2": {
    "schema_types_total": 28,
    "schema_types_inferred": 22,
    "type_inference_percent": 78.6
  }
}
```

**Command**: `pnpm validate:zod --format=json | jq '.kpi_2.type_inference_percent'`

**Current**: ~80% (estimated)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

**Note**: KPI is computed by validation script, not grepped (avoids false positives/negatives).

---

### KPI-3: Schema Documentation Coverage

**Metric**: Percentage of schemas with `.describe()`

**Target**: 100%

**Measurement**:
```bash
pnpm validate:zod | grep "describe"
```

**Current**: ~60% (estimated)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-4: Schema Location Compliance

**Metric**: Percentage of schemas in correct location

**Target**: 100%

**Measurement**:
```bash
pnpm validate:zod | grep "location"
```

**Current**: ~90% (estimated)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-5: Biome Validation Pass Rate

**Metric**: Percentage of files passing Biome validation

**Target**: 100%

**Measurement**:
```bash
pnpm check --reporter=json | jq '.summary.errors'
```

**Current**: ~95% (estimated)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-6: Validation Script Pass Rate

**Metric**: Percentage of files passing custom Zod validation

**Target**: 100%

**Measurement**:
```bash
pnpm validate:zod | grep "errors"
```

**Current**: ~85% (estimated)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-7: Helper Function Usage

**Metric**: Percentage of schemas using mandatory helpers

**Target**: 80% (minimum)

**Scope**: Applies to **new or modified schemas only**. Legacy untouched schemas are excluded to avoid pointless churn.

**Definition of "New/Modified Schema"**:
- Any file that contains `export const <Name>Schema = ...` changed in diff
- Detected by: files with schema exports in git diff

**Measurement**:
The validation script **MUST** output structured data:
```json
{
  "kpi_7": {
    "base_branch": "main",
    "new_modified_schemas": 15,
    "schemas_using_helpers": 12,
    "helper_usage_percent": 80.0
  }
}
```

**Command**: `pnpm validate:zod --format=json | jq '.kpi_7.helper_usage_percent'`

**Diff Detection**:
- **CI**: `git diff origin/main...HEAD`
- **Local**: `git diff <base-branch>...HEAD` (default: `main`)
- **Configurable**: Base branch configurable via environment variable

**Current**: 0% (helpers not yet used)
**Target**: 80% (of new/modified schemas)
**Status**: 🎯 **READY FOR APPROVAL**

**Note**: Explicit diff detection prevents CI failures due to fetch depth or base branch availability.

---

### KPI-8: Pre-commit Hook Effectiveness

**Metric**: Percentage of commits blocked by validation

**Target**: 100% (all violations blocked)

**Measurement**:
- Track commits with violations
- Track commits blocked by hooks
- Calculate block rate

**Current**: 0% (hooks not yet configured)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-9: CI/CD Validation Pass Rate

**Metric**: Percentage of CI/CD runs passing validation

**Target**: 100%

**Measurement**:
- Track CI/CD runs
- Track validation failures
- Calculate pass rate

**Current**: N/A (not yet configured)
**Target**: 100%
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-10: Developer Experience Score

**Metric**: Subjective score (1-10) for developer experience

**Target**: 8+ (out of 10)

**Objective Signal**: Average time to fix a validation error (target: <10 minutes)

**Measurement**:
- Developer survey (subjective)
- Average fix time (objective)
- Feedback collection
- Issue tracking

**Current**: N/A (baseline needed)
**Target**: 8+ (subjective), <10 min (objective)
**Status**: 🎯 **READY FOR APPROVAL**

---

### KPI-12: False Positive Rate

**Metric**: Percentage of validation errors that are false positives

**Target**: 0%

**Measurement**:
Track issues labeled `zod-false-positive` created by developers:
```json
{
  "kpi_12": {
    "total_validations": 1250,
    "false_positives": 0,
    "false_positive_rate": 0.0
  }
}
```

**Command**: `pnpm validate:zod --format=json | jq '.kpi_12.false_positive_rate'`

**Enforcement**:
- False positives must be resolved within 24h when stop condition is active
- Tracked via issue labels: `zod-false-positive`
- Validation script reports false positive count

**Current**: N/A (baseline needed)
**Target**: 0%
**Status**: 🎯 **READY FOR APPROVAL**

**Why This Matters**: This is your **trust metric**. High false positive rate = low developer trust.

---

## 📈 KPI Summary Dashboard

| KPI        | Metric              | Current | Target | Status  |
| ---------- | ------------------- | ------- | ------ | ------- |
| **KPI-1**  | Import Compliance   | 0%      | 100%   | 🎯 Ready |
| **KPI-2**  | Type Inference      | ~80%    | 100%   | 🎯 Ready |
| **KPI-3**  | Documentation       | ~60%    | 100%   | 🎯 Ready |
| **KPI-4**  | Schema Location     | ~90%    | 100%   | 🎯 Ready |
| **KPI-5**  | Biome Pass Rate     | ~95%    | 100%   | 🎯 Ready |
| **KPI-6**  | Validation Pass     | ~85%    | 100%   | 🎯 Ready |
| **KPI-7**  | Helper Usage        | 0%      | 80%    | 🎯 Ready |
| **KPI-8**  | Pre-commit Blocks   | 0%      | 100%   | 🎯 Ready |
| **KPI-9**  | CI/CD Pass Rate     | N/A     | 100%   | 🎯 Ready |
| **KPI-10** | Dev Experience      | N/A     | 8+     | 🎯 Ready |
| **KPI-11** | Waiver Count        | 0       | ≤3     | 🎯 Ready |
| **KPI-12** | False Positive Rate | N/A     | 0%     | 🎯 Ready |

---

## 🎯 Success Criteria

### Overall Success Definition

The project is considered **DONE** when:

1. ✅ **All DOD phases complete** (100% of criteria met)
2. ✅ **All KPIs meet targets** (100% compliance where applicable)
3. ✅ **Zero violations** in codebase (excluding approved waivers)
4. ✅ **Waiver count** ≤ 3 and trending down
5. ✅ **Documentation complete**
6. ✅ **Team trained** (if applicable)
7. ✅ **CI/CD integrated**
8. ✅ **Monitoring in place**
9. ✅ **Stop conditions** not triggered

### Success Metrics

- **Compliance Rate**: 100% (excluding approved waivers)
- **Violation Count**: 0 (excluding approved waivers)
- **Waiver Count**: ≤ 3 active (trending down)
- **Documentation Coverage**: 100%
- **Helper Usage**: 80%+ (of new/modified schemas)
- **Developer Satisfaction**: 8+/10
- **Average Fix Time**: <10 minutes
- **CI Pass Rate**: ≥95%

---

## 📋 Approval Checklist

### Before Starting Implementation

- [ ] **DOD Reviewed**: All phases understood
- [ ] **KPIs Approved**: Targets agreed upon
- [ ] **Resources Allocated**: Time and team assigned
- [ ] **Timeline Agreed**: Phases scheduled
- [ ] **Success Criteria Clear**: Definition understood
- [ ] **Stakeholders Informed**: All parties aware
- [ ] **Approval Obtained**: Sign-off received

### Approval Sign-off

**Project**: Zod Mandatory Enforcement Implementation
**Date**: _______________
**Approved By**: _______________
**Status**: ☐ Approved ☐ Rejected ☐ Pending Changes

**Comments**:
_________________________________________________
_________________________________________________
_________________________________________________

---

## 🚀 Phase Execution Strategy

### Recommended Execution Overlap

**Do NOT run phases strictly sequentially.** Use overlapping execution:

| Phase       | Start Condition             | Execution                          |
| ----------- | --------------------------- | ---------------------------------- |
| **Phase 1** | Immediately                 | Full, uninterrupted                |
| **Phase 2** | At 70% of Phase 1           | Parallel with Phase 1 completion   |
| **Phase 3** | After Phase 2 tools compile | Start pattern implementation       |
| **Phase 4** | Incremental                 | Not "big bang" - migrate gradually |

**Why**: Avoids tool lock-in before patterns stabilize.

---

## 🚀 Next Steps After Approval

1. **Assign Phase Owners**: Designate owners for each phase
2. **Baseline Measurement**: Measure current KPI values
3. **Waiver Tracking Setup**: Initialize `zod-waivers.json`
4. **Phase 1 Start**: Begin import migration
5. **Daily Monitoring**: Track KPI progress + stop conditions
6. **Weekly Review**: Review DOD completion + waiver status
7. **Final Validation**: Verify all criteria met

---

**Document Status**: ✅ **READY FOR APPROVAL** (Executable-Enhanced v3.0)
**Last Updated**: 2026-01-10
**Version**: 3.0 (Executable-Enhanced)

**Approval Statement**: This proposal enforces schema correctness **without sacrificing velocity**, provides **auditable escape hatches**, and ensures **no silent regression**. Approval authorizes enforcement tooling, not architectural rigidity.

**Key Enhancements in v3.0**:
- ✅ Waiver policy made enforceable (scope, duration limits, owner)
- ✅ Stop conditions include metric-based trigger (violations spike)
- ✅ KPI measurements use structured output (not grep)
- ✅ Non-blocking ramp mode for CI (protects velocity)
- ✅ KPI-12: False Positive Rate (trust metric)
- ✅ All dates updated to 2026-01-10
