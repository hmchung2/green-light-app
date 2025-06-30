const {defineConfig} = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      indent: ['error', 2], // <- Enforce 4 spaces
      'prettier/prettier': ['error', {tabWidth: 2}],
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.ts', '.tsx', '.d.ts'],
        },
      },
    },
  },
]);
