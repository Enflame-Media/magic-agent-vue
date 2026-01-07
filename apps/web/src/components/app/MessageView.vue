<script setup lang="ts">
/**
 * MessageView - Renders a normalized message block in a session.
 */

import { computed } from 'vue';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MarkdownView, { type Option } from './markdown/MarkdownView.vue';
import ToolView from './tools/ToolView.vue';
import ToolResult from './ToolResult.vue';
import type { NormalizedMessage } from '@/services/messages/types';

interface Props {
  message: NormalizedMessage;
  onOptionPress?: (option: Option) => void;
}

const props = defineProps<Props>();

const isUser = computed(() => props.message.kind === 'user-text');
const isAssistant = computed(() => props.message.kind === 'agent-text');
const isSystem = computed(() => props.message.kind === 'system' || props.message.kind === 'agent-event');

// Timestamp formatting
const timestamp = computed(() => {
  const date = new Date(props.message.createdAt);
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Avatar initials
const avatarInitials = computed(() => {
  if (isUser.value) return 'U';
  if (isAssistant.value) return 'C';
  return 'S';
});
</script>

<template>
  <div
    :class="[
      'flex gap-3 px-4 py-3',
      isUser && 'flex-row-reverse',
      isSystem && 'justify-center',
    ]"
  >
    <!-- Avatar -->
    <Avatar
      v-if="!isSystem"
      class="h-8 w-8 flex-shrink-0"
    >
      <AvatarFallback
        :class="[
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        ]"
      >
        {{ avatarInitials }}
      </AvatarFallback>
    </Avatar>

    <!-- Message content -->
    <div
      :class="[
        'max-w-[80%] rounded-lg px-4 py-2',
        isUser && 'bg-primary text-primary-foreground',
        isAssistant && 'bg-muted',
        isSystem && 'bg-muted/50 text-muted-foreground text-sm italic',
      ]"
    >
      <MarkdownView
        v-if="message.kind === 'user-text'"
        :markdown="message.displayText ?? message.text"
        :on-option-press="props.onOptionPress"
      />

      <MarkdownView
        v-else-if="message.kind === 'agent-text'"
        :markdown="message.text"
        :on-option-press="props.onOptionPress"
      />

      <ToolView
        v-else-if="message.kind === 'tool-call'"
        :tool="message.tool"
        :messages="message.children"
      />

      <ToolResult
        v-else-if="message.kind === 'tool-result'"
        tool-name="Tool result"
        :result="typeof message.content === 'string' ? message.content : JSON.stringify(message.content, null, 2)"
        :success="!message.isError"
      />

      <p v-else-if="message.kind === 'agent-event'" class="whitespace-pre-wrap break-words">
        <span v-if="message.event.type === 'switch'">
          Switched to {{ message.event.mode }}
        </span>
        <span v-else-if="message.event.type === 'message'">
          {{ message.event.message }}
        </span>
        <span v-else-if="message.event.type === 'limit-reached'">
          Usage limit until {{ new Date(message.event.endsAt * 1000).toLocaleTimeString() }}
        </span>
        <span v-else>System event</span>
      </p>

      <p v-else-if="message.kind === 'system'" class="whitespace-pre-wrap break-words">
        {{ message.text }}
      </p>

      <!-- Timestamp -->
      <span
        v-if="!isSystem"
        :class="[
          'text-xs mt-1 block',
          isUser ? 'text-primary-foreground/70' : 'text-muted-foreground',
        ]"
      >
        {{ timestamp }}
      </span>
    </div>
  </div>
</template>
