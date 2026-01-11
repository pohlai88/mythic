# Analytics Service Architecture & Purpose

## Executive Summary

The analytics service in the BoardRoom proxy serves a **different purpose** from your existing systems:

| System               | Purpose                                          | Scope            | Data Type         |
| -------------------- | ------------------------------------------------ | ---------------- | ----------------- |
| **Proxy Analytics**  | Infrastructure monitoring, performance, security | All requests     | Technical metrics |
| **Thanos Events**    | Business audit trail (6W1H)                      | Business actions | Domain events     |
| **Vercel Analytics** | User behavior, page views                        | Client-side      | Web analytics     |

---

## Purpose: Three-Layer Analytics Strategy

### Layer 1: Infrastructure Analytics (Proxy Service)

**Purpose**: Monitor infrastructure health, security threats, and performance bottlenecks.

**What to Collect**:
- Request patterns (pathname, method, frequency)
- Response times (latency tracking)
- Error rates (4xx, 5xx responses)
- Security events (invalid requests, suspicious patterns)
- Geographic distribution (IP-based, anonymized)
- User agent analysis (browser/device detection)

**Why Separate from Thanos**:
- Thanos = **Business events** (proposals, approvals, decisions)
- Proxy Analytics = **Infrastructure events** (requests, errors, performance)
- Different retention policies (analytics: 90 days, Thanos: permanent)
- Different access controls (analytics: ops team, Thanos: auditors)

### Layer 2: Business Audit Trail (Thanos Events)

**Purpose**: Immutable forensic audit trail for business decisions.

**What's Already Collected**:
- Who: Actor ID (user_id)
- What: Action type (CREATED, APPROVED, VETOED)
- When: Timestamp
- Where: Source (web, api, webhook)
- Why: Reason for action
- Which: Alternatives considered
- How: Method (UI, API, batch)

**Integration Point**: Proxy analytics can **reference** Thanos events via `proposalId` for correlation.

### Layer 3: User Behavior Analytics (Vercel Analytics)

**Purpose**: Understand user engagement and UI performance.

**What's Already Collected**:
- Page views
- User interactions
- Performance metrics (via Speed Insights)

**Integration Point**: Can correlate with proxy analytics via `x-request-id` header.

---

## Recommended Analytics Service Architecture

### Option 1: Self-Hosted (Recommended for Luxury ERP)

**Why**:
- Full data sovereignty (critical for enterprise clients)
- No third-party dependencies
- Customizable for Luxury ERP needs
- Cost-effective at scale

**Implementation**:
```typescript
// apps/boardroom/src/lib/analytics/service.ts
import { z } from 'zod/v4'

/**
 * Analytics Event Schema
 * Contract-First: All analytics events validated with Zod
 */
export const analyticsEventSchema = z.object({
  // Request metadata
  requestId: z.string().uuid(),
  pathname: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']),
  timestamp: z.string().datetime(),

  // Performance metrics
  responseTime: z.number().optional(), // milliseconds
  statusCode: z.number().int().min(100).max(599).optional(),

  // User context (anonymized)
  userAgent: z.string().optional(),
  ipHash: z.string().optional(), // SHA-256 hash of IP (privacy-preserving)
  country: z.string().length(2).optional(), // ISO 3166-1 alpha-2

  // Security context
  isValidRequest: z.boolean(),
  validationErrors: z.array(z.string()).optional(),

  // Correlation IDs
  proposalId: z.string().uuid().optional(), // Link to Thanos events
  userId: z.string().uuid().optional(), // Link to user (if authenticated)

  // Custom metadata
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>
```

**Storage Options**:
1. **PostgreSQL** (same database, separate schema)
   - Pros: Single database, easy queries
   - Cons: Can bloat main database
   - Best for: Small to medium scale

2. **TimescaleDB** (PostgreSQL extension)
   - Pros: Time-series optimized, automatic retention
   - Cons: Requires extension installation
   - Best for: Large scale, long-term retention

3. **ClickHouse** (separate service)
   - Pros: Excellent for analytics, fast queries
   - Cons: Additional infrastructure
   - Best for: Very large scale, complex analytics

### Option 2: Third-Party Service (Quick Start)

**Options**:
- **Vercel Analytics** (already integrated, but limited to client-side)
- **PostHog** (open-source, self-hostable)
- **Plausible** (privacy-focused, lightweight)
- **Mixpanel** (enterprise-grade, expensive)

**Recommendation**: Use **PostHog** if you need quick setup, but migrate to self-hosted for production.

---

## Enhanced Proxy Analytics Implementation

### Current Implementation Issues

1. **Missing Response Time**: Can't measure performance
2. **No Status Code**: Can't track errors
3. **No Correlation**: Can't link to Thanos events
4. **No Privacy**: IP address sent in plain text

### Recommended Enhancement

```typescript
// apps/boardroom/src/proxy.ts (enhanced analytics)

import { analyticsEventSchema, type AnalyticsEvent } from '@/src/lib/analytics/service'
import { hashIP } from '@/src/lib/analytics/privacy'

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const startTime = Date.now()
  const requestId = crypto.randomUUID()

  // ... existing validation code ...

  // Background task: Enhanced analytics
  if (event) {
    event.waitUntil(
      (async () => {
        try {
          // Wait for response to get status code and timing
          // Note: In proxy, we can't easily get response status
          // Alternative: Log in route handlers with x-request-id correlation

          const analyticsEvent: AnalyticsEvent = {
            requestId,
            pathname: request.nextUrl.pathname,
            method: request.method,
            timestamp: new Date().toISOString(),
            userAgent: request.headers.get('user-agent') || undefined,
            ipHash: hashIP(request.headers.get('x-forwarded-for') || 'unknown'),
            isValidRequest: validationResult.success,
            validationErrors: validationResult.success
              ? undefined
              : validationResult.error.issues.map(i => i.message),
            // Extract proposalId from pathname if present
            proposalId: extractProposalId(request.nextUrl.pathname),
            // Extract userId from headers if authenticated
            userId: request.headers.get('x-user-id') || undefined,
          }

          // Validate with Zod
          const validated = analyticsEventSchema.parse(analyticsEvent)

          // Send to analytics service
          await fetch(process.env.ANALYTICS_ENDPOINT || 'http://localhost:3001/api/analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(process.env.ANALYTICS_API_KEY && {
                Authorization: `Bearer ${process.env.ANALYTICS_API_KEY}`,
              }),
            },
            body: JSON.stringify(validated),
          })
        } catch (error) {
          // Graceful failure - don't affect response
          if (process.env.NODE_ENV === 'development') {
            console.error('Analytics logging failed:', error)
          }
        }
      })()
    )
  }

  // ... rest of proxy code ...
}

function extractProposalId(pathname: string): string | undefined {
  const match = pathname.match(/\/boardroom\/proposal\/([a-f0-9-]+)/i)
  return match?.[1]
}

function hashIP(ip: string): string {
  // SHA-256 hash for privacy (one-way, can't reverse)
  // Implementation: Use Web Crypto API or crypto library
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip))
    .then(hash => Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(''))
    .catch(() => 'unknown')
}
```

---

## Analytics Service Endpoint Implementation

### Route Handler (Next.js)

```typescript
// apps/boardroom/app/api/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { analyticsEventSchema } from '@/src/lib/analytics/service'
import { db } from '@/src/db'
import { analyticsEvents } from '@/src/db/schema/analytics' // New table

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod (Contract-First)
    const result = analyticsEventSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid analytics event', issues: result.error.issues },
        { status: 400 }
      )
    }

    const event = result.data

    // Store in database (or send to external service)
    await db.insert(analyticsEvents).values({
      requestId: event.requestId,
      pathname: event.pathname,
      method: event.method,
      timestamp: new Date(event.timestamp),
      responseTime: event.responseTime,
      statusCode: event.statusCode,
      userAgent: event.userAgent,
      ipHash: event.ipHash,
      isValidRequest: event.isValidRequest,
      validationErrors: event.validationErrors,
      proposalId: event.proposalId,
      userId: event.userId,
      metadata: event.metadata,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Analytics endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Database Schema

```typescript
// apps/boardroom/src/db/schema/analytics.ts

import { pgTable, uuid, varchar, timestamp, integer, boolean, jsonb, text } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod/v4'

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull().unique(),
  pathname: varchar('pathname', { length: 500 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  timestamp: timestamp('timestamp').notNull(),
  responseTime: integer('response_time'), // milliseconds
  statusCode: integer('status_code'),
  userAgent: text('user_agent'),
  ipHash: varchar('ip_hash', { length: 64 }), // SHA-256 hash
  isValidRequest: boolean('is_valid_request').notNull(),
  validationErrors: jsonb('validation_errors'),
  proposalId: uuid('proposal_id'), // Foreign key to proposals
  userId: uuid('user_id'), // Foreign key to users
  metadata: jsonb('metadata'),
})

// Zod schemas
export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents)
export const selectAnalyticsEventSchema = createSelectSchema(analyticsEvents)
```

---

## Integration with Existing Systems

### 1. Correlation with Thanos Events

```typescript
// Query: Get all analytics events for a proposal's lifecycle
const proposalAnalytics = await db
  .select()
  .from(analyticsEvents)
  .where(eq(analyticsEvents.proposalId, proposalId))
  .orderBy(desc(analyticsEvents.timestamp))

// Query: Get Thanos events for the same proposal
const thanosEvents = await db
  .select()
  .from(thanosEvents)
  .where(eq(thanosEvents.proposalId, proposalId))
  .orderBy(desc(thanosEvents.when))

// Correlate: Match by timestamp proximity
const correlated = correlateEvents(proposalAnalytics, thanosEvents)
```

### 2. Integration with Vercel Analytics

```typescript
// Use x-request-id header to correlate
const vercelEvent = {
  requestId: headers().get('x-request-id'),
  // Vercel Analytics data
  page: pathname,
  // ... other Vercel data
}
```

---

## Security & Privacy Considerations

### 1. IP Address Hashing

**Why**: GDPR/CCPA compliance, privacy protection

**Implementation**: SHA-256 hash (one-way, can't reverse)

```typescript
// apps/boardroom/src/lib/analytics/privacy.ts

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

### 2. Data Retention

**Recommendation**:
- **Analytics Events**: 90 days (performance monitoring)
- **Thanos Events**: Permanent (audit trail)
- **Aggregated Metrics**: 1 year (trends)

**Implementation**: Use PostgreSQL `pg_cron` or scheduled job to delete old analytics events.

### 3. Access Control

**Recommendation**:
- **Analytics**: Ops team only (infrastructure monitoring)
- **Thanos**: Auditors, compliance team (business audit)
- **Aggregated Reports**: Executives, product team (business insights)

---

## Environment Variables

Add to `apps/boardroom/src/lib/env.ts`:

```typescript
// Analytics Configuration
ANALYTICS_ENABLED: z
  .string()
  .transform((val) => val === 'true')
  .pipe(z.boolean())
  .optional()
  .default('true')
  .describe('Enable analytics logging'),

ANALYTICS_ENDPOINT: z
  .string()
  .url('ANALYTICS_ENDPOINT must be a valid URL')
  .optional()
  .default('http://localhost:3000/api/analytics')
  .describe('Analytics service endpoint'),

ANALYTICS_API_KEY: z
  .string()
  .min(1, 'ANALYTICS_API_KEY is required if analytics enabled')
  .optional()
  .describe('API key for analytics service authentication'),

ANALYTICS_RETENTION_DAYS: z
  .string()
  .regex(/^\d+$/, 'ANALYTICS_RETENTION_DAYS must be a number')
  .transform((val) => Number.parseInt(val, 10))
  .pipe(z.number().int().min(1).max(365))
  .optional()
  .default('90')
  .describe('Analytics data retention period in days'),
```

---

## Purpose Summary

### What Proxy Analytics Does

1. **Infrastructure Monitoring**
   - Track request patterns (which endpoints are hit most)
   - Monitor error rates (4xx, 5xx responses)
   - Detect anomalies (sudden spikes, unusual patterns)

2. **Performance Analysis**
   - Response time tracking
   - Identify slow endpoints
   - Optimize based on real usage

3. **Security Monitoring**
   - Invalid request patterns (potential attacks)
   - Suspicious IP addresses (rate limiting)
   - Validation failures (malformed requests)

4. **Business Intelligence** (when correlated with Thanos)
   - User journey analysis (how users navigate proposals)
   - Feature usage (which features are used most)
   - Conversion funnels (proposal creation → approval)

### What Proxy Analytics Does NOT Do

1. **Business Audit Trail** → Use Thanos Events
2. **User Behavior Tracking** → Use Vercel Analytics
3. **Personal Data Collection** → IP hashed, no PII

---

## Implementation Priority

### Phase 1: Basic Analytics (Current)
- ✅ Request logging (pathname, method, timestamp)
- ✅ Error tracking (validation failures)
- ⚠️ Missing: Response time, status code

### Phase 2: Enhanced Analytics (Recommended)
- [ ] Add response time tracking
- [ ] Add status code tracking
- [ ] Add IP hashing for privacy
- [ ] Add correlation with Thanos events

### Phase 3: Advanced Analytics (Future)
- [ ] Real-time dashboards
- [ ] Anomaly detection
- [ ] Automated alerts
- [ ] Business intelligence reports

---

## Recommended Next Steps

1. **Add Analytics Schema** to environment variables
2. **Create Analytics Database Table** (separate from business data)
3. **Implement Privacy Functions** (IP hashing)
4. **Create Analytics API Endpoint** (route handler)
5. **Enhance Proxy** with response time and status code
6. **Add Correlation Logic** with Thanos events
7. **Set Up Retention Policy** (automated cleanup)

---

**Status**: Architecture defined, ready for implementation
**Priority**: Medium (infrastructure monitoring, not critical path)
**Dependencies**: None (can be implemented independently)
