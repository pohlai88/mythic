# Neon Connection Binding Test

**Purpose**: Test Neon database connection with channel binding enabled

---

## Connection String Format

Neon requires specific connection parameters for security:

```env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

**Key Parameters**:
- `sslmode=require` - SSL encryption (mandatory)
- `channel_binding=require` - Enhanced security (recommended)

---

## Test Connection

### 1. Configure .env

```env
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. Run Validation

```bash
pnpm validate:db
```

### 3. Expected Output

```
🔌 Validating Direct Database Connection...

   Detected: Neon PostgreSQL (Serverless)

✅ Direct Database Connection Successful!

   Connection Time: XXms
   Database: neondb
   User: neondb_owner
   PostgreSQL Version: PostgreSQL 15.x
   Tables Found: X

✨ Neon Serverless Features:
   - Connection pooling: Enabled
   - Serverless optimized: Yes
   - HTTP-based: Yes
   - Channel binding: ✅ Enabled (secure)
```

---

## Connection String Validation

The validation script checks:

✅ **Pooler Endpoint**
- Automatically converts direct endpoints to pooler
- Example: `ep-xxx-xxx.neon.tech` → `ep-xxx-xxx-pooler.neon.tech`

✅ **SSL Configuration**
- Ensures `sslmode=require` is present
- Required for all Neon connections

✅ **Channel Binding**
- Detects if `channel_binding=require` is present
- Warns if missing (recommended for production)

✅ **Connection Timeout**
- Adds `connect_timeout=10` if not present
- Optimizes for serverless environments

---

## Troubleshooting

### Issue: "Channel binding not enabled"

**Solution**: Add `channel_binding=require` to connection string:
```env
DATABASE_URL=postgresql://...?sslmode=require&channel_binding=require
```

### Issue: "Connection timeout"

**Solutions**:
1. Check Neon dashboard - project may be paused
2. Verify connection string is correct
3. Check network/firewall settings
4. Ensure pooler endpoint is used (not direct)

### Issue: "SSL connection required"

**Solution**: Ensure `sslmode=require` is in connection string:
```env
DATABASE_URL=postgresql://...?sslmode=require
```

### Issue: "Authentication failed"

**Solutions**:
1. Verify credentials in Neon dashboard
2. Check if password was rotated
3. Regenerate connection string from Neon dashboard

---

## Connection String Examples

### With Channel Binding (Recommended)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require
```

### Without Channel Binding (Still Secure)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require
```

### With Additional Parameters
```env
DATABASE_URL=postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require&channel_binding=require&connect_timeout=10
```

---

## Automatic Optimization

The `getDatabaseUrl()` function in `apps/boardroom/src/lib/env.ts` automatically:

1. ✅ Converts direct endpoints to pooler endpoints
2. ✅ Adds `sslmode=require` if missing
3. ✅ Preserves `channel_binding=require` if present
4. ✅ Adds `connect_timeout=10` if missing

**You don't need to manually add these** - the code handles it automatically!

---

## Security Best Practices

1. **Always use SSL**: `sslmode=require` (mandatory)
2. **Enable channel binding**: `channel_binding=require` (recommended)
3. **Use pooler endpoint**: Better for serverless (automatic)
4. **Never commit credentials**: `.env` is in `.gitignore`
5. **Rotate credentials**: If connection string is exposed

---

## Testing Checklist

- [ ] Connection string includes `sslmode=require`
- [ ] Connection string includes `channel_binding=require` (recommended)
- [ ] Using pooler endpoint (`-pooler.neon.tech`)
- [ ] Validation script shows "Channel binding: ✅ Enabled"
- [ ] Connection time < 200ms
- [ ] Can list tables successfully

---

**Ready to test Neon connection!** ✨
