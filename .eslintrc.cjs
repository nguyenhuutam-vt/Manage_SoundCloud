module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // 👇 thêm dòng này
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' }, // cho phép biến bắt đầu bằng _ không bị coi là unused
    ],
  },
}
