## Description

<!-- Describe what this PR does and why -->

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to
      change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Infrastructure/CI changes

## Testing

<!-- Describe how you tested this change -->

- [ ] Tested locally
- [ ] Added/updated tests
- [ ] Verified no console errors

---

## UX Governance Checklist

> **Required for all PRs that modify UI components, styling, or user-facing
> behavior.** See: `apps/StratonHub/docs/governance/` for full governance
> documentation.

### Intake (New Pages/Components Only)

- [ ] This PR does **NOT** add new pages or components (skip intake)
- [ ] **OR**: Intake checklist completed: `docs/governance/INTAKE_CHECKLIST.md`
  - [ ] 3 classification questions answered
  - [ ] Single-sentence intent test passed
  - [ ] Shell locked
  - [ ] Diataxis mode assigned

### Freeze Zone Compliance

- [ ] This PR does **NOT** modify frozen UX zones
- [ ] **OR**: ADR approved and linked: `docs/governance/decisions/ADR-XXX.md`

**Frozen files** (require ADR to modify):

- `store/use-reader-prefs.ts`
- `hooks/use-scroll-memory.ts`
- `packages/design-system/src/tokens/axis-base.css`
- `packages/design-system/src/tokens/axis-theme.css`

### Silence Budget

- [ ] This PR has **no UI changes** (skip budget)
- [ ] **OR**: Budget impact calculated below

| Action                        | Units    |
| ----------------------------- | -------- |
| _[Describe addition/removal]_ | _[+/-X]_ |
| **Net Impact**                | **[X]**  |
| **New Balance**               | **[X]**  |

### Refuse List Compliance

- [ ] This PR does **NOT** introduce refused features
- [ ] **OR**: Exception documented with rationale

**Refused features include**: toast notifications, progress bars, share buttons,
page transitions, scroll-to-top buttons, welcome modals. See
`docs/governance/REFUSE_LIST.md` for full list.

### Regression Checks

- [ ] `pnpm --filter @mythic/straton-hub check:ux-regression` passes
- [ ] `pnpm --filter @mythic/straton-hub check:silence-budget` passes

### Reader Respect

- [ ] All animations respect `prefers-reduced-motion`
- [ ] No new modals or interstitials added
- [ ] Content works without JavaScript
- [ ] No new required interactions before content

---

## Reviewer Notes

<!-- Any additional context for reviewers -->

## Related Issues

<!-- Link any related issues: Fixes #123, Relates to #456 -->
