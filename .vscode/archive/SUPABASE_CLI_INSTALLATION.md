# Supabase CLI Installation Guide

## ⚠️ Important: Correct Installation Method

The Supabase CLI **cannot** be installed globally using `npm install -g supabase`.

The error message you saw:

```
Installing Supabase CLI as a global module is not supported.
Please use one of the supported package managers
```

---

## ✅ Correct Installation Methods for Windows

### Method 1: Using npm with @supabase/cli (Recommended)

**Correct command:**

```powershell
npm install -g @supabase/cli
```

**Note:** Use `@supabase/cli` (with @ prefix), not just `supabase`

**Verify installation:**

```powershell
supabase --version
```

### Method 2: Using Scoop (Windows Package Manager)

If you have Scoop installed:

1. **Add Supabase bucket:**

   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   ```

2. **Install Supabase CLI:**

   ```powershell
   scoop install supabase
   ```

3. **Verify installation:**
   ```powershell
   supabase --version
   ```

### Method 3: Using Chocolatey

If you have Chocolatey installed:

```powershell
choco install supabase
```

### Method 4: Direct Download (Manual)

1. Download the latest release from: https://github.com/supabase/cli/releases
2. Extract and add to PATH
3. Verify: `supabase --version`

---

## 🔧 Installation Steps (Recommended Method)

### Step 1: Install via npm

Open PowerShell and run:

```powershell
npm install -g @supabase/cli
```

### Step 2: Verify Installation

```powershell
supabase --version
```

You should see output like:

```
supabase CLI version X.X.X
```

### Step 3: Login to Supabase

```powershell
supabase login
```

This will open your browser to authenticate.

### Step 4: Link Your Project

Navigate to your project directory and link it:

```powershell
cd C:\AI-BOS\eBOM\with-supabase-app
supabase link --project-ref your-project-ref
```

---

## 📋 Common Issues & Solutions

### Issue 1: "command not found" after installation

**Solution:**

1. Close and reopen PowerShell/VS Code terminal
2. Verify npm global bin is in PATH:
   ```powershell
   npm config get prefix
   ```
3. Add to PATH if needed:
   ```powershell
   $env:Path += ";$(npm config get prefix)"
   ```

### Issue 2: Permission errors

**Solution:**
Run PowerShell as Administrator, then:

```powershell
npm install -g @supabase/cli
```

### Issue 3: Node.js version issues

**Solution:**
Ensure you have Node.js 18+ installed:

```powershell
node --version
```

If outdated, download from: https://nodejs.org/

---

## ✅ Verification Checklist

After installation, verify:

- [ ] `supabase --version` shows version number
- [ ] `supabase --help` shows help menu
- [ ] `supabase login` works (opens browser)
- [ ] Can run Supabase commands in your project

---

## 🎯 Quick Start Commands

Once installed, you can use:

```powershell
# Check version
supabase --version

# Login to Supabase
supabase login

# Initialize Supabase in project
supabase init

# Start local Supabase (requires Docker)
supabase start

# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF

# Generate TypeScript types
supabase gen types typescript --linked > types/supabase.ts
```

---

## 📚 Additional Resources

- **Official Docs:** https://supabase.com/docs/guides/cli
- **GitHub:** https://github.com/supabase/cli
- **Installation Guide:** https://supabase.com/docs/guides/cli/getting-started

---

## ⚠️ Important Notes

1. **Don't use:** `npm install -g supabase` ❌
2. **Use instead:** `npm install -g @supabase/cli` ✅
3. **Docker required** for local development (`supabase start`)
4. **Node.js 18+** required

---

_Use the correct installation method to avoid errors!_
