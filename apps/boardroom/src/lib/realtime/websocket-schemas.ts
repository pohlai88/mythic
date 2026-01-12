/**
 * WebSocket Message Schemas
 *
 * Phase 21: WebSocket message validation with Zod
 * Luxury ERP Requirement: WebSocket messages must be validated for security
 */

import { z as z4 } from 'zod/v4'

/**
 * WebSocket Message Schema
 *
 * Validates all WebSocket message types using discriminated union
 */
export const websocketMessageSchema = z4.discriminatedUnion('type', [
  z4.object({
    type: z4.literal('proposal_updated'),
    proposalId: z4.string().uuid(),
    changes: z4.record(z4.string(), z4.unknown()),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('comment_added'),
    proposalId: z4.string().uuid(),
    commentId: z4.string().uuid(),
    authorId: z4.string().uuid(),
    content: z4.string().min(1).max(5000),
    mentions: z4.array(z4.string().uuid()).default([]),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('presence_update'),
    userId: z4.string().uuid(),
    proposalId: z4.string().uuid().optional(),
    status: z4.enum(['viewing', 'editing', 'idle']),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('approval_status_changed'),
    proposalId: z4.string().uuid(),
    status: z4.enum(['DRAFT', 'LISTENING', 'APPROVED', 'VETOED', 'ARCHIVED']),
    approvedBy: z4.string().uuid().optional(),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('broadcast_created'),
    broadcastId: z4.string().uuid(),
    broadcast: z4.object({
      id: z4.string().uuid(),
      createdBy: z4.string().uuid(),
      type: z4.enum(['approval', 'veto', 'announcement', 'poll', 'emergency']),
      title: z4.string(),
      message: z4.string().nullable(),
      audience: z4.string(),
      priority: z4.enum(['low', 'normal', 'high', 'urgent']),
    }),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('broadcast_updated'),
    broadcastId: z4.string().uuid(),
    changes: z4.record(z4.string(), z4.unknown()),
    timestamp: z4.date(),
  }),
  z4.object({
    type: z4.literal('broadcast_read'),
    broadcastId: z4.string().uuid(),
    userId: z4.string().uuid(),
    timestamp: z4.date(),
  }),
]).describe('WebSocket message validation schema')

/**
 * WebSocket Connection Schema
 */
export const websocketConnectionSchema = z4.object({
  userId: z4.string().uuid(),
  sessionId: z4.string().uuid(),
  connectedAt: z4.date(),
  lastActivity: z4.date(),
}).describe('WebSocket connection validation')

/**
 * Type exports
 */
export type WebSocketMessage = z4.infer<typeof websocketMessageSchema>
export type WebSocketConnection = z4.infer<typeof websocketConnectionSchema>
