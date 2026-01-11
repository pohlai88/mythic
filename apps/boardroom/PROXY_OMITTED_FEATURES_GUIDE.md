# Next.js Proxy: Omitted Features Guide

**Purpose**: Explain what features CAN be implemented but were intentionally omitted, the reasoning behind each decision, and when/how to implement them if needed.

**Current Implementation**: Validation-focused proxy with Zod contract-first approach  
**Next.js Version**: 16.1.1

---

## Table of Contents

1. [Background: Why Features Were Omitted](#background)
2. [Omitted Features with Reasoning](#omitted-features)
3. [Implementation Solutions](#implementation-solutions)
4. [Decision Matrix: When to Implement](#decision-matrix)
5. [Code Examples for Each Feature](#code-examples)

---

## Background: Why Features Were Omitted

### Design Philosophy

The current proxy implementation follows a **"separation of concerns"** principle:

1. **Proxy (Edge Runtime)**: Lightweight request validation and security checks
2. **Route Handlers (Node.js Runtime)**: Business logic, authentication, data processing
3. **Server Actions**: Form handling, mutations, complex operations

### Next.js Best Practice Reasoning

According to Next.js documentation:
> "Proxy is meant to be invoked separately of your render code and in optimized cases deployed to your CDN for fast redirect/rewrite handling, you should not attempt relying on shared modules or globals."

**Key Principles**:
- ✅ **DO**: Use proxy for fast, lightweight checks (validation, redirects, rewrites)
- ❌ **DON'T**: Use proxy for heavy business logic, database queries, or complex operations
- ✅ **DO**: Keep proxy at Edge Runtime (fast, close to users)
- ❌ **DON'T**: Add dependencies that require Node.js runtime

---

## Omitted Features with Reasoning

### 1. Authentication & Authorization ❌

**Status**: Intentionally omitted  
**Reasoning**: 
- **Edge Runtime Limitation**: Authentication often requires database lookups, JWT validation, or session checks that are better suited for Node.js runtime
- **Separation of Concerns**: Authentication logic is complex and should be in route handlers or Server Actions where you have full Node.js capabilities
- **Performance**: Edge Runtime is optimized for speed, not complex business logic
- **Current Architecture**: Your route handlers (`src/lib/api/route-handler.ts`) already handle authentication better

**When to Implement in Proxy**:
- ✅ Simple token validation (JWT without DB lookup)
- ✅ Cookie-based session checks (read-only)
- ✅ IP-based blocking
- ❌ Complex RBAC checks
- ❌ Database user lookups
- ❌ Multi-factor authentication

---

### 2. Rate Limiting ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **State Management**: Rate limiting requires state (in-memory cache or external service like Redis)
- **Edge Runtime Limitation**: Edge Runtime has limited state management capabilities
- **Better Alternatives**: Use external services (Vercel Edge Config, Upstash Redis, Cloudflare Rate Limiting)
- **Current Architecture**: Can be added to route handlers or use Next.js built-in rate limiting

**When to Implement in Proxy**:
- ✅ Simple IP-based rate limiting (with external service)
- ✅ Token-based rate limiting (with external cache)
- ❌ Complex per-user rate limiting (requires DB)
- ❌ Dynamic rate limits based on user tier

---

### 3. Request/Response Header Manipulation ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Current Need**: Not required for validation-only proxy
- **Performance**: Header manipulation adds minimal overhead but not needed
- **Future-Proof**: Can be added easily when needed

**When to Implement**:
- ✅ Need to pass validation status to downstream handlers
- ✅ Need to add security headers (X-Frame-Options, CSP, etc.)
- ✅ Need to modify CORS headers
- ✅ Need to add request tracing IDs

---

### 4. Cookie Manipulation ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Current Need**: Not required for validation-only proxy
- **Separation of Concerns**: Cookie management is better handled in route handlers or Server Actions
- **Security**: Cookie manipulation in proxy can be error-prone if not careful

**When to Implement**:
- ✅ Setting session cookies after validation
- ✅ Clearing invalid cookies
- ✅ Adding CSRF tokens
- ✅ Implementing "remember me" functionality

---

### 5. URL Rewrites & Redirects ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Current Need**: Not required for validation-only proxy
- **Next.js Configuration**: Better handled in `next.config.mjs` for static redirects
- **Route Handlers**: Dynamic redirects better handled in route handlers
- **Performance**: Rewrites/redirects add complexity without current benefit

**When to Implement**:
- ✅ A/B testing (redirect based on user segment)
- ✅ Feature flags (rewrite to different pages)
- ✅ Legacy URL migration (redirect old URLs to new)
- ✅ Multi-tenant routing (rewrite based on subdomain)

---

### 6. CORS Headers ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Route Handlers**: CORS is better handled in route handlers (`src/lib/api/route-handler.ts`)
- **Next.js Best Practice**: Route handlers have better CORS support and control
- **Current Architecture**: API routes use route handlers, not proxy

**When to Implement in Proxy**:
- ✅ Need CORS for all routes (including pages)
- ✅ Need dynamic CORS based on origin
- ✅ Need preflight request handling at proxy level
- ❌ API routes only (use route handlers instead)

---

### 7. Background Tasks (waitUntil) ⚠️

**Status**: Partially implemented (parameter accepted, not used)  
**Reasoning**:
- **Current Need**: No analytics/logging requirements yet
- **Performance**: Background tasks don't block response but add complexity
- **Future-Proof**: Infrastructure ready, just needs implementation

**When to Implement**:
- ✅ Analytics tracking (non-blocking)
- ✅ Logging to external services
- ✅ Webhook notifications
- ✅ Cache warming
- ✅ Audit trail logging

---

### 8. Request Body Validation ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Edge Runtime Limitation**: Body parsing in Edge Runtime is limited
- **Route Handlers**: Body validation is better handled in route handlers where you have full control
- **Current Architecture**: Your route handlers already validate bodies with Zod

**When to Implement in Proxy**:
- ✅ Simple body size checks (before parsing)
- ✅ Content-Type validation
- ❌ Full body parsing and validation (use route handlers)

---

### 9. IP-Based Geo-Location ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Current Need**: Not required for BoardRoom app
- **External Service**: Requires external service (Cloudflare, MaxMind, etc.)
- **Performance**: Adds latency if not cached properly

**When to Implement**:
- ✅ Content localization (redirect based on country)
- ✅ Compliance (block certain regions)
- ✅ Analytics (track user locations)

---

### 10. Bot Detection & Blocking ❌

**Status**: Intentionally omitted  
**Reasoning**:
- **Current Need**: Not required for BoardRoom app
- **External Service**: Better handled by CDN (Cloudflare, Vercel Edge Network)
- **Complexity**: Requires ML models or external services

**When to Implement**:
- ✅ High-traffic public pages
- ✅ API abuse prevention
- ✅ Scraping prevention

---

## Implementation Solutions

### Solution 1: Authentication (Simple Token Validation)

**When to Use**: Need lightweight JWT validation without database lookup

```typescript
// src/proxy.ts

import { z } from 'zod/v4'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'
import { verify } from 'jose' // JWT verification library

const authTokenSchema = z.string().regex(/^Bearer\s+.+$/)

export async function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // Skip auth for public routes
  const publicRoutes = ['/login', '/signup', '/api/public']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Validate auth token
  const authHeader = request.headers.get('authorization')
  const tokenValidation = authTokenSchema.safeParse(authHeader)

  if (!tokenValidation.success) {
    return NextResponse.json(
      { error: 'Missing or invalid authorization header' },
      { status: 401 }
    )
  }

  // Verify JWT (lightweight, no DB lookup)
  try {
    const token = authHeader!.split(' ')[1]
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    
    await verify(token, secret)
    
    // Token valid, continue
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
```

**Pros**:
- ✅ Fast (no database lookup)
- ✅ Edge Runtime compatible
- ✅ Works for simple token validation

**Cons**:
- ❌ Doesn't check if token is revoked
- ❌ Doesn't validate user permissions
- ❌ Limited to stateless authentication

---

### Solution 2: Rate Limiting (with External Service)

**When to Use**: Need to prevent API abuse

```typescript
// src/proxy.ts

import { z } from 'zod/v4'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

// Using Upstash Redis for rate limiting (Edge Runtime compatible)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

export async function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // Skip rate limiting for static assets
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Get identifier (IP address or user ID)
  const identifier = request.ip ?? request.headers.get('x-forwarded-for') ?? 'anonymous'
  
  const { success, limit, remaining, reset } = await ratelimit.limit(identifier)

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  // Add rate limit headers to response
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())

  return response
}
```

**Pros**:
- ✅ Edge Runtime compatible (Upstash Redis)
- ✅ Accurate rate limiting
- ✅ Works across multiple instances

**Cons**:
- ❌ Requires external service (cost)
- ❌ Adds latency (network call)

---

### Solution 3: Request Header Forwarding

**When to Use**: Need to pass validation status to downstream handlers

```typescript
// src/proxy.ts

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // ... existing validation code ...

  // Add validation status header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-validated-by-proxy', 'true')
  requestHeaders.set('x-request-id', crypto.randomUUID())

  // Forward headers to downstream handlers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
```

**Pros**:
- ✅ Simple to implement
- ✅ No performance impact
- ✅ Useful for debugging and tracing

**Cons**:
- ❌ Adds header size (minimal)

---

### Solution 4: Cookie Manipulation

**When to Use**: Need to set/clear cookies after validation

```typescript
// src/proxy.ts

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // ... existing validation code ...

  // Check for session cookie
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie) {
    // No session, continue (auth handled elsewhere)
    return NextResponse.next()
  }

  // Validate session (lightweight check)
  // ... validation logic ...

  // Set response cookie
  const response = NextResponse.next()
  
  // Update session expiration
  response.cookies.set('session', sessionCookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return response
}
```

**Pros**:
- ✅ Can manage session cookies
- ✅ Can implement "remember me"
- ✅ Can add CSRF tokens

**Cons**:
- ❌ Cookie manipulation can be error-prone
- ❌ Security considerations (httpOnly, secure, sameSite)

---

### Solution 5: URL Rewrites & Redirects

**When to Use**: Need dynamic routing based on conditions

```typescript
// src/proxy.ts

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // A/B Testing: Redirect based on user segment
  const userSegment = request.cookies.get('user-segment')?.value ?? 'control'
  
  if (pathname === '/pricing' && userSegment === 'variant-a') {
    return NextResponse.rewrite(new URL('/pricing-variant-a', request.url))
  }

  // Legacy URL migration
  if (pathname.startsWith('/old-path/')) {
    const newPath = pathname.replace('/old-path/', '/new-path/')
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Multi-tenant routing
  const hostname = request.nextUrl.hostname
  if (hostname.startsWith('app.')) {
    return NextResponse.rewrite(new URL('/app', request.url))
  }

  return NextResponse.next()
}
```

**Pros**:
- ✅ Fast (Edge Runtime)
- ✅ Good for A/B testing
- ✅ Good for legacy URL migration

**Cons**:
- ❌ Can be complex to maintain
- ❌ Harder to debug

---

### Solution 6: CORS Headers

**When to Use**: Need CORS for all routes (including pages)

```typescript
// src/proxy.ts

const allowedOrigins = [
  'https://myapp.com',
  'https://www.myapp.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean) as string[]

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const origin = request.headers.get('origin')
  const isAllowedOrigin = origin && allowedOrigins.includes(origin)

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // Handle actual requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin!)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}
```

**Pros**:
- ✅ Works for all routes
- ✅ Good for public APIs

**Cons**:
- ❌ Better handled in route handlers for API routes
- ❌ Security considerations (CORS misconfiguration)

---

### Solution 7: Background Tasks (waitUntil)

**When to Use**: Need non-blocking analytics/logging

```typescript
// src/proxy.ts

export function proxy(request: NextRequest, event?: NextFetchEvent) {
  const pathname = request.nextUrl.pathname

  // ... existing validation code ...

  // Background task: Log request for analytics (non-blocking)
  if (event) {
    event.waitUntil(
      fetch('https://analytics.example.com/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`,
        },
        body: JSON.stringify({
          pathname,
          method: request.method,
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ip: request.ip ?? request.headers.get('x-forwarded-for'),
        }),
      }).catch((error) => {
        // Don't throw - background task failures shouldn't affect response
        console.error('Analytics logging failed:', error)
      })
    )
  }

  return NextResponse.next()
}
```

**Pros**:
- ✅ Non-blocking (doesn't slow down response)
- ✅ Good for analytics, logging, webhooks
- ✅ Extends proxy lifetime until task completes

**Cons**:
- ❌ Can't return errors to user (background task)
- ❌ Need to handle failures gracefully

---

## Decision Matrix: When to Implement

| Feature | Implement in Proxy? | Alternative | Priority |
|---------|-------------------|-------------|----------|
| **Simple JWT validation** | ✅ Yes | Route handlers | Medium |
| **Complex authentication** | ❌ No | Route handlers | High |
| **Rate limiting (external service)** | ✅ Yes | Route handlers | High |
| **Rate limiting (database)** | ❌ No | Route handlers | High |
| **Header forwarding** | ✅ Yes | N/A | Low |
| **Cookie manipulation** | ⚠️ Maybe | Route handlers | Medium |
| **URL rewrites** | ✅ Yes | next.config.mjs | Medium |
| **URL redirects** | ✅ Yes | next.config.mjs | Medium |
| **CORS (all routes)** | ✅ Yes | Route handlers | Low |
| **CORS (API only)** | ❌ No | Route handlers | High |
| **Background tasks** | ✅ Yes | N/A | Low |
| **Body validation** | ❌ No | Route handlers | High |
| **Geo-location** | ⚠️ Maybe | CDN/External | Low |
| **Bot detection** | ❌ No | CDN/External | Low |

---

## Recommended Implementation Order

### Phase 1: High-Value, Low-Risk (Do First)
1. ✅ **Background Tasks (waitUntil)** - Analytics/logging
2. ✅ **Request Header Forwarding** - Validation status
3. ✅ **Simple Rate Limiting** - If needed (with external service)

### Phase 2: Medium-Value, Medium-Risk (Do When Needed)
4. ⚠️ **Simple JWT Validation** - If stateless auth needed
5. ⚠️ **Cookie Manipulation** - If session management needed
6. ⚠️ **URL Rewrites/Redirects** - If A/B testing or migration needed

### Phase 3: Low-Value, High-Risk (Avoid Unless Necessary)
7. ❌ **Complex Authentication** - Use route handlers instead
8. ❌ **CORS in Proxy** - Use route handlers instead
9. ❌ **Body Validation** - Use route handlers instead

---

## Current Architecture Recommendation

### ✅ Keep Current Implementation

Your current proxy implementation is **optimal** for a validation-focused proxy:

1. **Lightweight**: Only validates request structure
2. **Fast**: Edge Runtime compatible, no heavy operations
3. **Secure**: Early rejection of invalid requests
4. **Maintainable**: Simple, focused responsibility

### 🔧 Add Only When Needed

Add features only when you have a **specific requirement**:

- **Analytics needed?** → Add `waitUntil` for background logging
- **Header forwarding needed?** → Add request header manipulation
- **Rate limiting needed?** → Add external service integration
- **A/B testing needed?** → Add URL rewrites

### ❌ Don't Add Unnecessarily

Avoid adding features "just because":
- Complex authentication (use route handlers)
- CORS (use route handlers)
- Body validation (use route handlers)
- Database queries (use route handlers)

---

## Summary

**Current Implementation**: ✅ **Optimal for validation-focused proxy**

**Omitted Features**: Intentionally omitted for good reasons:
- Better handled elsewhere (route handlers, Server Actions)
- Not needed for current use case
- Would add complexity without benefit

**When to Add**: Only when you have a specific requirement that:
1. ✅ Benefits from Edge Runtime (fast, close to users)
2. ✅ Doesn't require heavy operations (database, complex logic)
3. ✅ Needs to run before route handlers
4. ✅ Can't be handled better elsewhere

**Next Steps**: 
- ✅ Keep current implementation
- ✅ Add features only when needed
- ✅ Follow Next.js best practices (separation of concerns)

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Next.js Version**: 16.1.1
