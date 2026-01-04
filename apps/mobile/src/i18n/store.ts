/**
 * i18n Pinia Store for Happy Mobile
 *
 * Reactive language state management with native device detection.
 * Uses NativeScript's Device.language for native locale detection.
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Device, ApplicationSettings } from '@nativescript/core';
import {
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
} from './types';
import {
  en,
  es,
  ru,
  pl,
  pt,
  ca,
  zhHans,
  type TranslationStructure,
} from './translations';

/**
 * Storage key for persisted language preference
 */
const LANGUAGE_STORAGE_KEY = 'happy_preferred_language';

/**
 * All available translations mapped by language code
 */
const translations: Record<SupportedLanguage, TranslationStructure> = {
  en,
  es,
  ru,
  pl,
  pt,
  ca,
  'zh-Hans': zhHans,
};

/**
 * Detect the device's preferred language
 * Uses NativeScript's Device.language which returns the OS language setting
 */
function detectDeviceLanguage(): SupportedLanguage {
  try {
    const deviceLang = Device.language;
    console.log('[i18n] Device language:', deviceLang);

    if (!deviceLang) {
      return DEFAULT_LANGUAGE;
    }

    // Extract primary language code (e.g., "en-US" -> "en")
    const primaryLang = deviceLang.split('-')[0]?.toLowerCase() ?? '';

    // Special handling for Chinese variants
    if (primaryLang === 'zh') {
      // Check for simplified Chinese indicators
      const langLower = deviceLang.toLowerCase();
      if (
        langLower.includes('hans') ||
        langLower.includes('cn') ||
        langLower.includes('sg')
      ) {
        return 'zh-Hans';
      }
      // Default to simplified Chinese for any Chinese variant
      return 'zh-Hans';
    }

    // Check if primary language is supported
    if (isSupportedLanguage(primaryLang)) {
      return primaryLang;
    }

    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('[i18n] Error detecting device language:', error);
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Load persisted language preference from storage
 */
function loadPersistedLanguage(): SupportedLanguage | null {
  try {
    const stored = ApplicationSettings.getString(LANGUAGE_STORAGE_KEY);
    if (stored && isSupportedLanguage(stored)) {
      return stored;
    }
  } catch (error) {
    console.error('[i18n] Error loading persisted language:', error);
  }
  return null;
}

/**
 * Persist language preference to storage
 */
function persistLanguage(lang: SupportedLanguage): void {
  try {
    ApplicationSettings.setString(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.error('[i18n] Error persisting language:', error);
  }
}

/**
 * i18n Store
 *
 * Manages the current language state and provides translation functions.
 */
export const useI18nStore = defineStore('i18n', () => {
  // ─────────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Whether the user has explicitly set a language preference
   * If false, we use automatic device detection
   */
  const isAutomatic = ref(true);

  /**
   * Current active language code
   */
  const currentLanguage = ref<SupportedLanguage>(DEFAULT_LANGUAGE);

  // ─────────────────────────────────────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initialize the i18n store
   * Call this once on app startup
   */
  function initialize(): void {
    // Check for persisted preference first
    const persisted = loadPersistedLanguage();

    if (persisted) {
      currentLanguage.value = persisted;
      isAutomatic.value = false;
      console.log('[i18n] Using persisted language:', persisted);
    } else {
      // Fall back to device detection
      const detected = detectDeviceLanguage();
      currentLanguage.value = detected;
      isAutomatic.value = true;
      console.log('[i18n] Using detected language:', detected);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Computed
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Current translations object
   */
  const currentTranslations = computed(() => translations[currentLanguage.value]);

  /**
   * Current language info (name, native name, etc.)
   */
  const currentLanguageInfo = computed(() => SUPPORTED_LANGUAGES[currentLanguage.value]);

  /**
   * List of all available languages
   */
  const availableLanguages = computed(() => Object.values(SUPPORTED_LANGUAGES));

  // ─────────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Set the current language
   * Pass null to reset to automatic detection
   */
  function setLanguage(lang: SupportedLanguage | null): void {
    if (lang === null) {
      // Reset to automatic
      isAutomatic.value = true;
      currentLanguage.value = detectDeviceLanguage();
      ApplicationSettings.remove(LANGUAGE_STORAGE_KEY);
      console.log('[i18n] Reset to automatic:', currentLanguage.value);
    } else if (isSupportedLanguage(lang)) {
      // Set explicit language
      isAutomatic.value = false;
      currentLanguage.value = lang;
      persistLanguage(lang);
      console.log('[i18n] Set language to:', lang);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Return Store Interface
  // ─────────────────────────────────────────────────────────────────────────────

  return {
    // State
    isAutomatic,
    currentLanguage,

    // Computed
    currentTranslations,
    currentLanguageInfo,
    availableLanguages,

    // Actions
    initialize,
    setLanguage,
  };
});
