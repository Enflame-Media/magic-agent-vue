<script setup lang="ts">
/**
 * Manual Entry View - Enter CLI connection code manually
 *
 * Allows users to paste the connection URL/code when
 * camera scanning is not available.
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clipboard, CheckCircle2, AlertCircle, Loader2 } from 'lucide-vue-next';
import { parseConnectionCode, approveCliConnection, authenticateWithSecretKey } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';

const router = useRouter();
const authStore = useAuthStore();

type ConnectionState = 'input' | 'connecting' | 'success' | 'error';
type ManualAuthMode = 'cli' | 'secret' | null;

const state = ref<ConnectionState>('input');
const manualInput = ref('');
const lastMode = ref<ManualAuthMode>(null);
const errorMessage = ref<string | null>(null);

/**
 * Paste from clipboard
 */
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    manualInput.value = text.trim();
    toast.success('Pasted from clipboard');
  } catch {
    toast.error('Failed to paste', {
      description: 'Please paste manually using Ctrl+V or Cmd+V',
    });
  }
}

/**
 * Handle form submission
 */
async function handleSubmit() {
  const rawInput = manualInput.value.trim();
  if (!rawInput) {
    toast.error('Please enter a connection code or secret key');
    return;
  }

  state.value = 'connecting';
  lastMode.value = null;
  errorMessage.value = null;

  try {
    let connectionInfo: ReturnType<typeof parseConnectionCode> | null = null;

    try {
      connectionInfo = parseConnectionCode(rawInput);
    } catch {
      connectionInfo = null;
    }

    if (connectionInfo) {
      lastMode.value = 'cli';
      // Check if we have credentials to approve the connection
      if (!authStore.canApproveConnections || !authStore.token || !authStore.secret) {
        throw new Error('Not authenticated. Please log in first.');
      }

      // Approve the CLI connection
      await approveCliConnection(
        authStore.token,
        connectionInfo.publicKey,
        authStore.secret
      );

      toast.success('CLI Connected!', {
        description: 'The terminal session is now linked to your account',
      });
    } else {
      lastMode.value = 'secret';
      const credentials = await authenticateWithSecretKey(rawInput);
      authStore.setCredentials(credentials.token, 'temp-account-id');
      authStore.setSecret(credentials.secret);

      toast.success('Authenticated!', {
        description: 'You are now logged in on this browser',
      });
    }

    state.value = 'success';

    // Redirect to home after success
    setTimeout(() => {
      router.push('/');
    }, 2000);
  } catch (error) {
    console.error('[ManualEntry] Connection failed:', error);
    state.value = 'error';
    errorMessage.value =
      error instanceof Error ? error.message : 'Invalid connection code';

    toast.error('Authentication Failed', {
      description: errorMessage.value,
    });
  }
}

/**
 * Go back to login
 */
function goBack() {
  router.push('/auth');
}

/**
 * Retry entry
 */
function retry() {
  state.value = 'input';
  lastMode.value = null;
  errorMessage.value = null;
  manualInput.value = '';
}
</script>

<template>
  <div class="manual-entry-view">
    <div class="entry-container">
      <!-- Header -->
      <div class="header">
        <Button
          variant="ghost"
          size="icon"
          @click="goBack"
        >
          <ArrowLeft class="h-5 w-5" />
        </Button>
        <h1 class="title">Manual Entry</h1>
        <div class="spacer" />
      </div>

      <!-- Entry Card -->
      <Card>
        <CardHeader>
          <CardTitle>Manual Connection</CardTitle>
          <CardDescription>
            Paste the connection URL or your secret key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <!-- Input State -->
          <template v-if="state === 'input'">
            <form
              class="form"
              @submit.prevent="handleSubmit"
            >
              <div class="input-group">
                <Input
                  v-model="manualInput"
                  type="text"
                  placeholder="happy://terminal?... or paste secret key"
                  class="input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  @click="pasteFromClipboard"
                >
                  <Clipboard class="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                class="w-full"
                :disabled="!manualInput.trim()"
              >
                Connect
              </Button>
            </form>
          </template>

          <!-- Connecting State -->
          <template v-else-if="state === 'connecting'">
            <div class="state-container">
              <Loader2 class="state-icon spinning" />
              <p class="state-title">
                {{ lastMode === 'secret' ? 'Authenticating...' : 'Connecting...' }}
              </p>
              <p class="state-description">
                {{ lastMode === 'secret'
                  ? 'Signing in with your secret key'
                  : 'Establishing connection with the CLI' }}
              </p>
            </div>
          </template>

          <!-- Success State -->
          <template v-else-if="state === 'success'">
            <div class="state-container success">
              <CheckCircle2 class="state-icon" />
              <p class="state-title">
                {{ lastMode === 'secret' ? 'Authenticated!' : 'Connected!' }}
              </p>
              <p class="state-description">
                {{ lastMode === 'secret'
                  ? 'Your browser session is now authenticated'
                  : 'You can now see this session in your terminal' }}
              </p>
            </div>
          </template>

          <!-- Error State -->
          <template v-else-if="state === 'error'">
            <div class="state-container error">
              <AlertCircle class="state-icon" />
              <p class="state-title">Authentication Failed</p>
              <p class="state-description">{{ errorMessage }}</p>
              <Button @click="retry">
                Try Again
              </Button>
            </div>
          </template>
        </CardContent>
      </Card>

      <!-- Instructions -->
      <div
        v-if="state === 'input'"
        class="instructions"
      >
        <p class="instruction-title">Where to find the code:</p>
        <ol class="instruction-list">
          <li>Run <code>happy</code> in your terminal</li>
          <li>Choose "Web Authentication"</li>
          <li>Copy the URL shown below the QR code</li>
          <li>Or paste your secret key to authenticate this browser</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manual-entry-view {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.5rem;
  padding-top: 3rem;
  background: hsl(var(--background));
}

.entry-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 600;
  color: hsl(var(--foreground));
}

.spacer {
  width: 2.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input {
  flex: 1;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  text-align: center;
}

.state-icon {
  width: 3rem;
  height: 3rem;
  color: hsl(var(--muted-foreground));
}

.state-container.success .state-icon {
  color: hsl(var(--primary));
}

.state-container.error .state-icon {
  color: hsl(var(--destructive));
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.state-title {
  font-weight: 600;
  color: hsl(var(--foreground));
}

.state-description {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
}

.instructions {
  padding: 1rem;
  background: hsl(var(--muted) / 0.5);
  border-radius: 0.5rem;
}

.instruction-title {
  font-weight: 500;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
}

.instruction-list {
  margin: 0;
  padding-left: 1.25rem;
  color: hsl(var(--muted-foreground));
  font-size: 0.875rem;
  line-height: 1.75;
}

.instruction-list code {
  background: hsl(var(--muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875em;
}
</style>
