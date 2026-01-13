# Intake Checklist

**Purpose**: Gate that precedes all UI work. Filters requests before design
begins. **Authority**: If intake fails, request is rejected. No exceptions.
**Status**: IMMUTABLE (amendments require ADR) **Version**: 1.0.0

---

> _"Intake exists to protect the system from urgency-driven design."_

---

## Prerequisite: Concept Reference

**This request MUST reference an existing Concept.**

Before intake can begin:

- Identify which Concept this work belongs to
- If no Concept exists, propose a new Concept Definition first
- Concept must be RATIFIED before Intake proceeds

See: [`docs/concepts/`](../concepts/) for registered Concepts.

| If work is...                              | Concept                                                       |
| ------------------------------------------ | ------------------------------------------------------------- |
| Technical documentation, reference, guides | [Documentation Surface](../concepts/documentation-surface.md) |
| _More Concepts to be added_                | —                                                             |

**If Concept is unclear → STOP. Define Concept first.**

---

## Fail Fast Rule

**If any classification answer is unclear or contradictory, the request is
rejected and must be rewritten.**

Do not proceed with vague mandates. Do not "figure it out later."

---

## The 3 Classification Questions

Every request must answer these before any design work begins.

### Question 1: Outcome

> **What decision or understanding must the user leave with?**

- Must be specific and testable
- "Understand the system" is too vague
- "Know which API endpoint to call for authentication" is valid

### Question 2: Posture

> **Is this informational, navigational, or authoritative?**

| Type               | Definition                         | Shell         |
| ------------------ | ---------------------------------- | ------------- |
| **Informational**  | User needs to understand something | DocShell      |
| **Navigational**   | User needs to find something       | PageShell     |
| **Authoritative**  | User needs to trust and reference  | DocShell      |
| **Confirmational** | User needs system acknowledgment   | CenteredShell |

### Question 3: Necessity

> **What happens if this page does not exist?**

- If the answer is "nothing important" → reject request
- If the answer requires another page → that page is the priority
- If the answer reveals real user harm → proceed

---

## Intent Brief

Complete this before any visual or structural work.

```
User intent:
- [Primary outcome - what user will DO after reading]
- [Secondary outcome - what user will UNDERSTAND]

Non-goals:
- [What this is explicitly NOT trying to do]

Cognitive posture:
- [Fast/slow reading? Exploratory/focused? Reference/tutorial?]
```

---

## Single-Sentence Intent Test

Write one sentence:

> **"This page exists so that the user can ****\_\_****."**

**Rule**: If this sentence cannot be written clearly and specifically, intake
fails.

Examples:

| Valid                                             | Invalid                    |
| ------------------------------------------------- | -------------------------- |
| "...confirm their API key is working"             | "...understand the system" |
| "...find the correct endpoint for their use case" | "...learn about our APIs"  |
| "...reference authentication error codes"         | "...get started"           |

---

## Shell Lock

Once classified, lock the Shell. This decision is final.

```
Authoritative / Reference  →  DocShell
Orientation / Navigation   →  PageShell
System State / Confirmation →  CenteredShell
```

**After Shell lock:**

- Width is locked
- Rhythm is locked
- Tone is locked
- No layout debates

---

## Diataxis Classification

Assign one Diataxis mode. Do not mix modes.

| Mode            | Orientation            | User State                 |
| --------------- | ---------------------- | -------------------------- |
| **Tutorial**    | Learning-oriented      | "I want to learn"          |
| **How-to**      | Task-oriented          | "I want to accomplish X"   |
| **Reference**   | Information-oriented   | "I need to look up Y"      |
| **Explanation** | Understanding-oriented | "I want to understand why" |

**Rule**: If content spans multiple modes, split into multiple pages.

---

## Mixed Intent Rule

**If intent is mixed, split into multiple pages or reject.**

Signs of mixed intent:

- "Overview + detailed reference"
- "Tutorial with reference tables"
- "Explanation that's also a how-to"

Each page serves ONE purpose. No hybrids.

---

## Intake Approval

```
Request: _________________________________
Reviewed by: _____________________________
Approved by: _____________________________
Date: ___________________________________
```

**This is a decision, not a suggestion.**

Once approved:

- Classification is frozen
- Shell is frozen
- Diataxis mode is frozen

Changes require re-intake.

---

## Intake Decision Tree

```
Request received
    │
    ▼
Can all 3 questions be answered clearly?
    │
    ├─ No  → REJECT (rewrite request)
    │
    ▼
Can single-sentence intent test be written?
    │
    ├─ No  → REJECT (clarify intent)
    │
    ▼
Is intent singular (not mixed)?
    │
    ├─ No  → SPLIT into multiple pages
    │
    ▼
Lock Shell + Diataxis mode
    │
    ▼
APPROVED → Proceed to UX Ratification
```

---

## Integration with Governance

Intake is **Phase 0** of the UX workflow:

| Phase | Gate               | Document                     |
| ----- | ------------------ | ---------------------------- |
| **0** | Intake             | This checklist               |
| 1     | Ratification       | `UX_RATIFICATION_PROCESS.md` |
| 2     | Implementation     | Code                         |
| 3     | Subtraction Review | Remove 20%                   |
| 4     | Freeze             | Immutable                    |

Skipping intake is a governance violation.

---

## What Intake Prevents

| Failure Mode       | How Intake Stops It                 |
| ------------------ | ----------------------------------- |
| Feature creep      | Necessity question filters vanity   |
| Vague requests     | Single-sentence test forces clarity |
| Layout debates     | Shell lock removes 80% of arguments |
| Cognitive overload | Diataxis prevents mode mixing       |
| Scope expansion    | Mixed intent rule forces splits     |

---

## For AI Assistants

Before suggesting ANY new page or component:

1. Ask the 3 classification questions
2. Require single-sentence intent test
3. Lock Shell before discussing layout
4. Reject mixed intent immediately

Do not proceed with unclear requests. Ask for clarification.

---

## Version History

| Version | Date       | Change                           |
| ------- | ---------- | -------------------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification (IMMUTABLE) |

---

**Status**: IMMUTABLE **Authority**: Invisible Governance System **Last
Updated**: 2026-01-13
