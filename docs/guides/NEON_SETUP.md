# Neon Database Setup for The Apex MVP

## Quick Setup with Neon

Neon is a serverless PostgreSQL database. This guide shows how to configure The Apex MVP to use your Neon database.

---

## Step 1: Configure Environment Variables

### 1.1 Create `.env` File

```bash
cp env.example .env
```

### 1.2 Add Your Neon Connection String

Edit `.env` and add your Neon connection string:

```env
DATABASE_URL=postgresql://neondb_owner:npg_1wpavUmJIdV8@ep-hidden-mountain-a1ckcj1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Important**: 
- Keep your connection string secure (don't commit to git)
- Neon requires SSL (`sslmode=require`)
- The connection string includes authentication credentials

---

## Step 2: Verify Connection

### 2.1 Test Connection Script

```bash
pnpm db:setup
```

This will:
- ✅ Connect to your Neon database
- ✅ Check if schema exists
- ✅ List current tables

### 2.2 Test with psql (Optional)

```bash
psql 'postgresql://neondb_owner:npg_1wpavUmJIdV8@ep-hidden-mountain-a1ckcj1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

Or using Neon's simplified hostname:

```bash
psql -h pg.neon.tech -U neondb_owner -d neondb
```

---

## Step 3: Generate and Push Schema

### 3.1 Generate Migrations

```bash
pnpm db:generate
```

This creates migration files in `./drizzle/` based on your schema.

### 3.2 Push Schema to Neon

```bash
pnpm db:push
```

This creates all tables in your Neon database:
- `users`
- `proposals`
- `proposal_stencils`
- `thanos_events`
- `board_comments`
- `proposal_approvers`
- `circles`
- `circle_members`
- `global_config`
- `user_configs`
- `case_whatif_budgets`
- `case_whatif_milestones`
- `broadcasts`
- `broadcast_reads`
- `todos`

---

## Step 4: Verify Tables Created

### 4.1 Using Setup Script

```bash
pnpm db:setup
```

Should show all tables listed.

### 4.2 Using psql

```bash
psql 'postgresql://neondb_owner:npg_1wpavUmJIdV8@ep-hidden-mountain-a1ckcj1m-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' -c "\dt"
```

### 4.3 Using Drizzle Studio

```bash
pnpm db:studio
```

Opens a web UI to browse your database.

---

## Step 5: Start Development Server

```bash
pnpm dev
```

The application will connect to your Neon database automatically.

---

## Neon-Specific Notes

### Connection Pooling

Neon provides two connection modes:

1. **Direct Connection** (for migrations):
   ```
   postgresql://user:pass@ep-xxx-xxx.region.aws.neon.tech/dbname
   ```

2. **Pooled Connection** (for applications):
   ```
   postgresql://user:pass@ep-xxx-xxx-pooler.region.aws.neon.tech/dbname
   ```

Your connection string uses the pooler, which is perfect for applications.

### SSL Requirements

Neon requires SSL connections. The connection string includes:
- `sslmode=require` - Enforces SSL
- `channel_binding=require` - Additional security

### Database Name

Your database is named `neondb`. Make sure your connection string points to this database.

---

## Troubleshooting

### Issue: "SSL connection required"

**Solution**: Ensure your connection string includes `?sslmode=require`

### Issue: "Connection timeout"

**Solutions**:
1. Check your Neon project is active
2. Verify connection string is correct
3. Check firewall/network settings

### Issue: "Database does not exist"

**Solution**: 
1. Log into Neon dashboard
2. Verify database name is `neondb`
3. Check connection string matches

### Issue: "Authentication failed"

**Solutions**:
1. Verify username/password in connection string
2. Check if credentials were rotated in Neon dashboard
3. Regenerate connection string if needed

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Rotate credentials** - If connection string is exposed, rotate in Neon dashboard
3. **Use environment variables** - Don't hardcode connection strings
4. **Limit access** - Use Neon's IP allowlist if possible

---

## Next Steps

Once database is configured:

1. ✅ Run `pnpm db:push` to create tables
2. ✅ Start dev server: `pnpm dev`
3. ✅ Access The Apex: `http://localhost:3000/apex`

---

**Status**: ✅ Neon Configuration Complete
**Last Updated**: 2026-01-10
