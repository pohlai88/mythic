# Selective Content Copying Process

## Overview

This document describes the process for selectively copying content from `apps/docs.archive` to the new `apps/docs` structure.

**Important**: This is NOT an automated migration. All copying is manual and requires review.

## Process Steps

### Step 1: Review Archive

1. Navigate to `apps/docs.archive/`
2. Review content structure
3. Identify valuable content
4. Document what to copy

### Step 2: Validate Against New Schemas

Before copying any content:

1. **Check Frontmatter**: Ensure frontmatter matches Drizzle Zod schema
2. **Check Structure**: Ensure content follows Diataxis framework
3. **Check Audience**: Ensure content is assigned to correct audience
4. **Check Module**: Ensure module assignment is correct

### Step 3: Transform Content

For each file to copy:

1. **Update Frontmatter**:
   - Add `audience` field (required)
   - Add `module` field if applicable
   - Add `type` field (tutorial, how-to, reference, explanation)
   - Ensure `published: true`
   - Add `lastUpdated` timestamp

2. **Update Structure**:
   - Follow Diataxis framework for document type
   - Use templates from `templates/content-schemas/`
   - Ensure proper section structure

3. **Update Links**:
   - Fix internal links to match new route structure
   - Update cross-references
   - Verify all links work

4. **Update Code Examples**:
   - Ensure code examples are current
   - Add syntax highlighting
   - Verify examples work

### Step 4: Validate Copied Content

After copying:

1. **Run Validation**:
   ```bash
   pnpm docs:validate
   ```

2. **Check Schema Compliance**:
   - Frontmatter validates against Drizzle Zod schema
   - Content follows Diataxis structure
   - All required fields present

3. **Test in Browser**:
   - Navigate to copied content
   - Verify rendering
   - Check links work
   - Verify search indexing

### Step 5: Document What Was Copied

Keep a record of:

- What files were copied
- What files were NOT copied (and why)
- What transformations were applied
- Any issues encountered

## Content Selection Criteria

### Copy Content If:

- ✅ Content is still relevant and accurate
- ✅ Content follows Diataxis framework
- ✅ Content can be validated against new schemas
- ✅ Content adds value to the documentation

### Do NOT Copy Content If:

- ❌ Content is outdated or inaccurate
- ❌ Content doesn't fit new structure
- ❌ Content violates README-only policy
- ❌ Content is redundant with existing content

## Transformation Examples

### Example 1: API Documentation

**Old Structure** (`apps/docs.archive/content/reference/...`):
```mdx
---
title: API Reference
---

# API Reference
...
```

**New Structure** (`apps/docs/app/(audiences)/developers/api/[module]/page.mdx`):
```mdx
---
title: BoardRoom API Reference
description: Complete API reference for BoardRoom module
audience: developers
module: boardroom
type: reference
published: true
---

# BoardRoom API Reference
...
```

### Example 2: User Guide

**Old Structure** (`apps/docs.archive/content/guides/...`):
```mdx
---
title: User Guide
---

# User Guide
...
```

**New Structure** (`apps/docs/app/(audiences)/users/[module]/page.mdx`):
```mdx
---
title: BoardRoom User Guide
description: Complete user guide for the BoardRoom module
audience: users
module: boardroom
type: tutorial
published: true
---

# BoardRoom User Guide
...
```

## Validation Checklist

Before considering content "copied":

- [ ] Frontmatter validates against schema
- [ ] Content follows Diataxis structure
- [ ] All links work
- [ ] Code examples are current
- [ ] Content renders correctly
- [ ] Search indexing works
- [ ] No references to archive
- [ ] Follows README-only policy (if applicable)

## Archive Cleanup

After successful migration (6+ months):

1. Review archive retention policy
2. Document what was copied vs. discarded
3. Decide on archive removal or long-term storage

## Notes

- Archive is read-only reference
- No automated migration tools
- All copying is manual and reviewed
- Quality over quantity - only copy valuable content

---

**Last Updated**: 2026-01-11
