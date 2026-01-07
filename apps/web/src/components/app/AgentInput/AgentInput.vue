<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import MultiTextInput from '@/components/app/MultiTextInput.vue';
import ActionButtons from './ActionButtons.vue';
import KeyboardShortcutHints from './KeyboardShortcutHints.vue';
import StatusDisplay from './StatusDisplay.vue';
import SettingsOverlay from './SettingsOverlay.vue';
import type { AgentInputProps } from './types';

interface Props extends AgentInputProps {
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelLabel: '',
  permissionLabel: '',
  online: false,
  disabled: false,
  placeholder: 'Type a message...',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'send'): void;
  (event: 'settings'): void;
  (event: 'info'): void;
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3">
    <MultiTextInput
      v-model="localValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @submit="emit('send')"
    />

    <div class="mt-3 flex items-center justify-between text-xs text-muted-foreground">
      <div class="flex items-center gap-4">
        <ActionButtons
          @settings="emit('settings')"
          @info="emit('info')"
        />
        <StatusDisplay :online="online" />
      </div>

      <div class="flex items-center gap-3">
        <SettingsOverlay
          :model-label="modelLabel"
          :permission-label="permissionLabel"
        />
      </div>
    </div>

    <div class="mt-3 flex items-center justify-between text-muted-foreground">
      <KeyboardShortcutHints />
      <Button
        variant="outline"
        size="sm"
        class="h-7 rounded-full px-3 text-xs"
        :disabled="disabled"
        @click="emit('send')"
      >
        Send
      </Button>
    </div>
  </div>
</template>
