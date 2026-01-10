# Supabase Setup Guide

## Local Development

### Prerequisites
- Docker Desktop running
- Supabase CLI installed

### Start Supabase
```powershell
supabase start
```

### MCP Configuration
- MCP endpoint: `http://127.0.0.1:54321/mcp`
- See `SUPABASE_MCP_QUICK_START.md` for details

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

## Database Access

### Server Components
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
```

### Client Components
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

## Common Tasks

### Generate TypeScript Types
```powershell
supabase gen types typescript --local > types/database.ts
```

### Run Migrations
```powershell
supabase migration up
```

### Reset Local Database
```powershell
supabase db reset
```
