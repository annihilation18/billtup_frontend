# BilltUp Auth Endpoints Fix Script (PowerShell)
# This script fixes all auth endpoints in the server function

Write-Host "🔧 BilltUp Auth Endpoints Fix Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if file exists
if (-not (Test-Path "supabase\functions\server\index.tsx")) {
    Write-Host "❌ Error: supabase\functions\server\index.tsx not found" -ForegroundColor Red
    Write-Host "Please run this script from your project root directory" -ForegroundColor Red
    exit 1
}

# Create backup
Write-Host "📦 Creating backup..." -ForegroundColor Yellow
Copy-Item "supabase\functions\server\index.tsx" "supabase\functions\server\index.tsx.backup"
Write-Host "✅ Backup created: supabase\functions\server\index.tsx.backup" -ForegroundColor Green
Write-Host ""

# Read file content
$content = Get-Content "supabase\functions\server\index.tsx" -Raw

# Count occurrences before fix
$beforeMatches = ([regex]::Matches($content, "await requireAuth\(c, async \(\) => \{\}\);")).Count
Write-Host "📊 Found $beforeMatches endpoints to fix" -ForegroundColor Yellow
Write-Host ""

# Define patterns
$oldPattern = '  await requireAuth\(c, async \(\) => \{\}\);[\r\n]+  const userId = c\.get\(''userId''\);'
$newPattern = @'
  const auth = await checkAuth(c);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }
  const userId = auth.userId;
'@

# Apply fix
Write-Host "🔨 Applying fixes..." -ForegroundColor Yellow
$content = $content -replace $oldPattern, $newPattern

# Save file
Set-Content "supabase\functions\server\index.tsx" $content

# Count occurrences after fix
$afterContent = Get-Content "supabase\functions\server\index.tsx" -Raw
$afterMatches = ([regex]::Matches($afterContent, "await requireAuth\(c, async \(\) => \{\}\);")).Count
$fixedCount = $beforeMatches - $afterMatches

Write-Host "✅ Fixed $fixedCount endpoints!" -ForegroundColor Green
Write-Host "✅ Remaining broken endpoints: $afterMatches" -ForegroundColor Green
Write-Host ""

if ($afterMatches -eq 0) {
    Write-Host "🎉 SUCCESS! All auth endpoints have been fixed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review changes: git diff supabase\functions\server\index.tsx" -ForegroundColor White
    Write-Host "2. Deploy to Supabase: supabase functions deploy server" -ForegroundColor White
    Write-Host "3. Test the application" -ForegroundColor White
} else {
    Write-Host "⚠️  Warning: $afterMatches endpoints still need manual fixing" -ForegroundColor Yellow
    Write-Host "Please review the file manually" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done! ✨" -ForegroundColor Cyan
