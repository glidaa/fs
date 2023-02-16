module.exports = {
  env: {
    commonjs: true,
    node: true,
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {},
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "import", "react-hooks"],
  ignorePatterns: ["node_modules/"],
  rules: {
    "react/prop-types": 0,
    "no-unused-vars": 0,
    "no-case-declarations": 0
  },
  settings: {
    react: {
      version: "detect"
    },
  },
};