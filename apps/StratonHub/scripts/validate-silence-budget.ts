#!/usr/bin/env tsx
/**
 * Silence Budget Validator
 *
 * Validates that the silence budget ledger is properly maintained
 * and that no PR would cause the budget to go negative.
 *
 * Usage:
 *   pnpm --filter @mythic/straton-hub check:silence-budget
 *
 * @see docs/governance/SILENCE_BUDGET.md
 */

import * as fs from "node:fs"
import * as path from "node:path"

// Budget configuration
const BUDGET_FILE = path.resolve(__dirname, "../docs/governance/SILENCE_BUDGET.md")
const MIN_BALANCE = 0
const WARNING_THRESHOLD = 25
const HEALTHY_THRESHOLD = 50

interface BudgetEntry {
  date: string
  reference: string
  description: string
  debit: number | null
  credit: number | null
  balance: number
}

interface ValidationResult {
  valid: boolean
  currentBalance: number
  status: "surplus" | "healthy" | "warning" | "critical" | "debt"
  errors: string[]
  warnings: string[]
}

/**
 * Parse the silence budget markdown file
 */
function parseBudgetFile(content: string): { balance: number; entries: BudgetEntry[] } {
  // Extract current balance from the "Current Balance" section
  const balanceMatch = content.match(/Current Balance:\s*(\d+)\s*units/i)
  const currentBalance = balanceMatch && balanceMatch[1] ? parseInt(balanceMatch[1], 10) : 0

  // Extract transaction history table
  const tableRegex =
    /\|\s*Date\s*\|\s*PR\/ADR\s*\|[\s\S]*?\n((?:\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|[^|]+\|\n?)+)/i
  const tableMatch = content.match(tableRegex)

  const entries: BudgetEntry[] = []

  if (tableMatch && tableMatch[1]) {
    const rows = tableMatch[1].trim().split("\n")
    for (const row of rows) {
      // Skip separator rows (contain only dashes, pipes, and spaces)
      if (/^[\|\-\s]+$/.test(row)) continue

      const cells = row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean)
      if (cells.length >= 5) {
        const date = cells[0] ?? ""
        const reference = cells[1] ?? ""
        const description = cells[2] ?? ""
        const debitStr = cells[3]
        const creditStr = cells[4]
        const balanceStr = cells[5]
        entries.push({
          date,
          reference,
          description,
          debit: debitStr && debitStr !== "—" ? parseInt(debitStr, 10) : null,
          credit: creditStr && creditStr !== "—" ? parseInt(creditStr, 10) : null,
          balance: balanceStr ? parseInt(balanceStr, 10) : 0,
        })
      }
    }
  }

  return { balance: currentBalance, entries }
}

/**
 * Determine budget status based on balance
 */
function getStatus(balance: number): ValidationResult["status"] {
  if (balance > 100) return "surplus"
  if (balance >= HEALTHY_THRESHOLD) return "healthy"
  if (balance >= WARNING_THRESHOLD) return "warning"
  if (balance >= MIN_BALANCE) return "critical"
  return "debt"
}

/**
 * Validate the silence budget
 */
function validateBudget(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if budget file exists
  if (!fs.existsSync(BUDGET_FILE)) {
    return {
      valid: false,
      currentBalance: 0,
      status: "debt",
      errors: ["Silence budget file not found: " + BUDGET_FILE],
      warnings: [],
    }
  }

  const content = fs.readFileSync(BUDGET_FILE, "utf-8")
  const { balance, entries } = parseBudgetFile(content)

  // Validate entries
  if (entries.length > 0) {
    let runningBalance = 100 // Starting balance

    for (const entry of entries) {
      // Skip initial entry
      if (entry.description === "System baseline") continue

      // Calculate expected balance
      const expectedChange = (entry.credit ?? 0) - (entry.debit ?? 0)
      runningBalance += expectedChange

      // Check if balance matches
      if (entry.balance !== runningBalance) {
        errors.push(
          `Balance mismatch at ${entry.date}: expected ${runningBalance}, found ${entry.balance}`
        )
      }
    }

    // Check if current balance matches last entry
    const lastEntry = entries[entries.length - 1]
    if (lastEntry && lastEntry.balance !== balance) {
      errors.push(
        `Current balance (${balance}) does not match last ledger entry (${lastEntry.balance})`
      )
    }
  }

  // Check balance thresholds
  const status = getStatus(balance)

  if (status === "debt") {
    errors.push(`CRITICAL: Silence budget is negative (${balance} units). Feature freeze required.`)
  } else if (status === "critical") {
    warnings.push(`WARNING: Silence budget is critical (${balance} units). No additions allowed.`)
  } else if (status === "warning") {
    warnings.push(`WARNING: Silence budget is low (${balance} units). Prioritize removals.`)
  }

  return {
    valid: errors.length === 0,
    currentBalance: balance,
    status,
    errors,
    warnings,
  }
}

/**
 * Format status for console output
 */
function formatStatus(status: ValidationResult["status"]): string {
  const statusMap = {
    surplus: "🟢 SURPLUS",
    healthy: "🟢 HEALTHY",
    warning: "🟡 WARNING",
    critical: "🟠 CRITICAL",
    debt: "🔴 DEBT",
  }
  return statusMap[status]
}

/**
 * Main execution
 */
function main(): void {
  console.log("╔════════════════════════════════════════════════╗")
  console.log("║         SILENCE BUDGET VALIDATOR               ║")
  console.log("╚════════════════════════════════════════════════╝")
  console.log()

  const result = validateBudget()

  console.log(`Current Balance: ${result.currentBalance} units`)
  console.log(`Status: ${formatStatus(result.status)}`)
  console.log()

  if (result.warnings.length > 0) {
    console.log("⚠️  WARNINGS:")
    for (const warning of result.warnings) {
      console.log(`   ${warning}`)
    }
    console.log()
  }

  if (result.errors.length > 0) {
    console.log("❌ ERRORS:")
    for (const error of result.errors) {
      console.log(`   ${error}`)
    }
    console.log()
  }

  if (result.valid) {
    console.log("✅ Silence budget validation PASSED")
  } else {
    console.log("❌ Silence budget validation FAILED")
    process.exit(1)
  }
}

main()
