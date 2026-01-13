#!/usr/bin/env tsx
/**
 * Validate Intelligence CSS Classes
 *
 * Ensures all CSS classes referenced by intelligence functions
 * are defined in packages/TailwindCSS-V4/Design-System/src/tokens/axis-base.css
 *
 * ⚠️ ENFORCEMENT: This script validates that intelligence CSS classes
 * are defined in the design system (source of truth).
 *
 * Usage:
 *   pnpm validate:intelligence-classes
 */

import { readFileSync } from "fs"
import { join } from "path"

const DESIGN_SYSTEM_BASE = join(process.cwd(), "packages/TailwindCSS-V4/Design-System/src/tokens/axis-base.css")

const INTELLIGENCE_BASE = join(process.cwd(), "packages/NextJS/Shared-Utils/src/tailwind-intelligence.ts")

const INTELLIGENCE_ERP = join(
  process.cwd(),
  "packages/NextJS/Shared-Utils/src/tailwind-intelligence-erp.ts"
)

interface ValidationResult {
  class: string
  file: string
  line?: number
  status: "found" | "missing"
}

/**
 * Extract CSS class names from intelligence functions
 */
function extractIntelligenceClasses(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8")
  const classes: string[] = []

  // Pattern: 'class-name' or "class-name" (single or double quotes)
  // Match class names that look like intelligence classes
  const classPattern = /['"`]([a-z]+(?:-[a-z]+)+)['"`]/g
  const intelligencePrefixes = [
    "vector-",
    "risk-",
    "status-",
    "priority-",
    "transition-",
    "gradient-",
    "role-",
    "broadcast-",
    "workflow-",
    "validation-",
    "data-",
    "financial-",
    "inventory-",
    "order-",
    "payment-",
    "approval-",
    "notification-",
    "module-",
  ]

  let match
  while ((match = classPattern.exec(content)) !== null) {
    const className = match[1]
    // Only include classes that match intelligence patterns
    if (intelligencePrefixes.some((prefix) => className.startsWith(prefix))) {
      classes.push(className)
    }
  }

  return [...new Set(classes)] // Remove duplicates
}

/**
 * Extract CSS class names from axis-base.css
 */
function extractDefinedClasses(filePath: string): string[] {
  const content = readFileSync(filePath, "utf-8")
  const classes: string[] = []

  // Pattern: .class-name { (CSS class definition)
  const classPattern = /\.([a-z]+(?:-[a-z]+)+)\s*\{/g

  let match
  while ((match = classPattern.exec(content)) !== null) {
    classes.push(match[1])
  }

  return classes
}

/**
 * Validate intelligence classes
 */
function validateIntelligenceClasses(): {
  valid: boolean
  missing: ValidationResult[]
  found: ValidationResult[]
} {
  // Extract classes from intelligence functions
  const baseClasses = extractIntelligenceClasses(INTELLIGENCE_BASE)
  const erpClasses = extractIntelligenceClasses(INTELLIGENCE_ERP)
  const allIntelligenceClasses = [...new Set([...baseClasses, ...erpClasses])]

  // Extract defined classes from design system
  const definedClasses = extractDefinedClasses(DESIGN_SYSTEM_BASE)

  // Check which classes are missing
  const missing: ValidationResult[] = []
  const found: ValidationResult[] = []

  for (const className of allIntelligenceClasses) {
    if (definedClasses.includes(className)) {
      found.push({
        class: className,
        file: DESIGN_SYSTEM_BASE,
        status: "found",
      })
    } else {
      missing.push({
        class: className,
        file: DESIGN_SYSTEM_BASE,
        status: "missing",
      })
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    found,
  }
}

/**
 * Main validation function
 */
function main() {
  console.log("🔍 Validating Intelligence CSS Classes...\n")

  const result = validateIntelligenceClasses()

  if (result.valid) {
    console.log("✅ All intelligence CSS classes are defined in design system")
    console.log(`   Found ${result.found.length} classes in axis-base.css\n`)
    process.exit(0)
  } else {
    console.error("❌ TRUTH VIOLATION: Missing intelligence CSS classes\n")
    console.error("The following classes are referenced by intelligence functions")
    console.error("but are NOT defined in packages/TailwindCSS-V4/Design-System/src/tokens/axis-base.css:\n")

    for (const missing of result.missing) {
      console.error(`   ❌ .${missing.class}`)
      console.error(`      Referenced in: ${missing.file}`)
      console.error(`      Action: Add .${missing.class} to axis-base.css @layer utilities\n`)
    }

    console.error("⚠️  This violates the Design System Constitution (SOURCE OF TRUTH rule)")
    console.error("    All intelligence CSS classes MUST be defined in axis-base.css\n")
    process.exit(1)
  }
}

// Run validation
main()
