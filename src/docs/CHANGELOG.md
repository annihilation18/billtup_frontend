# BilltUp Changelog

All notable changes, fixes, and improvements to the BilltUp project.

---

## [1.4.0] - 2025-11-11 - Framework Documentation & Deployment Guides

### Added
- **Framework documentation** - Comprehensive `framework.md` detailing React + Vite architecture
- **Deployment guide** - Complete guide for web hosting (Vercel/Netlify) and mobile apps
- Build tool clarification: Using Vite (not CRA or Next.js)

### Documentation
- Created `DEPLOYMENT_GUIDE.md` with step-by-step instructions for:
  - Web hosting on Vercel (5 minutes)
  - Mobile app setup with Capacitor
  - App store submission process
  - Post-deployment checklists

---

## [1.3.0] - 2025-11-11 - DDoS Protection & Security Hardening

### Added
- **Multi-tier rate limiting**
  - 100 requests/minute for authenticated users
  - 60 requests/minute per IP address
  - 10 login attempts per 15 minutes
- **Automatic IP blocking** after 200 requests/minute
- **Query limits** - Maximum 100 rows per request
- **Response size limits** - 5MB maximum
- **Pagination** for all list endpoints
- **Comprehensive logging** for security events
- **Automatic cleanup** of rate limit store

### Changed
- Frontend API calls updated to handle paginated responses
- All list endpoints now support `page` and `limit` parameters

### Security
- Enterprise-grade DDoS protection
- Protection against database query spam
- Egress quota protection for Supabase

---

## [1.2.0] - 2025-11-05 - Customer Phone Display & Mobile Optimizations

### Fixed - Customer Phone Display
- ✅ Phone number now displays on customer detail screen
- ✅ Complete contact information (email + phone) visible
- ✅ Safe rendering handles missing phone numbers gracefully

### Fixed - Mobile Invoice Preview
- ✅ **iPhone-optimized preview** with dual layout system (desktop vs mobile)
- ✅ **Single-line invoice info** - "INVOICE | INV-001 | Nov 5, 2025" format
- ✅ **Smaller INVOICE heading** - Optimized for iPhone 16 Pro Max and smaller devices
- ✅ **Clear line item labels** - Quantity, Price ($), Total with proper labels
- ✅ **Better placeholders** - Examples guide data entry

### Improved
- Responsive invoice preview adapts to all screen sizes without overlap
- Enhanced mobile UX across all screens

**Reference:** MOBILE_INVOICE_FIX.md, CUSTOMER_PHONE_FIX.md

---

## [1.1.0] - 2025-11-04 - UI Improvements & Feature Enhancements

### Added
- **Edit customer functionality** - Update customer information anytime
- **Phone auto-population** - Phone automatically fills when selecting customer
- **Responsive invoice preview** - Adapts to all screen sizes
- **Enhanced customer display** - Email and phone clearly shown
- **Proper input labels** - All fields have clear, descriptive labels

### Improved
- Better form validation and error messages
- Cleaner UI with consistent spacing
- Mobile-responsive layouts across all screens

**Reference:** ADDITIONAL_IMPROVEMENTS_SUMMARY.md

---

## [1.0.5] - 2025-11-03 - PDF Invoice Improvements

### Fixed
- **Layout issues** - Invoice number no longer overlaps business details
- **Cleaner Bill To section** - Shows customer name only (email removed)
- **Professional formatting** - Standard invoice format throughout

### Added
- **Signature toggle** - Optional signature with Switch control
- Users can turn signature ON/OFF in invoice builder

**Reference:** PDF_IMPROVEMENTS_SUMMARY.md, SIGNATURE_TOGGLE_GUIDE.txt

---

## [1.0.4] - 2025-11-02 - Invoice & Customer Management

### Changed
- **Auto-create customers** - Customers automatically created when creating invoices
- **Required email field** - Customer email now mandatory for all invoices
- **Optional phone field** - Added phone number field for customer records

### Removed
- Redundant search icon from Dashboard header (cleaner UI)

**Reference:** INVOICE_CUSTOMER_UPDATE.md, INVOICE_FEATURES_UPDATE.md

---

## [1.0.3] - 2025-11-01 - Email System Migration

### Changed
- **Switched from Resend to Nodemailer**
- Now supports Gmail, Outlook, or any SMTP service
- Full control over email infrastructure

### Fixed
- No more "API key invalid" errors
- More reliable email delivery
- Better error handling and logging

### Documentation
- Added `NODEMAILER_QUICK_SETUP.txt` for 5-minute setup
- Updated email configuration guides

**Reference:** LATEST_EMAIL_UPDATE.md, EMAIL_MIGRATION_SUMMARY.md, NODEMAILER_SETUP_GUIDE.md

---

## [1.0.2] - 2025-10-31 - PDF Preview Fixes

### Fixed
- **Line items display** - Line items now render correctly in PDF preview
- **Close functionality** - 4 different ways to close the preview:
  1. Close button (top right)
  2. "Back to Invoice" button
  3. Click outside modal
  4. ESC key

### Improved
- Better PDF generation performance
- Cleaner preview modal styling

**Reference:** PDF_PREVIEW_FIX.md, PDF_FIX_CARD.txt, PDF_PREVIEW_VISUAL_GUIDE.txt

---

## [1.0.1] - 2025-10-30 - Password Reset Implementation

### Added
- **Password reset flow**
  - Forgot password screen with email input
  - Reset password screen with new password form
  - Secure token-based reset via Supabase Auth
  - Email notification for password changes

### Security
- Secure password reset tokens
- Email verification required
- Token expiration (1 hour)

**Reference:** PASSWORD_RESET_IMPLEMENTATION.md, PASSWORD_RESET_COMPLETE.md

---

## [1.0.0] - 2025-10-25 - Initial Production Release

### Core Features
- ✅ **User Authentication** - Sign up, login, secure sessions
- ✅ **Business Profile** - Branding, logo, tax settings, bank details
- ✅ **Customer Management** - Full CRUD, search, invoice history
- ✅ **Invoice Builder** - Line items, tax calculation, signature capture
- ✅ **Payment Processing** - Stripe integration (card payments)
- ✅ **Email Delivery** - Automatic invoice PDFs
- ✅ **Analytics** - Sales tracking (MTD/YTD), revenue charts
- ✅ **Refunds** - Full and partial refund support
- ✅ **Settings** - Tax management, business configuration

### Backend (25 API Endpoints)
- Authentication: Login, signup, session management
- Business: Profile CRUD, logo upload, settings
- Customers: Full CRUD operations
- Invoices: Create, read, update, list with filters
- Payments: Process, refund, retrieve
- Email: Send invoices, receipts
- Analytics: Revenue tracking, sales data

### Design System
- Material Design 3 principles
- Custom color palette:
  - Deep Blue: #1E3A8A (primary)
  - Teal: #14B8A6 (secondary/accent)
  - Amber: #F59E0B (highlights)
- Typography: Poppins (headings), Inter (body), Roboto Mono (code)
- 12dp rounded corners throughout
- Fully responsive (phone, tablet, desktop)

### Security
- Bank-level encryption (TLS 1.3)
- PCI DSS compliant (via Stripe)
- Secure authentication (JWT tokens)
- Environment-based secrets
- CORS configured
- Security headers enabled
- Request validation

### Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS v4, shadcn/ui
- **Build Tool:** Vite
- **Backend:** Supabase Edge Functions (Deno), Hono.js
- **Database:** Supabase KV Store
- **Storage:** Supabase Storage
- **Payments:** Stripe API
- **Email:** Resend API (later migrated to Nodemailer)

**Reference:** IMPLEMENTATION_SUMMARY.md, BACKEND_COMPLETION_SUMMARY.md

---

## Earlier Development (Pre-1.0.0)

### Branding Updates
- Logo created with BilltUp name
- Color palette finalized
- Typography system established
- **Reference:** BRANDING_UPDATE.md

### Stripe Connect Implementation
- OAuth integration for connected accounts
- Platform fee structure: 0.6% + $0.20 (platform) + 2.9% + $0.30 (Stripe)
- Total: 3.5% + $0.50 per transaction
- **Reference:** STRIPE_CONNECT_IMPLEMENTATION.md, STRIPE_CONNECT_STATUS.md, STRIPE_SETUP_GUIDE.md

### Database Schema
- Designed for Supabase KV Store
- User profiles, business data, customers, invoices, payments
- **Reference:** DATABASE_SCHEMA.md

### Architecture
- React SPA with Vite
- Component-based routing
- Supabase backend integration
- **Reference:** ARCHITECTURE.md

---

## Bug Fixes Summary

### Email System
- Fixed "API key invalid" errors (migrated to Nodemailer)
- Fixed SMTP configuration issues
- Added error logging for email failures
- **Reference:** EMAIL_FIX_SUMMARY.md, EMAIL_ERROR_DIAGNOSTIC.md, FIX_RESEND_API_ERROR.md, DEBUG_EMAIL_CONSOLE.md, ERROR_LOGGING_ADDED.md, QUICK_EMAIL_FIX.md, FIX_EMAIL_CREDENTIALS.md

### Connection Issues
- Fixed "Failed to Fetch" errors (backend deployment required)
- Fixed CORS issues
- Added connection refused debugging
- **Reference:** FIX_FAILED_TO_FETCH.md, CONNECTION_REFUSED_DEBUG.md

### Package Management
- Fixed package.json dependency issues
- Updated to compatible versions
- **Reference:** PACKAGE_JSON_FIX.md

### UI/Mobile Fixes
- Fixed invoice preview on mobile devices
- Fixed customer phone display
- Fixed PDF preview rendering
- Fixed startup issues
- **Reference:** MOBILE_FIX_CARD.txt, PDF_FIX_CARD.txt, STARTUP_FIX_SUMMARY.md

---

## Testing & Quality Assurance

### Testing Guides Created
- API testing procedures
- Payment testing with Stripe test cards
- Email delivery testing
- PDF generation testing
- **Reference:** TESTING_GUIDE.md, API_TESTING_GUIDE.md, PAYMENT_AND_EMAIL_GUIDE.md, PDF_PREVIEW_TEST_CHECKLIST.md

### Diagnostic Tools
- Email configuration checker
- Connection diagnostics
- Error logging system
- **Reference:** README_DIAGNOSTIC_TOOLS.md, EmailConfigTest.tsx

---

## Documentation Improvements

### Setup Guides
- Quick start guide (10 minutes)
- Deployment guide (step-by-step)
- Email setup guide (Nodemailer)
- Stripe setup guide
- **Reference:** START_HERE.md, QUICK_START.md, DEPLOY_NOW.md, NODEMAILER_QUICK_SETUP.txt

### Feature Documentation
- Sales tracking guide
- Invoice features documentation
- Customer management guide
- **Reference:** SALES_TRACKING_GUIDE.md, INVOICE_FEATURES_UPDATE.md, INVOICE_UPDATE_CARD.txt

### Deployment Documentation
- Production deployment guide
- Mobile conversion guide (Capacitor)
- Capacitor quickstart (30 minutes)
- Security enhancements guide
- Legal compliance guide
- **Reference:** PRODUCTION_DEPLOYMENT_GUIDE.md, MOBILE_CONVERSION_GUIDE.md, CAPACITOR_QUICKSTART.md, SECURITY_ENHANCEMENTS_GUIDE.md, LEGAL_COMPLIANCE_GUIDE.md

### Troubleshooting
- General troubleshooting guide
- Email troubleshooting
- Connection issues
- Deployment checks
- **Reference:** TROUBLESHOOTING.md, EMAIL_TROUBLESHOOTING.md, DEPLOYMENT_CHECK.md

### Quick Reference Cards
- Latest improvements card
- Latest update summary
- Quick fix card
- Quick reference guide
- **Reference:** LATEST_IMPROVEMENTS_CARD.txt, LATEST_UPDATE_SUMMARY.md, QUICK_FIX_CARD.txt, QUICK_REFERENCE.md, RECENT_UPDATES.md

---

## Version History

| Version | Date       | Summary                                    |
|---------|------------|--------------------------------------------|
| 1.4.0   | 2025-11-11 | Framework docs & deployment guides         |
| 1.3.0   | 2025-11-11 | DDoS protection & security hardening       |
| 1.2.0   | 2025-11-05 | Customer phone & mobile optimizations      |
| 1.1.0   | 2025-11-04 | UI improvements & feature enhancements     |
| 1.0.5   | 2025-11-03 | PDF invoice improvements                   |
| 1.0.4   | 2025-11-02 | Invoice & customer management updates      |
| 1.0.3   | 2025-11-01 | Email system migration to Nodemailer       |
| 1.0.2   | 2025-10-31 | PDF preview fixes                          |
| 1.0.1   | 2025-10-30 | Password reset implementation              |
| 1.0.0   | 2025-10-25 | Initial production release                 |

---

## Upcoming Features

### Planned for Next Release
- [ ] Recurring invoices
- [ ] Invoice templates
- [ ] Multi-currency support
- [ ] Advanced reporting dashboard
- [ ] Invoice reminders (automated)

### Under Consideration
- [ ] Mobile apps (iOS/Android) via Capacitor
- [ ] API webhooks for integrations
- [ ] Team/multi-user support
- [ ] White-label customization
- [ ] Payment plans/subscriptions

---

**Note:** This changelog consolidates information from multiple update, fix, and improvement documents. For detailed information about specific features or fixes, refer to the original documentation files referenced in each section.

**Last Updated:** November 11, 2025
