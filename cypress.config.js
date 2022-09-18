const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "wdyht2",
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://127.0.0.1:4173",
    env: {
      "cypress-watch-and-reload": {
        watch: "src/*",
      },
      apiHost: "http://127.0.0.1:5000",
    },
    setupNodeEvents(on, config) {
      // https://github.com/bahmutov/cypress-watch-and-reload
      return require("cypress-watch-and-reload/plugins")(on, config);
    },
  },
  env: {
    apiHost: "http://127.0.0.1:5000",
  },
});
