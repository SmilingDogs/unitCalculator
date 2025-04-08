module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-commonjs': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['metro.config.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
