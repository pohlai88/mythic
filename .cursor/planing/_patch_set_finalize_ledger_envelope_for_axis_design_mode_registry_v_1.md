# Patch Set — Finalize Ledger Envelope for AXIS Design Mode Registry v1.0

**Goal:** Apply minimal, spec-conforming edits to your existing canvas ledger envelope for **AXIS Design Mode Registry v1.0**.

**Rule:** Single-line replacements only. No rewrites of meaning. Placeholders remain until append time.

---

## A) Public Ledger Entry — AXIS Design Mode Registry v1.0

Target canvas doc: **“Public Ledger Entry — AXIS Design Mode Registry v1.0”**

### 1) Replace `entry_type` (keep as-is)
No change required.

### 2) Replace the `timestamp` line
**Find:**
```json
"timestamp": "2026-01-10T00:00:00Z",
```
**Replace with (append-time):**
```json
"timestamp": "2026-01-10T<HH:MM:SS>Z",
```

### 3) Replace `artifact_ref` line (doc hash anchor)
**Find:**
```json
"artifact_ref": "AXIS_Design_Mode_Registry_v1.0@sha256:REPLACE_WITH_DOC_HASH"
```
**Replace with:**
```json
"artifact_ref": "AXIS_Design_Mode_Registry_v1.0@sha256:<REGISTRY_DOC_HASH>",
```

### 4) Replace `evidence_ref` line (ratification record anchor)
**Find:**
```json
"governance:ratifications:AXIS_Design_Mode_Registry_v1.0@sha256:REPLACE"
```
**Replace with:**
```json
"governance:ratifications:AXIS_Design_Mode_Registry_v1.0@sha256:<REGISTRY_RATIFICATION_RECORD_HASH>"
```

### 5) Replace `prev_entry_hash` line
**Find:**
```json
"prev_entry_hash": "sha256:REPLACE_OR_NULL",
```
**Replace with:**
```json
"prev_entry_hash": "sha256:<LEDGER_TIP_PREV_HASH>",
```

### 6) Replace `entry_id` line
**Find:**
```json
"entry_id": "urn:uuid:REPLACE_WITH_UUID",
```
**Replace with:**
```json
"entry_id": "urn:uuid:<REGISTRY_LEDGER_ENTRY_UUID>",
```

### 7) Replace actor identity fingerprint line
**Find:**
```json
"identity": "fp:sha256:REPLACE_WITH_FINGERPRINT"
```
**Replace with:**
```json
"identity": "fp:sha256:<ACTOR_FINGERPRINT_HEX>"
```

### 8) Replace `entry_hash` line (compute last)
**Find:**
```json
"entry_hash": "sha256:COMPUTE_LAST"
```
**Replace with:**
```json
"entry_hash": "sha256:<ENTRY_HASH_COMPUTED_LAST>"
```

---

## B) Weekly Governance Rollup — AXIS Design Mode Registry v1.0

Target canvas doc: **“Weekly Governance Rollup — AXIS Design Mode Registry v1.0”**

### 1) Replace Document Hash line
**Find:**
```text
- **Document Hash:** `sha256:<FILL_COMPUTED_HASH>`
```
**Replace with:**
```text
- **Document Hash:** `sha256:<REGISTRY_DOC_HASH>`
```

### 2) Replace Ledger Entry ID line
**Find:**
```text
- **Ledger Entry ID:** `urn:uuid:<FILL_AT_APPEND>`
```
**Replace with:**
```text
- **Ledger Entry ID:** `urn:uuid:<REGISTRY_LEDGER_ENTRY_UUID>`
```

---

## C) TITAN_AUDIT_RUN Baseline Block (4-line patches)

Target canvas doc: **“Public Ledger Template — TITAN_AUDIT_RUN (Verification Sweep)”**

### 1) Registry doc hash
**Find:**
```json
"registry_doc_hash": "sha256:<FILL_REGISTRY_DOC_HASH>",
```
**Replace with:**
```json
"registry_doc_hash": "sha256:<REGISTRY_DOC_HASH>",
```

### 2) Registry ledger entry id
**Find:**
```json
"registry_ledger_entry_id": "urn:uuid:<FILL_REGISTRY_LEDGER_ENTRY_ID>",
```
**Replace with:**
```json
"registry_ledger_entry_id": "urn:uuid:<REGISTRY_LEDGER_ENTRY_UUID>",
```

### 3) Surface inventory ref
**Find:**
```json
"surface_inventory_ref": "axis:surfaces:index@sha256:<FILL>",
```
**Replace with:**
```json
"surface_inventory_ref": "axis:surfaces:index@sha256:<SURFACE_INDEX_HASH>",
```

### 4) Visual Constitution ledger entry id
**Find:**
```json
"visual_constitution_ledger_entry_id": "urn:uuid:<FILL_VISUAL_CONSTITUTION_LEDGER_ENTRY_ID>"
```
**Replace with:**
```json
"visual_constitution_ledger_entry_id": "urn:uuid:<VISUAL_CONSTITUTION_LEDGER_ENTRY_UUID>"
```

---

## D) Append-Time Fill Checklist (Minimal)

You only need these concrete values at append time:

- `<REGISTRY_DOC_HASH>`
- `<REGISTRY_LEDGER_ENTRY_UUID>`
- `<ACTOR_FINGERPRINT_HEX>`
- `<LEDGER_TIP_PREV_HASH>`
- `<ENTRY_HASH_COMPUTED_LAST>`
- `<REGISTRY_RATIFICATION_RECORD_HASH>`

And for the sweep:

- `<SURFACE_INDEX_HASH>`
- `<VISUAL_CONSTITUTION_LEDGER_ENTRY_UUID>`

---

> This patch set is additive: it finalizes placeholders without changing any prior ratified meaning.

