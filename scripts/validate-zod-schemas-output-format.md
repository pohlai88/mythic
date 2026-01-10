# Zod Validation Script Output Format

## 📋 Output Format Specification

The `pnpm validate:zod` script **MUST** output structured data for KPI tracking.

---

## 🎯 Output Modes

### Mode 1: Human-Readable (Default)

**Command**: `pnpm validate:zod`

**Output**: Human-readable summary with structured JSON at end

```
🔍 Validating Zod schemas with Biome integration...

📋 Step 1: Running Biome check...
✅ Biome check passed

📋 Step 2: Running custom Zod validation...
📊 Validated 45 files

📄 src/lib/api-schemas/index.ts
  ⚠️  Warnings:
    - SHOULD use .safeParse() instead of .parse()

📊 Validation Summary:
   Files with issues: 1
   Total errors: 0
   Total warnings: 1
   Biome check: ✅ Passed
============================================================

⚠️  Validation passed with warnings.

--- JSON OUTPUT ---
{
  "summary": {
    "files_scanned": 45,
    "files_with_errors": 0,
    "files_with_warnings": 1,
    "total_errors": 0,
    "total_warnings": 1,
    "biome_check": "passed"
  },
  "kpi_1": { ... },
  "kpi_2": { ... },
  ...
}
```

### Mode 2: JSON Only

**Command**: `pnpm validate:zod --format=json`

**Output**: Pure JSON (for CI/CD parsing)

```json
{
  "summary": {
    "files_scanned": 45,
    "files_with_errors": 0,
    "files_with_warnings": 1,
    "total_errors": 0,
    "total_warnings": 1,
    "biome_check": "passed",
    "timestamp": "2026-01-10T10:30:00Z"
  },
  "kpi_1": {
    "files_scanned": 45,
    "files_noncompliant": 12,
    "compliance_percent": 73.3
  },
  "kpi_2": {
    "schema_types_total": 28,
    "schema_types_inferred": 22,
    "type_inference_percent": 78.6
  },
  "kpi_3": {
    "schemas_total": 28,
    "schemas_with_describe": 17,
    "documentation_percent": 60.7
  },
  "kpi_4": {
    "schemas_total": 28,
    "schemas_correct_location": 25,
    "location_compliance_percent": 89.3
  },
  "kpi_5": {
    "files_scanned": 45,
    "files_passing_biome": 43,
    "biome_pass_percent": 95.6
  },
  "kpi_6": {
    "files_scanned": 45,
    "files_passing_validation": 38,
    "validation_pass_percent": 84.4
  },
  "kpi_7": {
    "base_branch": "main",
    "new_modified_schemas": 15,
    "schemas_using_helpers": 12,
    "helper_usage_percent": 80.0
  },
  "kpi_11": {
    "active_waivers": 0,
    "expired_waivers": 0,
    "waiver_count": 0
  },
  "kpi_12": {
    "total_validations": 1250,
    "false_positives": 0,
    "false_positive_rate": 0.0
  },
  "violations": [
    {
      "file": "src/lib/api-schemas/index.ts",
      "line": 25,
      "type": "warning",
      "message": "SHOULD use .safeParse() instead of .parse()",
      "kpi_affected": ["kpi_6"]
    }
  ],
  "waivers": [
    {
      "id": "waiver-001",
      "scope": "src/lib/api-schemas/user.ts#UserSchema",
      "owner": "@alice",
      "expires": "2026-02-15",
      "status": "active"
    }
  ]
}
```

---

## 📊 KPI Output Structure

### KPI-1: Import Compliance

```json
"kpi_1": {
  "files_scanned": 45,
  "files_using_zod_v4": 33,
  "files_using_zod": 12,
  "files_noncompliant": 12,
  "compliance_percent": 73.3
}
```

### KPI-2: Type Inference

```json
"kpi_2": {
  "schema_types_total": 28,
  "schema_types_inferred": 22,
  "schema_types_manual": 6,
  "type_inference_percent": 78.6
}
```

### KPI-3: Documentation

```json
"kpi_3": {
  "schemas_total": 28,
  "schemas_with_describe": 17,
  "schemas_without_describe": 11,
  "documentation_percent": 60.7
}
```

### KPI-4: Schema Location

```json
"kpi_4": {
  "schemas_total": 28,
  "schemas_correct_location": 25,
  "schemas_incorrect_location": 3,
  "location_compliance_percent": 89.3
}
```

### KPI-5: Biome Pass Rate

```json
"kpi_5": {
  "files_scanned": 45,
  "files_passing_biome": 43,
  "files_failing_biome": 2,
  "biome_pass_percent": 95.6
}
```

### KPI-6: Validation Pass Rate

```json
"kpi_6": {
  "files_scanned": 45,
  "files_passing_validation": 38,
  "files_failing_validation": 7,
  "validation_pass_percent": 84.4
}
```

### KPI-7: Helper Usage

```json
"kpi_7": {
  "base_branch": "main",
  "new_modified_schemas": 15,
  "schemas_using_helpers": 12,
  "schemas_not_using_helpers": 3,
  "helper_usage_percent": 80.0,
  "diff_command": "git diff origin/main...HEAD"
}
```

### KPI-11: Waiver Count

```json
"kpi_11": {
  "active_waivers": 0,
  "expired_waivers": 0,
  "waivers_near_expiry": 0,
  "waiver_count": 0,
  "max_waivers": 3,
  "status": "ok"
}
```

### KPI-12: False Positive Rate

```json
"kpi_12": {
  "total_validations": 1250,
  "false_positives": 0,
  "false_positive_rate": 0.0,
  "issues_labeled_false_positive": 0
}
```

---

## 🔧 Implementation Notes

### JSON Extraction

For CI/CD, extract JSON from human-readable output:

```bash
# Extract JSON section
pnpm validate:zod | sed -n '/--- JSON OUTPUT ---/,$p' | tail -n +2 | jq .

# Or use JSON-only mode
pnpm validate:zod --format=json | jq '.kpi_1.compliance_percent'
```

### Exit Codes

- `0`: All checks passed (warnings allowed)
- `1`: Errors found or stop condition triggered
- `2`: Validation script error

---

**Last Updated**: 2026-01-10
**Version**: 1.0
