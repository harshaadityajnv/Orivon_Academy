import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: true, // IMPORTANT for Render / Docker
      strictPort: true, // prevents switching to another port

      // FIX: allow your Render domain
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "orivon-academy-frontend.onrender.com",
      ],

      proxy: {
        '/api': {
          // Use backend URL if provided
          target: env.VITE_BACKEND_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },

      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      },
    },

    plugins: [react()],

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
