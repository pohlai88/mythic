# React Version Fix - Cleanup and Reinstall Script
# Run this from the monorepo root

Write-Host "🧹 Cleaning React version mismatch..." -ForegroundColor Cyan

# Step 1: Remove root node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing root node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}

# Step 2: Remove pnpm-lock.yaml
if (Test-Path "pnpm-lock.yaml") {
    Write-Host "Removing pnpm-lock.yaml..." -ForegroundColor Yellow
    Remove-Item -Force "pnpm-lock.yaml" -ErrorAction SilentlyContinue
}

# Step 3: Remove app-level node_modules
$apps = @("apps\docs", "apps\boardroom")
foreach ($app in $apps) {
    $nodeModules = Join-Path $app "node_modules"
    if (Test-Path $nodeModules) {
        Write-Host "Removing $app\node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $nodeModules -ErrorAction SilentlyContinue
    }
}

# Step 4: Remove package-level node_modules
$packages = Get-ChildItem -Path "packages" -Directory -ErrorAction SilentlyContinue
foreach ($pkg in $packages) {
    $nodeModules = Join-Path $pkg.FullName "node_modules"
    if (Test-Path $nodeModules) {
        Write-Host "Removing $($pkg.Name)\node_modules..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force $nodeModules -ErrorAction SilentlyContinue
    }
}

# Step 5: Remove .next cache
$nextCache = "apps\docs\.next"
if (Test-Path $nextCache) {
    Write-Host "Removing apps\docs\.next cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $nextCache -ErrorAction SilentlyContinue
}

Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Next step: Run 'pnpm install' from the monorepo root" -ForegroundColor Cyan
