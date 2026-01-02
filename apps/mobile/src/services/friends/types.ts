/**
 * Friend-related types and schemas for NativeScript-Vue mobile app
 *
 * Re-exports core schemas from @happy-vue/protocol for consistency,
 * and adds app-specific relationship event schemas.
 */

import { z } from 'zod';

// Re-export core schemas from protocol
export {
  ImageRefSchema,
  type ImageRef,
  RelationshipStatusSchema,
  type RelationshipStatus,
  UserProfileSchema,
  type UserProfile,
} from '@happy-vue/protocol';

// Import for use in this file
import {
  RelationshipStatusSchema,
  UserProfileSchema,
} from '@happy-vue/protocol';

//
// Relationship Updated Event (for real-time updates)
//

export const RelationshipUpdatedEventSchema = z.object({
  fromUserId: z.string(),
  toUserId: z.string(),
  status: RelationshipStatusSchema,
  action: z.enum(['created', 'updated', 'deleted']),
  fromUser: UserProfileSchema.optional(),
  toUser: UserProfileSchema.optional(),
  timestamp: z.number(),
});

export type RelationshipUpdatedEvent = z.infer<typeof RelationshipUpdatedEventSchema>;

//
// API Response Types
//

export const UserResponseSchema = z.object({
  user: UserProfileSchema,
});

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const FriendsResponseSchema = z.object({
  friends: z.array(UserProfileSchema),
});

export type FriendsResponse = z.infer<typeof FriendsResponseSchema>;

export const UsersSearchResponseSchema = z.object({
  users: z.array(UserProfileSchema),
});

export type UsersSearchResponse = z.infer<typeof UsersSearchResponseSchema>;

//
// Utility functions
//

export function getDisplayName(profile: { firstName: string; lastName: string | null; username: string }): string {
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  return fullName || profile.username;
}

export function isFriend(status: z.infer<typeof RelationshipStatusSchema>): boolean {
  return status === 'friend';
}

export function isPendingRequest(status: z.infer<typeof RelationshipStatusSchema>): boolean {
  return status === 'pending';
}

export function isRequested(status: z.infer<typeof RelationshipStatusSchema>): boolean {
  return status === 'requested';
}
