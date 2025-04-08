module.exports = {
  extends: ['../.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-commonjs': 'off',
  },
  parserOptions: {
    sourceType: 'script',
  },
};
