/**
 * i18n Composables for Happy Mobile
 *
 * Vue composables for using i18n in components.
 */

import { computed, type ComputedRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18nStore } from './store';
import type { SupportedLanguage, LanguageInfo } from './types';
import type { Translations } from './translations';

/**
 * Extract all possible dot-notation keys from the nested translation object
 * E.g., 'common.cancel', 'settings.title', 'time.minutesAgo'
 */
type NestedKeys<T, Path extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends string | ((...args: unknown[]) => string)
          ? Path extends ''
            ? K
            : `${Path}.${K}`
          : NestedKeys<T[K], Path extends '' ? K : `${Path}.${K}`>
        : never;
    }[keyof T]
  : never;

/**
 * Get the value type at a specific dot-notation path
 */
type GetValue<T, Path> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? GetValue<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

/**
 * Extract parameter type from a translation value
 */
type GetParams<V> = V extends (params: infer P) => string
  ? P
  : V extends string
    ? undefined
    : never;

/**
 * All valid translation keys
 */
export type TranslationKey = NestedKeys<Translations>;

/**
 * Get the parameter type for a specific translation key
 */
export type TranslationParams<K extends TranslationKey> = GetParams<
  GetValue<Translations, K>
>;

/**
 * i18n composable return type
 */
export interface UseI18nReturn {
  /**
   * Translate a key to the current language
   */
  t: <K extends TranslationKey>(
    key: K,
    ...args: GetParams<GetValue<Translations, K>> extends undefined
      ? []
      : [GetParams<GetValue<Translations, K>>]
  ) => string;

  /**
   * Current language code
   */
  currentLanguage: ComputedRef<SupportedLanguage>;

  /**
   * Whether using automatic language detection
   */
  isAutomatic: ComputedRef<boolean>;

  /**
   * Current language info (native name, English name, etc.)
   */
  currentLanguageInfo: ComputedRef<LanguageInfo>;

  /**
   * List of all available languages
   */
  availableLanguages: ComputedRef<LanguageInfo[]>;

  /**
   * Set the current language (pass null for automatic)
   */
  setLanguage: (lang: SupportedLanguage | null) => void;
}

/**
 * Main i18n composable for Vue components
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useI18n } from '@/i18n';
 *
 * const { t, currentLanguage, setLanguage } = useI18n();
 * </script>
 *
 * <template>
 *   <Label :text="t('common.cancel')" />
 *   <Label :text="t('time.minutesAgo', { count: 5 })" />
 * </template>
 * ```
 */
export function useI18n(): UseI18nReturn {
  const store = useI18nStore();
  const { currentLanguage, isAutomatic, currentLanguageInfo, availableLanguages } =
    storeToRefs(store);

  /**
   * Translation function with type safety
   */
  function t<K extends TranslationKey>(
    key: K,
    ...args: GetParams<GetValue<Translations, K>> extends undefined
      ? []
      : [GetParams<GetValue<Translations, K>>]
  ): string {
    try {
      const translations = store.currentTranslations;
      const keys = key.split('.');

      // Navigate to the value
      let value: unknown = translations;
      for (const k of keys) {
        value = (value as Record<string, unknown>)[k];
        if (value === undefined) {
          console.warn(`[i18n] Translation missing: ${key}`);
          return key;
        }
      }

      // Handle function translations (with parameters)
      if (typeof value === 'function') {
        const params = args[0];
        return (value as (p: unknown) => string)(params);
      }

      // Handle string translations
      if (typeof value === 'string') {
        return value;
      }

      console.warn(`[i18n] Invalid translation value type for key: ${key}`);
      return key;
    } catch (error) {
      console.error(`[i18n] Translation error for key: ${key}`, error);
      return key;
    }
  }

  return {
    t,
    currentLanguage: computed(() => currentLanguage.value),
    isAutomatic: computed(() => isAutomatic.value),
    currentLanguageInfo: computed(() => currentLanguageInfo.value),
    availableLanguages: computed(() => availableLanguages.value),
    setLanguage: store.setLanguage,
  };
}
