<script setup lang="ts">
/**
 * Home View - Landing page for Happy web application
 *
 * Displays welcome message and getting started information.
 * Demonstrates ShadCN-Vue components (Card, Button, Input, Avatar, Skeleton).
 */

import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const version = ref('0.0.1');
const email = ref('');

function handleGetStarted() {
  if (email.value) {
    toast.success('Thanks for signing up!', {
      description: `We'll notify you at ${email.value}`,
    });
    email.value = '';
  } else {
    toast.error('Please enter your email');
  }
}
</script>

<template>
  <div class="py-8 space-y-12">
    <!-- Hero Section -->
    <section class="text-center space-y-4">
      <h2 class="text-3xl font-semibold text-foreground">Welcome to Happy</h2>
      <p class="text-muted-foreground text-lg max-w-xl mx-auto">
        Control your Claude Code sessions remotely from any device.
      </p>

      <!-- Email signup with ShadCN-Vue components -->
      <div class="flex gap-2 max-w-md mx-auto mt-6">
        <Input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="flex-1"
          @keyup.enter="handleGetStarted"
        />
        <Button @click="handleGetStarted">Get Started</Button>
      </div>
    </section>

    <!-- Features Section with Cards -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-primary">Real-time Sync</CardTitle>
          <CardDescription>
            See your coding sessions update in real-time across all devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/anthropics.png" alt="Anthropic" />
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <Skeleton class="h-4 w-3/4 mb-2" />
              <Skeleton class="h-3 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-primary">End-to-End Encrypted</CardTitle>
          <CardDescription>
            Your code and conversations are encrypted and only visible to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2">
            <Button variant="outline" size="sm">Learn More</Button>
            <Button variant="secondary" size="sm">View Docs</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-primary">Multi-Platform</CardTitle>
          <CardDescription>
            Available on web, iOS, and Android for seamless access anywhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm">Web</Button>
            <Button variant="outline" size="sm">iOS</Button>
            <Button variant="outline" size="sm">Android</Button>
          </div>
        </CardContent>
      </Card>
    </section>

    <!-- Footer -->
    <footer class="text-center">
      <p class="text-muted-foreground text-xs">Version {{ version }}</p>
    </footer>
  </div>
</template>
