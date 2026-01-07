<script setup lang="ts">
import { Kbd } from '@/components/ui/kbd';
</script>

<template>
  <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
    <div class="flex items-center gap-1">
      <Kbd>Enter</Kbd>
      <span>Send</span>
    </div>
    <div class="flex items-center gap-1">
      <Kbd>Tab</Kbd>
      <span>Cycle mode</span>
    </div>
    <div class="flex items-center gap-1">
      <Kbd>Cmd</Kbd>
      <span>Cycle model</span>
    </div>
    <div class="flex items-center gap-1">
      <Kbd>Esc</Kbd>
      <span>Abort</span>
    </div>
  </div>
</template>
