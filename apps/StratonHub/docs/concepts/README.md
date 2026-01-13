# Concept Registry

**Purpose**: Define the semantic universe of StratonHub. **Authority**: All
Intents MUST belong to a ratified Concept. **Status**: ACTIVE

---

## What is a Concept?

A Concept is **not a feature, page, or component**.

A Concept is a **semantic boundary** that defines:

- What exists within this domain
- What explicitly does not exist
- The canonical posture (Shell, rhythm, tone)
- The rules for all Intents that belong to it

Concepts change **rarely**. They are the foundation.

---

## Concept Lifecycle

```
1. PROPOSED   → Concept Definition written
2. REVIEWED   → Stakeholder review
3. RATIFIED   → Approved, frozen
4. ACTIVE     → Spawning Intents
5. DEPRECATED → No new Intents (existing remain)
6. ARCHIVED   → Removed from active registry
```

---

## Registered Concepts

| Concept                                           | Status   | Shell    | Intents |
| ------------------------------------------------- | -------- | -------- | ------- |
| [Documentation Surface](documentation-surface.md) | RATIFIED | DocShell | —       |

---

## Creating a New Concept

1. Write Concept Definition using template below
2. Submit for review
3. Obtain ratification
4. Add to this registry
5. Only then can Intents reference it

---

## Concept Definition Template

```markdown
# Concept: [Name]

**Status**: PROPOSED | RATIFIED | DEPRECATED **Version**: 1.0.0 **Shell**:
[DocShell | PageShell | CenteredShell]

---

## Definition

[One paragraph: What is this concept? What semantic space does it occupy?]

---

## Boundaries

### What Exists

- [Explicit list of what belongs here]

### What Does Not Exist

- [Explicit exclusions - things that might seem related but are NOT part of this
  concept]

---

## Canonical Posture

| Attribute         | Value                            |
| ----------------- | -------------------------------- |
| Shell             | [Shell name]                     |
| Diataxis Mode     | [Primary mode]                   |
| Cognitive Posture | [Fast/slow, exploratory/focused] |
| Rhythm            | [Dense/breathing]                |

---

## Intent Constraints

Intents belonging to this Concept MUST:

- [Rule 1]
- [Rule 2]

Intents belonging to this Concept MUST NOT:

- [Exclusion 1]
- [Exclusion 2]

---

## Governance

- Changes require ADR
- Deprecation requires migration plan
- Archival requires zero active Intents
```

---

## Relationship to Governance

```
Concept (semantic anchor)
    ↓
Intent (specific goal)
    ↓
Intake Checklist (classification)
    ↓
Ratification (approval)
    ↓
Implementation (code)
```

Concepts are **upstream** of all governance processes.

---

## Version History

| Version | Date       | Change                                      |
| ------- | ---------- | ------------------------------------------- |
| 1.0.0   | 2026-01-13 | Initial registry with Documentation Surface |
