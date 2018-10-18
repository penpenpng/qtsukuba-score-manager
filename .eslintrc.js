const OFF = 0
const WARN = 1
const ERROR = 2
const PRODUCTION_ERROR = process.env.NODE_ENV === "production" ? ERROR : OFF

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: "eslint:recommended",
  globals: {
    __static: true
  },
  plugins: [
    "html"
  ],
  rules: {
    "comma-dangle": [WARN, "only-multiline"],
    "quotes": [WARN, "double", { "allowTemplateLiterals": true }],
    "semi": [WARN, "never"],
    "space-before-function-paren": [WARN, "never"],
    "no-console": PRODUCTION_ERROR,
    "no-debugger": PRODUCTION_ERROR,
  }
}
