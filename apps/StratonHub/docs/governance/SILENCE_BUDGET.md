# Silence Budget

**Purpose**: Track and enforce the finite resource of UI simplicity.
**Authority**: Every new element must pay for itself. Budget must never go
negative. **Version**: 1.0.0 **Status**: RATIFIED

---

## The Silence Principle

> "Silence is a finite resource."

Every UI element:

- Competes for attention
- Adds cognitive load
- Requires maintenance
- Creates potential for bugs

Silence is not the absence of features. It is the **presence of focus**.

---

## Budget Rules

### Initial Budget

```
Starting Balance: 100 silence units
```

This represents the "silence capital" of the system. It can grow through
removals or shrink through additions.

### Cost Table (Debits)

| Action                  | Cost      | Notes                       |
| ----------------------- | --------- | --------------------------- |
| New visible UI element  | -5 units  | Buttons, badges, indicators |
| New animation           | -10 units | Any motion, even subtle     |
| New interactive control | -8 units  | Toggles, selects, inputs    |
| New tooltip/popover     | -3 units  | Hover-triggered content     |
| New modal/dialog        | -15 units | Interrupts reading flow     |
| New navigation item     | -5 units  | Links, menu items           |
| New color/style variant | -2 units  | Additional visual pattern   |
| New preference option   | -8 units  | User must make decision     |
| New state indicator     | -3 units  | Loading, error, success     |

### Credit Table (Credits)

| Action                   | Credit        | Notes                   |
| ------------------------ | ------------- | ----------------------- |
| Remove UI element        | +5 units      | Must be genuine removal |
| Remove animation         | +10 units     | Includes disabling      |
| Consolidate controls     | +3 units/each | Merge multiple into one |
| Reduce reading time      | +10 units     | Must be measurable      |
| Simplify interaction     | +5 units      | Fewer steps to complete |
| Remove preference option | +8 units      | Less user decisions     |
| Remove navigation item   | +5 units      | Cleaner structure       |

### Balance Requirements

| Balance State | Meaning  | Action Required       |
| ------------- | -------- | --------------------- |
| > 100 units   | Surplus  | May add features      |
| 50-100 units  | Healthy  | Proceed carefully     |
| 25-50 units   | Warning  | Prioritize removals   |
| 0-25 units    | Critical | No additions allowed  |
| < 0 units     | Debt     | FROZEN until positive |

---

## Current Ledger

### Balance

```
Current Balance: 100 units
Last Updated: 2026-01-13
```

### Transaction History

| Date       | PR/ADR  | Description     | Debit | Credit | Balance |
| ---------- | ------- | --------------- | ----- | ------ | ------- |
| 2026-01-13 | Initial | System baseline | —     | —      | 100     |

---

## How to Calculate Silence Cost

### Before Submitting PR

1. **Inventory new elements**: List every new visible element
2. **Apply cost table**: Sum the debits
3. **Inventory removals**: List anything removed
4. **Apply credit table**: Sum the credits
5. **Calculate net**: Credits - Debits = Net Impact

### Example Calculation

```markdown
## Silence Budget Impact

### Additions (Debits)

| Element            | Cost    |
| ------------------ | ------- |
| New toggle control | -8      |
| New tooltip        | -3      |
| **Subtotal**       | **-11** |

### Removals (Credits)

| Element               | Credit |
| --------------------- | ------ |
| Removed unused button | +5     |
| **Subtotal**          | **+5** |

### Net Impact

-11 + 5 = **-6 units**

### New Balance

100 - 6 = **94 units**
```

---

## Enforcement

### PR Requirements

Every PR that modifies UI must include:

```markdown
## Silence Budget

- [ ] This PR has no UI changes
- [ ] OR: Budget impact calculated below

| Action            | Units   |
| ----------------- | ------- |
| [Describe change] | [+/-X]  |
| **Net Impact**    | **[X]** |
| **New Balance**   | **[X]** |
```

### CI Validation

The `validate-silence-budget.ts` script:

1. Parses PR description for budget statement
2. Validates arithmetic
3. Checks new balance against current ledger
4. Blocks merge if balance goes negative

### Manual Review

For ambiguous cases:

- UX Owner has final authority on cost classification
- Disputed costs default to **higher** estimate
- When in doubt, cost more

---

## Paying Down Debt

If balance goes negative:

1. **Feature freeze**: No new UI elements until positive
2. **Removal sprint**: Identify elements to remove
3. **Debt repayment**: Each removal adds credits
4. **Resume**: Only when balance is positive

### Debt Avoidance Strategies

1. **One-in-one-out**: For every addition, remove something
2. **Consolidation**: Merge similar controls
3. **Simplification**: Reduce steps in interactions
4. **Elimination**: Question if element is needed at all

---

## Special Cases

### Infrastructure Changes

Changes that don't affect visible UI:

- Refactoring
- Performance improvements
- Accessibility fixes (that don't add visible elements)
- Bug fixes

**Cost**: 0 units (no budget impact)

### Accessibility Additions

Elements added purely for accessibility:

- Screen reader announcements
- Focus indicators
- Skip links

**Cost**: 0 units (accessibility is not optional)

### Temporary Elements

Elements with defined sunset date:

- Beta badges
- Migration notices
- Deprecation warnings

**Cost**: Full cost, but credited upon removal at sunset

---

## Budget Review

### Monthly Review

Each month, review:

1. Current balance trend
2. Largest recent debits
3. Removal opportunities
4. Debt risk assessment

### Quarterly Audit

Each quarter:

1. Validate ledger accuracy
2. Recalibrate cost table if needed
3. Review balance thresholds
4. Publish audit report

---

## Integration with Other Governance

### Refuse List

Features on the Refuse List have **infinite cost**. They cannot be added
regardless of budget.

### Ratification Process

During ratification, silence cost is calculated. If PR would cause negative
balance:

- Proposal is **DEFERRED**
- Author must propose offsetting removals
- Resubmit with balanced budget

### Regression Checklist

Regression checks validate that credited removals actually occurred. Phantom
credits are rejected.

---

## Philosophy

### Why This Works

1. **Makes cost visible**: Forces acknowledgment of complexity
2. **Creates accountability**: Every addition has an owner
3. **Encourages restraint**: Surplus feels good to maintain
4. **Enables trade-offs**: "We can add X if we remove Y"

### Why This Doesn't Become Bureaucracy

1. **Simple math**: Addition and subtraction only
2. **Clear categories**: No ambiguous classifications
3. **Fast checks**: Seconds to calculate
4. **Self-enforcing**: CI blocks violations

### The Ultimate Goal

A system where adding features feels **expensive** and removing them feels
**rewarding**.

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Invisible Governance System **Last
Updated**: 2026-01-13
