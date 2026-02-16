# BilltUp Architecture

System architecture and design documentation.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR BROWSER                           │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │      React App (localhost:5173 / Vercel)               │ │
│  │  - Components (Dashboard, Invoice, etc.)                │ │
│  │  - Uses /utils/api.tsx for API calls                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           │ HTTPS                            │
│                           ↓                                  │
└─────────────────────────────────────────────────────────────┘

                             │
                             ↓
                             
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE CLOUD (Hosted Backend)                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Edge Function: "server"                               │ │
│  │  URL: /functions/v1/make-server-dce439b6               │ │
│  │                                                        │ │
│  │  25 API Endpoints:                                     │ │
│  │  - POST /auth/signup, /auth/signin                     │ │
│  │  - GET/POST /business, /customers, /invoices           │ │
│  │  - POST /payments/*, /refunds, /webhooks/stripe        │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase Services                                     │ │
│  │  - Database (KV Store Pattern)                         │ │
│  │  - Storage (Logos & PDFs)                              │ │
│  │  - Auth (JWT tokens)                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

                             │
                             ↓
                             
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Stripe     │  │  Nodemailer  │                        │
│  │  - Payments  │  │  - Emails    │                        │
│  │  - Refunds   │  │  - SMTP      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React hooks (useState, useEffect)

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono
- **Database**: PostgreSQL (via Supabase KV Store)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (JWT)

### External Services
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP)
- **Hosting**: Vercel (frontend), Supabase (backend)

---

## Data Flow Example: Creating an Invoice

```
1. User fills invoice form in InvoiceBuilder.tsx
   ↓
2. Frontend calls: invoiceApi.create(invoiceData)
   ↓
3. API Client (/utils/api.tsx) makes fetch request:
   POST /make-server-dce439b6/invoices
   ↓
4. Edge Function (/supabase/functions/server/index.tsx)
   - Validates authentication
   - Generates invoice number
   - Saves to KV store
   ↓
5. KV Store: set(`invoices:${userId}`, [...invoices, newInvoice])
   ↓
6. Response back to frontend: { success: true, invoice: {...} }
   ↓
7. UI updates with new invoice
```

---

## Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend: authApi.signIn(email, password)
   ↓
3. Supabase Auth validates credentials
   ↓
4. Returns JWT token + user data
   ↓
5. Token stored in localStorage
   ↓
6. Subsequent requests include: Authorization: Bearer {token}
   ↓
7. Backend validates token on each request
```

---

## Payment Flow

```
1. User enters card details (Stripe.js in browser)
   ↓
2. Stripe.js tokenizes card → payment method ID
   ↓
3. Frontend sends only token to backend (never card data)
   ↓
4. Backend creates Stripe payment intent
   ↓
5. Stripe processes payment
   ↓
6. Webhook notifies backend of result
   ↓
7. Backend updates invoice status
   ↓
8. Frontend shows success/failure
```

---

## Security Model

### Three-Tier Architecture

```
Frontend (Public)
  │ Only has:
  │ - Supabase URL (public)
  │ - Anon Key (limited access)
  │ - Stripe Publishable Key (public)
  │
  ↓ HTTPS only
  │
Backend (Server-side)
  │ Has:
  │ - Service Role Key (full database access)
  │ - Stripe Secret Key (payment processing)
  │ - Email credentials
  │
  ↓ Validates every request
  │
Database
  │ User data isolated by userId
  │ Can only access own data
```

### Security Features

1. **Authentication**
   - JWT tokens with 1-hour expiration
   - Refresh token rotation
   - Server-side validation

2. **Data Protection**
   - User data scoped by userId
   - Sensitive fields encrypted (AES-256-GCM)
   - PCI DSS Level 1 compliance via Stripe

3. **API Security**
   - CORS configured
   - Rate limiting (planned)
   - Input validation
   - Error sanitization

---

## File Structure

```
billtup/
├── components/
│   ├── dashboard/          # Dashboard UI components
│   ├── website/            # Marketing website
│   ├── ui/                 # Reusable UI (shadcn)
│   └── mockups/            # App mockups
│
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx   # Main API (25 endpoints)
│           └── kv_store.tsx # Database utilities
│
├── utils/
│   ├── api.tsx             # API client
│   ├── dashboard-api.tsx   # Dashboard API client
│   ├── encryption.ts       # Encryption utilities
│   ├── config.ts           # Centralized configuration
│   └── supabase/           # Supabase client
│
├── docs/                   # Documentation
├── styles/                 # Global styles
└── App.tsx                 # Main app component
```

---

## Database Schema (KV Store Pattern)

### Key Naming Convention

```
{entity}:{userId}              - List of entities for user
{entity}:{entityId}            - Individual entity details
```

### Primary Entities

1. **Business Profile**: `business:{userId}`
2. **Customers**: `customers:{userId}` (array)
3. **Invoices**: `invoices:{userId}` (array)
4. **Payments**: `payments:{userId}` (array)

See [DATABASE.md](./DATABASE.md) for complete schema.

---

## API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/signin` - Sign in (via Supabase)
- `POST /auth/request-password-reset` - Password reset email
- `POST /auth/reset-password` - Reset password

### Business
- `GET /business` - Get business profile
- `POST /business` - Create/update profile
- `POST /business/logo` - Upload logo

### Customers
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Invoices
- `GET /invoices` - List invoices
- `POST /invoices` - Create invoice
- `GET /invoices/:id` - Get invoice
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice
- `POST /invoices/send-email` - Email invoice

### Payments
- `POST /payments/create-intent` - Create payment intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/refund` - Process refund

### Webhooks
- `POST /webhooks/stripe` - Stripe webhook handler

### Subscription
- `GET /subscription/status` - Get subscription status
- `POST /subscription/cancel` - Cancel subscription
- `POST /subscription/upgrade` - Upgrade plan

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

---

## Environment Variables

### Frontend (Public - OK to expose)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Backend (Server-Only - Never expose)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Server admin key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook verification
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_FROM` - Sender email

---

## Deployment Architecture

### Development
```
localhost:5173 → Local Supabase project
```

### Production
```
Vercel (Frontend) → Supabase Cloud (Backend) → External Services
```

### Scaling Strategy

**0-100 users**: Free tiers  
**100-1000 users**: Upgrade to Pro plans  
**1000+ users**: Team plans + optimization

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

---

## Performance Considerations

### Current
- React lazy loading for code splitting
- Tailwind CSS for minimal CSS bundle
- Vite for fast builds
- Edge Functions for low latency

### Planned
- Request caching (config ready)
- Database query optimization
- CDN integration
- Image optimization

---

## Monitoring & Logging

### Current
- Console logging in Edge Functions
- Browser console for frontend errors
- Supabase logs for backend

### Planned
- Sentry for error tracking
- Vercel Analytics for performance
- Custom metrics dashboard

---

## Next Steps

- Review [Database Schema](./DATABASE.md)
- See [API Reference](./API_REFERENCE.md)
- Check [Security Guide](./SECURITY.md)
- Read [Deployment Guide](./DEPLOYMENT.md)

---

*Last Updated: November 21, 2025*
