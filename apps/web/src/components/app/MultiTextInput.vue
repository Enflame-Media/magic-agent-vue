<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  rows: 3,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'submit'): void;
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    emit('submit');
  }
}
</script>

<template>
  <textarea
    v-model="localValue"
    :rows="rows"
    :placeholder="placeholder"
    :disabled="disabled"
    class="min-h-[88px] w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
    @keydown="handleKeydown"
  />
</template>
