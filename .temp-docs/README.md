# Temporary Documentation Holding Area

This directory holds **temporary documentation** that is still in draft or
review stage.

## Rules

1. **Naming Convention**: `TEMP-[YYYYMMDD-HHMM]_descriptive-name.md`
   - Example: `TEMP-20260106-1430_meeting-notes.md`

2. **Expiration**: 7 days maximum
   - Documents older than 7 days will be **automatically deleted** by pre-commit
     hook

3. **Migration**: Move to permanent location before expiration

   ```bash
   .temp-docs/TEMP-20260106-1430_api-design.md
     ↓
   docs/api/DOC-0045_api-design-specification.md
   ```

4. **Purpose**: Use for:
   - Meeting notes
   - Draft specifications
   - Work-in-progress documentation
   - Brainstorming documents

## Not For

- ❌ Permanent documentation (use docs/ or .cursor/docs/)
- ❌ Code comments (use inline comments)
- ❌ Configuration (use appropriate config files)

---

**See**: `.cursor/rules/022_documentation-governance.mdc` for full rules
