/**
 * Friends Service - API client and types for friend features
 *
 * @example
 * ```typescript
 * import { friendsService, type UserProfile } from '@/services/friends';
 *
 * // Configure the service
 * friendsService.configure({
 *   baseUrl: 'https://api.happy.engineering',
 *   getAuthToken: () => authStore.token,
 * });
 *
 * // Use the service
 * const friends = await friendsService.getFriendsList();
 * ```
 */

export { friendsService, FriendsApiError } from './FriendsService';
export * from './types';
