/**
 * Happy Mobile App Entry Point
 *
 * NativeScript-Vue 3 application with Pinia state management
 * and Material Design components.
 */
import { createApp } from 'nativescript-vue';
import { createPinia } from 'pinia';
import { Application, isIOS } from '@nativescript/core';

// Material Components setup
import { installMixins, themer } from '@nativescript-community/ui-material-core';

// RevenueCat setup
import { RevenueCat } from '@mleleux/nativescript-revenuecat';

// Root component
import App from './app.vue';

// Install Material mixins for elevation and ripple effects
installMixins();

// Configure iOS theme colors programmatically
if (isIOS) {
  themer.setPrimaryColor('#6366F1'); // Indigo-500
  themer.setAccentColor('#8B5CF6');  // Violet-500
  themer.setSecondaryColor('#EC4899'); // Pink-500
}

// RevenueCat configuration
import { REVENUECAT_CONFIG } from '@/services/purchases/config';

// ─────────────────────────────────────────────────────────────────────────────
// RevenueCat Initialization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize RevenueCat SDK on app launch.
 *
 * RevenueCat recommends initializing as early as possible, ideally
 * before the app fully launches. This ensures purchases are synced
 * and customer info is available immediately.
 */
Application.on(Application.launchEvent, () => {
  const apiKey = REVENUECAT_CONFIG.apiKey;

  if (apiKey) {
    try {
      RevenueCat.configure(apiKey);

      // Enable debug logs in development
      if (REVENUECAT_CONFIG.debugLogsEnabled) {
        RevenueCat.setDebugLogsEnabled(true);
      }

      console.log(
        `[RevenueCat] Initialized on ${isIOS ? 'iOS' : 'Android'}`
      );
    } catch (error) {
      console.error('[RevenueCat] Initialization failed:', error);
    }
  } else {
    console.warn(
      `[RevenueCat] No API key configured for ${isIOS ? 'iOS' : 'Android'}. ` +
        'Add keys to services/purchases/config.ts.'
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Vue Application Setup
// ─────────────────────────────────────────────────────────────────────────────

// Create the Vue application
const app = createApp(App);

// Install Pinia for state management
const pinia = createPinia();
app.use(pinia);

// Start the application
app.start();
