/**
 * Native RevenueCat SDK Adapter
 *
 * Bridges the @mleleux/nativescript-revenuecat plugin to our internal types.
 * Provides type-safe wrapper around the native SDK with proper error handling.
 *
 * @module services/purchases/NativeRevenueCatAdapter
 */

import { RevenueCat } from '@mleleux/nativescript-revenuecat';
import type {
  CustomerInfo,
  Offerings,
  Offering,
  Package,
  Product,
  EntitlementInfo,
} from '@happy-vue/shared';
import { PurchaseError, PurchaseErrorCode } from '@happy-vue/shared';
import type { NativeRevenueCat } from './PurchaseService';

// ─────────────────────────────────────────────────────────────────────────────
// Native SDK Types (from @mleleux/nativescript-revenuecat)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Native Product from RevenueCat SDK
 */
interface NativeProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
}

/**
 * Native Package from RevenueCat SDK
 */
interface NativePackage {
  identifier: string;
  packageType: string;
  product: NativeProduct;
}

/**
 * Native Offering from RevenueCat SDK
 */
interface NativeOffering {
  identifier: string;
  availablePackages: NativePackage[];
}

/**
 * Native Offerings response
 */
interface NativeOfferingsResponse {
  current: NativeOffering | null;
  all: Record<string, NativeOffering>;
}

/**
 * Native Entitlement Info
 */
interface NativeEntitlementInfo {
  identifier: string;
  isActive: boolean;
  expirationDate?: string;
  productIdentifier?: string;
  willRenew?: boolean;
}

/**
 * Native Customer Info from getCustomerInfo
 */
interface NativeCustomerInfo {
  originalAppUserId: string;
  entitlements: {
    all: Record<string, NativeEntitlementInfo>;
    active: Record<string, NativeEntitlementInfo>;
  };
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  latestExpirationDate?: string;
  firstSeen?: string;
  managementURL?: string;
  requestDate: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Transformers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transform native product to our Product type
 */
function transformProduct(native: NativeProduct): Product {
  return {
    identifier: native.identifier,
    title: native.title,
    description: native.description,
    priceString: native.priceString,
    price: native.price,
    currencyCode: native.currencyCode,
  };
}

/**
 * Transform native package to our Package type
 */
function transformPackage(native: NativePackage): Package {
  return {
    identifier: native.identifier,
    packageType: native.packageType,
    product: transformProduct(native.product),
  };
}

/**
 * Transform native offering to our Offering type
 */
function transformOffering(native: NativeOffering): Offering {
  return {
    identifier: native.identifier,
    availablePackages: native.availablePackages.map(transformPackage),
  };
}

/**
 * Transform native offerings to our Offerings type
 */
function transformOfferings(native: NativeOfferingsResponse): Offerings {
  const all: Record<string, Offering> = {};

  for (const [key, offering] of Object.entries(native.all)) {
    all[key] = transformOffering(offering);
  }

  return {
    current: native.current ? transformOffering(native.current) : null,
    all,
  };
}

/**
 * Transform native entitlement to our EntitlementInfo type
 */
function transformEntitlement(native: NativeEntitlementInfo): EntitlementInfo {
  return {
    identifier: native.identifier,
    isActive: native.isActive,
  };
}

/**
 * Transform native customer info to our CustomerInfo type
 */
function transformCustomerInfo(native: NativeCustomerInfo): CustomerInfo {
  const entitlements: Record<string, EntitlementInfo> = {};

  for (const [key, entitlement] of Object.entries(native.entitlements.all)) {
    entitlements[key] = transformEntitlement(entitlement);
  }

  // Build active subscriptions record
  const activeSubscriptions: Record<string, unknown> = {};
  for (const productId of native.activeSubscriptions) {
    activeSubscriptions[productId] = true;
  }

  return {
    originalAppUserId: native.originalAppUserId,
    entitlements: { all: entitlements },
    activeSubscriptions,
    requestDate: new Date(native.requestDate),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map native SDK errors to PurchaseError
 */
function mapError(error: unknown, defaultMessage: string): PurchaseError {
  if (error instanceof PurchaseError) {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // User cancellation patterns
    if (
      message.includes('cancel') ||
      message.includes('user cancelled') ||
      message.includes('skuserscancelled')
    ) {
      return new PurchaseError(
        PurchaseErrorCode.CANCELLED,
        'Purchase was cancelled',
        error
      );
    }

    // Already owned
    if (
      message.includes('already purchased') ||
      message.includes('already owned')
    ) {
      return new PurchaseError(
        PurchaseErrorCode.ALREADY_OWNED,
        'This product is already owned',
        error
      );
    }

    // Network errors
    if (
      message.includes('network') ||
      message.includes('connection') ||
      message.includes('timeout')
    ) {
      return new PurchaseError(
        PurchaseErrorCode.NETWORK_ERROR,
        'Network error during purchase operation',
        error
      );
    }

    // Product not found
    if (
      message.includes('product not found') ||
      message.includes('invalid product')
    ) {
      return new PurchaseError(
        PurchaseErrorCode.PRODUCT_NOT_FOUND,
        'Product not found',
        error
      );
    }

    return new PurchaseError(
      PurchaseErrorCode.UNKNOWN,
      error.message || defaultMessage,
      error
    );
  }

  return new PurchaseError(PurchaseErrorCode.UNKNOWN, defaultMessage, error);
}

// ─────────────────────────────────────────────────────────────────────────────
// Adapter Class
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adapter that wraps the native RevenueCat SDK to match our interface.
 *
 * Handles all type transformations and error mapping between the
 * native SDK and our application types.
 */
class NativeRevenueCatAdapterImpl implements NativeRevenueCat {
  private _isConfigured = false;

  /**
   * Configure the native RevenueCat SDK
   */
  configure(apiKey: string, appUserId?: string): void {
    try {
      RevenueCat.configure(apiKey, appUserId);
      this._isConfigured = true;
      console.log('[NativeRevenueCat] Configured successfully');
    } catch (error) {
      console.error('[NativeRevenueCat] Configuration failed:', error);
      throw mapError(error, 'Failed to configure RevenueCat');
    }
  }

  /**
   * Get customer subscription information
   */
  async getCustomerInfo(): Promise<NativeCustomerInfo> {
    this.ensureConfigured();

    try {
      const info = await RevenueCat.getCustomerInfo();
      return info as NativeCustomerInfo;
    } catch (error) {
      throw mapError(error, 'Failed to get customer info');
    }
  }

  /**
   * Get all available offerings
   */
  async getOfferings(): Promise<NativeOfferingsResponse> {
    this.ensureConfigured();

    try {
      const allOfferings = await RevenueCat.getAllOfferings();
      const currentOffering = await RevenueCat.getCurrentOffering();

      return {
        current: currentOffering as NativeOffering | null,
        all: allOfferings as Record<string, NativeOffering>,
      };
    } catch (error) {
      throw mapError(error, 'Failed to get offerings');
    }
  }

  /**
   * Purchase a package (identified by its identifier)
   */
  async purchasePackage(
    packageIdentifier: string
  ): Promise<{ customerInfo: NativeCustomerInfo }> {
    this.ensureConfigured();

    try {
      // Get the product from the package
      const offerings = await this.getOfferings();
      let targetProduct: NativeProduct | null = null;

      // Search for the package in all offerings
      for (const offering of Object.values(offerings.all)) {
        const pkg = offering.availablePackages.find(
          (p) => p.identifier === packageIdentifier
        );
        if (pkg) {
          targetProduct = pkg.product;
          break;
        }
      }

      // Also check current offering
      if (!targetProduct && offerings.current) {
        const pkg = offerings.current.availablePackages.find(
          (p) => p.identifier === packageIdentifier
        );
        if (pkg) {
          targetProduct = pkg.product;
        }
      }

      if (!targetProduct) {
        throw new PurchaseError(
          PurchaseErrorCode.PRODUCT_NOT_FOUND,
          `Package ${packageIdentifier} not found`
        );
      }

      // Purchase the product
      await RevenueCat.purchaseProduct(targetProduct);

      // Get updated customer info after purchase
      const customerInfo = await this.getCustomerInfo();

      return { customerInfo };
    } catch (error) {
      throw mapError(error, 'Purchase failed');
    }
  }

  /**
   * Restore previous purchases
   */
  async restorePurchases(): Promise<NativeCustomerInfo> {
    this.ensureConfigured();

    try {
      await RevenueCat.restorePurchases();
      return await this.getCustomerInfo();
    } catch (error) {
      throw mapError(error, 'Failed to restore purchases');
    }
  }

  /**
   * Sync purchases with RevenueCat backend
   */
  async syncPurchases(): Promise<void> {
    this.ensureConfigured();

    try {
      // Sync by getting fresh customer info
      await RevenueCat.getCustomerInfo();
    } catch (error) {
      throw mapError(error, 'Failed to sync purchases');
    }
  }

  /**
   * Present paywall (not natively supported - return placeholder)
   *
   * Note: The @mleleux/nativescript-revenuecat plugin does not provide
   * native paywall UI. Implement a custom Vue component for paywall.
   */
  presentPaywall(): Promise<string> {
    // Native paywall not available in this plugin
    // The PurchaseService will use a custom Vue component instead
    return Promise.resolve('NOT_SUPPORTED');
  }

  /**
   * Check if SDK is configured
   */
  isConfigured(): boolean {
    return this._isConfigured && RevenueCat.isConfigured();
  }

  /**
   * Check if device can make payments
   */
  async canMakePayments(): Promise<boolean> {
    try {
      return await RevenueCat.canMakePayments();
    } catch (error) {
      console.error('[NativeRevenueCat] canMakePayments failed:', error);
      return false;
    }
  }

  /**
   * Set debug logs enabled
   */
  setDebugLogsEnabled(enabled: boolean): void {
    try {
      RevenueCat.setDebugLogsEnabled(enabled);
    } catch (error) {
      console.error('[NativeRevenueCat] setDebugLogsEnabled failed:', error);
    }
  }

  /**
   * Set log level
   */
  setLogLevel(level: number): void {
    try {
      RevenueCat.setLogLevel(level);
    } catch (error) {
      console.error('[NativeRevenueCat] setLogLevel failed:', error);
    }
  }

  /**
   * Log in with app user ID
   */
  async logIn(appUserId: string): Promise<NativeCustomerInfo> {
    this.ensureConfigured();

    try {
      await RevenueCat.logIn(appUserId);
      return await this.getCustomerInfo();
    } catch (error) {
      throw mapError(error, 'Failed to log in');
    }
  }

  /**
   * Log out current user
   */
  async logOut(): Promise<NativeCustomerInfo> {
    this.ensureConfigured();

    try {
      await RevenueCat.logOut();
      return await this.getCustomerInfo();
    } catch (error) {
      throw mapError(error, 'Failed to log out');
    }
  }

  /**
   * Get app user ID
   */
  async getAppUserId(): Promise<string> {
    this.ensureConfigured();

    try {
      return await RevenueCat.getAppUserID();
    } catch (error) {
      throw mapError(error, 'Failed to get app user ID');
    }
  }

  /**
   * Set user attributes
   */
  setAttributes(attributes: Record<string, string>): void {
    this.ensureConfigured();

    try {
      RevenueCat.setAttributes(attributes);
    } catch (error) {
      console.error('[NativeRevenueCat] setAttributes failed:', error);
    }
  }

  /**
   * Set user email
   */
  setEmail(email: string): void {
    this.ensureConfigured();

    try {
      RevenueCat.setEmail(email);
    } catch (error) {
      console.error('[NativeRevenueCat] setEmail failed:', error);
    }
  }

  /**
   * Ensure SDK is configured before operations
   */
  private ensureConfigured(): void {
    if (!this._isConfigured) {
      throw new PurchaseError(
        PurchaseErrorCode.NOT_CONFIGURED,
        'RevenueCat not configured. Call configure() first.'
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Singleton adapter instance
 */
export const nativeRevenueCatAdapter = new NativeRevenueCatAdapterImpl();

// Export transformers for use in PurchaseService
export {
  transformCustomerInfo,
  transformOfferings,
  transformProduct,
  transformPackage,
  transformOffering,
  mapError,
};

// Export native types for reference
export type {
  NativeCustomerInfo,
  NativeOfferingsResponse,
  NativeOffering,
  NativePackage,
  NativeProduct,
  NativeEntitlementInfo,
};
