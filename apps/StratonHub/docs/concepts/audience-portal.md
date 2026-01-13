# Concept: Audience Portal

**Status**: RATIFIED **Version**: 1.0.0 **Shell**: PageShell (with AxisHero +
AxisCardGrid) **Ratified**: 2026-01-13

---

## Definition

The Audience Portal is the **orientation surface** for a specific user persona.
It exists to answer: "What is here for me?" and "Where do I go next?"

This is not a documentation surface. This is not a content surface. This is the
**navigation gateway** that routes users to their relevant content.

---

## Boundaries

### What Exists

- Role-based landing pages (Developer, Operator, Sovereign)
- Navigation cards linking to deeper content
- Status indicators (role, environment)
- Audience-specific messaging and framing
- Quick access to priority surfaces

### What Does Not Exist

- Long-form prose content
- Reference documentation
- Tutorials or how-to guides
- Interactive tools or dashboards
- Time-sensitive announcements
- User-generated content

---

## Canonical Posture

| Attribute             | Value                              |
| --------------------- | ---------------------------------- |
| **Shell**             | PageShell                          |
| **Primary Block**     | AxisHero + AxisCardGrid + AxisCard |
| **Diataxis Mode**     | Orientation                        |
| **Cognitive Posture** | Quick scan, decision-making        |
| **Rhythm**            | Tight spacing, dense information   |
| **Width**             | Full axis width                    |
| **Tone**              | Welcoming, confident, efficient    |

---

## Intent Constraints

### Intents MUST

- Use PageShell exclusively (not DocShell)
- Provide clear navigation to deeper content
- Use AxisHero for identity and context
- Use AxisCardGrid + AxisCard for navigation
- Be data-driven (no inline component definitions)
- Load fast (no heavy client-side logic)

### Intents MUST NOT

- Include long-form prose (use Documentation Surface)
- Define custom card components
- Include interactive features beyond navigation
- Display real-time data
- Require authentication to view
- Use attention-grabbing animations

---

## Component Palette

Intents within Audience Portal may use:

| Component    | Purpose                |
| ------------ | ---------------------- |
| PageShell    | Page container         |
| AxisHero     | Identity and status    |
| AxisCardGrid | Navigation grid layout |
| AxisCard     | Navigation card        |
| AxisStack    | Vertical rhythm        |

Components NOT allowed:

- DocShell (wrong posture)
- ContentShell (wrong posture)
- DocHeader (belongs to Documentation Surface)

---

## Routes

| Route         | Audience    | Status    |
| ------------- | ----------- | --------- |
| `/`           | All (Entry) | COMPLIANT |
| `/developers` | Architect   | COMPLIANT |
| `/users`      | Operator    | COMPLIANT |
| `/business`   | Sovereign   | COMPLIANT |

---

## Metrics

Audience Portal optimizes for:

| Metric              | Definition                    | Target   |
| ------------------- | ----------------------------- | -------- |
| Time-to-click       | How fast user finds next step | Minimize |
| Bounce rate         | Users leaving without action  | Minimize |
| Navigation accuracy | Users finding correct content | Maximize |

We do NOT optimize for:

- Time on page (longer is not better)
- Page depth
- Return visits to this page

---

## Governance

### Changes

Any change to this Concept requires:

- ADR in `docs/governance/decisions/`
- Review by UX owner
- Update to all dependent Intents

### Deprecation

If deprecated:

- All existing Intents remain valid
- No new Intents may reference this Concept
- Migration plan required before archival

---

## Related Concepts

| Concept               | Relationship                      |
| --------------------- | --------------------------------- |
| Documentation Surface | Navigates TO from Audience Portal |
| Home Orientation      | Parent of Audience Portal         |

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Concept Registry **Shell**: PageShell
