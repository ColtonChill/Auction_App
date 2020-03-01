module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'linebreak-style': 'off',
  },
};
