/**
 * i18n Module for Happy Mobile
 *
 * Provides internationalization support with:
 * - Native device language detection (iOS/Android)
 * - Dynamic language switching without app restart
 * - Type-safe translation functions
 * - Date/time/number formatting per locale
 * - Pluralization rules per language
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

// Re-export types
export * from './types';
export { useI18nStore } from './store';
export { useI18n } from './composables';
export * from './formatting';

// Re-export translations for direct access if needed
export type { Translations, TranslationStructure } from './translations';
