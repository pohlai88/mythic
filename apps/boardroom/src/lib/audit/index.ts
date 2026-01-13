/**
 * Audit Trail Module Exports
 *
 * Phase 22: Centralized audit trail exports
 */

export {
  thanosEventSchema,
  immutableAuditTrailSchema,
  createAuditEventSchema,
  type ThanosEvent,
  type ImmutableAuditTrail,
  type CreateAuditEvent,
} from "./audit-schemas"

export {
  createAuditEvent,
  getAuditTrail,
  validateAuditEvent,
  validateAuditTrail,
  validateCreateAuditEvent,
} from "./audit-service"
