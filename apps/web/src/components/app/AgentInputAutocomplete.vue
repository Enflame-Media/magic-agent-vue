<script setup lang="ts">
interface Props {
  suggestions: string[];
  activeIndex?: number;
}

withDefaults(defineProps<Props>(), {
  suggestions: () => [],
  activeIndex: 0,
});
</script>

<template>
  <div v-if="suggestions.length" class="rounded-lg border border-border/60 bg-muted/40 p-2 text-xs">
    <div
      v-for="(suggestion, index) in suggestions"
      :key="suggestion + index"
      class="rounded px-2 py-1"
      :class="index === activeIndex ? 'bg-muted text-foreground' : 'text-muted-foreground'"
    >
      {{ suggestion }}
    </div>
  </div>
</template>
