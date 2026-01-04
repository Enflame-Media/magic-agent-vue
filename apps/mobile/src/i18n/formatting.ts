/**
 * Date, Time, and Number Formatting Utilities for Happy Mobile
 *
 * Uses the browser's Intl API for locale-aware formatting.
 * NativeScript supports Intl on both iOS and Android.
 */

import type { SupportedLanguage } from './types';

/**
 * Map of SupportedLanguage to BCP 47 locale tags for Intl API
 */
const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-US',
  es: 'es-ES',
  ru: 'ru-RU',
  pl: 'pl-PL',
  pt: 'pt-PT',
  ca: 'ca-ES',
  'zh-Hans': 'zh-CN',
};

/**
 * Get the BCP 47 locale tag for a supported language
 */
export function getLocaleTag(lang: SupportedLanguage): string {
  return LOCALE_MAP[lang] || LOCALE_MAP.en;
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Date format options
 */
export type DateFormatStyle = 'short' | 'medium' | 'long' | 'full';

/**
 * Format a date according to the locale
 *
 * @param date - Date to format
 * @param lang - Language code
 * @param style - Format style (short, medium, long, full)
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date(), 'en', 'medium') // "Jan 4, 2026"
 * formatDate(new Date(), 'es', 'long') // "4 de enero de 2026"
 */
export function formatDate(
  date: Date,
  lang: SupportedLanguage,
  style: DateFormatStyle = 'medium'
): string {
  const locale = getLocaleTag(lang);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: style,
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    // Fallback to ISO string if Intl fails
    const isoDate = date.toISOString().split('T')[0];
    return isoDate ?? date.toDateString();
  }
}

/**
 * Format a time according to the locale
 *
 * @param date - Date to format
 * @param lang - Language code
 * @param style - Format style (short, medium, long, full)
 * @returns Formatted time string
 *
 * @example
 * formatTime(new Date(), 'en', 'short') // "3:45 PM"
 * formatTime(new Date(), 'de', 'short') // "15:45"
 */
export function formatTime(
  date: Date,
  lang: SupportedLanguage,
  style: DateFormatStyle = 'short'
): string {
  const locale = getLocaleTag(lang);
  const options: Intl.DateTimeFormatOptions = {
    timeStyle: style,
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toTimeString().slice(0, 5);
  }
}

/**
 * Format a date and time according to the locale
 *
 * @param date - Date to format
 * @param lang - Language code
 * @param dateStyle - Date format style
 * @param timeStyle - Time format style
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: Date,
  lang: SupportedLanguage,
  dateStyle: DateFormatStyle = 'medium',
  timeStyle: DateFormatStyle = 'short'
): string {
  const locale = getLocaleTag(lang);
  const options: Intl.DateTimeFormatOptions = {
    dateStyle,
    timeStyle,
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return `${formatDate(date, lang, dateStyle)} ${formatTime(date, lang, timeStyle)}`;
  }
}

/**
 * Format a relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to compare against now
 * @param lang - Language code
 * @returns Formatted relative time string
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000), 'en') // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() - 3600000), 'es') // "hace 1 hora"
 */
export function formatRelativeTime(date: Date, lang: SupportedLanguage): string {
  const locale = getLocaleTag(lang);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffSeconds) < 60) {
      return rtf.format(diffSeconds, 'second');
    } else if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, 'minute');
    } else if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, 'hour');
    } else {
      return rtf.format(diffDays, 'day');
    }
  } catch {
    // Fallback
    if (Math.abs(diffMinutes) < 60) {
      return `${String(Math.abs(diffMinutes))}m ago`;
    } else if (Math.abs(diffHours) < 24) {
      return `${String(Math.abs(diffHours))}h ago`;
    } else {
      return `${String(Math.abs(diffDays))}d ago`;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Number Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a number according to the locale
 *
 * @param value - Number to format
 * @param lang - Language code
 * @param options - Additional Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * formatNumber(1234567.89, 'en') // "1,234,567.89"
 * formatNumber(1234567.89, 'de') // "1.234.567,89"
 */
export function formatNumber(
  value: number,
  lang: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  const locale = getLocaleTag(lang);

  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return value.toString();
  }
}

/**
 * Format a number as currency
 *
 * @param value - Number to format
 * @param lang - Language code
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 *
 * @example
 * formatCurrency(99.99, 'en', 'USD') // "$99.99"
 * formatCurrency(99.99, 'de', 'EUR') // "99,99 €"
 */
export function formatCurrency(
  value: number,
  lang: SupportedLanguage,
  currency: string = 'USD'
): string {
  const locale = getLocaleTag(lang);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format a number as a percentage
 *
 * @param value - Number to format (0-1 for 0%-100%)
 * @param lang - Language code
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 *
 * @example
 * formatPercent(0.85, 'en') // "85%"
 * formatPercent(0.856, 'en', 1) // "85.6%"
 */
export function formatPercent(
  value: number,
  lang: SupportedLanguage,
  decimals: number = 0
): string {
  const locale = getLocaleTag(lang);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch {
    return `${(value * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format a number in compact notation (e.g., 1K, 1M)
 *
 * @param value - Number to format
 * @param lang - Language code
 * @returns Formatted compact number string
 *
 * @example
 * formatCompact(1500, 'en') // "1.5K"
 * formatCompact(1500000, 'en') // "1.5M"
 */
export function formatCompact(value: number, lang: SupportedLanguage): string {
  const locale = getLocaleTag(lang);

  try {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  } catch {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Composable for Formatting
// ─────────────────────────────────────────────────────────────────────────────

import { useI18nStore } from './store';

/**
 * Composable for locale-aware formatting functions
 *
 * Returns formatting functions bound to the current language.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useFormatting } from '@/i18n';
 *
 * const { formatDate, formatNumber, formatCurrency } = useFormatting();
 * </script>
 *
 * <template>
 *   <Label :text="formatDate(session.createdAt)" />
 *   <Label :text="formatCurrency(99.99, 'USD')" />
 * </template>
 * ```
 */
interface FormattingFunctions {
  formatDate: (date: Date, style?: DateFormatStyle) => string;
  formatTime: (date: Date, style?: DateFormatStyle) => string;
  formatDateTime: (date: Date, dateStyle?: DateFormatStyle, timeStyle?: DateFormatStyle) => string;
  formatRelativeTime: (date: Date) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatPercent: (value: number, decimals?: number) => string;
  formatCompact: (value: number) => string;
}

export function useFormatting(): FormattingFunctions {
  const store = useI18nStore();

  return {
    formatDate: (date: Date, style?: DateFormatStyle) =>
      formatDate(date, store.currentLanguage, style),

    formatTime: (date: Date, style?: DateFormatStyle) =>
      formatTime(date, store.currentLanguage, style),

    formatDateTime: (date: Date, dateStyle?: DateFormatStyle, timeStyle?: DateFormatStyle) =>
      formatDateTime(date, store.currentLanguage, dateStyle, timeStyle),

    formatRelativeTime: (date: Date) => formatRelativeTime(date, store.currentLanguage),

    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(value, store.currentLanguage, options),

    formatCurrency: (value: number, currency?: string) =>
      formatCurrency(value, store.currentLanguage, currency),

    formatPercent: (value: number, decimals?: number) =>
      formatPercent(value, store.currentLanguage, decimals),

    formatCompact: (value: number) => formatCompact(value, store.currentLanguage),
  };
}
