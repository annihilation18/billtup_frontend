#!/bin/bash

# BilltUp Backend Deployment Script
# Deploys the Supabase Edge Function with all latest changes

echo "════════════════════════════════════════════════════════════════"
echo "  🚀 BilltUp Backend Deployment"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if we're in the right directory
if [ ! -f "supabase/functions/server/index.tsx" ]; then
    echo "❌ Error: supabase/functions/server/index.tsx not found"
    echo ""
    echo "Make sure you're running this script from the project root directory."
    echo ""
    exit 1
fi

echo "✅ Backend function found"
echo ""

# Deploy the function
echo "📦 Deploying server function to Supabase..."
echo ""

npx supabase functions deploy server

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ✅ Backend Deployed Successfully!"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "🎉 Your backend is now live with:"
    echo "  • Updated email templates (Modern, Classic, Minimal)"
    echo "  • Custom branding support in emails"
    echo "  • Monthly invoice tracking endpoint"
    echo "  • All authentication endpoints"
    echo "  • Payment processing"
    echo "  • Email delivery"
    echo "  • Analytics and reporting"
    echo ""
    echo "Next steps:"
    echo "  1. Refresh your app"
    echo "  2. Send a test invoice email to verify new templates"
    echo "  3. Check that email matches your brand preview"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════════════════════"
    echo "  ❌ Deployment Failed"
    echo "════════════════════════════════════════════════════════════════"
    echo ""
    echo "Common fixes:"
    echo ""
    echo "1. Not logged in?"
    echo "   npx supabase login"
    echo ""
    echo "2. Project not linked?"
    echo "   npx supabase link --project-ref YOUR_PROJECT_REF"
    echo ""
    echo "3. Need to initialize?"
    echo "   npx supabase init"
    echo ""
    exit 1
fi