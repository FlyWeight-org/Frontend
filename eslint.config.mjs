import pluginVue from 'eslint-plugin-vue'
import parser from 'vue-eslint-parser'

export default [
  // add more generic rulesets here, such as:
  // js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // ...pluginVue.configs['flat/vue2-recommended'], // Use this if you are using Vue.js 2.x.
  {
    rules: {
      'vue/multi-word-component-names': 'off'
    },
    languageOptions: {
      ecmaVersion: 'latest',
      parser: parser,
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  }
]
