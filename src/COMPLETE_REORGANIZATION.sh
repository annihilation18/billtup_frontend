#!/bin/bash

# BilltUp Documentation Reorganization Script
# This script completes the documentation reorganization

echo "🚀 Starting BilltUp Documentation Reorganization..."
echo ""

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p docs/deployment
mkdir -p docs/architecture
mkdir -p docs/features
mkdir -p docs/guides

# Note: Files already created:
# - docs/README.md
# - docs/CHANGELOG.md
# - docs/getting-started/QUICKSTART.md
# - docs/getting-started/FRAMEWORK.md

echo "✅ Directory structure created"
echo ""

echo "📝 Files to manually consolidate:"
echo ""
echo "=== /docs/deployment/WEB_HOSTING.md ==="
echo "  Consolidate:"
echo "    - DEPLOYMENT_GUIDE.md"
echo "    - DEPLOY_NOW.md"
echo "    - PRODUCTION_DEPLOYMENT_GUIDE.md"
echo "    - DEPLOYMENT_CHECK.md"
echo ""

echo "=== /docs/deployment/MOBILE_APPS.md ==="
echo "  Consolidate:"
echo "    - CAPACITOR_QUICKSTART.md"
echo "    - MOBILE_CONVERSION_GUIDE.md"
echo ""

echo "=== /docs/architecture/OVERVIEW.md ==="
echo "  Consolidate:"
echo "    - ARCHITECTURE.md"
echo ""

echo "=== /docs/architecture/DATABASE.md ==="
echo "  Consolidate:"
echo "    - DATABASE_SCHEMA.md"
echo ""

echo "=== /docs/architecture/API.md ==="
echo "  Consolidate:"
echo "    - BACKEND_API_SPECIFICATION.md"
echo "    - BACKEND_COMPLETION_SUMMARY.md (as status)"
echo ""

echo "=== /docs/features/PAYMENTS.md ==="
echo "  Consolidate:"
echo "    - STRIPE_CONNECT_IMPLEMENTATION.md"
echo "    - STRIPE_CONNECT_STATUS.md"
echo "    - STRIPE_SETUP_GUIDE.md"
echo "    - Parts of PAYMENT_AND_EMAIL_GUIDE.md"
echo ""

echo "=== /docs/features/EMAIL.md ==="
echo "  Consolidate:"
echo "    - EMAIL_SETUP_GUIDE.md"
echo "    - EMAIL_TROUBLESHOOTING.md"
echo "    - NODEMAILER_SETUP_GUIDE.md"
echo "    - EMAIL_MIGRATION_SUMMARY.md"
echo "    - NODEMAILER_QUICK_SETUP.txt"
echo ""

echo "=== /docs/features/ANALYTICS.md ==="
echo "  Consolidate:"
echo "    - SALES_TRACKING_GUIDE.md"
echo ""

echo "=== /docs/guides/TESTING.md ==="
echo "  Consolidate:"
echo "    - TESTING_GUIDE.md"
echo "    - API_TESTING_GUIDE.md"
echo "    - PDF_PREVIEW_TEST_CHECKLIST.md"
echo ""

echo "=== /docs/guides/SECURITY.md ==="
echo "  Consolidate:"
echo "    - SECURITY.md"
echo "    - SECURITY_ENHANCEMENTS_GUIDE.md"
echo "    - LEGAL_COMPLIANCE_GUIDE.md"
echo ""

echo "=== /docs/guides/TROUBLESHOOTING.md ==="
echo "  Consolidate:"
echo "    - TROUBLESHOOTING.md"
echo "    - EMAIL_TROUBLESHOOTING.md"
echo "    - FIX_FAILED_TO_FETCH.md"
echo "    - CONNECTION_REFUSED_DEBUG.md"
echo "    - README_DIAGNOSTIC_TOOLS.md"
echo ""

echo ""
echo "🎯 Files to DELETE after consolidation (all info in CHANGELOG.md now):"
echo ""
cat << 'EOF'
  - ADDITIONAL_IMPROVEMENTS_SUMMARY.md
  - BRANDING_UPDATE.md
  - CUSTOMER_PHONE_FIX.md
  - DEBUG_EMAIL_CONSOLE.md
  - EMAIL_ERROR_DIAGNOSTIC.md
  - EMAIL_FIX_NOW.md
  - EMAIL_FIX_SUMMARY.md
  - EMAIL_MIGRATION_SUMMARY.md
  - EMAIL_SYSTEM_CHANGE.txt
  - ERROR_LOGGING_ADDED.md
  - FIX_EMAIL_CREDENTIALS.md
  - FIX_RESEND_API_ERROR.md
  - IMPLEMENTATION_SUMMARY.md
  - INVOICE_CUSTOMER_UPDATE.md
  - INVOICE_FEATURES_UPDATE.md
  - INVOICE_UPDATE_CARD.txt
  - LATEST_EMAIL_UPDATE.md
  - LATEST_IMPROVEMENTS_CARD.txt
  - LATEST_UPDATE_SUMMARY.md
  - MOBILE_FIX_CARD.txt
  - MOBILE_INVOICE_FIX.md
  - PACKAGE_JSON_FIX.md
  - PASSWORD_RESET_COMPLETE.md
  - PASSWORD_RESET_IMPLEMENTATION.md
  - PDF_FIX_CARD.txt
  - PDF_IMPROVEMENTS_SUMMARY.md
  - PDF_PREVIEW_FIX.md
  - PDF_PREVIEW_VISUAL_GUIDE.txt
  - QUICK_EMAIL_FIX.md
  - QUICK_FIX_CARD.txt
  - RECENT_UPDATES.md
  - RESEND_QUICK_FIX.txt
  - SIGNATURE_TOGGLE_GUIDE.txt
  - STARTUP_FIX_SUMMARY.md
  - WHERE_TO_ADD_RESEND_KEY.txt
EOF

echo ""
echo "📊 Progress:"
echo "  ✅ Completed: 4/16 docs"
echo "  ⏳ Remaining: 12 docs to create"
echo ""
echo "🔗 See /REORGANIZATION_PLAN.md for complete details"
echo ""
echo "Done! Continue with manual file consolidation or use Figma Make to help."
