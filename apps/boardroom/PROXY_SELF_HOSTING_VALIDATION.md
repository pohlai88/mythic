# Proxy Self-Hosting Validation Report

**Date**: 2026-01-11
**Reference**: `apps/boardroom/docs/analytics-service-architecture.md`
**Status**: ⚠️ **Needs Updates for Self-Hosting Compliance**

---

## Executive Summary

The current proxy implementation has **basic analytics** but is **missing critical features** required for self-hosting according to the analytics service architecture document. This report identifies gaps and provides implementation guidance.

---

## Compliance Status: **40%** ⚠️

### ✅ Implemented (40%)

| Feature                      | Status | Notes                                  |
| ---------------------------- | ------ | -------------------------------------- |
| Basic analytics logging      | ✅      | Uses `waitUntil` for background tasks  |
| Request metadata             | ✅      | pathname, method, timestamp, userAgent |
| Environment variable support | ✅      | ANALYTICS_ENDPOINT, ANALYTICS_API_KEY  |
| Non-blocking execution       | ✅      | Uses `event.waitUntil()`               |
| Error handling               | ✅      | Graceful failure handling              |

### ❌ Missing (60%)

| Feature                             | Status | Priority | Impact                          |
| ----------------------------------- | ------ | -------- | ------------------------------- |
| **Zod schema validation**           | ❌      | CRITICAL | No contract-first validation    |
| **IP hashing (privacy)**            | ❌      | CRITICAL | GDPR/CCPA violation risk        |
| **requestId in payload**            | ❌      | HIGH     | Can't correlate events          |
| **isValidRequest flag**             | ❌      | HIGH     | Can't track validation failures |
| **validationErrors array**          | ❌      | HIGH     | Can't debug validation issues   |
| **proposalId extraction**           | ❌      | MEDIUM   | Can't correlate with Thanos     |
| **userId extraction**               | ❌      | MEDIUM   | Can't track user behavior       |
| **Response time tracking**          | ❌      | MEDIUM   | Can't measure performance       |
| **Status code tracking**            | ❌      | MEDIUM   | Can't track errors              |
| **Environment variables in env.ts** | ❌      | HIGH     | No type safety                  |
| **Analytics service utilities**     | ❌      | HIGH     | No reusable functions           |
| **Database schema**                 | ❌      | MEDIUM   | Can't store events              |

---

## Detailed Gap Analysis

### 1. Missing Zod Schema Validation ❌

**Current Implementation**:
```typescript
// No schema validation - just JSON.stringify
body: JSON.stringify({
  pathname: request.nextUrl.pathname,
  method: request.method,
  timestamp: new Date().toISOString(),
  userAgent: request.headers.get('user-agent'),
  ip: request.headers.get('x-forwarded-for') ?? 'unknown',
})
```

**Required (from architecture doc)**:
```typescript
const analyticsEventSchema = z.object({
  requestId: z.string().uuid(),
  pathname: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']),
  timestamp: z.string().datetime(),
  responseTime: z.number().optional(),
  statusCode: z.number().int().min(100).max(599).optional(),
  userAgent: z.string().optional(),
  ipHash: z.string().optional(), // SHA-256 hash
  isValidRequest: z.boolean(),
  validationErrors: z.array(z.string()).optional(),
  proposalId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})
```

**Impact**:
- ❌ No type safety
- ❌ No runtime validation
- ❌ Can't catch malformed events
- ❌ Violates contract-first approach

---

### 2. Missing IP Hashing (Privacy Violation) ❌

**Current Implementation**:
```typescript
ip: request.headers.get('x-forwarded-for') ?? 'unknown', // ❌ Plain text IP
```

**Required (from architecture doc)**:
```typescript
ipHash: hashIP(request.headers.get('x-forwarded-for') || 'unknown'), // ✅ SHA-256 hash
```

**Impact**:
- ❌ **GDPR/CCPA violation** - storing PII (IP addresses)
- ❌ Privacy risk for users
- ❌ Legal compliance issue

---

### 3. Missing requestId ❌

**Current Implementation**:
- requestId is generated but **not included in analytics payload**
- Only set in headers, not sent to analytics service

**Required**:
```typescript
requestId: crypto.randomUUID(), // Must be in analytics payload
```

**Impact**:
- ❌ Can't correlate analytics events with request headers
- ❌ Can't link to Vercel Analytics
- ❌ Can't trace request flow

---

### 4. Missing Validation Status ❌

**Current Implementation**:
- Validation result exists but **not included in analytics**

**Required**:
```typescript
isValidRequest: validationResult.success,
validationErrors: validationResult.success
  ? undefined
  : validationResult.error.issues.map(i => i.message),
```

**Impact**:
- ❌ Can't track validation failures
- ❌ Can't monitor security threats
- ❌ Can't debug validation issues

---

### 5. Missing Correlation IDs ❌

**Current Implementation**:
- No proposalId or userId extraction

**Required**:
```typescript
proposalId: extractProposalId(request.nextUrl.pathname),
userId: request.headers.get('x-user-id') || undefined,
```

**Impact**:
- ❌ Can't correlate with Thanos events
- ❌ Can't track user behavior
- ❌ Can't analyze proposal lifecycle

---

### 6. Missing Performance Metrics ❌

**Current Implementation**:
- No response time or status code tracking

**Required**:
```typescript
responseTime: z.number().optional(), // milliseconds
statusCode: z.number().int().min(100).max(599).optional(),
```

**Impact**:
- ❌ Can't measure performance
- ❌ Can't identify slow endpoints
- ❌ Can't track error rates

---

### 7. Missing Environment Variables in env.ts ❌

**Current Implementation**:
- Uses `process.env.ANALYTICS_ENDPOINT` directly (no validation)

**Required** (from architecture doc):
```typescript
ANALYTICS_ENABLED: z.boolean().optional().default(true),
ANALYTICS_ENDPOINT: z.string().url().optional().default('http://localhost:3000/api/analytics'),
ANALYTICS_API_KEY: z.string().min(1).optional(),
ANALYTICS_RETENTION_DAYS: z.number().int().min(1).max(365).optional().default(90),
```

**Impact**:
- ❌ No type safety
- ❌ No runtime validation
- ❌ No default values
- ❌ Can't enable/disable analytics

---

### 8. Missing Analytics Service Utilities ❌

**Required Files**:
- `src/lib/analytics/service.ts` - Zod schema and types
- `src/lib/analytics/privacy.ts` - IP hashing function
- `src/lib/analytics/utils.ts` - proposalId extraction, etc.

**Impact**:
- ❌ No reusable utilities
- ❌ Code duplication risk
- ❌ Harder to maintain

---

### 9. Missing Database Schema ❌

**Required** (from architecture doc):
- `src/db/schema/analytics.ts` - Analytics events table
- Route handler at `app/api/analytics/route.ts`

**Impact**:
- ❌ Can't store analytics events
- ❌ Can't query historical data
- ❌ Can't build dashboards

---

## Self-Hosting Requirements Checklist

### ✅ Infrastructure Requirements

| Requirement                 | Status | Notes                                  |
| --------------------------- | ------ | -------------------------------------- |
| Self-hosted endpoint        | ✅      | Can use `/api/analytics` route handler |
| No third-party dependencies | ✅      | Uses internal API endpoint             |
| Data sovereignty            | ⚠️      | Need database schema                   |
| Customizable                | ✅      | Can customize as needed                |

### ❌ Data Requirements

| Requirement                     | Status | Notes                                  |
| ------------------------------- | ------ | -------------------------------------- |
| Privacy-preserving (IP hashing) | ❌      | **CRITICAL** - Currently violates GDPR |
| Contract-first validation       | ❌      | **CRITICAL** - No Zod schema           |
| Correlation with Thanos         | ❌      | Missing proposalId/userId              |
| Performance tracking            | ❌      | Missing response time/status code      |

### ❌ Implementation Requirements

| Requirement                     | Status | Notes                 |
| ------------------------------- | ------ | --------------------- |
| Environment variables in env.ts | ❌      | No type safety        |
| Analytics service utilities     | ❌      | No reusable functions |
| Database schema                 | ❌      | Can't store events    |
| API endpoint                    | ❌      | No route handler      |

---

## Recommended Implementation Plan

### Phase 1: Critical Fixes (Privacy & Validation) 🔴

**Priority**: CRITICAL - Must fix before production

1. ✅ Add IP hashing function (`src/lib/analytics/privacy.ts`)
2. ✅ Add Zod schema validation (`src/lib/analytics/service.ts`)
3. ✅ Update proxy to use schema and hash IP
4. ✅ Add environment variables to `env.ts`

**Estimated Time**: 1-2 hours
**Risk**: High if not fixed (GDPR violation)

---

### Phase 2: Core Features (Correlation & Tracking) 🟡

**Priority**: HIGH - Needed for full functionality

5. ✅ Add requestId to analytics payload
6. ✅ Add isValidRequest and validationErrors
7. ✅ Add proposalId extraction
8. ✅ Add userId extraction
9. ✅ Add response time tracking (if possible in proxy)

**Estimated Time**: 2-3 hours
**Risk**: Medium (missing features)

---

### Phase 3: Infrastructure (Storage & API) 🟢

**Priority**: MEDIUM - Can be added later

10. ✅ Create database schema (`src/db/schema/analytics.ts`)
11. ✅ Create API endpoint (`app/api/analytics/route.ts`)
12. ✅ Add status code tracking (in route handlers)

**Estimated Time**: 3-4 hours
**Risk**: Low (can use external service temporarily)

---

## Compliance Score Breakdown

| Category                      | Score   | Weight   | Weighted Score |
| ----------------------------- | ------- | -------- | -------------- |
| **Privacy & Security**        | 0%      | 30%      | 0.0%           |
| **Contract-First Validation** | 0%      | 25%      | 0.0%           |
| **Correlation & Tracking**    | 20%     | 20%      | 4.0%           |
| **Performance Metrics**       | 0%      | 15%      | 0.0%           |
| **Infrastructure**            | 50%     | 10%      | 5.0%           |
| **TOTAL**                     | **40%** | **100%** | **9.0%**       |

**Current Compliance**: **9%** (Weighted) / **40%** (Simple Average)

---

## Next Steps

1. **Immediate**: Fix privacy violation (IP hashing) - **CRITICAL**
2. **Immediate**: Add Zod schema validation - **CRITICAL**
3. **Short-term**: Add correlation IDs and validation status
4. **Medium-term**: Add database schema and API endpoint
5. **Long-term**: Add performance metrics and dashboards

---

**Status**: ⚠️ **Not Production Ready** - Critical privacy and validation issues must be fixed before deployment.

**Recommendation**: Implement Phase 1 (Critical Fixes) immediately, then proceed with Phase 2 and Phase 3.
