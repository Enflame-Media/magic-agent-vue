/**
 * NativeScript Purchase Types
 *
 * Types specific to NativeScript mobile purchases implementation.
 * Extends the shared types from @happy-vue/shared.
 */

// Re-export all shared types
export {
  type CustomerInfo,
  type EntitlementInfo,
  type Product,
  type Package,
  type Offering,
  type Offerings,
  type PurchaseResult,
  type RevenueCatConfig,
  type PaywallOptions,
  type PaywallIfNeededOptions,
  type RevenueCatInterface,
  LogLevel,
  PaywallResult,
  PurchaseErrorCode,
  PurchaseError,
} from '@happy-vue/shared';

/**
 * Purchase status for UI state management
 */
export type PurchaseStatus =
  | 'idle'
  | 'loading'
  | 'purchasing'
  | 'restoring'
  | 'success'
  | 'error';

/**
 * Platform-specific configuration
 */
export interface MobilePurchaseConfig {
  /** iOS API key */
  iosApiKey: string;
  /** Android API key */
  androidApiKey: string;
  /** Optional app user ID */
  appUserID?: string;
  /** Use Amazon App Store instead of Google Play */
  useAmazon?: boolean;
}

/**
 * Purchase state for NativeScript apps
 */
export interface PurchaseState {
  status: PurchaseStatus;
  isConfigured: boolean;
  customerInfo: import('@happy-vue/shared').CustomerInfo | null;
  offerings: import('@happy-vue/shared').Offerings | null;
  error: string | null;
  isPro: boolean;
}
