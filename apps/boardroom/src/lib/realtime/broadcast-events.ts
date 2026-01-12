/**
 * Broadcast Event Handlers
 *
 * Handles WebSocket events for broadcast announcements.
 * Provides utilities for emitting and handling broadcast events.
 */

import { createWebSocketMessage } from './websocket-handler'
import type { WebSocketMessage } from './websocket-schemas'
import type { BroadcastData } from '@/app/actions/broadcasts'

/**
 * Create broadcast_created WebSocket message
 */
export function createBroadcastCreatedMessage(
  broadcast: BroadcastData
): Extract<WebSocketMessage, { type: 'broadcast_created' }> {
  return createWebSocketMessage('broadcast_created', {
    broadcastId: broadcast.id,
    broadcast: {
      id: broadcast.id,
      createdBy: broadcast.createdBy,
      type: broadcast.type,
      title: broadcast.title,
      message: broadcast.message,
      audience: broadcast.audience,
      priority: broadcast.priority,
    },
  })
}

/**
 * Create broadcast_updated WebSocket message
 */
export function createBroadcastUpdatedMessage(
  broadcastId: string,
  changes: Partial<BroadcastData>
): Extract<WebSocketMessage, { type: 'broadcast_updated' }> {
  return createWebSocketMessage('broadcast_updated', {
    broadcastId,
    changes: changes as Record<string, unknown>,
  })
}

/**
 * Create broadcast_read WebSocket message
 */
export function createBroadcastReadMessage(
  broadcastId: string,
  userId: string
): Extract<WebSocketMessage, { type: 'broadcast_read' }> {
  return createWebSocketMessage('broadcast_read', {
    broadcastId,
    userId,
  })
}

/**
 * Emit broadcast event to WebSocket clients
 *
 * In production, this would send the message to all connected clients
 * matching the broadcast audience. For now, this is a placeholder that
 * logs the event.
 */
export async function emitBroadcastEvent(
  message: WebSocketMessage
): Promise<void> {
  // TODO: In production, integrate with WebSocket server
  // This would:
  // 1. Get all connected clients
  // 2. Filter by audience (if broadcast_created/updated)
  // 3. Send message to matching clients
  // 4. Handle connection errors gracefully

  console.log('📡 Broadcast WebSocket Event:', {
    type: message.type,
    timestamp: message.timestamp,
    data: message,
  })
}
