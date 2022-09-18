import Bugsnag from "@bugsnag/js";
import type { Plugin } from "@bugsnag/js";
import BugsnagPluginVue from "@bugsnag/plugin-vue";
import type { BugsnagPluginVueResult } from "@bugsnag/plugin-vue";
import config from "@/config/index";

let bugsnagPlugin: BugsnagPluginVueResult | undefined = undefined;

if (config.bugsnagAPIKey) {
  Bugsnag.start({
    apiKey: config.bugsnagAPIKey,
    plugins: [<Plugin>new BugsnagPluginVue()],
  });

  bugsnagPlugin = Bugsnag.getPlugin("vue");
}

export { bugsnagPlugin };
