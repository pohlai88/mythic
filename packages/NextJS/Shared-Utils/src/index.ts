/**
 * Shared Utilities Package
 *
 * Export all utility functions here
 */

export { cn } from "./cn"

// Tailwind Intelligence Utilities (Base)
export {
  // Core functions
  intelligentRiskStyles,
  intelligentStatusStyles,
  intelligentVarianceStyles,
  intelligentPriorityStyles,
  intelligentButtonStyles,
  intelligentInputStyles,
  intelligentTransitionStyles,
  intelligentStyles,
  calculateRiskStatus,
  createIntelligentStyles,
  // Types
  type RiskStatus,
  type ProposalStatus,
  type PriorityLevel,
  type VectorType,
  type StatusVariant,
  type ButtonVariant,
  type ButtonSize,
  type VarianceVariant,
  type PriorityVariant,
} from "./tailwind-intelligence"

// Tailwind Intelligence Utilities (ERP-Specific)
export {
  // ERP functions
  intelligentRoleStyles,
  intelligentBroadcastStyles,
  intelligentWorkflowStyles,
  intelligentValidationStyles,
  intelligentDataStateStyles,
  intelligentFinancialStyles,
  intelligentInventoryStyles,
  intelligentOrderStyles,
  intelligentPaymentStyles,
  intelligentApprovalWorkflowStyles,
  intelligentNotificationStyles,
  intelligentModuleStatusStyles,
  intelligentERPStyles,
  // ERP Types
  type UserRole,
  type BroadcastType,
  type BroadcastPriority,
  type BroadcastState,
  type WorkflowState,
  type ValidationState,
  type DataState,
  type FinancialStatus,
  type InventoryLevel,
  type OrderStatus,
  type PaymentStatus,
  type ApprovalWorkflow,
  type NotificationType,
  type ModuleStatus,
  type RoleVariant,
  type BroadcastVariant,
  type WorkflowVariant,
  type ValidationVariant,
  type DataStateVariant,
  type FinancialVariant,
  type InventoryVariant,
  type OrderVariant,
  type PaymentVariant,
  type NotificationVariant,
} from "./tailwind-intelligence-erp"
