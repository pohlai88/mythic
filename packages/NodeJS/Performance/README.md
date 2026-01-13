# @mythic/performance

Shared Performance Utilities

KISS: Simple performance tracking, caching, and optimization helpers.

## Usage

```typescript
import {
  trackPerformance,
  createPerformanceBudget,
  measurePerformance,
} from "@mythic/performance"
import { createCacheStrategy } from "@mythic/performance/caching"

// Track metrics
trackPerformance("api-response-time", 150, "ms")

// Performance budgets
const budget = createPerformanceBudget([
  { metric: "api-response-time", threshold: 200, unit: "ms" },
])

// Measure execution
const result = await measurePerformance("database-query", async () => {
  return await db.query()
})

// Cache strategy
const cache = createCacheStrategy({ keyPrefix: "api", cacheTime: 300 })
```
