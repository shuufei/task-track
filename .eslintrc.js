module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-typescript',
    // 'prettier/@typescript-eslint',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    // 'prettier/prettier': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
    "import/no-extraneous-dependencies": ["error", {"dependencies": false, "devDependencies": false, "optionalDependencies": false, "peerDependencies": false}]
  }
};
