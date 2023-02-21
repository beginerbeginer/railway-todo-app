module.exports = {
  env: {
    browser: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }], // react-cookieで使わない定数を許容するために追加。
  },
}
