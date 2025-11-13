#!/bin/bash

# BilltUp Auth Endpoints Fix Script
# This script fixes all auth endpoints in the server function

echo "🔧 BilltUp Auth Endpoints Fix Script"
echo "===================================="
echo ""

# Check if file exists
if [ ! -f "supabase/functions/server/index.tsx" ]; then
  echo "❌ Error: supabase/functions/server/index.tsx not found"
  echo "Please run this script from your project root directory"
  exit 1
fi

# Create backup
echo "📦 Creating backup..."
cp supabase/functions/server/index.tsx supabase/functions/server/index.tsx.backup
echo "✅ Backup created: supabase/functions/server/index.tsx.backup"
echo ""

# Count occurrences before fix
BEFORE_COUNT=$(grep -c "await requireAuth(c, async () => {});" supabase/functions/server/index.tsx || echo "0")
echo "📊 Found $BEFORE_COUNT endpoints to fix"
echo ""

# Apply fix using perl
echo "🔨 Applying fixes..."
perl -i -0777 -pe 's/  await requireAuth\(c, async \(\) => \{\}\);\n  const userId = c\.get\('"'"'userId'"'"'\);/  const auth = await checkAuth(c);\n  if ('"'"'error'"'"' in auth) {\n    return c.json({ error: auth.error }, auth.status);\n  }\n  const userId = auth.userId;/g' supabase/functions/server/index.tsx

# Count occurrences after fix  
AFTER_COUNT=$(grep -c "await requireAuth(c, async () => {});" supabase/functions/server/index.tsx || echo "0")
FIXED_COUNT=$((BEFORE_COUNT - AFTER_COUNT))

echo "✅ Fixed $FIXED_COUNT endpoints!"
echo "✅ Remaining broken endpoints: $AFTER_COUNT"
echo ""

if [ "$AFTER_COUNT" -eq "0" ]; then
  echo "🎉 SUCCESS! All auth endpoints have been fixed!"
  echo ""
  echo "Next steps:"
  echo "1. Review changes: git diff supabase/functions/server/index.tsx"
  echo "2. Deploy to Supabase: supabase functions deploy server"
  echo "3. Test the application"
else
  echo "⚠️  Warning: $AFTER_COUNT endpoints still need manual fixing"
  echo "Please review the file manually"
fi

echo ""
echo "Done! ✨"
