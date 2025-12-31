/**
 * Happy Vue.js Web Application Entry Point
 *
 * Bootstraps the Vue 3 application with:
 * - Vue Router for client-side routing
 * - Pinia for state management
 * - Tailwind CSS with ShadCN-Vue theme
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import global styles (Tailwind CSS + ShadCN-Vue variables)
import './assets/index.css';

const app = createApp(App);

// Install plugins
app.use(createPinia());
app.use(router);

// Mount the application
app.mount('#app');
