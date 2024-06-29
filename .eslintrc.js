module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Add node environment globally
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [
    {
      files: [
        "*.config.js", // Apply node environment to all config files
        "*.cjs",
      ],
      env: {
        node: true,
      },
      rules: {
        "no-undef": "off", // Disable no-undef rule for these files
      },
      parserOptions: {
        sourceType: "script", // Ensure source type is script for these files
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {},
};
