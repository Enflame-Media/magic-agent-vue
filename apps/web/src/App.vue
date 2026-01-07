<script setup lang="ts">
/**
 * Root Vue component for Happy web application
 *
 * Renders the router-view for client-side navigation.
 * Includes dark mode toggle, Sonner toast provider, WebSocket sync,
 * and session revival error handling.
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Toaster } from '@/components/ui/sonner';
import { useSync } from '@/composables/useSync';
import { useSessionRevival } from '@/composables/useSessionRevival';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import SessionErrorDialog from '@/components/app/SessionErrorDialog.vue';
import SessionSidebar from '@/components/app/SessionSidebar.vue';
import SiteHeader from '@/components/SiteHeader.vue';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const route = useRoute();

// Initialize WebSocket sync - auto-connects when authenticated (HAP-671)
useSync();

// Session revival error handling (HAP-736)
const {
  revivalFailed,
  copySessionId,
  archiveFailedSession,
  dismissError,
} = useSessionRevival();

// Auth state for conditional UI
const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const showShell = computed(() => isAuthenticated.value && route.meta.requiresAuth);
const pageTitle = computed(() => {
  const name = String(route.name ?? '');
  const titles: Record<string, string> = {
    home: 'Dashboard',
    'new-session': 'New Session',
    session: 'Session',
    'session-info': 'Session Details',
    'session-artifacts': 'Session Artifacts',
    artifacts: 'Artifacts',
    friends: 'Friends',
    'friend-profile': 'Friend Profile',
    settings: 'Settings',
    'settings-account': 'Account',
    'settings-appearance': 'Appearance',
    'settings-language': 'Language',
    'settings-privacy': 'Privacy',
    'settings-voice': 'Voice',
  };

  return titles[name] ?? 'Happy';
});
</script>

<template>
  <!-- Sonner toast provider for notifications -->
  <Toaster />

  <!-- Session revival error dialog (HAP-736) -->
  <SessionErrorDialog
    :revival-failed="revivalFailed"
    @copy="copySessionId"
    @archive="archiveFailedSession"
    @dismiss="dismissError"
  />

  <div v-if="showShell" id="happy-app" class="min-h-screen bg-background">
    <SidebarProvider class="min-h-svh">
      <SessionSidebar />
      <SidebarInset>
        <SiteHeader :title="pageTitle" />
        <div class="flex min-h-0 flex-1 flex-col">
          <RouterView />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>

  <div v-else class="min-h-screen bg-background">
    <RouterView />
  </div>
</template>
