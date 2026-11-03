import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: 'tv5',
    publicDir: 'assets',
    plugins: [react()],
    build: {
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'tv5/index.html'),
          about: path.resolve(__dirname, 'tv5/about.html'),
          account: path.resolve(__dirname, 'tv5/account.html'),
          admin: path.resolve(__dirname, 'tv5/admin.html'),
          careers: path.resolve(__dirname, 'tv5/careers.html'),
          company: path.resolve(__dirname, 'tv5/company.html'),
          contact: path.resolve(__dirname, 'tv5/contact.html'),
          dashboard: path.resolve(__dirname, 'tv5/dashboard.html'),
          news: path.resolve(__dirname, 'tv5/news.html'),
          services: path.resolve(__dirname, 'tv5/services.html'),
          trainings: path.resolve(__dirname, 'tv5/trainings.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
