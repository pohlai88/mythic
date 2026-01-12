#!/bin/bash
# Validate imports before commit
# Ensures all imports use path aliases (@/) instead of relative paths

echo "🔍 Validating imports..."

# Run import validation script
pnpm validate:imports

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Import validation failed!"
  echo "Fix relative imports before committing"
  echo "Run: pnpm validate:imports to see violations"
  echo ""
  exit 1
fi

echo "✅ Import validation passed"