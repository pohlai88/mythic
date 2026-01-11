/**
 * WebSocket Handler with Zod Validation
 *
 * Phase 21: WebSocket message handling with validated schemas
 */

import { z as z4 } from 'zod/v4'
import {
  websocketMessageSchema,
  websocketConnectionSchema,
  type WebSocketMessage,
  type WebSocketConnection,
} from './websocket-schemas'

/**
 * Validate WebSocket message
 */
export function validateWebSocketMessage(message: unknown) {
  return websocketMessageSchema.safeParse(message)
}

/**
 * Handle WebSocket message
 *
 * Validates message and processes it
 */
export function handleWebSocketMessage(
  message: unknown,
  userId: string
): WebSocketMessage {
  const result = validateWebSocketMessage(message)
  if (!result.success) {
    // Vanguard Security: Reject invalid messages
    throw new Error(
      `Invalid WebSocket message: ${result.error.issues[0]?.message || 'Unknown error'}`
    )
  }

  // Additional security check: verify userId matches message author if present
  const validatedMessage = result.data

  // Check if message has authorId and it matches the connection userId
  if (
    (validatedMessage.type === 'comment_added' &&
      validatedMessage.authorId !== userId) ||
    (validatedMessage.type === 'approval_status_changed' &&
      validatedMessage.approvedBy &&
      validatedMessage.approvedBy !== userId)
  ) {
    throw new Error('User ID mismatch in WebSocket message')
  }

  return validatedMessage
}

/**
 * Validate WebSocket connection
 */
export function validateWebSocketConnection(
  connection: unknown
): WebSocketConnection {
  const result = websocketConnectionSchema.safeParse(connection)
  if (!result.success) {
    throw new Error(`Invalid WebSocket connection: ${result.error.issues[0]?.message || 'Unknown error'}`)
  }
  return result.data
}

/**
 * Create WebSocket message
 *
 * Helper to create validated WebSocket messages
 */
export function createWebSocketMessage<T extends WebSocketMessage['type']>(
  type: T,
  data: Omit<Extract<WebSocketMessage, { type: T }>, 'type' | 'timestamp'>
): Extract<WebSocketMessage, { type: T }> {
  const message = {
    type,
    ...data,
    timestamp: new Date(),
  } as Extract<WebSocketMessage, { type: T }>

  return websocketMessageSchema.parse(message) as Extract<
    WebSocketMessage,
    { type: T }
  >
}
