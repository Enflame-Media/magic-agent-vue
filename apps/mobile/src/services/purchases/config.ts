/**
 * RevenueCat Configuration for NativeScript
 *
 * Static configuration for the mobile purchase system.
 * API keys should be stored securely. In production builds,
 * these values should come from secure configuration.
 */

import { isIOS } from '@nativescript/core';

/**
 * RevenueCat API keys.
 *
 * These should be replaced with actual keys from your RevenueCat dashboard.
 * Consider using:
 * - NativeScript environment variables via webpack
 * - Secure configuration files (not committed to git)
 * - Build-time injection
 *
 * Note: RevenueCat API keys are safe to include in client code.
 * They can only be used with your app bundle ID.
 */
export const REVENUECAT_CONFIG = {
  /**
   * iOS RevenueCat API key (from RevenueCat Dashboard > Project > API Keys)
   * This key is specific to your iOS app bundle ID.
   */
  IOS_API_KEY: '',

  /**
   * Android RevenueCat API key (from RevenueCat Dashboard > Project > API Keys)
   * This key is specific to your Android package name.
   */
  ANDROID_API_KEY: '',

  /**
   * Get the appropriate API key for the current platform
   */
  get apiKey(): string {
    return isIOS ? this.IOS_API_KEY : this.ANDROID_API_KEY;
  },

  /**
   * Pro entitlement identifier
   */
  PRO_ENTITLEMENT: 'pro',

  /**
   * Enable debug logging in development
   */
  get debugLogsEnabled(): boolean {
    return __DEV__;
  },
} as const;

/**
 * Product identifiers for Happy Pro subscriptions.
 *
 * These must match the product IDs configured in:
 * - App Store Connect (iOS)
 * - Google Play Console (Android)
 * - RevenueCat Dashboard
 */
export const PRODUCT_IDS = {
  /** Monthly subscription product ID */
  PRO_MONTHLY: 'happy_pro_monthly',

  /** Annual subscription product ID */
  PRO_ANNUAL: 'happy_pro_annual',

  /** Lifetime purchase product ID */
  PRO_LIFETIME: 'happy_pro_lifetime',
} as const;

/**
 * Default offering identifier.
 * This should match the default offering in RevenueCat dashboard.
 */
export const DEFAULT_OFFERING = 'default';
