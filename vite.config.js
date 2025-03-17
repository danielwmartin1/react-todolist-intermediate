import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './frontend', // Ensure this points to the directory containing index.html
  build: {
    outDir: '../dist', // Adjusted to ensure the output directory is correct
  },
});
