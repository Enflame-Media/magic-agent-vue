/**
 * Purchases Service Module
 *
 * Exports the purchase service and related utilities for NativeScript mobile apps.
 *
 * @module services/purchases
 */

export * from './types';
export {
  purchaseService,
  configurePurchases,
  getPurchaseState,
  isPro,
  type NativeRevenueCat,
} from './PurchaseService';
export {
  nativeRevenueCatAdapter,
  transformCustomerInfo,
  transformOfferings,
  type NativeCustomerInfo,
  type NativeOfferingsResponse,
} from './NativeRevenueCatAdapter';
