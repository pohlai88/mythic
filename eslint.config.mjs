import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";

// Optional plugins (uncomment only if installed)
// import importPlugin from "eslint-plugin-import";
// import jsxA11y from "eslint-plugin-jsx-a11y";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

export default [
  // 0) Ignore generated/large dirs early
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/dist/**",
      "**/build/**",
      "**/.turbo/**",
      "**/.vercel/**",
      "**/coverage/**",
      "**/*.tsbuildinfo",
      "**/.eslintcache",
      "**/eslint-report.*"
    ]
  },

  // 1) Base JS sanity
  js.configs.recommended,

  // 2) NEXT.JS CONSTITUTION (must come before everything else)
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript"
  ),

  // 3) Your repo policy layer (minimal overrides)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    // Optional plugins (only if installed)
    // plugins: {
    //   import: importPlugin,
    //   "jsx-a11y": jsxA11y
    // },

    settings: {
      // CRITICAL: Tell Next ESLint where the apps live (monorepo)
      "@next/next": {
        rootDir: ["apps/docs", "apps/boardroom"]
      }
    },

    rules: {
      // App Router: disable pages-router assumption rule
      "@next/next/no-html-link-for-pages": "off",

      // Keep console usable
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // Basic hygiene
      "prefer-const": "warn",
      "no-var": "error",

      // Optional import ordering (only if eslint-plugin-import is installed)
      // "import/order": [
      //   "warn",
      //   {
      //     "groups": ["builtin", "external", "internal", ["parent", "sibling"], "index", "type"],
      //     "newlines-between": "always",
      //     "alphabetize": { "order": "asc", "caseInsensitive": true },
      //     "pathGroups": [
      //       { "pattern": "react", "group": "external", "position": "before" },
      //       { "pattern": "next/**", "group": "external", "position": "before" },
      //       { "pattern": "@mythic/**", "group": "internal", "position": "before" }
      //     ],
      //     "pathGroupsExcludedImportTypes": ["react", "next"]
      //   }
      // ],

      // Optional a11y extras (only if eslint-plugin-jsx-a11y is installed)
      // "jsx-a11y/alt-text": "warn",
      // "jsx-a11y/anchor-is-valid": [
      //   "error",
      //   {
      //     "components": ["Link"],
      //     "specialLink": ["hrefLeft", "hrefRight"],
      //     "aspects": ["invalidHref", "preferButton"]
      //   }
      // ]
    }
  },

  // 4) Pages router only: if you have pages/ somewhere, enable the rule there
  {
    files: ["**/pages/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "error"
    }
  },

  // 5) Tests: reduce noise
  {
    files: [
      "**/*.test.{ts,tsx,js,jsx}",
      "**/*.spec.{ts,tsx,js,jsx}",
      "**/__tests__/**"
    ],
    rules: {
      "no-console": "off"
    }
  },

  // 6) Config/scripts: allow console
  {
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/next.config.*",
      "scripts/**/*.{js,ts,mjs}"
    ],
    rules: {
      "no-console": "off"
    }
  },

  // 7) Prettier last (disables formatting rules)
  prettier
];
