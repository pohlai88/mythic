# System Architecture Overview

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui

## Project Structure

```
with-supabase-app/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── protected/         # Protected routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── auth/             # Auth-related components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client utilities
└── supabase/              # Supabase configuration
```

## Key Patterns

### Authentication Flow
- Uses Supabase Auth with server-side rendering
- Protected routes via middleware
- Client and server Supabase clients separated

### Component Organization
- UI components in `components/ui/`
- Feature components in `components/`
- Shared utilities in `lib/`

### Database Access
- Server components use `lib/supabase/server.ts`
- Client components use `lib/supabase/client.ts`
- Type-safe queries with TypeScript
