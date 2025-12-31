/**
 * Dark Mode Composable
 *
 * Provides reactive dark mode state with localStorage persistence
 * and system preference detection. Toggles the 'dark' class on
 * document.documentElement for Tailwind's class-based dark mode.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useDarkMode } from '@/composables/useDarkMode';
 *
 * const { isDark, toggle, setDark } = useDarkMode();
 * </script>
 *
 * <template>
 *   <button @click="toggle">
 *     {{ isDark ? '🌙' : '☀️' }}
 *   </button>
 * </template>
 * ```
 */

import { ref, watchEffect, onMounted, type Ref } from 'vue';

const STORAGE_KEY = 'happy-vue-dark-mode';

/**
 * Reactive dark mode state shared across all component instances.
 * Using a module-level ref ensures singleton behavior.
 */
const isDark = ref(false);
const isInitialized = ref(false);

/**
 * Composable for managing dark mode state.
 *
 * Features:
 * - Persists user preference to localStorage
 * - Respects system color scheme preference on first visit
 * - Syncs with document.documentElement.classList for Tailwind
 * - Singleton pattern ensures consistent state across components
 */
export function useDarkMode(): {
  isDark: Ref<boolean>;
  toggle: () => void;
  setDark: (value: boolean) => void;
} {
  /**
   * Initialize dark mode state from storage or system preference.
   * Only runs once, on first component mount.
   */
  onMounted(() => {
    if (isInitialized.value) return;

    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      isDark.value = stored === 'true';
    } else {
      // Fall back to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    isInitialized.value = true;
  });

  /**
   * Sync the dark class with the document and persist to storage.
   */
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark.value);
    }

    if (isInitialized.value) {
      localStorage.setItem(STORAGE_KEY, String(isDark.value));
    }
  });

  /**
   * Toggle between light and dark modes.
   */
  function toggle(): void {
    isDark.value = !isDark.value;
  }

  /**
   * Explicitly set the dark mode state.
   * @param value - true for dark mode, false for light mode
   */
  function setDark(value: boolean): void {
    isDark.value = value;
  }

  return {
    /** Reactive dark mode state */
    isDark,
    /** Toggle between light and dark modes */
    toggle,
    /** Explicitly set dark mode state */
    setDark,
  };
}
