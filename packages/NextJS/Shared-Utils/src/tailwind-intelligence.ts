/**
 * Tailwind Intelligence Utilities
 *
 * ⚠️ SINGLE SOURCE OF TRUTH for TypeScript Intelligence Functions
 * This is the canonical implementation. All re-exports reference this file.
 *
 * Context-aware, data-driven styling utilities that automatically apply
 * appropriate Tailwind classes based on business logic, risk scores,
 * status values, and real-time state changes.
 *
 * ⚠️ CSS CLASSES SOURCE OF TRUTH: packages/design-system/src/tokens/axis-base.css
 * All CSS classes referenced by these functions (e.g., .risk-on-track, .status-approved)
 * MUST be defined in the design system. This file only contains TypeScript functions
 * that return class strings referencing classes from the design system.
 *
 * @see docs/reference/TAILWIND_INTELLIGENCE_DRIVEN.md
 * @see packages/design-system/src/tokens/axis-base.css - CSS classes source of truth
 */

import { cn } from "./cn"

// ============================================================================
// Types
// ============================================================================

export type RiskStatus = "on_track" | "warning" | "overrun" | "underrun" | "critical"

export type ProposalStatus = "DRAFT" | "LISTENING" | "APPROVED" | "VETOED" | "ARCHIVED"

export type PriorityLevel = "HIGH" | "MEDIUM" | "LOW"

export type VectorType = "past" | "present" | "future"

export type StatusVariant = "badge" | "card" | "border" | "text"

export type ButtonVariant = "primary" | "secondary" | "tertiary"

export type ButtonSize = "sm" | "md" | "lg"

export type VarianceVariant = "badge" | "text" | "indicator"

export type PriorityVariant = "badge" | "indicator" | "text"

// ============================================================================
// Risk Calculation
// ============================================================================

/**
 * Calculate risk status from variance percentage
 *
 * @param variance - Variance percentage (can be negative for underruns)
 * @param vectorType - Vector type (past/present/future)
 * @returns Risk status
 */
export function calculateRiskStatus(
  variance: number,
  vectorType: VectorType = "future"
): RiskStatus {
  // Past and present vectors are always on track (historical/current state)
  if (vectorType === "past" || vectorType === "present") {
    return "on_track"
  }

  // Future vector uses risk thresholds
  if (variance < -10) {
    return "underrun"
  }
  if (variance >= 20) {
    return "critical"
  }
  if (variance >= 10) {
    return "overrun"
  }
  if (variance >= 5) {
    return "warning"
  }
  return "on_track"
}

// ============================================================================
// Risk-Based Styling
// ============================================================================

/**
 * Risk-based styling from variance percentage or explicit risk status
 *
 * @param riskStatus - Risk status string or variance percentage (auto-calculates)
 * @param vectorType - Vector type (past/present/future)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentRiskStyles(
  riskStatus: RiskStatus | number,
  vectorType: VectorType = "future",
  className?: string
): string {
  // Auto-calculate risk if number provided
  const risk: RiskStatus =
    typeof riskStatus === "number" ? calculateRiskStatus(riskStatus, vectorType) : riskStatus

  // Base classes for vector types
  const vectorClasses = {
    past: "vector-past",
    present: "vector-present",
    future: "vector-future",
  }

  // Risk-specific classes
  const riskClasses = {
    on_track: "risk-on-track",
    warning: "risk-warning",
    overrun: "risk-overrun",
    underrun: "risk-underrun",
    critical: "risk-critical",
  }

  return cn(vectorClasses[vectorType], riskClasses[risk], className)
}

// ============================================================================
// Status-Based Styling
// ============================================================================

/**
 * Context-aware styling for proposal statuses
 *
 * @param status - Proposal status
 * @param variant - Style variant (badge/card/border/text)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentStatusStyles(
  status: ProposalStatus,
  variant: StatusVariant = "badge",
  className?: string
): string {
  const statusClasses = {
    DRAFT: "status-draft",
    LISTENING: "status-listening",
    APPROVED: "status-approved",
    VETOED: "status-vetoed",
    ARCHIVED: "status-archived",
  }

  const baseClass = statusClasses[status]

  // Variant-specific modifiers
  const variantModifiers = {
    badge: "",
    card: "p-4 rounded-lg",
    border: "border-2",
    text: "",
  }

  return cn(baseClass, variantModifiers[variant], className)
}

// ============================================================================
// Variance-Based Styling
// ============================================================================

/**
 * Dynamic styling based on variance percentage thresholds
 *
 * @param variancePct - Variance percentage
 * @param variant - Style variant (badge/text/indicator)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentVarianceStyles(
  variancePct: number,
  variant: VarianceVariant = "badge",
  className?: string
): string {
  const riskStatus = calculateRiskStatus(variancePct, "future")
  const riskClass = intelligentRiskStyles(riskStatus, "future")

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    text: "",
    indicator: "h-2 rounded-full",
  }

  return cn(riskClass, variantModifiers[variant], className)
}

// ============================================================================
// Priority-Based Styling
// ============================================================================

/**
 * Visual urgency indicators based on priority levels
 *
 * @param priority - Priority level
 * @param variant - Style variant (badge/indicator/text)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentPriorityStyles(
  priority: PriorityLevel,
  variant: PriorityVariant = "badge",
  className?: string
): string {
  const priorityClasses = {
    HIGH: "priority-high",
    MEDIUM: "priority-medium",
    LOW: "priority-low",
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
  }

  return cn(priorityClasses[priority], variantModifiers[variant], className)
}

// ============================================================================
// Button Styling
// ============================================================================

/**
 * Context-aware button styling
 *
 * @param variant - Button variant (primary/secondary/tertiary)
 * @param size - Button size (sm/md/lg)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentButtonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
): string {
  const variantClasses = {
    primary: "bg-gold text-void hover:bg-gold/90 active:bg-gold/80",
    secondary: "bg-charcoal text-parchment hover:bg-charcoal/80 active:bg-charcoal/70",
    tertiary: "bg-transparent text-parchment hover:bg-charcoal/20 active:bg-charcoal/30",
  }

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const baseClasses =
    "font-medium rounded-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"

  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className)
}

// ============================================================================
// Input Styling
// ============================================================================

/**
 * Consistent input styling following design system
 *
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentInputStyles(className?: string): string {
  const baseClasses =
    "w-full px-4 py-2 bg-charcoal border border-ash/30 rounded-xs text-parchment placeholder:text-ash/50 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-colors duration-200"

  return cn(baseClasses, className)
}

// ============================================================================
// Transition Styling
// ============================================================================

/**
 * Intelligent transition utilities
 *
 * @param type - Transition type (illuminate/commit/hover-intelligent)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentTransitionStyles(
  type: "illuminate" | "commit" | "hover-intelligent",
  className?: string
): string {
  const transitionClasses = {
    illuminate: "transition-illuminate",
    commit: "transition-commit",
    "hover-intelligent": "transition-hover-intelligent",
  }

  return cn(transitionClasses[type], className)
}

// ============================================================================
// Combined Intelligence Styling
// ============================================================================

interface IntelligentStylesConfig {
  status?: ProposalStatus
  priority?: PriorityLevel
  riskStatus?: RiskStatus | number
  vectorType?: VectorType
  isSelected?: boolean
  isActive?: boolean
  isUrgent?: boolean
  className?: string
}

/**
 * Combine multiple intelligence factors into a single class string
 *
 * @param config - Configuration object with intelligence factors
 * @returns Merged class string
 */
export function intelligentStyles(config: IntelligentStylesConfig): string {
  const classes: string[] = []

  // Status styling
  if (config.status) {
    classes.push(intelligentStatusStyles(config.status, "card"))
  }

  // Priority styling
  if (config.priority) {
    classes.push(intelligentPriorityStyles(config.priority, "text"))
  }

  // Risk styling
  if (config.riskStatus !== undefined) {
    classes.push(intelligentRiskStyles(config.riskStatus, config.vectorType ?? "future"))
  }

  // Selection state
  if (config.isSelected) {
    classes.push("ring-2 ring-gold ring-offset-2 ring-offset-void")
  }

  // Active state
  if (config.isActive) {
    classes.push("bg-gold/10 border-gold/30")
  }

  // Urgent state
  if (config.isUrgent) {
    classes.push("priority-high animate-pulse")
  }

  // Custom classes
  if (config.className) {
    classes.push(config.className)
  }

  return cn(...classes)
}

// ============================================================================
// Fluent Builder API
// ============================================================================

interface FluentBuilder {
  risk(riskStatus: RiskStatus | number, vectorType?: VectorType): FluentBuilder
  status(status: ProposalStatus, variant?: StatusVariant): FluentBuilder
  priority(priority: PriorityLevel, variant?: PriorityVariant): FluentBuilder
  variance(variancePct: number, variant?: VarianceVariant): FluentBuilder
  transition(type: "illuminate" | "commit" | "hover-intelligent"): FluentBuilder
  gradient(type: "approved" | "vetoed" | "warning" | "success" | "neutral"): FluentBuilder
  add(className: string): FluentBuilder
  build(): string
}

/**
 * Create a fluent builder for complex styling scenarios
 *
 * @returns Fluent builder instance
 */
export function createIntelligentStyles(): FluentBuilder {
  const classes: string[] = []

  const builder: FluentBuilder = {
    risk(riskStatus: RiskStatus | number, vectorType: VectorType = "future") {
      classes.push(intelligentRiskStyles(riskStatus, vectorType))
      return this
    },

    status(status: ProposalStatus, variant: StatusVariant = "badge") {
      classes.push(intelligentStatusStyles(status, variant))
      return this
    },

    priority(priority: PriorityLevel, variant: PriorityVariant = "badge") {
      classes.push(intelligentPriorityStyles(priority, variant))
      return this
    },

    variance(variancePct: number, variant: VarianceVariant = "badge") {
      classes.push(intelligentVarianceStyles(variancePct, variant))
      return this
    },

    transition(type: "illuminate" | "commit" | "hover-intelligent") {
      classes.push(intelligentTransitionStyles(type))
      return this
    },

    gradient(type: "approved" | "vetoed" | "warning" | "success" | "neutral") {
      classes.push(`gradient-${type}`)
      return this
    },

    add(className: string) {
      classes.push(className)
      return this
    },

    build() {
      return cn(...classes)
    },
  }

  return builder
}
