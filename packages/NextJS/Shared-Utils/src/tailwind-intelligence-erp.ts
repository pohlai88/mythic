/**
 * ERP-Specific Tailwind Intelligence Utilities
 *
 * ⚠️ SINGLE SOURCE OF TRUTH for ERP Intelligence Functions
 * This file extends base tailwind-intelligence.ts with ERP-specific patterns.
 *
 * Context-aware, data-driven styling utilities for ERP business logic patterns.
 *
 * ⚠️ CSS CLASSES SOURCE OF TRUTH: packages/design-system/src/tokens/axis-base.css
 * All CSS classes referenced by these functions (e.g., .role-sovereign, .broadcast-approval)
 * MUST be defined in the design system. This file only contains TypeScript functions
 * that return class strings referencing classes from the design system.
 *
 * @see packages/shared-utils/src/tailwind-intelligence.ts - Base intelligence functions
 * @see docs/reference/TAILWIND_INTELLIGENCE_DRIVEN.md - Documentation
 * @see packages/design-system/src/tokens/axis-base.css - CSS classes source of truth
 */

import { cn } from "./cn"

// ============================================================================
// ERP Types
// ============================================================================

export type UserRole = "sovereign" | "council" | "observer"
export type BroadcastType = "approval" | "veto" | "announcement" | "poll" | "emergency"
export type BroadcastPriority = "low" | "normal" | "high" | "urgent"
export type BroadcastState = "draft" | "published" | "scheduled" | "expired" | "archived"
export type WorkflowState = "pending" | "in_progress" | "completed" | "blocked" | "cancelled"
export type ValidationState = "valid" | "invalid" | "warning" | "pending"
export type DataState = "loading" | "loaded" | "error" | "empty" | "refreshing"
export type FinancialStatus = "profitable" | "break_even" | "loss" | "projected"
export type InventoryLevel = "in_stock" | "low_stock" | "out_of_stock" | "backordered"
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"
export type ApprovalWorkflow =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "requires_changes"
export type NotificationType = "info" | "success" | "warning" | "error" | "system"
export type ModuleStatus = "active" | "inactive" | "maintenance" | "deprecated"

export type RoleVariant = "badge" | "indicator" | "text" | "card"
export type BroadcastVariant = "badge" | "banner" | "card" | "alert"
export type WorkflowVariant = "badge" | "progress" | "indicator" | "text"
export type ValidationVariant = "badge" | "border" | "text" | "icon"
export type DataStateVariant = "badge" | "skeleton" | "overlay" | "message"
export type FinancialVariant = "badge" | "indicator" | "text" | "chart"
export type InventoryVariant = "badge" | "indicator" | "text" | "stock"
export type OrderVariant = "badge" | "status" | "timeline" | "text"
export type PaymentVariant = "badge" | "indicator" | "text" | "amount"
export type NotificationVariant = "toast" | "banner" | "badge" | "alert"

// ============================================================================
// Role-Based Styling
// ============================================================================

/**
 * Visual indicators based on user roles
 *
 * @param role - User role (sovereign/council/observer)
 * @param variant - Style variant (badge/indicator/text/card)
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentRoleStyles(
  role: UserRole,
  variant: RoleVariant = "badge",
  className?: string
): string {
  const roleClasses = {
    sovereign: "role-sovereign", // Gold/amber tones (highest authority)
    council: "role-council", // Blue/teal tones (management)
    observer: "role-observer", // Gray/ash tones (read-only)
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
    card: "p-4 rounded-lg border",
  }

  return cn(roleClasses[role], variantModifiers[variant], className)
}

// ============================================================================
// Broadcast Styling
// ============================================================================

/**
 * Context-aware styling for broadcast types and priorities
 *
 * @param type - Broadcast type
 * @param priority - Broadcast priority
 * @param state - Broadcast state
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentBroadcastStyles(
  type: BroadcastType,
  priority: BroadcastPriority = "normal",
  state: BroadcastState = "published",
  variant: BroadcastVariant = "badge",
  className?: string
): string {
  const typeClasses = {
    approval: "broadcast-approval", // Green/emerald tones
    veto: "broadcast-veto", // Red/ember tones
    announcement: "broadcast-announcement", // Blue/gold tones
    poll: "broadcast-poll", // Purple/indigo tones
    emergency: "broadcast-emergency", // Red/amber tones with animation
  }

  const priorityClasses = {
    low: "priority-low",
    normal: "priority-normal",
    high: "priority-high",
    urgent: "priority-urgent animate-pulse", // Pulsing for urgent
  }

  const stateClasses = {
    draft: "opacity-60 border-dashed",
    published: "",
    scheduled: "opacity-80",
    expired: "opacity-40 grayscale",
    archived: "opacity-50",
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    banner: "p-4 rounded-lg border-l-4",
    card: "p-4 rounded-lg border shadow-sm",
    alert: "p-3 rounded-lg border-2",
  }

  return cn(
    typeClasses[type],
    priorityClasses[priority],
    stateClasses[state],
    variantModifiers[variant],
    className
  )
}

// ============================================================================
// Workflow State Styling
// ============================================================================

/**
 * Visual indicators for workflow progression states
 *
 * @param state - Workflow state
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentWorkflowStyles(
  state: WorkflowState,
  variant: WorkflowVariant = "badge",
  className?: string
): string {
  const stateClasses = {
    pending: "workflow-pending", // Gray/ash tones
    in_progress: "workflow-in-progress", // Blue/gold tones
    completed: "workflow-completed", // Green/emerald tones
    blocked: "workflow-blocked", // Red/amber tones
    cancelled: "workflow-cancelled", // Gray/charcoal tones
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    progress: "h-2 rounded-full",
    indicator: "w-2 h-2 rounded-full",
    text: "",
  }

  return cn(stateClasses[state], variantModifiers[variant], className)
}

// ============================================================================
// Validation State Styling
// ============================================================================

/**
 * Visual feedback for form/data validation states
 *
 * @param state - Validation state
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentValidationStyles(
  state: ValidationState,
  variant: ValidationVariant = "border",
  className?: string
): string {
  const stateClasses = {
    valid: "validation-valid", // Green border/text
    invalid: "validation-invalid", // Red border/text
    warning: "validation-warning", // Amber/yellow border/text
    pending: "validation-pending", // Gray border/text
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    border: "border-2",
    text: "",
    icon: "w-4 h-4",
  }

  return cn(stateClasses[state], variantModifiers[variant], className)
}

// ============================================================================
// Data State Styling
// ============================================================================

/**
 * Visual indicators for async data loading states
 *
 * @param state - Data state
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentDataStateStyles(
  state: DataState,
  variant: DataStateVariant = "badge",
  className?: string
): string {
  const stateClasses = {
    loading: "data-loading animate-pulse", // Pulsing skeleton
    loaded: "data-loaded", // Normal state
    error: "data-error", // Red/error tones
    empty: "data-empty opacity-60", // Gray/empty state
    refreshing: "data-refreshing opacity-80", // Slightly dimmed
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    skeleton: "animate-pulse bg-charcoal/20 rounded",
    overlay: "absolute inset-0 bg-void/50 flex items-center justify-center",
    message: "p-4 rounded-lg text-center",
  }

  return cn(stateClasses[state], variantModifiers[variant], className)
}

// ============================================================================
// Financial Status Styling
// ============================================================================

/**
 * Visual indicators for financial status (profit/loss/break-even)
 *
 * @param status - Financial status
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentFinancialStyles(
  status: FinancialStatus,
  variant: FinancialVariant = "badge",
  className?: string
): string {
  const statusClasses = {
    profitable: "financial-profitable", // Green/emerald tones
    break_even: "financial-break-even", // Gray/neutral tones
    loss: "financial-loss", // Red/ember tones
    projected: "financial-projected", // Blue/gold tones (future)
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
    chart: "h-4 rounded",
  }

  return cn(statusClasses[status], variantModifiers[variant], className)
}

// ============================================================================
// Inventory Level Styling
// ============================================================================

/**
 * Visual indicators for inventory stock levels
 *
 * @param level - Inventory level
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentInventoryStyles(
  level: InventoryLevel,
  variant: InventoryVariant = "badge",
  className?: string
): string {
  const levelClasses = {
    in_stock: "inventory-in-stock", // Green tones
    low_stock: "inventory-low-stock", // Amber/yellow tones
    out_of_stock: "inventory-out-of-stock", // Red tones
    backordered: "inventory-backordered", // Purple/indigo tones
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
    stock: "px-3 py-2 rounded-lg border",
  }

  return cn(levelClasses[level], variantModifiers[variant], className)
}

// ============================================================================
// Order Status Styling
// ============================================================================

/**
 * Visual indicators for order lifecycle states
 *
 * @param status - Order status
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentOrderStyles(
  status: OrderStatus,
  variant: OrderVariant = "badge",
  className?: string
): string {
  const statusClasses = {
    pending: "order-pending", // Gray/ash tones
    confirmed: "order-confirmed", // Blue tones
    processing: "order-processing", // Gold/amber tones
    shipped: "order-shipped", // Teal/cyan tones
    delivered: "order-delivered", // Green/emerald tones
    cancelled: "order-cancelled", // Red/ember tones
    returned: "order-returned", // Purple/indigo tones
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    status: "px-3 py-2 rounded-lg border",
    timeline: "flex items-center gap-2",
    text: "",
  }

  return cn(statusClasses[status], variantModifiers[variant], className)
}

// ============================================================================
// Payment Status Styling
// ============================================================================

/**
 * Visual indicators for payment processing states
 *
 * @param status - Payment status
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentPaymentStyles(
  status: PaymentStatus,
  variant: PaymentVariant = "badge",
  className?: string
): string {
  const statusClasses = {
    pending: "payment-pending", // Gray/ash tones
    processing: "payment-processing animate-pulse", // Gold/amber tones with pulse
    completed: "payment-completed", // Green/emerald tones
    failed: "payment-failed", // Red/ember tones
    refunded: "payment-refunded", // Purple/indigo tones
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
    amount: "px-3 py-2 rounded-lg font-mono",
  }

  return cn(statusClasses[status], variantModifiers[variant], className)
}

// ============================================================================
// Approval Workflow Styling
// ============================================================================

/**
 * Visual indicators for approval workflow stages
 *
 * @param stage - Approval workflow stage
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentApprovalWorkflowStyles(
  stage: ApprovalWorkflow,
  variant: WorkflowVariant = "badge",
  className?: string
): string {
  const stageClasses = {
    submitted: "approval-submitted", // Blue tones
    under_review: "approval-under-review", // Gold/amber tones
    approved: "approval-approved", // Green/emerald tones
    rejected: "approval-rejected", // Red/ember tones
    requires_changes: "approval-requires-changes", // Amber/yellow tones
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    progress: "h-2 rounded-full",
    indicator: "w-2 h-2 rounded-full",
    text: "",
  }

  return cn(stageClasses[stage], variantModifiers[variant], className)
}

// ============================================================================
// Notification Styling
// ============================================================================

/**
 * Visual styling for notification types
 *
 * @param type - Notification type
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentNotificationStyles(
  type: NotificationType,
  variant: NotificationVariant = "toast",
  className?: string
): string {
  const typeClasses = {
    info: "notification-info", // Blue tones
    success: "notification-success", // Green tones
    warning: "notification-warning", // Amber/yellow tones
    error: "notification-error", // Red tones
    system: "notification-system", // Gray/neutral tones
  }

  const variantModifiers = {
    toast: "p-4 rounded-lg shadow-lg border-l-4",
    banner: "p-3 rounded-lg border",
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    alert: "p-4 rounded-lg border-2",
  }

  return cn(typeClasses[type], variantModifiers[variant], className)
}

// ============================================================================
// Module Status Styling
// ============================================================================

/**
 * Visual indicators for ERP module status
 *
 * @param status - Module status
 * @param variant - Style variant
 * @param className - Additional classes to merge
 * @returns Merged class string
 */
export function intelligentModuleStatusStyles(
  status: ModuleStatus,
  variant: RoleVariant = "badge",
  className?: string
): string {
  const statusClasses = {
    active: "module-active", // Green tones
    inactive: "module-inactive", // Gray tones
    maintenance: "module-maintenance", // Amber/yellow tones
    deprecated: "module-deprecated", // Red tones with strikethrough
  }

  const variantModifiers = {
    badge: "px-2 py-1 rounded-xs text-xs font-medium",
    indicator: "w-2 h-2 rounded-full",
    text: "",
    card: "p-4 rounded-lg border",
  }

  return cn(statusClasses[status], variantModifiers[variant], className)
}

// ============================================================================
// Combined ERP Intelligence Styling
// ============================================================================

interface ERPIntelligentStylesConfig {
  role?: UserRole
  broadcastType?: BroadcastType
  broadcastPriority?: BroadcastPriority
  workflowState?: WorkflowState
  validationState?: ValidationState
  dataState?: DataState
  financialStatus?: FinancialStatus
  inventoryLevel?: InventoryLevel
  orderStatus?: OrderStatus
  paymentStatus?: PaymentStatus
  approvalWorkflow?: ApprovalWorkflow
  notificationType?: NotificationType
  moduleStatus?: ModuleStatus
  isUrgent?: boolean
  isDisabled?: boolean
  isSelected?: boolean
  className?: string
}

/**
 * Combine multiple ERP intelligence factors into a single class string
 *
 * @param config - Configuration object with ERP intelligence factors
 * @returns Merged class string
 */
export function intelligentERPStyles(config: ERPIntelligentStylesConfig): string {
  const classes: string[] = []

  // Role styling
  if (config.role) {
    classes.push(intelligentRoleStyles(config.role, "text"))
  }

  // Broadcast styling
  if (config.broadcastType) {
    classes.push(
      intelligentBroadcastStyles(
        config.broadcastType,
        config.broadcastPriority,
        "published",
        "badge"
      )
    )
  }

  // Workflow styling
  if (config.workflowState) {
    classes.push(intelligentWorkflowStyles(config.workflowState, "text"))
  }

  // Validation styling
  if (config.validationState) {
    classes.push(intelligentValidationStyles(config.validationState, "border"))
  }

  // Data state styling
  if (config.dataState) {
    classes.push(intelligentDataStateStyles(config.dataState, "badge"))
  }

  // Financial styling
  if (config.financialStatus) {
    classes.push(intelligentFinancialStyles(config.financialStatus, "text"))
  }

  // Inventory styling
  if (config.inventoryLevel) {
    classes.push(intelligentInventoryStyles(config.inventoryLevel, "text"))
  }

  // Order styling
  if (config.orderStatus) {
    classes.push(intelligentOrderStyles(config.orderStatus, "text"))
  }

  // Payment styling
  if (config.paymentStatus) {
    classes.push(intelligentPaymentStyles(config.paymentStatus, "text"))
  }

  // Approval workflow styling
  if (config.approvalWorkflow) {
    classes.push(intelligentApprovalWorkflowStyles(config.approvalWorkflow, "text"))
  }

  // Notification styling
  if (config.notificationType) {
    classes.push(intelligentNotificationStyles(config.notificationType, "badge"))
  }

  // Module status styling
  if (config.moduleStatus) {
    classes.push(intelligentModuleStatusStyles(config.moduleStatus, "text"))
  }

  // Urgent state
  if (config.isUrgent) {
    classes.push("priority-urgent animate-pulse")
  }

  // Disabled state
  if (config.isDisabled) {
    classes.push("opacity-50 pointer-events-none cursor-not-allowed")
  }

  // Selected state
  if (config.isSelected) {
    classes.push("ring-2 ring-gold ring-offset-2 ring-offset-void")
  }

  // Custom classes
  if (config.className) {
    classes.push(config.className)
  }

  return cn(...classes)
}
