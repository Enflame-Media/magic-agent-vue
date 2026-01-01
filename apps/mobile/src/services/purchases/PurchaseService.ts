/**
 * Purchase Service for NativeScript
 *
 * Mobile purchase service implementation using RevenueCat.
 * Supports both iOS (StoreKit) and Android (Google Play / Amazon).
 *
 * Note: Requires the @aspect/nativescript-purchase or equivalent plugin
 * to be installed for native RevenueCat SDK access.
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
import { LogLevel, PaywallResult, PurchaseError, PurchaseErrorCode } from './types';

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
    purchaseState.isPro =
      purchaseState.customerInfo?.entitlements?.all?.['pro']?.isActive ?? false;
  }

  notifyStateChange();
}

// ─────────────────────────────────────────────────────────────────────────────
// Native SDK Placeholder
// ─────────────────────────────────────────────────────────────────────────────

// Note: In production, this would import from a NativeScript RevenueCat plugin.
// Example plugins:
// - @aspect/nativescript-purchases (if available)
// - Custom plugin wrapping native RevenueCat SDKs

/**
 * Native RevenueCat SDK contract
 *
 * This interface defines the expected API for a NativeScript RevenueCat plugin.
 * Plugin implementations should conform to this interface.
 *
 * @example
 * ```typescript
 * // In your NativeScript plugin:
 * export class RevenueCatPlugin implements NativeRevenueCat {
 *   configure(apiKey: string, appUserId?: string): void { ... }
 *   // ... implement other methods
 * }
 * ```
 */
export interface NativeRevenueCat {
  configure(apiKey: string, appUserId?: string): void;
  getCustomerInfo(): Promise<NativeCustomerInfo>;
  getOfferings(): Promise<NativeOfferings>;
  purchasePackage(packageIdentifier: string): Promise<{ customerInfo: NativeCustomerInfo }>;
  restorePurchases(): Promise<NativeCustomerInfo>;
  syncPurchases(): Promise<void>;
  presentPaywall(): Promise<string>;
}

interface NativeCustomerInfo {
  activeSubscriptions: string[];
  entitlements: {
    all: Record<string, { isActive: boolean; identifier: string }>;
  };
  originalAppUserId: string;
  requestDate: string;
}

interface NativeOfferings {
  current: NativeOffering | null;
  all: Record<string, NativeOffering>;
}

interface NativeOffering {
  identifier: string;
  availablePackages: NativePackage[];
}

interface NativePackage {
  identifier: string;
  packageType: string;
  product: NativeProduct;
}

interface NativeProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
}

// Note: Native SDK would be initialized by platform-specific code
// The NativeRevenueCat interface above defines the expected contract

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
      await this.initializeNativeSDK(apiKey, config.appUserID);

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
  private async initializeNativeSDK(
    _apiKey: string,
    appUserId?: string
  ): Promise<void> {
    // Note: This is a placeholder. In production, this would:
    // 1. Import the native RevenueCat plugin
    // 2. Configure it with the API key
    // 3. Set up listeners for customer info changes

    console.log('[Purchases] Would initialize native SDK with:', {
      platform: isIOS ? 'iOS' : 'Android',
      hasAppUserId: !!appUserId,
    });

    // Simulate native SDK initialization
    // In production: nativeRevenueCat = await NativeRevenueCatPlugin.configure(_apiKey, appUserId);
  }

  /**
   * Get customer subscription info
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    this.ensureConfigured();

    try {
      // In production: const native = await nativeRevenueCat!.getCustomerInfo();
      // For now, return mock data structure
      const customerInfo: CustomerInfo = {
        activeSubscriptions: {},
        entitlements: { all: {} },
        originalAppUserId: this.config?.appUserID ?? 'anonymous',
        requestDate: new Date(),
      };

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
      // In production: const native = await nativeRevenueCat!.getOfferings();
      // For now, return empty structure
      const offerings: Offerings = {
        current: null,
        all: {},
      };

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

    try {
      // In production: const result = await nativeRevenueCat!.purchasePackage(pkg.identifier);
      console.log('[Purchases] Would purchase package:', pkg.identifier);

      // Simulate successful purchase
      const customerInfo: CustomerInfo = {
        activeSubscriptions: { [pkg.product.identifier]: {} },
        entitlements: {
          all: {
            pro: { isActive: true, identifier: 'pro' },
          },
        },
        originalAppUserId: this.config?.appUserID ?? 'anonymous',
        requestDate: new Date(),
      };

      updateState({
        status: 'success',
        customerInfo,
      });

      return { customerInfo };
    } catch (error) {
      // Check for user cancellation
      if (this.isUserCancellation(error)) {
        updateState({ status: 'idle' });
        throw new PurchaseError(PurchaseErrorCode.CANCELLED, 'Purchase cancelled');
      }

      const purchaseError = new PurchaseError(
        PurchaseErrorCode.UNKNOWN,
        'Purchase failed',
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
   * Sync purchases with RevenueCat
   */
  async syncPurchases(): Promise<void> {
    this.ensureConfigured();

    try {
      // In production: await nativeRevenueCat!.syncPurchases();
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

    try {
      // In production: const info = await nativeRevenueCat!.restorePurchases();
      const customerInfo = await this.getCustomerInfo();

      updateState({
        status: 'success',
        customerInfo,
      });

      return customerInfo;
    } catch (error) {
      const purchaseError = new PurchaseError(
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
    // In production: nativeRevenueCat?.setLogLevel(level);
  }

  /**
   * Present native paywall
   */
  async presentPaywall(_options?: PaywallOptions): Promise<PaywallResult> {
    this.ensureConfigured();

    try {
      // In production: const result = await nativeRevenueCat!.presentPaywall(_options);
      console.log('[Purchases] Would present native paywall');

      // Native paywall would handle the full flow
      // Return value would come from native result
      return PaywallResult.NOT_PRESENTED;
    } catch (error) {
      console.error('[Purchases] Paywall error:', error);
      return PaywallResult.ERROR;
    }
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
    const info = purchaseState.customerInfo;
    if (!info) {
      await this.getCustomerInfo();
    }

    return purchaseState.customerInfo?.entitlements?.all?.[entitlementId]?.isActive ?? false;
  }

  /**
   * Check if user has active subscription
   */
  async isSubscribed(): Promise<boolean> {
    const info = purchaseState.customerInfo;
    if (!info) {
      await this.getCustomerInfo();
    }

    return Object.keys(purchaseState.customerInfo?.activeSubscriptions ?? {}).length > 0;
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

  private isUserCancellation(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('cancel') || message.includes('user cancelled');
    }
    return false;
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
