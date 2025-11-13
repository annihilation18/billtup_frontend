# Architecture Overview

System architecture and design for BilltUp.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                         │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React App (localhost:5173)                   │ │
│  │                                                        │ │
│  │  Components:                                           │ │
│  │  - LoginScreen, Dashboard, InvoiceBuilder, etc.        │ │
│  │                                                        │ │
│  │  Uses: /utils/api.tsx to make API calls               │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           │ HTTP Fetch                       │
│                           ↓                                  │
└─────────────────────────────────────────────────────────────┘

                            │
                            │ HTTPS
                            ↓

┌─────────────────────────────────────────────────────────────┐
│              SUPABASE CLOUD (Hosted Backend)                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Edge Function: "server"                               │ │
│  │  URL: https://xrgywtdjdlqthpthyxwj.supabase.co/       │ │
│  │       functions/v1/make-server-dce439b6               │ │
│  │                                                        │ │
│  │  Endpoints:                                            │ │
│  │  - POST /auth/signup                                   │ │
│  │  - POST /auth/signin                                   │ │
│  │  - GET  /business                                      │ │
│  │  - POST /customers                                     │ │
│  │  - POST /invoices                                      │ │
│  │  - POST /payments/card                                 │ │
│  │  - etc. (25 total endpoints)                           │ │
│  │                                                        │ │
│  │  File: /supabase/functions/server/index.tsx           │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase Services                                     │ │
│  │                                                        │ │
│  │  1. Database (KV Store)                                │ │
│  │     - business:{userId}                                │ │
│  │     - customers:{userId}                               │ │
│  │     - invoices:{userId}                                │ │
│  │                                                        │ │
│  │  2. Storage (Files)                                    │ │
│  │     - make-dce439b6-logos (business logos)             │ │
│  │     - make-dce439b6-invoices (PDF files)               │ │
│  │                                                        │ │
│  │  3. Auth                                               │ │
│  │     - User authentication                              │ │
│  │     - JWT tokens                                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘

                            │
                            │ API Calls
                            ↓

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Stripe     │  │  Nodemailer  │                        │
│  │              │  │   (SMTP)     │                        │
│  │  - Process   │  │  - Send      │                        │
│  │    payments  │  │    invoice   │                        │
│  │  - Handle    │  │    emails    │                        │
│  │    refunds   │  │    with PDF  │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### Frontend (React SPA)

**Location:** `/components/`

**Main Components:**
- `App.tsx` - Main application router
- `Dashboard.tsx` - Main dashboard with analytics
- `LoginScreen.tsx` - Authentication
- `InvoiceBuilder.tsx` - Create/edit invoices
- `PaymentScreen.tsx` - Process payments
- `CustomersScreen.tsx` - Manage customers
- `SettingsScreen.tsx` - Business settings

**Supporting Components:**
- `ui/` - shadcn/ui components (buttons, cards, inputs, etc.)
- `BilltUpLogo.tsx` - Branding
- `SecurityBadge.tsx` - Security indicators

---

## Data Flow Example: Creating an Invoice

```
1. User fills out invoice form
   ↓

2. Frontend (InvoiceBuilder.tsx)
   calls: invoiceApi.create(invoiceData)
   ↓

3. API Client (/utils/api.tsx)
   fetch('https://.../make-server-dce439b6/invoices', {
     method: 'POST',
     body: JSON.stringify(invoiceData)
   })
   ↓

4. Edge Function (/supabase/functions/server/index.tsx)
   app.post('/make-server-dce439b6/invoices', async (c) => {
     // Validate user authentication
     // Save to database
     // Return invoice
   })
   ↓

5. KV Store (Supabase Database)
   set(`invoices:${userId}`, [...invoices, newInvoice])
   ↓

6. Response back to frontend
   { success: true, invoice: {...} }
   ↓

7. UI updates with new invoice
```

---

## Technology Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **State:** React Hooks (useState, useEffect, useMemo)

### Backend
- **Runtime:** Deno (Supabase Edge Functions)
- **Framework:** Hono.js (lightweight web framework)
- **Database:** Supabase KV Store
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth (JWT)

### External Services
- **Payments:** Stripe API
- **Email:** Nodemailer (SMTP)
- **Hosting:** Vercel (recommended)

---

## Security Model

```
Frontend (Public)
  │
  │ Only has:
  │ - Supabase URL (public)
  │ - Anon Key (limited access)
  │
  ↓ HTTPS only
  │
Backend (Server-side)
  │
  │ Has:
  │ - Service Role Key (full access)
  │ - Stripe Secret Key
  │ - Email credentials
  │
  ↓ Validates every request
  │
Database
  │
  │ User data isolated by userId
  │ Can only access own data
```

**Security Features:**
- ✅ Sensitive keys never in frontend code
- ✅ All API calls authenticated
- ✅ User data scoped by userId
- ✅ Card data goes directly to Stripe (never touches our servers)
- ✅ Bank info encrypted with AES-256-GCM
- ✅ HTTPS enforced everywhere
- ✅ Rate limiting enabled
- ✅ CORS properly configured

---

## Environment Variables

### Frontend (.env.local)

```bash
VITE_SUPABASE_URL=https://xrgywtdjdlqthpthyxwj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend (Supabase Secrets)

```bash
# Auto-configured by Supabase
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY

# You must configure these
STRIPE_SECRET_KEY
EMAIL_HOST
EMAIL_PORT
EMAIL_USER
EMAIL_PASSWORD
```

---

## File Structure

```
billtup/
├── components/          ← Frontend React components
│   ├── Dashboard.tsx   ← UI layer
│   ├── LoginScreen.tsx
│   └── ...
│
├── utils/
│   ├── api.tsx         ← API client (makes HTTP calls)
│   ├── encryption.ts   ← AES-256-GCM encryption
│   └── supabase/
│       ├── client.tsx  ← Supabase frontend client
│       └── info.tsx    ← Project ID & public key
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx    ← Backend API (25 endpoints)
│           └── kv_store.tsx ← Database utilities
│
├── styles/
│   └── globals.css     ← Design tokens & global styles
│
├── docs/               ← All documentation
│
└── vercel.json         ← Frontend hosting config
```

---

## Production Architecture

After deploying to Vercel:

```
User's Device
     ↓
Vercel CDN (Frontend)
  - https://billtup.vercel.app
  - Serves React app
     ↓
Supabase (Backend)
  - Edge Function API
  - Database
  - Storage
     ↓
External Services
  - Stripe (payments)
  - SMTP (emails)
```

All connected, all secure, all scalable! 🚀

---

## Key Features Implemented

### Core Functionality
- ✅ User authentication (signup, login, password reset)
- ✅ Business profile management
- ✅ Customer CRUD operations
- ✅ Invoice creation and management
- ✅ Payment processing (Stripe)
- ✅ Email delivery (invoices, receipts)
- ✅ Sales analytics (MTD/YTD)
- ✅ Refund processing (full & partial)
- ✅ Monthly invoice tracking

### Security Features
- ✅ Bank-level encryption (TLS 1.3)
- ✅ PCI DSS compliant (via Stripe)
- ✅ Secure authentication (JWT tokens)
- ✅ Environment-based secrets
- ✅ CORS configured
- ✅ Security headers enabled
- ✅ Request validation
- ✅ DDoS protection
- ✅ Rate limiting (multi-tier)

---

## Scalability

### Current Setup
- **Database:** KV Store (suitable for small-medium businesses)
- **Storage:** Supabase Storage (suitable for thousands of files)
- **API:** Edge Functions (globally distributed, auto-scaling)

### Migration Path for Growth
1. Move from KV Store to PostgreSQL tables
2. Implement caching (Redis)
3. Add database indexes
4. Implement pagination everywhere
5. CDN for static assets
6. Load balancing (automatic with Edge Functions)

---

## Monitoring & Debugging

### Frontend
- **Browser DevTools:** Console, Network, Application tabs
- **Error Tracking:** Can integrate Sentry
- **Analytics:** Can integrate Google Analytics

### Backend
- **Supabase Dashboard:** View logs, metrics
- **Edge Function Logs:** `npx supabase functions logs server`
- **Database Monitoring:** KV store usage

### External Services
- **Stripe Dashboard:** Payment logs, webhooks
- **Email Provider:** SMTP logs, delivery status

---

## Development Workflow

```bash
# 1. Start local development
npm run dev

# 2. Make changes to code

# 3. Test locally

# 4. Commit changes
git add .
git commit -m "Feature: X"

# 5. Push to GitHub
git push origin main

# 6. Auto-deploy (if using Vercel GitHub integration)
# Or manually deploy:
vercel --prod

# 7. Update backend (if needed)
npx supabase functions deploy server
```

---

## API Request Flow

```
Browser → Supabase Edge Function → Services

1. Browser makes request with JWT token
2. Edge Function validates token
3. Edge Function extracts userId from token
4. Edge Function processes request
5. Data scoped to userId automatically
6. Response sent back to browser
```

**Authentication:**
- All endpoints (except /auth/*) require Authorization header
- Format: `Authorization: Bearer {jwt_token}`
- Token obtained from signup/signin

---

## Success Metrics

**✅ 25 Backend APIs** - Fully implemented and tested  
**✅ 12+ Screens** - Complete user journey  
**✅ PCI Compliant** - Via Stripe integration  
**✅ GDPR Ready** - Data export/deletion  
**✅ Mobile Ready** - Capacitor setup included  
**✅ Production Ready** - Security hardened  
**✅ Well Documented** - Comprehensive docs  
**✅ DDoS Protected** - Multi-tier rate limiting  

---

**Last Updated:** November 11, 2025  
**Version:** 1.5.0  
**Status:** Production Ready
