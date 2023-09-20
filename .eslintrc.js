module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    // 'import/no-extraneous-dependencies': 'off',
    // 'no-underscore-dangle': 'off',
    // 'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
  },
  // workingDirectories: [{ "mode": "auto" }],
};
