module.exports = {
  root: true,
  plugins: [
    'prettier',
    'json-format',
    'import'
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'eslint-config-prettier',
  ],
  env: {
    'es6': true,
    'browser': false,
    'node': true,
    'commonjs': false,
    'es2021': true,
    'jest': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'project': './tsconfig.json',
    'ecmaVersion': 2020,
    'sourceType': 'module',
  },
  ignorePatterns: ['*.yaml', '*.yml', '*.csv'],
  rules: {
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    // ForOfStatement very opinionated https://github.com/airbnb/javascript/issues/1271
    'no-restricted-syntax': ['off', 'ForOfStatement'],
    'prettier/prettier': ['error', {
      trailingComma: 'all',
      semi: true,
      singleQuote: true,
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
    }],
    '@typescript-eslint/lines-between-class-members': [
      'error',
      'always',
      {exceptAfterSingleLine: true},
    ],
    "class-methods-use-this": "off",
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": false}],
    "no-underscore-dangle": "off",
  },
  overrides: [
    {
      files: ['*.test.ts', '**/*.test.ts'],
      rules: {
        // for mocking sometimes it is necessary
        '@typescript-eslint/ban-ts-comment': 0,
      },
    },
  ],
};
