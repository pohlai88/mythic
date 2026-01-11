# @mythic/monitoring

Shared Monitoring Utilities

KISS: Simple logging, error tracking, and analytics.

## Usage

```typescript
import { createLogger } from '@mythic/monitoring/logger'
import { trackError } from '@mythic/monitoring/errors'
import { trackEvent } from '@mythic/monitoring/analytics'

// Logger
const logger = createLogger({ domain: 'boardroom' })
logger.info('User logged in', { userId: '123' })

// Error tracking
try {
  // ...
} catch (error) {
  trackError(error, { domain: 'boardroom', userId: '123' })
}

// Analytics
trackEvent('proposal_approved', { proposalId: '456' })
```
