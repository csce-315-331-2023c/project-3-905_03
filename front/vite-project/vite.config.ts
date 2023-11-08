import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // assuming you are already using this plugin
    svgrPlugin({
      // default behavior is to use SVGR to import .svg files as React components
      // you can add SVGR options here if needed
    }),
  ],
});
