# 🧾 Public Ledger Template — `TITAN_AUDIT_RUN` (Verification Sweep)

**Purpose:** Record a Titan verification sweep as an append-only, hash-chained ledger entry.  
**Entry Type:** `TITAN_AUDIT_RUN`  
**Applies To:** Enforcement verification for `TITAN-CI-AXIS01` and related AXIS design authority checks.

---

## 1) Canonicalization Notes (for `entry_hash`)

**Canonicalize the JSON envelope before hashing/signing:**
- UTF-8
- LF line endings (`\n`)
- Stable JSON serialization (deterministic key ordering)
- No trailing whitespace in string fields
- Arrays remain in declared order

**Hash rule:**
- Compute `entry_hash = sha256(canonical_json_bytes)`
- Store as `sha256:<hex>`

---

## 2) Ready-to-Append Ledger Envelope (JSON)

> **Fill at append time:**
> - `entry_id` (UUID)
> - `timestamp`
> - `actor.identity` (fingerprint: `fp:sha256:<hex>`)
> - `prev_entry_hash` (current ledger tip)
> - `entry_hash` (computed LAST)

```json
{
  "ledger_version": "1.0",
  "entry_id": "urn:uuid:REPLACE_WITH_UUID",
  "entry_type": "TITAN_AUDIT_RUN",
  "timestamp": "2026-01-10T00:00:00Z",
  "actor": {
    "office": "System Architect Office",
    "team": "Titan Enforcement",
    "identity": "fp:sha256:REPLACE_WITH_FINGERPRINT"
  },
  "scope_declaration": [
    "AXIS Design Authority",
    "AXIS Design Mode Registry v1.0",
    "AXIS Visual Constitution v1.0"
  ],
  "subject": {
    "gate_id": "TITAN-CI-AXIS01",
    "policy": "Design Mode declaration + registry validation",
    "baseline_used": {
      "registry_doc_hash": "sha256:<FILL_REGISTRY_DOC_HASH>",
      "registry_ledger_entry_id": "urn:uuid:<FILL_REGISTRY_LEDGER_ENTRY_ID>",
      "visual_constitution_doc_hash": "sha256:bd4fa1e2d3211ef15f1be37ad9fe0eff8cf099e44ebe50fa684a247d53be9639",
      "visual_constitution_ledger_entry_id": "urn:uuid:<FILL_VISUAL_CONSTITUTION_LEDGER_ENTRY_ID>"
    }
  },
  "payload": {
    "run_type": "verification_sweep",
    "run_reason": "Post-ratification integrity verification",
    "targets": {
      "surface_inventory_ref": "axis:surfaces:index@sha256:<FILL>",
      "execution_context": [
        "CI",
        "runtime_validator"
      ]
    },
    "results": {
      "status": "PASS|WARN|FAIL",
      "score": {
        "total_surfaces": 0,
        "validated": 0,
        "missing_declaration": 0,
        "mismatched_version": 0,
        "unregistered_mode": 0
      },
      "findings": [
        {
          "finding_id": "AXIS01-F001",
          "severity": "LOW|MEDIUM|HIGH|CRITICAL",
          "surface_ref": "axis:surface:<NAME_OR_ID>",
          "assertion": "Surface must declare Design Mode name + version + constitution version.",
          "observed": "<WHAT_TITAN_OBSERVED>",
          "expected": "<EXPECTED_DECLARATION>",
          "remediation": "<WHAT_TEAM_SHOULD_DO>",
          "evidence_ref": [
            "axis:surface:snapshot@sha256:<FILL>",
            "titan:log@sha256:<FILL>"
          ]
        }
      ]
    },
    "acs": [
      {
        "control_id": "ACS-AXIS01-DECLARATION",
        "control_name": "Design Mode Declaration Present",
        "status": "PASS|WARN|FAIL",
        "severity": "HIGH",
        "evidence_ref": [
          "titan:rule@sha256:<FILL>",
          "titan:runlog@sha256:<FILL>"
        ]
      },
      {
        "control_id": "ACS-AXIS01-REGISTRY",
        "control_name": "Design Mode Exists + Version Matches Registry",
        "status": "PASS|WARN|FAIL",
        "severity": "HIGH",
        "evidence_ref": [
          "registry:extract@sha256:<FILL>",
          "titan:runlog@sha256:<FILL>"
        ]
      }
    ],
    "notes": "Optional: include sampling method, exclusions, and known limitations."
  },
  "evidence_ref": [
    "titan:audit:sweep_report@sha256:<FILL>",
    "axis:surfaces:index@sha256:<FILL>"
  ],
  "prev_entry_hash": "sha256:REPLACE_WITH_LEDGER_TIP",
  "entry_hash": "sha256:COMPUTE_LAST"
}
```

---

## 3) Minimal Run Checklist (Operational)

1. **Confirm baselines**
   - Registry ratification ledger entry ID exists
   - Registry canonical doc hash is computed and matches the ratified artifact
   - Visual Constitution baseline hashes are available

2. **Generate surface inventory**
   - Produce a canonical list of active AXIS surfaces (IDs + locations + build refs)
   - Hash it and set `surface_inventory_ref`

3. **Execute sweep**
   - Run Titan validators for `TITAN-CI-AXIS01` across the inventory
   - Export run log + summary report; hash both

4. **Populate results**
   - Fill totals, counts, and findings
   - Set `status` = PASS/WARN/FAIL

5. **Append audit entry**
   - Fill `entry_id`, `timestamp`, `prev_entry_hash`
   - Canonicalize JSON
   - Compute `entry_hash`
   - Sign and append

---

## 4) Output Contract (What Stakeholders Should See)

- Gate verified: `TITAN-CI-AXIS01`
- Baseline hashes referenced (Registry + Visual Constitution)
- Inventory size + failure counts
- Actionable findings with surface references and remediation
- Evidence hashes for audit replay

