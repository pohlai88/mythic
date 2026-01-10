# Supabase MCP (Model Context Protocol) Configuration

## ✅ MCP Endpoint Available

Your local Supabase instance provides an MCP endpoint at:
**http://127.0.0.1:54321/mcp**

---

## 🔧 Configuration Methods

### Method 1: Cursor IDE Settings (Recommended)

MCP servers in Cursor are configured through the IDE settings. Here's how to set it up:

1. **Open Cursor Settings:**
   - Press `Ctrl+,` (or `Cmd+,` on Mac)
   - Or: File → Preferences → Settings

2. **Navigate to MCP Settings:**
   - Search for "MCP" in settings
   - Or go to: Extensions → MCP

3. **Add Supabase MCP Server:**
   - Click "Add MCP Server" or "Configure MCP"
   - Add the following configuration:

```json
{
  "mcpServers": {
    "supabase-local": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server",
        "--url",
        "http://127.0.0.1:54321",
        "--key",
        "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
      ]
    }
  }
}
```

### Method 2: Direct HTTP MCP Connection

If Cursor supports HTTP-based MCP servers:

```json
{
  "mcpServers": {
    "supabase-local": {
      "url": "http://127.0.0.1:54321/mcp",
      "type": "http"
    }
  }
}
```

### Method 3: Environment-Based Configuration

Create a `.cursor/mcp.json` file in your workspace:

```json
{
  "servers": {
    "supabase-local": {
      "url": "http://127.0.0.1:54321/mcp",
      "auth": {
        "type": "api_key",
        "key": "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
      }
    }
  }
}
```

---

## 📋 Configuration Details

### MCP Endpoint Information

| Property | Value |
|----------|-------|
| **MCP URL** | http://127.0.0.1:54321/mcp |
| **Base URL** | http://127.0.0.1:54321 |
| **Publishable Key** | sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH |
| **Secret Key** | sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz |

### Connection Requirements

- ✅ Supabase local must be running (`supabase start`)
- ✅ MCP endpoint must be accessible
- ✅ Cursor IDE must support MCP protocol

---

## 🚀 Setup Steps

### Step 1: Verify Supabase is Running

```powershell
# Check if Supabase is running
supabase status

# If not running, start it
supabase start
```

### Step 2: Test MCP Endpoint

```powershell
# Test MCP endpoint accessibility
curl http://127.0.0.1:54321/mcp

# Or in PowerShell
Invoke-WebRequest -Uri http://127.0.0.1:54321/mcp
```

### Step 3: Configure in Cursor

1. Open Cursor Settings
2. Find MCP configuration section
3. Add Supabase MCP server configuration
4. Restart Cursor if required

### Step 4: Verify Connection

- Check Cursor's MCP status
- Try using AI features that require database context
- Verify MCP resources are available

---

## 🎯 What MCP Enables

With Supabase MCP configured, you can:

1. **Database Queries:**
   - Ask AI to query your database
   - Get schema information
   - Generate SQL queries

2. **Schema Management:**
   - Understand table structures
   - Get column information
   - View relationships

3. **Data Operations:**
   - Insert, update, delete operations
   - Query data with natural language
   - Generate TypeScript types

4. **Migration Help:**
   - Create migrations
   - Understand schema changes
   - Generate migration SQL

---

## 📝 Example Usage

Once configured, you can use natural language queries like:

- "Show me all tables in the database"
- "What's the schema of the users table?"
- "Query all users where email contains @example.com"
- "Generate TypeScript types for my database"
- "Create a migration to add a new column"

---

## 🔍 Verification

### Check MCP Status

1. **In Cursor:**
   - Look for MCP status indicator
   - Check MCP server connections
   - Verify Supabase MCP is connected

2. **Test Connection:**
   - Try asking AI about your database
   - Request schema information
   - Query data through AI

### Troubleshooting

**Issue: MCP not connecting**

1. Verify Supabase is running:
   ```powershell
   supabase status
   ```

2. Check MCP endpoint:
   ```powershell
   curl http://127.0.0.1:54321/mcp
   ```

3. Verify configuration:
   - Check Cursor MCP settings
   - Ensure URL and keys are correct
   - Restart Cursor

**Issue: Authentication errors**

- Verify publishable key is correct
- Check if secret key is needed instead
- Ensure keys match your local instance

**Issue: Connection refused**

- Ensure Supabase is running (`supabase start`)
- Check if port 54321 is accessible
- Verify firewall settings

---

## 🔐 Security Notes

### Local Development

- ✅ Safe to use publishable key locally
- ✅ Secret key should be kept secure
- ✅ MCP endpoint is only accessible locally

### Production

- ⚠️ Never commit keys to git
- ⚠️ Use environment variables
- ⚠️ Restrict MCP access in production

---

## 📚 Additional Resources

- **Supabase MCP Documentation:** https://supabase.com/docs/guides/mcp
- **MCP Protocol Spec:** https://modelcontextprotocol.io
- **Cursor MCP Guide:** Check Cursor documentation

---

## ✅ Configuration Checklist

- [ ] Supabase local is running
- [ ] MCP endpoint is accessible (http://127.0.0.1:54321/mcp)
- [ ] Cursor MCP settings configured
- [ ] Publishable key added to configuration
- [ ] Cursor restarted (if required)
- [ ] MCP connection verified
- [ ] Test query successful

---

## 🎉 Next Steps

1. **Configure MCP in Cursor** using one of the methods above
2. **Test the connection** by asking AI about your database
3. **Start using MCP** for database queries and schema management

---

**MCP Configuration Guide Complete!**

*Configure MCP to enable AI-powered database interactions in Cursor*
