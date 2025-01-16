import { defineConfig } from 'vite';
import pugPlugin from 'vite-plugin-pug';

const options = { pretty: true } // FIXME: pug pretty is deprecated!
const locals = { name: "My Pug" }

export default defineConfig({
  plugins: [
    pugPlugin(options, locals)
  ],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'sedna', // Nombre global para UMD
      fileName: (format) => `sedna.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  server: {
    open: true, // Abre el navegador automáticamente
  },
});
