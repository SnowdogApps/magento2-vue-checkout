module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 8,
    sourceType: "module"
  },
  env: {
    browser: true,
  },
  extends: ['plugin:vue/recommended', 'standard'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-mixed-operators': 0,
    'no-new': 0
  }
}
