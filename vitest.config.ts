import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.config.*',
        '**/dist/',
        '**/.next/',
        '**/.turbo/',
        '**/coverage/',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/__tests__/',
        '**/scripts/',
      ],
    },
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      '.turbo',
      'coverage',
      '**/*.config.*',
    ],
  },
  resolve: {
    alias: {
      '@mythic/shared-utils': resolve(__dirname, './packages/shared-utils/src'),
      '@mythic/shared-types': resolve(__dirname, './packages/shared-types/src'),
      '@mythic/design-system': resolve(__dirname, './packages/design-system/src'),
      '@mythic/domain-core': resolve(__dirname, './packages/domain-core/src'),
      '@mythic/performance': resolve(__dirname, './packages/performance/src'),
      '@mythic/monitoring': resolve(__dirname, './packages/monitoring/src'),
    },
  },
})
