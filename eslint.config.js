import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'node_modules', '**/*.ts', '**/*.tsx'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]
