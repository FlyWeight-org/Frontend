/// <reference types="vite/client" />

declare global {
  interface Window {
    Cypress?: Cypress;
  }
}

declare module "cypress-watch-and-reload/plugins.js" {
  export default function (
    on: PluginEvents,
    config: PluginConfigOptions
  ): PluginConfigOptions;
}
