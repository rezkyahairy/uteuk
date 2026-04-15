module.exports = {
  languageOptions: {
    parser: await import("@typescript-eslint/parser"),
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  plugins: {
    prettier: (await import("eslint-plugin-prettier")).default,
  },
  rules: {
    "prettier/prettier": "error",
  },
};
