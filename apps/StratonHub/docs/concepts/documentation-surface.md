# Concept: Documentation Surface

**Status**: RATIFIED **Version**: 1.0.0 **Shell**: DocShell **Ratified**:
2026-01-13

---

## Definition

The Documentation Surface is the canonical reading experience for technical
content in StratonHub. It is where users come to **understand, reference, and
trust** authoritative information.

This is not a marketing surface. This is not a navigation surface. This is the
**primary knowledge transfer medium** of the system.

---

## Boundaries

### What Exists

- Technical documentation (API, architecture, contracts)
- Reference material (schemas, error codes, configurations)
- Explanations (why decisions were made, how systems work)
- Governance documents (rules, checklists, processes)
- Guides (how-to, tutorials scoped to specific tasks)

### What Does Not Exist

- Marketing content (value propositions, testimonials)
- News or announcements (time-sensitive content)
- Interactive tools (calculators, configurators)
- Social features (comments, reactions, sharing)
- Navigation hubs (link collections without prose)
- Dashboards or status pages

---

## Canonical Posture

| Attribute             | Value                                        |
| --------------------- | -------------------------------------------- |
| **Shell**             | DocShell                                     |
| **Diataxis Mode**     | Reference (primary), Explanation (secondary) |
| **Cognitive Posture** | Slow, analytical, uninterrupted              |
| **Rhythm**            | Breathing (scroll-driven spacing)            |
| **Width**             | Prose-constrained (65ch max)                 |
| **Tone**              | Authoritative, precise, calm                 |

---

## Intent Constraints

### Intents MUST

- Serve a single Diataxis mode per page
- Use DocShell exclusively
- Prioritize scanability (headings, lists, code blocks)
- Support deep-linking (all headings anchored)
- Degrade gracefully without JavaScript
- Respect reader's time (no filler, no fluff)

### Intents MUST NOT

- Mix tutorial and reference content on same page
- Include interactive widgets beyond code copy
- Require authentication to read
- Display time-sensitive information
- Use attention-grabbing animations
- Include calls-to-action or conversion elements

---

## Silent Killers (Mandatory)

Documentation Surface pages inherit all Silent Killers:

| Feature               | Requirement                     |
| --------------------- | ------------------------------- |
| Quiet Links           | 30% opacity underline at rest   |
| Breathing Rhythm      | Scroll-driven spacing animation |
| Authority Pause       | H1 followed by intentional void |
| Hanging Punctuation   | Blockquotes extend into margin  |
| White-Glove Clipboard | Code copy strips prompts        |

---

## Reader Preferences (Advisory)

Documentation Surface respects reader preferences:

| Preference | Options          | Default |
| ---------- | ---------------- | ------- |
| Width      | prose / axis     | axis    |
| Scale      | normal / relaxed | normal  |
| Code Wrap  | true / false     | false   |

Preferences are **advisory only**. Content structure never depends on them.

---

## Component Palette

Intents within Documentation Surface may use:

| Component      | Purpose                 |
| -------------- | ----------------------- |
| DocShell       | Page container          |
| ContentShell   | Prose container         |
| AxisStack      | Vertical rhythm         |
| DocHeader      | Document metadata       |
| CodeBlock      | Syntax-highlighted code |
| DefinitionPeek | Inline term definitions |

Components NOT allowed:

- AxisHero (belongs to Orientation)
- AxisCardGrid (belongs to Navigation)
- CenteredShell (wrong posture)

---

## Metrics (Reader-First)

Documentation Surface optimizes for:

| Metric                | Definition                       | Target   |
| --------------------- | -------------------------------- | -------- |
| Time-to-understanding | How fast reader grasps concept   | Minimize |
| Scroll interruption   | Frequency of navigation away     | Minimize |
| Return rate           | Readers coming back to reference | Maximize |
| Search-to-answer      | Time from search to resolution   | Minimize |

We do NOT optimize for:

- Page views
- Time on page (longer is not better)
- Engagement metrics
- Social shares

---

## Governance

### Changes

Any change to this Concept requires:

- ADR in `docs/governance/decisions/`
- Review by documentation owner
- Update to all dependent Intents

### Deprecation

If deprecated:

- All existing Intents remain valid
- No new Intents may reference this Concept
- Migration plan required before archival

### Archival

Archival requires:

- Zero active Intents
- All content migrated or removed
- Registry updated

---

## Related Concepts

| Concept             | Relationship                       |
| ------------------- | ---------------------------------- |
| Audience Portal     | Navigates TO Documentation Surface |
| Home / Orientation  | Links TO Documentation Surface     |
| Governance Artifact | IS a Documentation Surface         |

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Concept Registry **Shell**: DocShell
