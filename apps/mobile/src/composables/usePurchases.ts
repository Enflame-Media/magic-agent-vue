/**
 * RevenueCat Purchases Composable for NativeScript
 *
 * Provides a Vue composable for managing RevenueCat purchases on mobile.
 * Uses the @mleleux/nativescript-revenuecat plugin and integrates with the purchases store.
 *
 * @example
 * ```typescript
 * const { initialize, purchase, restorePurchases, isPro } = usePurchases();
 *
 * // Initialize on app start
 * await initialize();
 *
 * // Purchase a package
 * const result = await purchase(monthlyPackage);
 * if (result === PaywallResult.PURCHASED) {
 *     console.log('Purchase successful!');
 * }
 * ```
 *
 * @module composables/usePurchases
 */

import { readonly } from 'vue';
import { storeToRefs } from 'pinia';
import { isIOS, Application } from '@nativescript/core';
import { usePurchasesStore } from '@/stores/purchases';
import type { CustomerInfo, Offerings, Package } from '@happy-vue/shared';
import {
  PaywallResult,
  PurchaseError,
  PurchaseErrorCode,
  LogLevel,
  trackPurchaseEvent,
  PurchaseAnalyticsEvent,
} from '@happy-vue/shared';
import {
  nativeRevenueCatAdapter,
  transformCustomerInfo,
  transformOfferings,
} from '@/services/purchases/NativeRevenueCatAdapter';
import { REVENUECAT_CONFIG } from '@/services/purchases/config';

// ─────────────────────────────────────────────────────────────────────────────
// Composable
// ─────────────────────────────────────────────────────────────────────────────

export function usePurchases() {
  const store = usePurchasesStore();

  // Extract reactive refs from store
  const {
    isConfigured,
    isLoading,
    status,
    customerInfo,
    offerings,
    lastError,
    isPaywallVisible,
    isPro,
    isSubscribed,
    activeEntitlements,
    currentOffering,
    availablePackages,
    monthlyPackage,
    annualPackage,
    hasError,
    isPurchasing,
    isRestoring,
    canMakePayments,
  } = storeToRefs(store);

  // ─────────────────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initialize RevenueCat SDK
   *
   * Should be called early in app lifecycle, typically on app start.
   * Can optionally provide an app user ID for user identification.
   */
  async function initialize(appUserId?: string): Promise<void> {
    if (store.isConfigured) {
      console.log('[usePurchases] Already configured');
      return;
    }

    store.setLoading(true);
    store.clearError();

    try {
      const apiKey = REVENUECAT_CONFIG.apiKey;

      if (!apiKey) {
        throw new PurchaseError(
          PurchaseErrorCode.NOT_CONFIGURED,
          `RevenueCat API key not configured for ${isIOS ? 'iOS' : 'Android'}. Add keys to services/purchases/config.ts.`
        );
      }

      // Configure the native SDK
      nativeRevenueCatAdapter.configure(apiKey, appUserId);

      // Enable debug logging in development
      if (REVENUECAT_CONFIG.debugLogsEnabled) {
        nativeRevenueCatAdapter.setDebugLogsEnabled(true);
        nativeRevenueCatAdapter.setLogLevel(LogLevel.DEBUG);
      }

      store.setConfigured(true);

      // Check if device can make payments
      const canPay = await nativeRevenueCatAdapter.canMakePayments();
      store.setCanMakePayments(canPay);

      // Fetch initial data in parallel
      await Promise.all([refreshCustomerInfo(), refreshOfferings()]);

      console.log('[usePurchases] Initialized successfully');
    } catch (error) {
      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(
              PurchaseErrorCode.UNKNOWN,
              'Failed to initialize RevenueCat',
              error
            );

      store.setError(purchaseError.code, purchaseError.message);
      throw purchaseError;
    } finally {
      store.setLoading(false);
    }
  }

  /**
   * Initialize RevenueCat when app launches
   *
   * This is the recommended way to initialize RevenueCat - as early as possible
   * during app launch. Called automatically if usePurchases is used in the root component.
   */
  function setupLaunchListener(appUserId?: string): void {
    Application.on(Application.launchEvent, () => {
      void initialize(appUserId).catch((error: unknown) => {
        console.error('[usePurchases] Launch initialization failed:', error);
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Data Fetching
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Refresh customer info from RevenueCat
   */
  async function refreshCustomerInfo(): Promise<CustomerInfo> {
    ensureConfigured();

    try {
      const nativeInfo = await nativeRevenueCatAdapter.getCustomerInfo();
      const info = transformCustomerInfo(nativeInfo);
      store.setCustomerInfo(info);
      return info;
    } catch (error) {
      console.error('[usePurchases] Failed to get customer info:', error);
      throw new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Failed to fetch customer info',
        error
      );
    }
  }

  /**
   * Refresh available offerings
   */
  async function refreshOfferings(): Promise<Offerings> {
    ensureConfigured();

    try {
      const nativeOfferings = await nativeRevenueCatAdapter.getOfferings();
      const transformed = transformOfferings(nativeOfferings);
      store.setOfferings(transformed);
      return transformed;
    } catch (error) {
      console.error('[usePurchases] Failed to get offerings:', error);
      throw new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Failed to fetch offerings',
        error
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Purchase Operations
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Purchase a package
   */
  async function purchase(pkg: Package): Promise<PaywallResult> {
    ensureConfigured();
    store.setPurchasing(true);
    store.clearError();

    // Track purchase started
    trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_STARTED, {
      platform: 'mobile',
      packageId: pkg.identifier,
      productId: pkg.product.identifier,
      price: pkg.product.price,
      currency: pkg.product.currencyCode,
    });

    try {
      const result = await nativeRevenueCatAdapter.purchasePackage(
        pkg.identifier
      );
      const info = transformCustomerInfo(result.customerInfo);
      store.setCustomerInfo(info);
      store.setSuccess();

      // Track purchase completed
      trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_COMPLETED, {
        platform: 'mobile',
        packageId: pkg.identifier,
        productId: pkg.product.identifier,
        price: pkg.product.price,
        currency: pkg.product.currencyCode,
      });

      return PaywallResult.PURCHASED;
    } catch (error: unknown) {
      // Check for user cancellation
      if (
        error instanceof PurchaseError &&
        error.code === PurchaseErrorCode.CANCELLED
      ) {
        // Track purchase cancelled
        trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_CANCELLED, {
          platform: 'mobile',
          packageId: pkg.identifier,
          productId: pkg.product.identifier,
        });
        return PaywallResult.CANCELLED;
      }

      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(
              PurchaseErrorCode.UNKNOWN,
              'Purchase failed',
              error
            );

      // Track purchase failed
      trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_FAILED, {
        platform: 'mobile',
        packageId: pkg.identifier,
        productId: pkg.product.identifier,
        errorCode: purchaseError.code,
        errorMessage: purchaseError.message,
      });

      store.setError(purchaseError.code, purchaseError.message);
      return PaywallResult.ERROR;
    } finally {
      store.setPurchasing(false);
    }
  }

  /**
   * Restore previous purchases
   */
  async function restorePurchases(): Promise<CustomerInfo> {
    ensureConfigured();
    store.setRestoring(true);
    store.clearError();

    // Track restore started
    trackPurchaseEvent(PurchaseAnalyticsEvent.RESTORE_STARTED, {
      platform: 'mobile',
    });

    try {
      const nativeInfo = await nativeRevenueCatAdapter.restorePurchases();
      const info = transformCustomerInfo(nativeInfo);
      store.setCustomerInfo(info);
      store.setSuccess();

      // Track restore completed
      const restoredCount = Object.keys(info.activeSubscriptions).length;
      const restoredPro = info.entitlements?.all?.['pro']?.isActive ?? false;
      trackPurchaseEvent(PurchaseAnalyticsEvent.RESTORE_COMPLETED, {
        platform: 'mobile',
        restoredCount,
        restoredPro,
      });

      return info;
    } catch (error) {
      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(
              PurchaseErrorCode.NETWORK_ERROR,
              'Failed to restore purchases',
              error
            );

      store.setError(purchaseError.code, purchaseError.message);
      throw purchaseError;
    } finally {
      store.setRestoring(false);
    }
  }

  /**
   * Sync purchases with RevenueCat backend
   */
  async function syncPurchases(): Promise<void> {
    await refreshCustomerInfo();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Paywall
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Show the paywall modal
   *
   * Note: On mobile, this triggers a custom Vue modal component,
   * as native paywall is not supported by the plugin.
   */
  function showPaywall(source?: string): void {
    // Track paywall presented
    trackPurchaseEvent(PurchaseAnalyticsEvent.PAYWALL_PRESENTED, {
      platform: 'mobile',
      offeringId: store.currentOffering?.identifier,
      source,
    });

    store.setPaywallVisible(true);
  }

  /**
   * Hide the paywall modal
   */
  function hidePaywall(): void {
    store.setPaywallVisible(false);
  }

  /**
   * Show paywall only if user doesn't have the required entitlement
   *
   * @param entitlementId - The entitlement to check (default: 'pro')
   * @param source - Optional source identifier for analytics
   * @returns PaywallResult indicating whether paywall was shown
   */
  async function showPaywallIfNeeded(
    entitlementId: string = 'pro',
    source?: string
  ): Promise<PaywallResult> {
    // Refresh customer info to ensure we have latest status
    if (!store.customerInfo) {
      await refreshCustomerInfo();
    }

    const hasIt = store.hasEntitlement(entitlementId);
    if (hasIt) {
      return PaywallResult.NOT_PRESENTED;
    }

    showPaywall(source ?? 'paywall_if_needed');
    return PaywallResult.NOT_PRESENTED; // Actual result comes from user interaction
  }

  // ─────────────────────────────────────────────────────────────────────────
  // User Management
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Log in a user with their app user ID
   *
   * Call this when a user signs in to your app to link their
   * purchases to their account.
   */
  async function logIn(appUserId: string): Promise<CustomerInfo> {
    ensureConfigured();

    try {
      const nativeInfo = await nativeRevenueCatAdapter.logIn(appUserId);
      const info = transformCustomerInfo(nativeInfo);
      store.setCustomerInfo(info);
      return info;
    } catch (error) {
      throw new PurchaseError(
        PurchaseErrorCode.UNKNOWN,
        'Failed to log in user',
        error
      );
    }
  }

  /**
   * Log out the current user
   *
   * Call this when a user signs out to reset to anonymous ID.
   */
  async function logOut(): Promise<CustomerInfo> {
    ensureConfigured();

    try {
      const nativeInfo = await nativeRevenueCatAdapter.logOut();
      const info = transformCustomerInfo(nativeInfo);
      store.setCustomerInfo(info);
      return info;
    } catch (error) {
      throw new PurchaseError(
        PurchaseErrorCode.UNKNOWN,
        'Failed to log out user',
        error
      );
    }
  }

  /**
   * Set user attributes for targeting and analytics
   */
  function setUserAttributes(attributes: Record<string, string>): void {
    if (store.isConfigured) {
      nativeRevenueCatAdapter.setAttributes(attributes);
    }
  }

  /**
   * Set user email
   */
  function setEmail(email: string): void {
    if (store.isConfigured) {
      nativeRevenueCatAdapter.setEmail(email);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Entitlements
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Check if user has a specific entitlement
   */
  function hasEntitlement(entitlementId: string): boolean {
    return store.hasEntitlement(entitlementId);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  function ensureConfigured(): void {
    if (!store.isConfigured) {
      throw new PurchaseError(
        PurchaseErrorCode.NOT_CONFIGURED,
        'RevenueCat not configured. Call initialize() first.'
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle Hooks
  // ─────────────────────────────────────────────────────────────────────────

  // Optional: Auto-refresh customer info when composable is mounted
  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Start periodic refresh of customer info (e.g., every 5 minutes)
   */
  function startAutoRefresh(intervalMs: number = 5 * 60 * 1000): void {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(() => {
      if (store.isConfigured) {
        void refreshCustomerInfo().catch((error: unknown) => {
          console.warn('[usePurchases] Auto-refresh failed:', error);
        });
      }
    }, intervalMs);
  }

  /**
   * Stop periodic refresh
   */
  function stopAutoRefresh(): void {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────

  return {
    // State (readonly refs)
    isConfigured: readonly(isConfigured),
    isLoading: readonly(isLoading),
    status: readonly(status),
    customerInfo: readonly(customerInfo),
    offerings: readonly(offerings),
    lastError: readonly(lastError),
    isPaywallVisible: readonly(isPaywallVisible),
    canMakePayments: readonly(canMakePayments),

    // Computed (readonly)
    isPro: readonly(isPro),
    isSubscribed: readonly(isSubscribed),
    activeEntitlements: readonly(activeEntitlements),
    currentOffering: readonly(currentOffering),
    availablePackages: readonly(availablePackages),
    monthlyPackage: readonly(monthlyPackage),
    annualPackage: readonly(annualPackage),
    hasError: readonly(hasError),
    isPurchasing: readonly(isPurchasing),
    isRestoring: readonly(isRestoring),

    // Initialization
    initialize,
    setupLaunchListener,

    // Data Fetching
    refreshCustomerInfo,
    refreshOfferings,

    // Purchase Operations
    purchase,
    restorePurchases,
    syncPurchases,

    // Paywall
    showPaywall,
    hidePaywall,
    showPaywallIfNeeded,

    // User Management
    logIn,
    logOut,
    setUserAttributes,
    setEmail,

    // Entitlements
    hasEntitlement,

    // Auto-refresh
    startAutoRefresh,
    stopAutoRefresh,
  };
}
