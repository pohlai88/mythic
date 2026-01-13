import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  test: {
    globals: true,
    // Use node environment for database tests (faster than jsdom, no DOM overhead)
    environment: "node",
    setupFiles: ["./src/__tests__/db/setup.ts"],

    // Database-specific optimizations
    testTimeout: 30000, // 30s for database operations
    hookTimeout: 10000, // 10s for setup/teardown

    // Test isolation for database connections (Vitest 4 syntax)
    pool: "threads",
    // Isolate database tests to prevent connection conflicts
    isolate: true,
    // Use threads for parallel execution (unit tests)
    threads: true,

    // Separate test suites
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".next", ".turbo", "coverage", "**/*.config.*"],

    // Performance optimizations
    sequence: {
      // Run database tests sequentially to avoid connection conflicts
      concurrent: false,
      // Shuffle tests for better isolation detection
      shuffle: false,
    },

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "**/*.config.*",
        "**/dist/",
        "**/.next/",
        "**/.turbo/",
        "**/coverage/",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/__tests__/",
        "**/scripts/",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
      "@/components": resolve(__dirname, "./components"),
      "@/lib": resolve(__dirname, "./src/lib"),
      "@/app": resolve(__dirname, "./app"),
      "@/src": resolve(__dirname, "./src"),
      "@mythic/nextjs-shared-utils": resolve(__dirname, "../../packages/NextJS/Shared-Utils/src"),
      "@mythic/typescript-shared-types": resolve(__dirname, "../../packages/TypeScript/Shared-Types/src"),
      "@mythic/tailwindcss-v4-design-system": resolve(__dirname, "../../packages/TailwindCSS-V4/Design-System/src"),
      "@mythic/nextjs-domain-core": resolve(__dirname, "../../packages/NextJS/Domain-Core/src"),
      "@mythic/nodejs-performance": resolve(__dirname, "../../packages/NodeJS/Performance/src"),
      "@mythic/nodejs-monitoring": resolve(__dirname, "../../packages/NodeJS/Monitoring/src"),
    },
  },
})
