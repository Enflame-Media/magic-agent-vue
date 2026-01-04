<script setup lang="ts">
/**
 * Language Settings View
 *
 * Allows users to select their preferred language for the app.
 * Changes apply immediately without app restart.
 */

import { Frame } from '@nativescript/core';
import { useI18n, type SupportedLanguage } from '@/i18n';

const { t, currentLanguage, isAutomatic, availableLanguages, setLanguage } = useI18n();

/**
 * Navigate back
 */
function navigateBack(): void {
  const frame = Frame.topmost();
  if (frame?.canGoBack()) {
    frame.goBack();
  }
}

/**
 * Handle language selection
 */
function onSelectLanguage(lang: SupportedLanguage | null): void {
  setLanguage(lang);
}

/**
 * Check if a language is currently selected
 */
function isSelected(lang: SupportedLanguage | null): boolean {
  if (lang === null) {
    return isAutomatic.value;
  }
  return !isAutomatic.value && currentLanguage.value === lang;
}
</script>

<template>
  <Page actionBarHidden="false">
    <ActionBar :title="t('settingsLanguage.title')">
      <NavigationButton
        text="Back"
        android.systemIcon="ic_menu_back"
        @tap="navigateBack"
      />
    </ActionBar>

    <ScrollView>
      <StackLayout class="settings-container">
        <!-- Description -->
        <Label
          :text="t('settingsLanguage.description')"
          class="description"
          textWrap="true"
        />

        <!-- Automatic Option -->
        <GridLayout
          columns="*, auto"
          class="setting-item"
          @tap="onSelectLanguage(null)"
        >
          <StackLayout col="0">
            <Label
              :text="t('settingsLanguage.automatic')"
              class="setting-title"
            />
            <Label
              :text="t('settingsLanguage.automaticSubtitle')"
              class="setting-subtitle"
            />
          </StackLayout>
          <Label
            v-if="isSelected(null)"
            col="1"
            text="✓"
            class="checkmark"
            verticalAlignment="center"
          />
        </GridLayout>

        <!-- Section Header -->
        <Label text="LANGUAGES" class="section-header" />

        <!-- Language List -->
        <StackLayout>
          <GridLayout
            v-for="lang in availableLanguages"
            :key="lang.code"
            columns="*, auto"
            class="setting-item"
            @tap="onSelectLanguage(lang.code)"
          >
            <StackLayout col="0">
              <Label
                :text="lang.nativeName"
                class="setting-title"
              />
              <Label
                :text="lang.englishName"
                class="setting-subtitle"
              />
            </StackLayout>
            <Label
              v-if="isSelected(lang.code)"
              col="1"
              text="✓"
              class="checkmark"
              verticalAlignment="center"
            />
          </GridLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<style scoped>
.settings-container {
  padding: 0;
}

.description {
  font-size: 14;
  color: #6b7280;
  padding: 16;
  background-color: #f9fafb;
}

.section-header {
  font-size: 13;
  font-weight: bold;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5;
  padding: 16;
  padding-bottom: 8;
  background-color: #f9fafb;
}

.setting-item {
  padding: 16;
  background-color: #ffffff;
  border-bottom-width: 1;
  border-bottom-color: #e5e7eb;
}

.setting-title {
  font-size: 17;
  color: #1f2937;
  font-weight: 500;
}

.setting-subtitle {
  font-size: 14;
  color: #6b7280;
  margin-top: 4;
}

.checkmark {
  font-size: 20;
  color: #6366f1;
  font-weight: bold;
}
</style>
