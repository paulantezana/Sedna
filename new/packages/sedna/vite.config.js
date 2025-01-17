import { defineConfig } from 'vite';
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'sedna',
      fileName: 'sedna',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
