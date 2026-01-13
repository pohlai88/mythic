import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Optional plugins (uncomment only if installed)
// import importPlugin from "eslint-plugin-import";
// import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = [
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

  // 2) NEXT.JS CONSTITUTION (Next.js 16 flat config - no FlatCompat needed)
  ...nextVitals,
  ...nextTs,

  // 3) Your repo policy layer (minimal overrides)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    // Optional plugins (only if installed)
    // plugins: {
    //   import: importPlugin,
    //   "jsx-a11y": jsxA11y
    // },

    linterOptions: {
      // Prevent "suppression rot" (dead eslint-disable comments)
      reportUnusedDisableDirectives: "warn"
    },

    settings: {
      // CRITICAL: Tell Next ESLint where the apps live (monorepo)
      "@next/next": {
        rootDir: ["apps/StratonHub", "apps/boardroom"]
      }
    },

    rules: {
      // ====== NEXT.JS PRIORITY (Framework Rules) ======
      // App Router: disable pages-router assumption rule
      "@next/next/no-html-link-for-pages": "off",

      // Next.js Image optimization
      "@next/next/no-img-element": "warn",
      "@next/next/no-unescaped-entities": "warn",

      // Next.js Link usage
      "@next/next/no-before-interactive-script-outside-document": "error",

      // ====== BASIC CODE QUALITY ======
      // Keep console usable
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // Basic hygiene
      "prefer-const": "warn",
      "no-var": "error",
      "no-unused-vars": "off", // Use TypeScript version instead

      // ====== TAILWIND PRIORITY (UI/UX Rules) ======
      // Enforce Tailwind semantic tokens (no hardcoded colors/values)
      "no-restricted-syntax": [
        "warn",
        {
          // Detect hardcoded hex colors (should use Tailwind tokens)
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: "TAILWIND PRIORITY: Use semantic tokens (bg-gold, text-void) instead of hardcoded hex colors. See @rules/033_design-system-constitution.mdc"
        },
        {
          // Detect CSS variable syntax (should use Tailwind utilities)
          selector: "Literal[value=/var\\(--/]",
          message: "TAILWIND PRIORITY: Use Tailwind utilities (bg-gold, text-void) instead of CSS variables. See @rules/033_design-system-constitution.mdc"
        },
        {
          // Detect raw HSL values (should use Tailwind tokens)
          selector: "Literal[value=/\\[hsl\\(/]",
          message: "TAILWIND PRIORITY: Use semantic tokens (bg-gold, text-void) instead of raw HSL values. See @rules/033_design-system-constitution.mdc"
        },
        {
          // Detect inline styles (prefer Tailwind classes)
          selector: "JSXAttribute[name.name='style']",
          message: "TAILWIND PRIORITY: Prefer Tailwind utility classes over inline styles. Use className with Tailwind utilities. See @rules/033_design-system-constitution.mdc"
        }
      ],

      // Enforce Tailwind className usage patterns
      // Note: CSS imports are allowed for global styles and Tailwind imports
      // This rule only warns about CSS modules when Tailwind utilities could be used
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["*.module.css"],
              message: "TAILWIND PRIORITY: Prefer Tailwind utility classes over CSS modules when possible. Use className with Tailwind utilities. See @rules/033_design-system-constitution.mdc"
            }
          ]
        }
      ],

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

  // 5.5) STRATONHUB GOVERNANCE: "Pages must not paint"
  // Enforces Shell + Block architecture. Pages compose, they don't define components.
  // TAILWIND PRIORITY: Enforces Tailwind semantic tokens over CSS variables
  {
    files: ["apps/StratonHub/app/**/page.tsx"],
    rules: {
      // Ban component definitions in pages - they should be in /components
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration",
          message: "GOVERNANCE: Define components in @/components, not in pages. Pages compose Shells + Blocks only."
        },
        {
          selector: "VariableDeclarator[init.type='ArrowFunctionExpression'][init.body.type='JSXElement']",
          message: "GOVERNANCE: Define components in @/components, not in pages. Pages compose Shells + Blocks only."
        },
        {
          // TAILWIND PRIORITY: Enforce semantic tokens
          selector: "Literal[value=/var\\(--/]",
          message: "TAILWIND PRIORITY: Use semantic tokens (text-gold, bg-void), not CSS variable syntax. See @rules/033_design-system-constitution.mdc"
        },
        {
          // TAILWIND PRIORITY: Enforce semantic tokens
          selector: "Literal[value=/--color-/]",
          message: "TAILWIND PRIORITY: Use semantic tokens (text-gold, bg-void), not CSS variable syntax. See @rules/033_design-system-constitution.mdc"
        },
        {
          // TAILWIND PRIORITY: Enforce semantic tokens
          selector: "Literal[value=/\\[hsl/]",
          message: "TAILWIND PRIORITY: Use semantic tokens (text-gold, bg-void), not raw HSL values. See @rules/033_design-system-constitution.mdc"
        }
      ],
      // Ban direct imports from internal component paths
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/shells/*", "@/components/blocks/*"],
              message: "GOVERNANCE: Import from @/components only, not internal paths."
            }
          ]
        }
      ]
    }
  },

  // 6) Config/scripts: allow console
  {
    files: [
      "**/*.config.{js,mjs,ts}",
      "**/next.config.*",
      "**/webpack.config.*",
      "scripts/**/*.{js,ts,mjs}"
    ],
    rules: {
      "no-console": "off",
      // Webpack config files often use require() and dynamic imports
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off"
    }
  },

  // 7) UX FREEZE ZONES: Protected patterns requiring ADR approval
  // See: apps/StratonHub/docs/governance/UX_RATIFICATION_PROCESS.md
  {
    files: [
      // Frozen files - require ADR to modify
      "apps/StratonHub/store/use-reader-prefs.ts",
      "apps/StratonHub/hooks/use-scroll-memory.ts"
    ],
    rules: {
      // Warn developers these are governance-protected files
      "no-warning-comments": [
        "warn",
        {
          terms: ["TODO", "FIXME", "HACK"],
          location: "anywhere"
        }
      ]
    }
  },

  // 7.1) UX FREEZE: Store client-only enforcement
  // Zustand stores must NEVER be imported in Server Components
  {
    files: ["apps/StratonHub/**/*.{ts,tsx}"],
    ignores: [
      "apps/StratonHub/**/*.test.{ts,tsx}",
      "apps/StratonHub/store/**/*"
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/store",
              message: "FREEZE ZONE: Zustand stores are CLIENT-ONLY. Only import in 'use client' components. See docs/governance/UX_REGRESSION_CHECKLIST.md"
            },
            {
              name: "@/store/use-reader-prefs",
              message: "FREEZE ZONE: Reader prefs store is CLIENT-ONLY. Only import in 'use client' components."
            }
          ]
        }
      ]
    }
  },

  // 7.2) UX FREEZE: Shell escape hatch prevention
  // Shells must not accept className or style props (no escape hatches)
  {
    files: ["apps/StratonHub/components/shells/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "TSPropertySignature[key.name='className']",
          message: "FREEZE ZONE: Shells must not accept className prop. This creates escape hatches. See docs/governance/REFUSE_LIST.md"
        },
        {
          selector: "TSPropertySignature[key.name='style']",
          message: "FREEZE ZONE: Shells must not accept style prop. This creates escape hatches. See docs/governance/REFUSE_LIST.md"
        }
      ]
    }
  },

  // 7.3) UX FREEZE: Refuse List pattern detection
  // Detect patterns that match refused features
  // TAILWIND PRIORITY: UI/UX patterns must respect Tailwind design system
  {
    files: ["apps/StratonHub/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "JSXElement[openingElement.name.name='Toast']",
          message: "REFUSE LIST: Toast notifications are refused. They interrupt reading flow. See docs/governance/REFUSE_LIST.md"
        },
        {
          selector: "JSXElement[openingElement.name.name='Modal'][openingElement.attributes.length>0]",
          message: "REFUSE LIST: Review Modal usage. Modals interrupt reading flow. See docs/governance/REFUSE_LIST.md"
        },
        {
          selector: "CallExpression[callee.property.name='scrollTo'][arguments.length>0]",
          message: "REFUSE LIST: Review scrollTo usage. 'Scroll to top' buttons are refused. See docs/governance/REFUSE_LIST.md"
        }
      ]
    }
  },

  // 7.4) TAILWIND PRIORITY: Enforce Tailwind best practices for UI/UX
  // This section ensures Tailwind patterns take priority over any conflicting UI/UX rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Enforce mobile-first responsive design (Tailwind best practice)
      "no-restricted-syntax": [
        "warn",
        {
          // Detect desktop-first responsive patterns (should be mobile-first)
          selector: "JSXAttribute[name.name='className'] > JSXExpressionContainer > TemplateLiteral[expressions.length>0]",
          message: "TAILWIND PRIORITY: Use mobile-first responsive design. Start with base classes, then add sm:, md:, lg: variants. See @rules/020_docs-tailwind-v4-best-practices.mdc"
        }
      ]
    }
  },

  // 8) Prettier last (disables formatting rules)
  prettier
];

export default eslintConfig;
