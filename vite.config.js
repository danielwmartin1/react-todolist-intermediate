import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for React project
export default defineConfig({
  plugins: [react()], // Enables React plugin
  resolve: {
    alias: {
      '@components': '/src/components', // Alias for components folder
      '@services': '/src/services', // Alias for services folder
      '@styles': '/src/styles', // Alias for styles folder
    },
  },
  server: {
    // Server configuration (proxy removed as it's not used)
  },
});
