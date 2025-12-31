/**
 * Sync Services
 *
 * WebSocket-based real-time synchronization with happy-server-workers.
 *
 * @example
 * ```typescript
 * import { wsService, setupSyncHandlers } from '@/services/sync';
 *
 * // Set up handlers (call once at app init)
 * const cleanup = setupSyncHandlers();
 *
 * // Connect to server
 * await wsService.connect(serverUrl, token);
 *
 * // Disconnect when done
 * wsService.disconnect();
 * cleanup();
 * ```
 */

export { wsService } from './WebSocketService';
export { setupSyncHandlers, areHandlersSetup } from './handlers';
