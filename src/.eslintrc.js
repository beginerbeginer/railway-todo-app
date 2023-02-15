module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'plugin:jsx-a11y/recommended', // アクセシビリティチェック
    'eslint:recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  rules: {},
}
