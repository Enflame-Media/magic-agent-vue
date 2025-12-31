import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vite configuration for Happy Vue.js web application
 *
 * Uses @cloudflare/vite-plugin to integrate with Cloudflare Workers
 * for both development and production deployment.
 *
 * Tailwind CSS is integrated via @tailwindcss/vite plugin.
 */
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    cloudflare(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
});
