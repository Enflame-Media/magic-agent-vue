/**
 * i18n Type Definitions for Happy Mobile
 *
 * Centralized language configuration and type definitions.
 * Mirrors the happy-app i18n structure for consistency.
 */

/**
 * Supported language codes
 * Must match the languages available in happy-app
 */
export type SupportedLanguage = 'en' | 'ru' | 'pl' | 'es' | 'pt' | 'ca' | 'zh-Hans';

/**
 * Language metadata interface
 */
export interface LanguageInfo {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
}

/**
 * All supported languages with their native and English names
 */
export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  en: {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
  },
  ru: {
    code: 'ru',
    nativeName: 'Русский',
    englishName: 'Russian',
  },
  pl: {
    code: 'pl',
    nativeName: 'Polski',
    englishName: 'Polish',
  },
  es: {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
  },
  pt: {
    code: 'pt',
    nativeName: 'Português',
    englishName: 'Portuguese',
  },
  ca: {
    code: 'ca',
    nativeName: 'Català',
    englishName: 'Catalan',
  },
  'zh-Hans': {
    code: 'zh-Hans',
    nativeName: '中文(简体)',
    englishName: 'Chinese (Simplified)',
  },
} as const;

/**
 * Array of all supported language codes
 */
export const SUPPORTED_LANGUAGE_CODES: SupportedLanguage[] = Object.keys(
  SUPPORTED_LANGUAGES
) as SupportedLanguage[];

/**
 * Default language code
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Helper to get language native name by code
 */
export function getLanguageNativeName(code: SupportedLanguage): string {
  return SUPPORTED_LANGUAGES[code].nativeName;
}

/**
 * Helper to get language English name by code
 */
export function getLanguageEnglishName(code: SupportedLanguage): string {
  return SUPPORTED_LANGUAGES[code].englishName;
}

/**
 * Check if a language code is supported
 */
export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return code in SUPPORTED_LANGUAGES;
}
