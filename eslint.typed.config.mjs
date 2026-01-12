import baseConfig from "./eslint.config.mjs";
import tseslint from "typescript-eslint";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // 1) Start from the stable, Next.js-first baseline
  ...baseConfig,

  // 2) Add TypeScript-ESLint typed recommendations (CI-only)
  //    These are the *typed* rule sets (more protection, slower)
  ...tseslint.configs.recommendedTypeChecked,

  // 3) Typed lint scope + safe overrides
  {
    files: [
      "apps/**/*.{ts,tsx}",
      "packages/**/*.{ts,tsx}",
      "scripts/**/*.{ts,tsx}"
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },

        // v8 best practice for monorepos
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      // ====== "FULL PROTECTION" (high value, low conflict) ======

      // Catch missing awaits + accidental promise leaks
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",

      // Prevent async patterns that commonly break in Node/Next runtimes
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            // Keep React event handlers ergonomic
            attributes: false
          }
        }
      ],

      // Make TS directives disciplined
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        {
          "ts-expect-error": "allow-with-description",
          "ts-ignore": "allow-with-description",
          "ts-nocheck": "allow-with-description",
          minimumDescriptionLength: 10
        }
      ],

      // Don't fight Next.js / TS inference
      "@typescript-eslint/explicit-module-boundary-types": "off",

      // Avoid noisy strictness in server actions / route handlers (see overrides below)

      // Keep developer intent clean
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },

  // 4) Next.js App Router: Server Components can be async; relax a few typed rules
  {
    files: ["**/app/**/*.{ts,tsx}", "**/src/app/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/require-await": "off"
    }
  },

  // 5) Route Handlers / API: pragmatic overrides
  {
    files: [
      "**/app/**/route.{ts,tsx}",
      "**/app/**/api/**/*.{ts,tsx}",
      "**/pages/api/**/*.{ts,tsx}"
    ],
    rules: {
      // Route handlers often intentionally return Promises; reduce friction
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off"
    }
  }
];
