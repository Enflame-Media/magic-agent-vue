<script setup lang="ts">
/**
 * QRScannerView - QR Code Scanner for Friend Invites
 *
 * Uses @nstudio/nativescript-barcodescanner to scan QR codes
 * containing friend invite links (happy://friend/add/{userId}).
 */

import { ref } from 'vue';
import { BarcodeScanner } from '@nstudio/nativescript-barcodescanner';
import { Dialogs } from '@nativescript/core';
import { useFriends } from '@/composables/useFriends';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success', userId: string): void;
}>();

const { processFriendInvite } = useFriends();

const isScanning = ref(false);
const errorMessage = ref<string | null>(null);
const scanner = new BarcodeScanner();

/**
 * Request camera permission
 */
async function requestPermission(): Promise<boolean> {
  try {
    const hasPermission = await scanner.hasCameraPermission();
    if (hasPermission) return true;

    const granted = await scanner.requestCameraPermission();
    return granted;
  } catch (error) {
    console.error('[QRScanner] Permission error:', error);
    return false;
  }
}

/**
 * Start QR code scanning
 */
async function startScanning() {
  errorMessage.value = null;

  const hasPermission = await requestPermission();
  if (!hasPermission) {
    errorMessage.value = 'Camera permission is required to scan QR codes';
    await Dialogs.alert({
      title: 'Permission Required',
      message: 'Camera permission is required to scan QR codes. Please enable it in Settings.',
      okButtonText: 'OK',
    });
    return;
  }

  isScanning.value = true;

  try {
    const result = await scanner.scan({
      formats: 'QR_CODE',
      message: 'Position the QR code in the frame',
      showFlipCameraButton: true,
      showTorchButton: true,
      preferFrontCamera: false,
      beepOnScan: true,
      openSettingsIfPermissionWasPreviouslyDenied: true,
      closeCallback: () => {
        isScanning.value = false;
      },
    });

    if (result.text) {
      await processQRCode(result.text);
    }
  } catch (error) {
    console.error('[QRScanner] Scan error:', error);
    errorMessage.value = 'Failed to scan QR code';
  } finally {
    isScanning.value = false;
  }
}

/**
 * Process scanned QR code
 */
async function processQRCode(data: string) {
  // Validate it's a Happy friend invite
  const friendMatch = data.match(/happy:\/\/friend\/add\/(.+)/);
  const webMatch = data.match(/https?:\/\/happy\.engineering\/friend\/add\/(.+)/);

  const match = friendMatch ?? webMatch;

  if (!match) {
    errorMessage.value = 'This QR code is not a valid Happy friend invite';
    await Dialogs.alert({
      title: 'Invalid QR Code',
      message: 'This QR code is not a valid Happy friend invite. Please scan a valid invite code.',
      okButtonText: 'OK',
    });
    return;
  }

  const userId = match[1];

  // Show confirmation dialog
  const confirmed = await Dialogs.confirm({
    title: 'Add Friend',
    message: 'Send a friend request to this user?',
    okButtonText: 'Send Request',
    cancelButtonText: 'Cancel',
  });

  if (!confirmed) return;

  // Process the invite
  const success = await processFriendInvite(data);

  if (success) {
    await Dialogs.alert({
      title: 'Request Sent',
      message: 'Your friend request has been sent!',
      okButtonText: 'OK',
    });
    emit('success', userId);
    emit('close');
  } else {
    errorMessage.value = 'Failed to send friend request';
    await Dialogs.alert({
      title: 'Error',
      message: 'Failed to send friend request. Please try again.',
      okButtonText: 'OK',
    });
  }
}

/**
 * Close the scanner
 */
function close() {
  emit('close');
}
</script>

<template>
  <Page action-bar-hidden="true">
    <GridLayout rows="auto, *, auto" class="scanner-container">
      <!-- Header -->
      <GridLayout row="0" columns="auto, *, auto" class="header">
        <Button col="0" text="Close" class="btn-close" @tap="close" />
        <Label col="1" text="Scan QR Code" class="title" />
        <StackLayout col="2" width="60" />
      </GridLayout>

      <!-- Scanner area -->
      <StackLayout row="1" class="scanner-area">
        <Label
          text="Position the QR code within the frame to scan"
          class="instructions"
          text-wrap="true"
        />

        <!-- Scan button -->
        <Button
          v-if="!isScanning"
          text="Start Scanning"
          class="btn-scan"
          @tap="startScanning"
        />

        <!-- Scanning indicator -->
        <StackLayout v-else class="scanning">
          <ActivityIndicator :busy="true" />
          <Label text="Scanning..." class="scanning-text" />
        </StackLayout>

        <!-- Error message -->
        <Label
          v-if="errorMessage"
          :text="errorMessage"
          class="error-message"
          text-wrap="true"
        />
      </StackLayout>

      <!-- Footer with instructions -->
      <StackLayout row="2" class="footer">
        <Label
          text="Scan a friend's QR code to send them a friend request"
          class="footer-text"
          text-wrap="true"
        />
      </StackLayout>
    </GridLayout>
  </Page>
</template>

<style scoped>
.scanner-container {
  background-color: #1f2937;
}

.header {
  padding: 16;
  background-color: #111827;
}

.btn-close {
  background-color: transparent;
  color: #ffffff;
  font-size: 16;
}

.title {
  font-size: 18;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

.scanner-area {
  horizontal-align: center;
  vertical-align: center;
  padding: 32;
}

.instructions {
  font-size: 16;
  color: #9ca3af;
  text-align: center;
  margin-bottom: 32;
}

.btn-scan {
  background-color: #6366f1;
  color: #ffffff;
  font-size: 18;
  font-weight: 600;
  padding: 16 32;
  border-radius: 12;
}

.scanning {
  horizontal-align: center;
}

.scanning-text {
  font-size: 16;
  color: #9ca3af;
  margin-top: 16;
}

.error-message {
  font-size: 14;
  color: #ef4444;
  text-align: center;
  margin-top: 16;
}

.footer {
  padding: 24;
  background-color: #111827;
}

.footer-text {
  font-size: 14;
  color: #9ca3af;
  text-align: center;
}
</style>
