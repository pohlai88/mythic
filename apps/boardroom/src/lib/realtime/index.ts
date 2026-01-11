/**
 * Realtime/WebSocket Module Exports
 *
 * Phase 21: Centralized WebSocket exports
 */

export {
  websocketMessageSchema,
  websocketConnectionSchema,
  type WebSocketMessage,
  type WebSocketConnection,
} from './websocket-schemas'

export {
  validateWebSocketMessage,
  handleWebSocketMessage,
  validateWebSocketConnection,
  createWebSocketMessage,
} from './websocket-handler'
