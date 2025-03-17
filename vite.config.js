import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend', // Set the root to the frontend directory
  server: {
    port: 5173,
  },
  build: {
    outDir: 'frontend/dist',
    rollupOptions: {
      input: 'frontend/index.html', // Ensure the entry point is set to frontend/index.html
    },
  },
});
