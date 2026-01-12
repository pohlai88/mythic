# Neon Database Connection - Quick Setup

## Step 1: Get Your Neon Connection String

1. Go to [Neon Console](https://console.neon.tech)
2. Sign in or create an account
3. Create a new project (or use existing)
4. Go to **Connection Details**
5. Copy the **Connection String** (use the **pooler** endpoint for serverless)

## Step 2: Create/Update .env File

Create a `.env` file in one of these locations:
- **Root**: `c:\AI-BOS\mythic\.env`
- **Boardroom**: `c:\AI-BOS\mythic\apps\boardroom\.env`

Add your Neon connection string:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

**Important**:
- Replace `user`, `password`, `ep-xxx-pooler.region.aws.neon.tech`, and `dbname` with your actual values
- Use the **pooler** endpoint (ends with `-pooler.neon.tech`)
- Include `sslmode=require` for SSL
- Include `channel_binding=require` for enhanced security (recommended)

## Step 3: Test Connection

Run the validation script:

```bash
cd apps/boardroom
pnpm validate:db
```

## Expected Output (Success)

```
✅ Direct Database Connection Successful!

   Connection Time: 120ms
   Database: your_db_name
   User: your_user
   PostgreSQL Version: PostgreSQL 15.x
   Tables Found: X

✨ Neon Serverless Features:
   - Connection pooling: Enabled
   - Serverless optimized: Yes
   - HTTP-based: Yes
   - Channel binding: ✅ Enabled (secure)
```

## Step 4: Create Schema (if needed)

If no tables are found, create the schema:

```bash
pnpm db:push
```

Then validate again:

```bash
pnpm validate:db
```

## Troubleshooting

### Connection Timeout
- Check Neon dashboard - project may be paused
- Verify connection string is correct
- Ensure you're using the pooler endpoint

### SSL Required Error
- Make sure `sslmode=require` is in the connection string

### Authentication Failed
- Verify username and password are correct
- Check if credentials were rotated in Neon dashboard

## Next Steps

Once connected:
1. ✅ Run tests: `pnpm test:db`
2. ✅ Start development: `pnpm dev`
3. ✅ Use database: Your app will automatically use the Neon connection

---

**Ready to connect!** 🚀
