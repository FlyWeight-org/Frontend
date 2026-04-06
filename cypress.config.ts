import path from 'node:path'
import { defineConfig } from 'cypress'
import { build } from 'vite'

// Inline Vite preprocessor replacing cypress-vite, which sets
// manualChunks: false — incompatible with Vite 8's Rolldown bundler.
function vitePreprocessor() {
  return async (file: Cypress.FileObject) => {
    const { outputPath, filePath } = file
    const fileName = path.basename(outputPath)
    const filenameWithoutExtension = path.basename(outputPath, path.extname(outputPath))

    await build({
      logLevel: 'warn',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
      build: {
        emptyOutDir: false,
        minify: false,
        outDir: path.dirname(outputPath),
        sourcemap: true,
        write: true,
        watch: null,
        lib: {
          entry: filePath,
          fileName: () => fileName,
          formats: ['umd'],
          name: filenameWithoutExtension,
        },
      },
    })

    return outputPath
  }
}

export default defineConfig({
  projectId: 'wdyht2',
  env: {
    apiHost: 'http://127.0.0.1:5000',
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://127.0.0.1:4173',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor())
    },
  },
})
