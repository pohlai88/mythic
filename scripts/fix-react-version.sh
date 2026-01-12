#!/bin/bash
# React Version Fix - Cleanup and Reinstall Script
# Run this from the monorepo root

echo "🧹 Cleaning React version mismatch..."

# Step 1: Remove root node_modules
if [ -d "node_modules" ]; then
    echo "Removing root node_modules..."
    rm -rf node_modules
fi

# Step 2: Remove pnpm-lock.yaml
if [ -f "pnpm-lock.yaml" ]; then
    echo "Removing pnpm-lock.yaml..."
    rm -f pnpm-lock.yaml
fi

# Step 3: Remove app-level node_modules
for app in apps/docs apps/boardroom; do
    if [ -d "$app/node_modules" ]; then
        echo "Removing $app/node_modules..."
        rm -rf "$app/node_modules"
    fi
done

# Step 4: Remove package-level node_modules
for pkg in packages/*; do
    if [ -d "$pkg/node_modules" ]; then
        echo "Removing $pkg/node_modules..."
        rm -rf "$pkg/node_modules"
    fi
done

# Step 5: Remove .next cache
if [ -d "apps/docs/.next" ]; then
    echo "Removing apps/docs/.next cache..."
    rm -rf apps/docs/.next
fi

echo "✅ Cleanup complete!"
echo ""
echo "📦 Next step: Run 'pnpm install' from the monorepo root"
