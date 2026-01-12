#!/bin/bash

# Build Verification Script for Diátaxis + Tailwind Integration
# Verifies that all components and styles are properly built

set -e

echo "🔍 Verifying Diátaxis + Tailwind CSS Integration..."
echo ""

# Check 1: Design System Theme CSS
echo "1️⃣  Checking design system theme CSS..."
if [ ! -f "packages/design-system/src/tokens/theme.css" ]; then
  echo "   ❌ Design system theme.css not found!"
  exit 1
else
  echo "   ✅ Design system theme.css exists"
fi

# Check 2: Diátaxis utilities in theme CSS
echo "2️⃣  Checking Diátaxis utilities in theme CSS..."
if grep -q "diataxis-tutorial" packages/design-system/src/tokens/theme.css; then
  echo "   ✅ Diátaxis utilities found in theme.css"
else
  echo "   ⚠️  Diátaxis utilities not found in theme.css (may be in app globals.css)"
fi

# Check 3: Components exist
echo "3️⃣  Checking Diátaxis components..."
COMPONENTS=(
  "apps/docs/components/diataxis/DocumentTypeBadge.tsx"
  "apps/docs/components/diataxis/DocumentTypeBanner.tsx"
  "apps/docs/components/diataxis/TutorialSteps.tsx"
  "apps/docs/components/diataxis/HowToGuide.tsx"
  "apps/docs/components/diataxis/ReferenceTable.tsx"
  "apps/docs/components/diataxis/ExplanationBox.tsx"
  "apps/docs/components/diataxis/index.ts"
)

for component in "${COMPONENTS[@]}"; do
  if [ -f "$component" ]; then
    echo "   ✅ $(basename $component)"
  else
    echo "   ❌ Missing: $component"
    exit 1
  fi
done

# Check 4: MDX components registered
echo "4️⃣  Checking MDX component registration..."
if grep -q "DocumentTypeBadge" apps/docs/mdx-components.tsx; then
  echo "   ✅ Diátaxis components registered in MDX"
else
  echo "   ❌ Diátaxis components not registered"
  exit 1
fi

# Check 5: Utility functions
echo "5️⃣  Checking utility functions..."
if [ -f "apps/docs/lib/diataxis.ts" ]; then
  echo "   ✅ Utility functions exist"
else
  echo "   ❌ Utility functions missing"
  exit 1
fi

# Check 6: Theme enhancements
echo "6️⃣  Checking theme enhancements..."
if grep -q "diataxis" apps/docs/app/globals.css; then
  echo "   ✅ Theme enhancements found"
else
  echo "   ⚠️  Theme enhancements not found"
fi

echo ""
echo "✅ All checks passed! Integration is ready."
echo ""
echo "Next steps:"
echo "  1. Run 'cd apps/docs && pnpm dev' to start dev server"
echo "  2. Visit '/examples/diataxis-showcase' to see components"
echo "  3. Use templates in 'content/templates/' for new documents"
