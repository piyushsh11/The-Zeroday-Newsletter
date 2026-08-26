import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Keep generated asset URLs relative so the multipage build works both at a
  // custom domain and when hosted from a GitHub Pages project subdirectory.
  base: './',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        writeups: resolve(__dirname, 'writeups.html'),
        events: resolve(__dirname, 'events.html'),
        tools: resolve(__dirname, 'tools.html'),
        team: resolve(__dirname, 'team.html'),
      },
    },
  },
});
