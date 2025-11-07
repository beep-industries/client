import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"
import checkFile from "eslint-plugin-check-file"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ["src/**/*.tsx"],
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "src/!(routes)/**/*.tsx": "PASCAL_CASE",
          "src/routes/**/^[a-zA-Z]*.tsx": "KEBAB_CASE",
        },
      ],
    },
  },
])
