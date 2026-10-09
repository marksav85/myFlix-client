module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: [
        "*.config.js",
        "*.cjs",
        ".eslintrc.js",
      ],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script", // Ensure source type is script for these files
      },
    },
    {
      files: ["src/api/config.js", "src/test/setup.js"],
      globals: {
        process: "readonly",
      },
    },
    {
      files: ["**/*.test.{js,jsx}"],
      globals: {
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
