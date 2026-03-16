import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', ''); // Trigger restart
  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY ?? env.GEMINI_API_KEY),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false
        },
        "/socket.io": {
          target: "http://localhost:5000",
          ws: true,
          changeOrigin: true
        }
      }
    },
    build: {
      rollupOptions: {
        external: ['better-sqlite3', 'express', 'socket.io', 'http', 'path'],
      },
    },
  };
});
