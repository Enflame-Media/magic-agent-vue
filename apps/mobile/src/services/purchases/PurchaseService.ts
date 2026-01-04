/**
 * Purchase Service for NativeScript
 *
 * Mobile purchase service implementation using RevenueCat.
 * Supports both iOS (StoreKit) and Android (Google Play / Amazon).
 *
 * Uses the @mleleux/nativescript-revenuecat plugin for native SDK access.
 *
 * @example
 * ```typescript
 * import { purchaseService } from '@/services/purchases';
 *
 * await purchaseService.configure({
 *   iosApiKey: 'your_ios_key',
 *   androidApiKey: 'your_android_key',
 * });
 *
 * const offerings = await purchaseService.getOfferings();
 * await purchaseService.purchase(offerings.current.availablePackages[0]);
 * ```
 */

import { isIOS } from '@nativescript/core';
import type {
  CustomerInfo,
  Offerings,
  Product,
  Package,
  PurchaseResult,
  PaywallOptions,
  PaywallIfNeededOptions,
  MobilePurchaseConfig,
  PurchaseState,
} from './types';
import {
  LogLevel,
  PaywallResult,
  PurchaseError,
  PurchaseErrorCode,
  trackPurchaseEvent,
  PurchaseAnalyticsEvent,
} from './types';
import {
  nativeRevenueCatAdapter,
  transformCustomerInfo,
  transformOfferings,
  type NativeCustomerInfo,
  type NativeOfferingsResponse,
} from './NativeRevenueCatAdapter';

// ─────────────────────────────────────────────────────────────────────────────
// Global State
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Global purchase state
 */
const purchaseState: PurchaseState = {
  status: 'idle',
  isConfigured: false,
  customerInfo: null,
  offerings: null,
  error: null,
  isPro: false,
};

/**
 * State change listeners
 */
type StateListener = (state: PurchaseState) => void;
const stateListeners: StateListener[] = [];

/**
 * Notify all listeners of state change
 */
function notifyStateChange(): void {
  for (const listener of stateListeners) {
    listener({ ...purchaseState });
  }
}

/**
 * Update state and notify listeners
 */
function updateState(updates: Partial<PurchaseState>): void {
  Object.assign(purchaseState, updates);

  // Update isPro based on customer info
  if (updates.customerInfo !== undefined) {
    const info = purchaseState.customerInfo;
    purchaseState.isPro = info?.entitlements.all['pro']?.isActive ?? false;
  }

  notifyStateChange();
}

// ─────────────────────────────────────────────────────────────────────────────
// Native SDK Interface
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Native RevenueCat SDK contract
 *
 * This interface defines the expected API for a NativeScript RevenueCat plugin.
 * The actual implementation is provided by NativeRevenueCatAdapter.
 */
export interface NativeRevenueCat {
  configure(apiKey: string, appUserId?: string): void;
  getCustomerInfo(): Promise<NativeCustomerInfo>;
  getOfferings(): Promise<NativeOfferingsResponse>;
  purchasePackage(packageIdentifier: string): Promise<{ customerInfo: NativeCustomerInfo }>;
  restorePurchases(): Promise<NativeCustomerInfo>;
  syncPurchases(): Promise<void>;
  presentPaywall(): Promise<string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Purchase Service Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Purchase Service for NativeScript Mobile Apps
 *
 * Note: This doesn't implement RevenueCatInterface directly since
 * MobilePurchaseConfig differs from RevenueCatConfig.
 */
class PurchaseServiceImpl {
  private config: MobilePurchaseConfig | null = null;

  /**
   * Configure RevenueCat with platform-specific API keys
   */
  async configure(config: MobilePurchaseConfig): Promise<void> {
    updateState({ status: 'loading', error: null });

    try {
      this.config = config;

      // Select API key based on platform
      const apiKey = isIOS ? config.iosApiKey : config.androidApiKey;

      if (!apiKey) {
        throw new PurchaseError(
          PurchaseErrorCode.NOT_CONFIGURED,
          `No API key configured for ${isIOS ? 'iOS' : 'Android'}`
        );
      }

      // Initialize native SDK
      this.initializeNativeSDK(apiKey, config.appUserID);

      updateState({
        status: 'idle',
        isConfigured: true,
      });

      // Fetch initial data
      await Promise.all([this.getCustomerInfo(), this.getOfferings()]);

      console.log('[Purchases] Configured successfully');
    } catch (error) {
      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(
              PurchaseErrorCode.UNKNOWN,
              'Failed to configure purchases',
              error
            );

      updateState({
        status: 'error',
        error: purchaseError.message,
        isConfigured: false,
      });

      throw purchaseError;
    }
  }

  /**
   * Initialize native RevenueCat SDK
   */
  private initializeNativeSDK(apiKey: string, appUserId?: string): void {
    console.log('[Purchases] Initializing native SDK with:', {
      platform: isIOS ? 'iOS' : 'Android',
      hasAppUserId: !!appUserId,
    });

    // Configure the native RevenueCat SDK via our adapter
    nativeRevenueCatAdapter.configure(apiKey, appUserId);

    // Enable debug logs in development
    if (__DEV__) {
      nativeRevenueCatAdapter.setDebugLogsEnabled(true);
    }
  }

  /**
   * Get customer subscription info
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    this.ensureConfigured();

    try {
      const nativeInfo = await nativeRevenueCatAdapter.getCustomerInfo();
      const customerInfo = transformCustomerInfo(nativeInfo);

      updateState({ customerInfo });
      return customerInfo;
    } catch (error) {
      throw new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Failed to get customer info',
        error
      );
    }
  }

  /**
   * Get available offerings
   */
  async getOfferings(): Promise<Offerings> {
    this.ensureConfigured();

    try {
      const nativeOfferings = await nativeRevenueCatAdapter.getOfferings();
      const offerings = transformOfferings(nativeOfferings);

      updateState({ offerings });
      return offerings;
    } catch (error) {
      throw new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Failed to get offerings',
        error
      );
    }
  }

  /**
   * Get specific products by ID
   */
  async getProducts(productIds: string[]): Promise<Product[]> {
    this.ensureConfigured();

    const offerings = await this.getOfferings();
    const products: Product[] = [];

    // Extract products from offerings
    for (const offering of Object.values(offerings.all)) {
      for (const pkg of offering.availablePackages) {
        if (productIds.includes(pkg.product.identifier)) {
          products.push(pkg.product);
        }
      }
    }

    return products;
  }

  /**
   * Purchase a product
   */
  async purchaseProduct(product: Product): Promise<PurchaseResult> {
    this.ensureConfigured();

    // Find the package containing this product
    const offerings = purchaseState.offerings;
    if (!offerings) {
      throw new PurchaseError(
        PurchaseErrorCode.PRODUCT_NOT_FOUND,
        'No offerings available'
      );
    }

    for (const offering of Object.values(offerings.all)) {
      const pkg = offering.availablePackages.find(
        (p) => p.product.identifier === product.identifier
      );
      if (pkg) {
        return this.purchasePackage(pkg);
      }
    }

    throw new PurchaseError(
      PurchaseErrorCode.PRODUCT_NOT_FOUND,
      `Product ${product.identifier} not found`
    );
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: Package): Promise<PurchaseResult> {
    this.ensureConfigured();
    updateState({ status: 'purchasing', error: null });

    // Track purchase started
    trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_STARTED, {
      platform: 'mobile',
      packageId: pkg.identifier,
      productId: pkg.product.identifier,
      price: pkg.product.price,
      currency: pkg.product.currencyCode,
      userId: this.config?.appUserID,
    });

    try {
      console.log('[Purchases] Purchasing package:', pkg.identifier);

      const result = await nativeRevenueCatAdapter.purchasePackage(pkg.identifier);
      const customerInfo = transformCustomerInfo(result.customerInfo);

      updateState({
        status: 'success',
        customerInfo,
      });

      // Track purchase completed
      trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_COMPLETED, {
        platform: 'mobile',
        packageId: pkg.identifier,
        productId: pkg.product.identifier,
        price: pkg.product.price,
        currency: pkg.product.currencyCode,
        userId: this.config?.appUserID,
      });

      return { customerInfo };
    } catch (error) {
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
          userId: this.config?.appUserID,
        });
        updateState({ status: 'idle' });
        throw error;
      }

      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(PurchaseErrorCode.UNKNOWN, 'Purchase failed', error);

      // Track purchase failed
      trackPurchaseEvent(PurchaseAnalyticsEvent.PURCHASE_FAILED, {
        platform: 'mobile',
        packageId: pkg.identifier,
        productId: pkg.product.identifier,
        errorCode: purchaseError.code,
        errorMessage: purchaseError.message,
        userId: this.config?.appUserID,
      });

      updateState({
        status: 'error',
        error: purchaseError.message,
      });

      throw purchaseError;
    }
  }

  /**
   * Sync purchases with RevenueCat
   */
  async syncPurchases(): Promise<void> {
    this.ensureConfigured();

    try {
      await nativeRevenueCatAdapter.syncPurchases();
      await this.getCustomerInfo();
    } catch (error) {
      throw new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Failed to sync purchases',
        error
      );
    }
  }

  /**
   * Restore purchases
   */
  async restorePurchases(): Promise<CustomerInfo> {
    this.ensureConfigured();
    updateState({ status: 'restoring', error: null });

    // Track restore started
    trackPurchaseEvent(PurchaseAnalyticsEvent.RESTORE_STARTED, {
      platform: 'mobile',
      userId: this.config?.appUserID,
    });

    try {
      const nativeInfo = await nativeRevenueCatAdapter.restorePurchases();
      const customerInfo = transformCustomerInfo(nativeInfo);

      updateState({
        status: 'success',
        customerInfo,
      });

      // Track restore completed
      const restoredCount = Object.keys(customerInfo.activeSubscriptions).length;
      const restoredPro = customerInfo.entitlements.all['pro']?.isActive ?? false;
      trackPurchaseEvent(PurchaseAnalyticsEvent.RESTORE_COMPLETED, {
        platform: 'mobile',
        userId: this.config?.appUserID,
        restoredCount,
        restoredPro,
      });

      return customerInfo;
    } catch (error) {
      const purchaseError =
        error instanceof PurchaseError
          ? error
          : new PurchaseError(
              PurchaseErrorCode.NETWORK_ERROR,
              'Failed to restore purchases',
              error
            );

      updateState({
        status: 'error',
        error: purchaseError.message,
      });

      throw purchaseError;
    }
  }

  /**
   * Set log level (debug purposes)
   */
  setLogLevel(level: LogLevel): void {
    console.log('[Purchases] Set log level:', LogLevel[level]);
    nativeRevenueCatAdapter.setLogLevel(level);
  }

  /**
   * Present native paywall
   *
   * Note: Native paywall is not supported by the @mleleux/nativescript-revenuecat plugin.
   * Use a custom Vue component for paywall UI instead.
   */
  presentPaywall(_options?: PaywallOptions, source?: string): PaywallResult {
    this.ensureConfigured();

    // Track paywall presented (even though we're redirecting to Vue modal)
    trackPurchaseEvent(PurchaseAnalyticsEvent.PAYWALL_PRESENTED, {
      platform: 'mobile',
      offeringId: purchaseState.offerings?.current?.identifier,
      source,
      userId: this.config?.appUserID,
    });

    // Native paywall not supported in this plugin
    // The usePurchases composable triggers a custom Vue modal instead
    console.log(
      '[Purchases] Native paywall not supported. Use showPaywall() from usePurchases composable.'
    );
    return PaywallResult.NOT_PRESENTED;
  }

  /**
   * Present paywall if user doesn't have entitlement
   */
  async presentPaywallIfNeeded(
    options: PaywallIfNeededOptions
  ): Promise<PaywallResult> {
    const hasEntitlement = await this.hasEntitlement(
      options.requiredEntitlementIdentifier
    );

    if (hasEntitlement) {
      return PaywallResult.NOT_PRESENTED;
    }

    return this.presentPaywall(options);
  }

  /**
   * Check if user has entitlement
   */
  async hasEntitlement(entitlementId: string): Promise<boolean> {
    if (!purchaseState.customerInfo) {
      await this.getCustomerInfo();
    }

    const info = purchaseState.customerInfo;
    return info?.entitlements.all[entitlementId]?.isActive ?? false;
  }

  /**
   * Check if user has active subscription
   */
  async isSubscribed(): Promise<boolean> {
    if (!purchaseState.customerInfo) {
      await this.getCustomerInfo();
    }

    const info = purchaseState.customerInfo;
    return Object.keys(info?.activeSubscriptions ?? {}).length > 0;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // State Management
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Get current state
   */
  getState(): PurchaseState {
    return { ...purchaseState };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: StateListener): () => void {
    stateListeners.push(listener);
    return () => {
      const index = stateListeners.indexOf(listener);
      if (index > -1) {
        stateListeners.splice(index, 1);
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────

  private ensureConfigured(): void {
    if (!purchaseState.isConfigured) {
      throw new PurchaseError(
        PurchaseErrorCode.NOT_CONFIGURED,
        'Purchases not configured. Call configure() first.'
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Singleton purchase service instance
 */
export const purchaseService = new PurchaseServiceImpl();

/**
 * Configure RevenueCat
 */
export async function configurePurchases(
  config: MobilePurchaseConfig
): Promise<void> {
  await purchaseService.configure(config);
}

/**
 * Get current purchase state
 */
export function getPurchaseState(): PurchaseState {
  return purchaseService.getState();
}

/**
 * Check if user has pro access
 */
export function isPro(): boolean {
  return purchaseState.isPro;
}
