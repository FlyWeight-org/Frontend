import { defineConfig } from 'cypress'
import vitePreprocessor from 'cypress-vite'

export default defineConfig({
  projectId: "wdyht2",
  env: {
    apiHost: "http://127.0.0.1:5000"
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: "http://127.0.0.1:4173",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  }
})
