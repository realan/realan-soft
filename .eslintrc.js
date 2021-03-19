module.exports = {
  parser: "babel-eslint",
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  rules: {
    "react/prop-types": 0,
    skipStrings: 0,
    "no-unused-vars": 1,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:prettier/recommended"],
};
