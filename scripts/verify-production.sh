#!/bin/bash
set -euo pipefail

# Production Verification Script
# Matches CI DoD gates for local validation
# Reference: NEXTRA_BEST_PRACTICES.md Section 5.1.1

echo "🔍 Running production verification..."

# DoD Gate 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# DoD Gate 2: Lint (hard gate - fails on errors)
echo "🔍 Running linter..."
pnpm lint

# DoD Gate 3: Type check (hard gate - fails on errors)
echo "🔍 Running TypeScript check..."
pnpm type-check

# DoD Gate 4: Build (hard gate - fails on errors)
echo "🏗️  Building project..."
pnpm build

# Optional: Lighthouse CI (if configured)
if command -v lhci &> /dev/null; then
  echo "📊 Running Lighthouse CI..."
  pnpm lighthouse-ci || echo "⚠️  Lighthouse CI not fully configured (optional)"
else
  echo "ℹ️  Lighthouse CI not installed (optional)"
fi

echo "✅ Production verification passed!"
echo ""
echo "Next steps:"
echo "  - Review KPI_REFERENCE.md for performance targets"
echo "  - Check NEXTRA_BEST_PRACTICES.md Section 6 for production checklist"
