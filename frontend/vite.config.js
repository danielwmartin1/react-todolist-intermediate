import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: []
    },
    esbuild: {
      loader: 'jsx', // Set the loader for .js files to jsx
      include: /src\/.*\.(js|jsx)$/, // Apply to .js and .jsx files in the src directory
      exclude: [],
    }
  }
});
