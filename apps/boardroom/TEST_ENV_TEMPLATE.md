# Test Environment Variables Template

Copy these variables to `.env.test` and configure for your test database.

## Option 1: Docker Desktop (Local Testing)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=test_db
DB_SSL=false
```

## Option 2: Neon (Cloud Testing)

```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/test?sslmode=require&channel_binding=require
```

## Option 3: Direct Test Database URLs

```env
# For Docker testing
TEST_DATABASE_URL=postgresql://user:pass@host:port/test_db

# For Neon testing
TEST_NEON_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/test?sslmode=require
```

## Test Configuration

```env
NODE_ENV=test
```

## Usage

1. Copy this template to `.env.test` in `apps/boardroom/`
2. Configure with your test database credentials
3. Run tests: `pnpm test:db`
