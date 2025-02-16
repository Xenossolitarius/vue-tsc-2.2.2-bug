import eslintPluginSvgRules from '@libs/eslint-plugin-svg-rules'
import config from '../../eslint.config.mjs'
import ts from 'typescript-eslint'

export default [
  ...config,
  {
    files: ['src/assets/icons/*.svg'],

    plugins: {
      '@libs/svg-rules': eslintPluginSvgRules,
    },

    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'prettier/prettier': 'off',
      'vue/comment-directive': 'off',
      '@libs/svg-rules/no-custom-width-height': 'error',
      '@libs/svg-rules/no-baked-in-colors': 'error',
    },
  },
]
