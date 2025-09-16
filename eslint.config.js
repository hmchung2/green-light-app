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
      indent: 'off', // 🔥 ESLint indent 끔
      'prettier/prettier': ['error', {tabWidth: 2}], // Prettier만 사용
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
