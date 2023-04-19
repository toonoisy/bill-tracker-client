module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // should be in sync with prettier's `printWidth`
    'max-len': [
      'error',
      {
        code: 80,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      },
    ],
  },
};
