/**
 * Friend Notification Handlers for NativeScript
 *
 * Handles push notifications related to friend events:
 * - Friend requests received
 * - Friend requests accepted
 *
 * This module provides registration and handling of friend-related
 * push notifications.
 *
 * @example
 * ```typescript
 * import { registerFriendNotifications } from '@/services/notifications/friendNotifications';
 *
 * // Register handlers on app startup
 * registerFriendNotifications({
 *   onFriendRequest: (data) => console.log('New request from:', data.fromUserName),
 *   onFriendAccepted: (data) => console.log('Accepted by:', data.fromUserName),
 *   navigateToFriends: () => navigation.navigate('Friends'),
 * });
 * ```
 */

import { useFriends } from '@/composables/useFriends';

/**
 * Friend notification data from server
 */
export interface FriendNotificationData {
  type: 'friend_request' | 'friend_accepted';
  fromUserId: string;
  fromUserName: string;
  timestamp: number;
}

/**
 * Notification handler callbacks
 */
export interface FriendNotificationHandlers {
  /** Called when a friend request notification is received */
  onFriendRequest?: (data: FriendNotificationData) => void;
  /** Called when a friend accepted notification is received */
  onFriendAccepted?: (data: FriendNotificationData) => void;
  /** Navigation callback to friends screen */
  navigateToFriends?: () => void;
  /** Show local notification callback (platform-specific implementation) */
  showLocalNotification?: (title: string, body: string, data: FriendNotificationData) => Promise<void>;
}

// Store handlers for later use
let handlers: FriendNotificationHandlers = {};

/**
 * Parse notification data from push message
 */
function parseNotificationData(data: Record<string, unknown>): FriendNotificationData | null {
  if (!data || typeof data !== 'object') return null;

  const type = data.type as string;
  if (type !== 'friend_request' && type !== 'friend_accepted') {
    return null;
  }

  return {
    type,
    fromUserId: String(data.fromUserId ?? ''),
    fromUserName: String(data.fromUserName ?? 'Someone'),
    timestamp: Number(data.timestamp ?? Date.now()),
  };
}

/**
 * Handle a friend notification
 */
async function handleFriendNotification(data: FriendNotificationData): Promise<void> {
  const { loadFriends } = useFriends();

  // Refresh friends list
  await loadFriends();

  // Call appropriate handler
  if (data.type === 'friend_request' && handlers.onFriendRequest) {
    handlers.onFriendRequest(data);
  } else if (data.type === 'friend_accepted' && handlers.onFriendAccepted) {
    handlers.onFriendAccepted(data);
  }
}

/**
 * Show a local notification for foreground messages
 */
async function showLocalNotification(data: FriendNotificationData): Promise<void> {
  const title = data.type === 'friend_request'
    ? 'New Friend Request'
    : 'Friend Request Accepted';

  const body = data.type === 'friend_request'
    ? `${data.fromUserName} wants to be your friend`
    : `${data.fromUserName} accepted your friend request`;

  // Use the provided notification handler if available
  if (handlers.showLocalNotification) {
    try {
      await handlers.showLocalNotification(title, body, data);
    } catch (error) {
      console.error('[FriendNotifications] Failed to show local notification:', error);
    }
  } else {
    console.log(`[FriendNotifications] ${title}: ${body}`);
  }
}

/**
 * Process incoming push notification data
 * Call this when receiving push notifications from your messaging service
 */
export async function processFriendNotification(
  rawData: Record<string, unknown>,
  isBackground: boolean = false
): Promise<boolean> {
  const data = parseNotificationData(rawData);
  if (!data) return false;

  if (isBackground) {
    // App was in background, user tapped notification
    await handleFriendNotification(data);
    handlers.navigateToFriends?.();
  } else {
    // App is in foreground, show local notification
    await showLocalNotification(data);
    await handleFriendNotification(data);
  }

  return true;
}

/**
 * Register friend notification handlers
 *
 * Call this on app startup to set up notification handling.
 * The actual push notification registration should be done separately
 * with your messaging service (Firebase, OneSignal, etc.).
 */
export function registerFriendNotifications(options: FriendNotificationHandlers): void {
  handlers = options;
  console.log('[FriendNotifications] Handlers registered');
}

/**
 * Create notification channel for Android
 * Call this once during app initialization
 */
export async function createFriendsNotificationChannel(): Promise<void> {
  // Channel creation is handled by the notification service
  console.log('[FriendNotifications] Channel ready');
}

/**
 * Unregister friend notification handlers
 * Call this on app shutdown or when cleaning up
 */
export function unregisterFriendNotifications(): void {
  handlers = {};
  console.log('[FriendNotifications] Handlers unregistered');
}
