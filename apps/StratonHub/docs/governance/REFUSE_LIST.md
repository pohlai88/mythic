# Refuse List

**Purpose**: Explicit declaration of features this system will NEVER implement.
**Authority**: This document is design law. Exceptions require formal ADR with
stakeholder approval. **Version**: 1.0.0 **Status**: RATIFIED

---

## The Negative Capability Principle

> "If a feature cannot justify its absence, it does not belong."

Luxury systems are defined by what they **refuse** to do, not what they add.

This list exists because:

- Every feature has maintenance cost
- Every interaction adds cognitive load
- Every animation delays content
- Every option creates decision fatigue

**Default stance**: Refuse. Require justification for inclusion, not exclusion.

---

## Refused Features

### Category: Animation

| Feature                       | Rationale                                    | Exception Criteria |
| ----------------------------- | -------------------------------------------- | ------------------ |
| Page transition effects       | Delays content delivery, no semantic value   | None               |
| Parallax scrolling            | Distracts from content, accessibility issues | None               |
| Loading spinners              | Use skeleton states that match content shape | None               |
| Entrance animations on scroll | Interrupts reading flow                      | None               |
| Hover animations > 300ms      | Violates "Rush Veto" (AXIS design law)       | None               |
| Auto-playing animations       | Violates reduced-motion respect              | None               |

### Category: Navigation

| Feature                       | Rationale                                   | Exception Criteria             |
| ----------------------------- | ------------------------------------------- | ------------------------------ |
| "Scroll to top" button        | Reader controls their journey               | None                           |
| Sticky navigation bars        | Reduces content viewport, adds visual noise | Emergency-only (system status) |
| Breadcrumb trails             | URL is the breadcrumb                       | None (use URL structure)       |
| "Back to previous page" links | Browser handles this                        | None                           |
| Tab navigation for content    | Content is not an application               | None                           |
| Infinite scroll               | Reader cannot gauge document length         | None                           |

### Category: Feedback & Notifications

| Feature                   | Rationale                           | Exception Criteria          |
| ------------------------- | ----------------------------------- | --------------------------- |
| Toast notifications       | Interrupts reading flow             | Critical system errors only |
| Success/error banners     | Inline confirmation near the action | None                        |
| Sound effects             | Hostile to shared environments      | None                        |
| Haptic feedback           | Not a mobile app                    | None                        |
| "Action completed" modals | Action should confirm itself        | None                        |
| Cookie consent popups     | Use privacy-respecting defaults     | Legal requirement only      |

### Category: Gamification

| Feature                  | Rationale                     | Exception Criteria |
| ------------------------ | ----------------------------- | ------------------ |
| Reading progress bars    | Readers are not players       | None               |
| Achievement badges       | Documentation is not a game   | None               |
| Streak counters          | Manufactured engagement       | None               |
| Points/XP systems        | Content is its own reward     | None               |
| Leaderboards             | Competition has no place here | None               |
| "You've read X articles" | Vanity metric                 | None               |

### Category: Social

| Feature                            | Rationale                                    | Exception Criteria |
| ---------------------------------- | -------------------------------------------- | ------------------ |
| Share buttons                      | Content speaks for itself (URL is shareable) | None               |
| Comment sections                   | Noise-to-signal ratio too low                | None               |
| "Like" or reaction buttons         | Popularity is not quality                    | None               |
| Social proof ("10k developers...") | Irrelevant to content value                  | None               |
| Author avatars/profiles            | Content over personality                     | None               |
| "Follow" functionality             | Not a social network                         | None               |

### Category: Personalization

| Feature                           | Rationale                                   | Exception Criteria             |
| --------------------------------- | ------------------------------------------- | ------------------------------ |
| "Recommended for you"             | Reduces serendipity, requires tracking      | None                           |
| Recently viewed                   | Browser history exists                      | None                           |
| Bookmarking system                | Browser bookmarks exist                     | None                           |
| Custom themes (beyond dark/light) | Increases maintenance, fragments experience | None                           |
| Font family selection             | Typography is design law                    | Accessibility requirement only |
| "Favorite" documents              | Not a content management system             | None                           |

### Category: Onboarding

| Feature                          | Rationale                            | Exception Criteria |
| -------------------------------- | ------------------------------------ | ------------------ |
| Feature tours/walkthroughs       | UI should explain itself             | None               |
| Welcome modals                   | Content is the welcome               | None               |
| Tooltips explaining obvious UI   | If it needs explanation, redesign it | None               |
| "Getting started" overlays       | Documentation IS getting started     | None               |
| Progressive disclosure tutorials | Complexity should not exist          | None               |
| First-time user detection        | All users are equal                  | None               |

### Category: Commercial

| Feature                   | Rationale                       | Exception Criteria |
| ------------------------- | ------------------------------- | ------------------ |
| Newsletter signup popups  | Hostile to reader focus         | None               |
| "Upgrade to Pro" banners  | Content is not a sales funnel   | None               |
| Ads or sponsorship blocks | Pollutes the reading experience | None               |
| Usage tracking pixels     | Privacy is non-negotiable       | None               |
| A/B testing variations    | Readers deserve consistency     | None               |
| Exit-intent popups        | Manipulative pattern            | None               |

### Category: Technical Decoration

| Feature                    | Rationale                                  | Exception Criteria             |
| -------------------------- | ------------------------------------------ | ------------------------------ |
| Drop shadows on cards      | Violates "Float Veto" (AXIS design law)    | None                           |
| Rounded corners > 2px      | Violates "Friendly Veto" (AXIS design law) | None                           |
| Gradient backgrounds       | Violates "Pop Veto" (AXIS design law)      | `text-divergence` utility only |
| Glassmorphism/blur effects | Performance cost, no semantic value        | None                           |
| Decorative icons           | Every element must earn existence          | Semantic icons only            |
| Background patterns        | Noise without signal                       | None                           |

---

## How to Read This Document

### For Developers

Before proposing any new feature, check this list. If the feature appears here:

1. **Stop** — Do not implement
2. **Check Exception Criteria** — Most have "None"
3. **If exception applies** — File ADR with specific justification

### For Product/Design

This list is not negotiable through preference or trend. Changes require:

1. Documented user research showing harm from absence
2. ADR with stakeholder approval
3. Silence Budget payment (see `SILENCE_BUDGET.md`)

### For AI Assistants

When generating code suggestions:

1. **REJECT** any feature on this list
2. **WARN** if proposed feature resembles a refused pattern
3. **CITE** this document when explaining rejection

---

## Adding to the Refuse List

New entries may be added when:

1. A feature was proposed and rejected through ratification
2. A pattern is identified as harmful across the industry
3. A feature violates the Luxury UX Charter principles

Process:

1. Propose addition in `docs/governance/decisions/` as ADR
2. Include: Feature, Category, Rationale, Exception Criteria
3. Require approval from UX governance stakeholder
4. Update this document with new entry

---

## Removing from the Refuse List

Removal requires:

1. Documented evidence that absence causes measurable harm
2. Proposed implementation that respects all Luxury UX principles
3. Silence Budget allocation
4. ADR approval with explicit stakeholder sign-off
5. Sunset plan if the feature fails

**Default**: Removal requests are rejected. The burden of proof is on inclusion.

---

## Version History

| Version | Date       | Change               |
| ------- | ---------- | -------------------- |
| 1.0.0   | 2026-01-13 | Initial ratification |

---

**Status**: RATIFIED **Authority**: Invisible Governance System **Last
Updated**: 2026-01-13
