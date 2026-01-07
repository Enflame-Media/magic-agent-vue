<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const props = defineProps<{
  title?: string;
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <header
    :class="cn(
      'flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
      props.class,
    )"
  >
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 class="text-base font-medium">
        {{ props.title ?? 'Dashboard' }}
      </h1>
      <div class="ml-auto flex items-center gap-2">
        <slot name="actions" />
        <Button variant="ghost" as-child size="sm" class="hidden sm:flex">
          <a
            href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
            rel="noopener noreferrer"
            target="_blank"
            class="dark:text-foreground"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  </header>
</template>
