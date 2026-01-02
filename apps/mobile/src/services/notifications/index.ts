/**
 * Notifications Service - Push notification handling
 *
 * @example
 * ```typescript
 * import {
 *   registerFriendNotifications,
 *   processFriendNotification,
 * } from '@/services/notifications';
 * ```
 */

export {
  registerFriendNotifications,
  unregisterFriendNotifications,
  processFriendNotification,
  createFriendsNotificationChannel,
  type FriendNotificationData,
  type FriendNotificationHandlers,
} from './friendNotifications';
