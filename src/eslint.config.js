const path = require('path');
const prettier = require('eslint-plugin-prettier');
const _import = require('eslint-plugin-import');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const { fixupPluginRules } = require('@eslint/compat');
const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

function getConfig(options) {
  return [
    ...compat.extends(
      path.resolve(__dirname, './rules.js'),
      'prettier'
    ),
    {
      plugins: {
        prettier,
        import: fixupPluginRules(_import),
        '@typescript-eslint': typescriptEslint,
      },

      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 6,
        sourceType: 'module',
      },

      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },

        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: options.tsConfigPath,
          },
        },
      },
    },
    ...compat
      .extends(
        path.resolve(__dirname, './rulesTs.js')
      )
      .map((config) => ({
        ...config,
        files: ['**/*.ts', '**/*.tsx'],
      })),
    {
      files: ['**/*.ts', '**/*.tsx'],

      languageOptions: {
        ecmaVersion: 5,
        sourceType: 'script',

        parserOptions: {
          project: [options.tsConfigPath],
        },
      },
    },
  ];
}

module.exports = getConfig;
