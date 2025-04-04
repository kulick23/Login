import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // Открывает браузер автоматически
    hmr: true,
  },
  preview: {
    port: 3000,
    open: true,
  },
});
