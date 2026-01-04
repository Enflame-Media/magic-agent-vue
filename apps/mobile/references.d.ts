/// <reference types="@nativescript/types" />

// NativeScript-Vue 3 type declarations
declare module 'nativescript-vue' {
  import { App, Component } from 'vue';

  export function createApp(rootComponent: Component): App;
  export function registerElement(
    name: string,
    resolver: () => unknown
  ): void;
}

// Material Components type declarations
declare module '@nativescript-community/ui-material-core' {
  export function installMixins(): void;
  export const themer: {
    setPrimaryColor(color: string): void;
    setAccentColor(color: string): void;
    setSecondaryColor(color: string): void;
  };
}

// Vue SFC declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

// Barcode Scanner plugin type declarations
declare module '@aspect/nativescript-barcodescanner' {
  export interface ScanOptions {
    formats?: string;
    message?: string;
    showFlipCameraButton?: boolean;
    showTorchButton?: boolean;
    beepOnScan?: boolean;
    closeCallback?: () => void;
    preferFrontCamera?: boolean;
    torchOn?: boolean;
    resultDisplayDuration?: number;
  }

  export interface ScanResult {
    text: string;
    format: string;
  }

  export class BarcodeScanner {
    available(): Promise<boolean>;
    hasCameraPermission(): Promise<boolean>;
    requestCameraPermission(): Promise<boolean>;
    scan(options?: ScanOptions): Promise<ScanResult>;
    stop(): Promise<void>;
  }
}

// RevenueCat plugin type declarations
declare module '@mleleux/nativescript-revenuecat' {
  /**
   * Product category for filtering products
   */
  export enum ProductCategory {
    SUBSCRIPTION = 'SUBSCRIPTION',
    NON_SUBSCRIPTION = 'NON_SUBSCRIPTION',
  }

  /**
   * Product from RevenueCat
   */
  export interface Product {
    identifier: string;
    title: string;
    description: string;
    priceString: string;
    price: number;
    currencyCode: string;
  }

  /**
   * Package containing a product
   */
  export interface Package {
    identifier: string;
    packageType: string;
    product: Product;
  }

  /**
   * Offering containing packages
   */
  export interface Offering {
    identifier: string;
    availablePackages: Package[];
  }

  /**
   * Entitlement information
   */
  export interface EntitlementInfo {
    identifier: string;
    isActive: boolean;
    expirationDate?: string;
    productIdentifier?: string;
    willRenew?: boolean;
  }

  /**
   * Customer info from RevenueCat
   */
  export interface CustomerInfo {
    originalAppUserId: string;
    entitlements: {
      all: Record<string, EntitlementInfo>;
      active: Record<string, EntitlementInfo>;
    };
    activeSubscriptions: string[];
    allPurchasedProductIdentifiers: string[];
    latestExpirationDate?: string;
    firstSeen?: string;
    managementURL?: string;
    requestDate: string;
  }

  /**
   * RevenueCat SDK for NativeScript
   */
  export const RevenueCat: {
    /**
     * Configure the SDK with API key and optional user ID
     */
    configure(apiKey: string, appUserId?: string): void;

    /**
     * Check if SDK is configured
     */
    isConfigured(): boolean;

    /**
     * Check if device can make payments
     */
    canMakePayments(): Promise<boolean>;

    /**
     * Get customer subscription information
     */
    getCustomerInfo(): Promise<CustomerInfo>;

    /**
     * Get current offering
     */
    getCurrentOffering(): Promise<Offering | null>;

    /**
     * Get all offerings
     */
    getAllOfferings(): Promise<Record<string, Offering>>;

    /**
     * Get entitlement information
     */
    getEntitlementInfos(): Promise<Record<string, EntitlementInfo>>;

    /**
     * Get products by identifiers
     */
    getProducts(
      productIdentifiers: string[],
      type?: ProductCategory
    ): Promise<Product[]>;

    /**
     * Purchase a product
     */
    purchaseProduct(product: Product): Promise<{ customerInfo: CustomerInfo }>;

    /**
     * Restore previous purchases
     */
    restorePurchases(): Promise<CustomerInfo>;

    /**
     * Get app user ID
     */
    getAppUserID(): Promise<string>;

    /**
     * Log in with user ID
     */
    logIn(appUserId: string): Promise<CustomerInfo>;

    /**
     * Log out current user
     */
    logOut(): Promise<CustomerInfo>;

    /**
     * Set debug logs enabled
     */
    setDebugLogsEnabled(enabled: boolean): void;

    /**
     * Set log level
     */
    setLogLevel(level: number): void;

    /**
     * Set user attributes
     */
    setAttributes(attributes: Record<string, string>): void;

    /**
     * Set user email
     */
    setEmail(email: string): void;

    /**
     * Set phone number
     */
    setPhoneNumber(phoneNumber: string): void;

    /**
     * Set display name
     */
    setDisplayName(displayName: string): void;

    /**
     * Set Firebase app instance ID
     */
    setFirebaseAppInstanceID(firebaseAppInstanceID: string): void;

    /**
     * Set keyword
     */
    setKeyword(keyword: string): void;

    /**
     * Simulate Ask to Buy in sandbox (iOS only)
     */
    setSimulatesAskToBuyInSandbox(simulatesAskToBuyInSandbox: boolean): void;
  };
}

// Global development flag
declare const __DEV__: boolean;
