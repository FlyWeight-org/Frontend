import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  server: {
    host: 'localhost',
  },
  plugins: [
    vue(),
    command === 'serve' && vueDevTools({ launchEditor: process.env.VITE_LAUNCH_EDITOR }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /\.map$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: 'hidden',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              // The framework and instrumentation layer turns over only when a dependency is
              // bumped, so it gets a chunk of its own. Shipping app code then leaves the
              // immutable-cached copy of these bytes intact for returning visitors.
              name: 'vendor',
              test: /[\\/]node_modules[\\/](?:vue|vue-router|pinia|vue-i18n|@vue|@intlify|@sentry|@sentry-internal)[\\/]/,
            },
          ],
        },
      },
    },
  },
}))
