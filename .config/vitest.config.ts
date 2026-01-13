import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./.config/vitest.setup.ts"],
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
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".next", ".turbo", "coverage", "**/*.config.*"],
  },
  resolve: {
    alias: {
      "@mythic/nextjs-shared-utils": resolve(__dirname, "../packages/NextJS/Shared-Utils/src"),
      "@mythic/typescript-shared-types": resolve(__dirname, "../packages/TypeScript/Shared-Types/src"),
      "@mythic/tailwindcss-v4-design-system": resolve(__dirname, "../packages/TailwindCSS-V4/Design-System/src"),
      "@mythic/nextjs-domain-core": resolve(__dirname, "../packages/NextJS/Domain-Core/src"),
      "@mythic/nodejs-performance": resolve(__dirname, "../packages/NodeJS/Performance/src"),
      "@mythic/nodejs-monitoring": resolve(__dirname, "../packages/NodeJS/Monitoring/src"),
    },
  },
})
