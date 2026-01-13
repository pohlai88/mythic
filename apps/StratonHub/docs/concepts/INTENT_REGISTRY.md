# Intent Registry

**Purpose**: Track all Intents and their mapping to Concepts, Shells, and
Routes. **Authority**: Canonical ecosystem coverage table. **Status**: ACTIVE

---

> _"Every page exists because an Intent declared it should."_

---

## Coverage Summary

| Concept               | Ratified | Intents | Pages    |
| --------------------- | -------- | ------- | -------- |
| Documentation Surface | Yes      | 15      | 15 (MDX) |
| Audience Portal       | Yes      | 4       | 4        |

**Total**: 19 Intents → 19 Pages

---

## Intent → Route Mapping

### Concept: Documentation Surface

**Shell**: DocShell **Status**: RATIFIED

| Intent                         | Route                                        | Diataxis    | Status    |
| ------------------------------ | -------------------------------------------- | ----------- | --------- |
| Boardroom User Guide           | `/users/boardroom`                           | How-to      | COMPLIANT |
| Creating Proposals Guide       | `/users/boardroom/guides/creating-proposals` | How-to      | COMPLIANT |
| Operator Training              | `/users/training`                            | Tutorial    | COMPLIANT |
| API Reference Index            | `/developers/api`                            | Reference   | COMPLIANT |
| API Module Reference           | `/developers/api/[module]`                   | Reference   | COMPLIANT |
| Architecture Reference         | `/developers/architecture`                   | Explanation | COMPLIANT |
| Execution Guides Index         | `/developers/guides`                         | How-to      | COMPLIANT |
| BoardRoom Integration Tutorial | `/developers/guides/boardroom-integration`   | Tutorial    | COMPLIANT |
| SDKs & Kits Reference          | `/developers/sdks`                           | Reference   | COMPLIANT |
| Business Overview              | `/business/overview`                         | Explanation | COMPLIANT |
| Compliance & Audit             | `/business/compliance`                       | Reference   | COMPLIANT |
| Business Training              | `/business/training`                         | Tutorial    | COMPLIANT |
| Governance System Docs         | `docs/governance/*`                          | Reference   | ACTIVE    |
| Concept Registry Docs          | `docs/concepts/*`                            | Reference   | ACTIVE    |
| Luxury UX Charter              | `docs/LUXURY_UX_CHARTER.md`                  | Explanation | ACTIVE    |

---

### Concept: Audience Portal (Pending Ratification)

**Proposed Shell**: PageShell (with AxisHero + AxisCardGrid) **Status**: PENDING
RATIFICATION

| Intent                | Route         | Diataxis    | Status    |
| --------------------- | ------------- | ----------- | --------- |
| Developer Orientation | `/developers` | Orientation | COMPLIANT |
| Operator Orientation  | `/users`      | Orientation | COMPLIANT |
| Sovereign Orientation | `/business`   | Orientation | COMPLIANT |

**Note**: All three audience portals are now Phase A compliant:

- Data-driven
- Compose AxisHero + AxisCardGrid
- No local component definitions

---

### Concept: Home Orientation (Pending Ratification)

**Proposed Shell**: PageShell (with AxisHero + AxisCardGrid) **Status**: PENDING
RATIFICATION

| Intent                 | Route | Diataxis    | Status    |
| ---------------------- | ----- | ----------- | --------- |
| StratonHub Entry Point | `/`   | Orientation | COMPLIANT |

---

## Phase A + B Completion Status

### Pages Refactored (Phase A)

| Route         | Before                   | After                              | Compliant |
| ------------- | ------------------------ | ---------------------------------- | --------- |
| `/`           | AxisHero + AxisCardGrid  | AxisHero + AxisCardGrid            | Yes       |
| `/developers` | AxisHero + AxisCardGrid  | AxisHero + AxisCardGrid            | Yes       |
| `/users`      | Local Card + SurfaceCard | AxisHero + AxisCardGrid + AxisCard | Yes       |
| `/business`   | Local Card               | AxisHero + AxisCardGrid + AxisCard | Yes       |

### Concepts Ratified (Phase B)

| Concept               | File                                     | Status   |
| --------------------- | ---------------------------------------- | -------- |
| Documentation Surface | `docs/concepts/documentation-surface.md` | RATIFIED |
| Audience Portal       | `docs/concepts/audience-portal.md`       | RATIFIED |

### Routes Created (Phase B)

| Route                  | Concept               | Shell    |
| ---------------------- | --------------------- | -------- |
| `/users/training`      | Documentation Surface | DocShell |
| `/business/compliance` | Documentation Surface | DocShell |
| `/business/training`   | Documentation Surface | DocShell |

### Governance Checks

- [x] All pages use Shells + Blocks only
- [x] No local component definitions in pages
- [x] TypeScript compiles without errors
- [x] All MDX pages wrapped in DocShell
- [x] Quiet Links styling implemented
- [x] 8/8 governance checks passing (all checks green)

---

## Next Steps (Phase D)

1. **Deepen Content** (Phase D)
   - Better prose in skeleton MDX pages
   - Add examples and diagrams
   - Expand API reference documentation

2. **UX Refinements** (Phase D)
   - Visual polish only after ecosystem is stable
   - Consider Ghost Rails alignment across layouts

**Note**: Animation durations fixed (200-300ms → 700ms) on 2026-01-13

---

## Registry Maintenance

### Adding an Intent

1. Verify Concept exists and is RATIFIED
2. Complete Intake Checklist
3. Add row to this registry
4. Create page using locked Shell

### Removing an Intent

1. Document reason in ADR
2. Remove page
3. Update this registry
4. Verify no broken links

---

**Last Updated**: 2026-01-13 **Version**: 1.0.0
