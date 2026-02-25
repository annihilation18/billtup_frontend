# BilltUp Architecture

System architecture and design documentation.

## System Overview

```
+---------------------------------------------------------------+
|                        CLIENT TIER                            |
|                                                               |
|  +-------------------------+  +----------------------------+  |
|  |   Web Browser           |  |   Mobile App               |  |
|  |   React 18 + TypeScript |  |   Capacitor 8              |  |
|  |   Vite + Tailwind v4    |  |   Android + iOS            |  |
|  +------------+------------+  +-------------+--------------+  |
|               |                             |                 |
+---------------------------------------------------------------+
                |             HTTPS           |
                +-------------+---------------+
                              |
                              v
+---------------------------------------------------------------+
|                     AWS CLOUD (us-east-1)                     |
|                                                               |
|  +-------------------------+  +----------------------------+  |
|  | CloudFront (CDN)        |  | API Gateway HTTP API v2    |  |
|  | Static site hosting     |  | Routes -> Lambda           |  |
|  | S3 origin               |  | JWT authorizer (Cognito)   |  |
|  +-------------------------+  +-------------+--------------+  |
|                                             |                 |
|  +------------------------------------------+--------------+  |
|  |                  AWS Lambda (22 functions)               |  |
|  |  Runtime: Node.js 22 | Framework: Hono                  |  |
|  |  IaC: AWS SAM (CloudFormation)                           |  |
|  +----+----------+----------+-----------+--+----+---------+  |
|       |          |          |           |  |    |         |  |
|  +----+---+ +----+---+ +---+----+ +----+--++ +-+------+  |  |
|  |Cognito | |DynamoDB | |  S3    | |Secrets | |CloudW. |  |  |
|  |User    | |KV table | |Storage | |Manager | |Alarms  |  |  |
|  |Pools   | |per env  | |per env | |per env | |+ SNS   |  |  |
|  +--------+ +--------+ +--------+ +--------+ +--------+  |  |
|                                                               |
+---------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------+
|                      EXTERNAL SERVICES                        |
|  +----------+  +--------+  +--------+  +-------------------+  |
|  | Stripe   |  | Square |  | Resend |  | Slack             |  |
|  | Connect  |  | OAuth  |  | Email  |  | Error alerts      |  |
|  | Payments |  | POS    |  | API    |  | (via SNS webhook) |  |
|  +----------+  +--------+  +--------+  +-------------------+  |
+---------------------------------------------------------------+
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
- **PDF Generation**: jsPDF (client-side)
- **Mobile Wrapper**: Capacitor 8 (Android + iOS)

### Backend
- **Runtime**: Node.js 22 (AWS Lambda)
- **Framework**: Hono
- **Database**: DynamoDB (KV table pattern -- `billtup-{env}-data`)
- **Storage**: S3 (`billtup-{env}-storage-{account}`)
- **Auth**: AWS Cognito (JWT, user pools per environment)
- **Secrets**: AWS Secrets Manager (`billtup-{env}-secrets`)
- **Infrastructure as Code**: AWS SAM (CloudFormation)

### External Services
- **Payments**: Stripe Connect + Square OAuth
- **Email**: Resend API (invoices@billtup.com)
- **Monitoring**: CloudWatch alarms + SNS + Slack error alerts
- **Hosting**: AWS CloudFront + S3 (frontend), AWS Lambda (backend)

### Lambda Functions (22 total)
| Function | Purpose |
|----------|---------|
| analytics | Dashboard analytics and metrics |
| auth | Sign-up, sign-in, password reset |
| business | Business profile CRUD + logo upload |
| contact | Contact form / support messages |
| customers | Customer CRUD |
| email | Send invoice/estimate emails via Resend |
| error-report | Client-side error reporting |
| estimate-approval | Public estimate approval flow |
| estimates | Estimate/quote CRUD |
| health | Health check endpoint |
| invoices | Invoice CRUD |
| line-items | Line item autocomplete/suggestions |
| notifications-daily | Scheduled daily notification digest |
| notifications-weekly | Scheduled weekly notification digest |
| pay | Public payment page (payment links) |
| payments | Payment intent creation and confirmation |
| square | Square OAuth integration |
| stripe | Stripe Connect onboarding |
| subscription | Subscription status, upgrade, cancel |
| user | User profile and preferences |
| webhooks | Stripe + Square webhook handlers |
| _shared.ts | Shared utilities (not a Lambda, imported by others) |

---

## Data Flow Example: Creating an Invoice

```
1. User fills invoice form in InvoiceBuilder.tsx
   |
   v
2. Frontend calls: dashboardApi.createInvoice(invoiceData)
   |
   v
3. API Client (utils/api.tsx) makes fetch request:
   POST {API_BASE_URL}/billtup-api/invoices
   Headers: Authorization: Bearer {Cognito ID token}
   |
   v
4. API Gateway validates JWT via Cognito authorizer
   |
   v
5. Lambda function (invoices) via Hono router:
   - Extracts userId from JWT claims
   - Generates invoice number
   - Saves to DynamoDB KV table
   |
   v
6. DynamoDB: put item in billtup-{env}-data
   Key: invoices:{userId}  Value: [...invoices, newInvoice]
   |
   v
7. Response back to frontend: { success: true, invoice: {...} }
   |
   v
8. UI updates with new invoice
```

---

## Authentication Flow

```
1. User enters email + password
   |
   v
2. Frontend: cognito.signIn(email, password)
   (Direct Cognito API call -- no AWS SDK, see utils/auth/cognito.ts)
   |
   v
3. Cognito InitiateAuth (USER_PASSWORD_AUTH flow)
   |
   v
4. Returns: idToken + accessToken + refreshToken
   |
   v
5. Tokens stored in localStorage:
   - billtup_id_token
   - billtup_access_token
   - billtup_refresh_token
   - billtup_token_expires_at
   |
   v
6. Subsequent API requests include:
   Authorization: Bearer {idToken}
   |
   v
7. API Gateway validates JWT against Cognito user pool
   |
   v
8. Token auto-refresh: cognito.ts checks expiry before each request
   and calls InitiateAuth with REFRESH_TOKEN_AUTH if needed
```

---

## Payment Flow

### Stripe Connect (Card Payments)

```
1. Business owner connects Stripe account (OAuth)
   |
   v
2. Customer opens payment link (/pay/:invoiceId)
   |
   v
3. Stripe.js loads in browser, renders payment element
   |
   v
4. Customer enters card details (Stripe.js tokenizes -- never touches our server)
   |
   v
5. Frontend sends payment method ID to backend
   POST /billtup-api/payments/create-intent
   |
   v
6. Lambda creates Stripe PaymentIntent with destination charge
   (funds go to business owner's connected Stripe account)
   |
   v
7. Stripe processes payment
   |
   v
8. Webhook (POST /billtup-api/webhooks/stripe) notifies backend of result
   |
   v
9. Backend updates invoice status to "paid" in DynamoDB
   |
   v
10. Frontend shows success page (PaymentSuccessPage.tsx)
```

### Square (POS Integration)

```
1. Business owner connects Square account (OAuth)
   |
   v
2. Square OAuth callback handled by OAuthCallbackPage.tsx
   |
   v
3. Backend stores Square tokens in DynamoDB (encrypted)
   |
   v
4. Payments processed via Square API when selected as provider
```

---

## Security Model

### Three-Tier Architecture

```
Frontend (Public)
  | Only has:
  | - Cognito User Pool ID + Client ID (public)
  | - Cognito Region (public)
  | - API Gateway URL (public)
  | - Stripe Publishable Key (public)
  |
  v  HTTPS only (CloudFront enforces TLS)
  |
API Gateway + Lambda (Server-side)
  | Has (via Secrets Manager):
  | - Stripe Secret Key
  | - Square credentials
  | - Resend API Key
  | - Encryption keys
  |
  v  Validates every request via Cognito JWT
  |
DynamoDB + S3
  | User data isolated by userId key prefix
  | IAM roles restrict Lambda access per resource
  | S3 buckets are private (no public access)
```

### Security Features

1. **Authentication**
   - AWS Cognito user pools (per environment)
   - JWT tokens with 1-hour expiration
   - Refresh token rotation
   - Server-side JWT validation at API Gateway layer
   - Session timeout with auto-renewal (15-min threshold)

2. **Data Protection**
   - User data scoped by userId in DynamoDB
   - Sensitive fields encrypted (AES-256-GCM)
   - PCI DSS Level 1 compliance via Stripe (card data never reaches server)
   - S3 buckets are private; pre-signed URLs for file access

3. **API Security**
   - CORS configured on API Gateway
   - Rate limiting (API Gateway throttling)
   - Input validation in Hono middleware
   - Error sanitization (no stack traces to client)
   - OIDC-based CI/CD (no long-lived AWS credentials in GitHub)

4. **Secrets Management**
   - All secrets stored in AWS Secrets Manager (`billtup-{env}-secrets`)
   - Lambda functions read secrets at cold start
   - No secrets in environment variables or source code
   - Frontend uses only public Cognito/Stripe publishable values

---

## File Structure

```
billtup_frontend/
|
+-- .github/
|   +-- workflows/
|       +-- deploy.yml               # CI/CD: build + deploy to S3 + CloudFront
|       +-- enforce-promotion.yml    # Branch promotion guard (dev -> stg -> main)
|
+-- src/
|   +-- App.tsx                      # Main app component + routing
|   +-- main.tsx                     # React entry point
|   +-- index.css                    # Global styles (Tailwind)
|   |
|   +-- components/
|   |   +-- dashboard/               # Authenticated app screens
|   |   |   +-- OverviewTab.tsx      # Dashboard home
|   |   |   +-- InvoicesTab.tsx      # Invoice list
|   |   |   +-- EstimatesTab.tsx     # Estimate list
|   |   |   +-- CustomersTab.tsx     # Customer list
|   |   |   +-- AnalyticsTab.tsx     # Analytics charts
|   |   |   +-- SettingsTab.tsx      # Settings panel
|   |   |   +-- CreateInvoiceModal   # Invoice creation
|   |   |   +-- CreateEstimateModal  # Estimate creation
|   |   |   +-- ...                  # 30+ dashboard modals/components
|   |   |
|   |   +-- website/                 # Marketing site (public)
|   |   |   +-- HeroSection.tsx
|   |   |   +-- PricingSection.tsx
|   |   |   +-- FeaturesSection.tsx
|   |   |   +-- SignInSection.tsx
|   |   |   +-- SignUpSection.tsx
|   |   |   +-- ...                  # 23 website sections
|   |   |
|   |   +-- estimate/
|   |   |   +-- EstimateApprovalPage.tsx   # Public estimate approval
|   |   |
|   |   +-- pay/
|   |   |   +-- PaymentPage.tsx            # Public payment link
|   |   |   +-- PaymentSuccessPage.tsx     # Payment confirmation
|   |   |
|   |   +-- ui/                     # Reusable UI primitives (shadcn)
|   |   +-- figma/                  # Design reference components
|   |   +-- mockups/                # App mockups
|   |
|   |   +-- InvoiceBuilder.tsx      # Full invoice builder
|   |   +-- LoginScreen.tsx         # Login page
|   |   +-- Dashboard.tsx           # Dashboard layout
|   |   +-- SettingsScreen.tsx      # Settings page
|   |   +-- CustomersScreen.tsx     # Customer management
|   |   +-- ...                     # Additional top-level screens
|   |
|   +-- utils/
|   |   +-- api.tsx                 # API client (fetch wrapper)
|   |   +-- dashboard-api.tsx       # Dashboard-specific API methods
|   |   +-- config.ts              # App config, pricing, feature flags
|   |   +-- routes.ts              # Route definitions
|   |   +-- encryption.ts          # Client-side AES-256-GCM encryption
|   |   +-- errorReporter.ts       # Error reporting to backend
|   |   +-- sessionTimeout.ts      # Session timeout management
|   |   +-- imageCompression.ts    # Image compression for uploads
|   |   +-- accessibility.ts       # Accessibility utilities
|   |   +-- auth/
|   |       +-- cognito.ts         # Direct Cognito API client (no SDK)
|   |       +-- config.ts          # Cognito + API Gateway URLs
|   |
|   +-- docs/                      # Developer documentation
|   +-- styles/                    # Global stylesheets
|
+-- android/                       # Capacitor Android project
+-- ios/                           # Capacitor iOS project (future)
+-- capacitor.config.ts            # Capacitor configuration
+-- vite.config.ts                 # Vite build config
+-- tailwind.config.ts             # Tailwind CSS config
+-- package.json
+-- tsconfig.json
```

---

## Database Schema (DynamoDB KV Table Pattern)

Each environment has a single DynamoDB table: `billtup-{env}-data`

### Key Naming Convention

```
{entity}:{userId}              -- List of entities for a user
{entity}:{entityId}            -- Individual entity details
```

### Primary Entities

| Key Pattern | Description |
|-------------|-------------|
| `business:{userId}` | Business profile (name, address, logo URL) |
| `customers:{userId}` | Array of customers |
| `invoices:{userId}` | Array of invoices |
| `estimates:{userId}` | Array of estimates/quotes |
| `payments:{userId}` | Array of payment records |
| `line-items:{userId}` | Saved line items for autocomplete |
| `subscription:{userId}` | Subscription status and plan |
| `user:{userId}` | User preferences and settings |
| `analytics:{userId}` | Cached analytics data |

See [DATABASE.md](./DATABASE.md) for complete schema.

---

## API Endpoints

All endpoints are prefixed with `{API_BASE_URL}/billtup-api`.
Authenticated endpoints require: `Authorization: Bearer {Cognito idToken}`

### Authentication
- `POST /auth/signup` -- Create account (Cognito)
- `POST /auth/signin` -- Sign in (Cognito)
- `POST /auth/request-password-reset` -- Send password reset email
- `POST /auth/reset-password` -- Reset password with code

### Business
- `GET /business` -- Get business profile
- `POST /business` -- Create/update profile
- `POST /business/logo` -- Upload logo to S3

### Customers
- `GET /customers` -- List customers
- `POST /customers` -- Create customer
- `PUT /customers/:id` -- Update customer
- `DELETE /customers/:id` -- Delete customer

### Invoices
- `GET /invoices` -- List invoices
- `POST /invoices` -- Create invoice
- `GET /invoices/:id` -- Get invoice
- `PUT /invoices/:id` -- Update invoice
- `DELETE /invoices/:id` -- Delete invoice

### Estimates
- `GET /estimates` -- List estimates
- `POST /estimates` -- Create estimate
- `GET /estimates/:id` -- Get estimate
- `PUT /estimates/:id` -- Update estimate
- `DELETE /estimates/:id` -- Delete estimate

### Email
- `POST /email/send-invoice` -- Email invoice PDF via Resend
- `POST /email/send-estimate` -- Email estimate PDF via Resend

### Payments
- `POST /payments/create-intent` -- Create Stripe PaymentIntent
- `POST /payments/confirm` -- Confirm payment
- `POST /payments/refund` -- Process refund

### Stripe
- `POST /stripe/connect` -- Begin Stripe Connect onboarding
- `GET /stripe/status` -- Check Stripe account status

### Square
- `POST /square/connect` -- Begin Square OAuth
- `GET /square/callback` -- Square OAuth callback

### Subscription
- `GET /subscription/status` -- Get subscription status
- `POST /subscription/upgrade` -- Upgrade plan
- `POST /subscription/cancel` -- Cancel subscription

### Pay (Public -- no auth required)
- `GET /pay/:invoiceId` -- Get invoice for payment page
- `POST /pay/:invoiceId/process` -- Process payment

### Estimate Approval (Public -- no auth required)
- `GET /estimate-approval/:id` -- Get estimate for approval
- `POST /estimate-approval/:id/approve` -- Approve estimate

### Webhooks (Public -- signature-verified)
- `POST /webhooks/stripe` -- Stripe webhook handler
- `POST /webhooks/square` -- Square webhook handler

### Utility
- `GET /health` -- Health check
- `POST /error-report` -- Client error reporting
- `POST /contact` -- Contact/support form
- `GET /analytics` -- Dashboard analytics
- `GET /line-items` -- Line item suggestions

See [API_REFERENCE.md](./API_REFERENCE.md) for complete documentation.

---

## Environment Variables

### Frontend (Public -- safe to expose, set via Vite `VITE_` prefix)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API Gateway base URL |
| `VITE_COGNITO_REGION` | Cognito region (us-east-1) |
| `VITE_COGNITO_USER_POOL_ID` | Cognito User Pool ID |
| `VITE_COGNITO_CLIENT_ID` | Cognito App Client ID |

Frontend also uses a hardcoded Stripe publishable key in `utils/config.ts` (safe to expose).

### Backend (Server-only -- stored in AWS Secrets Manager)
| Secret Key | Description |
|------------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `SQUARE_APP_ID` | Square application ID |
| `SQUARE_APP_SECRET` | Square application secret |
| `RESEND_API_KEY` | Resend email API key |
| `ENCRYPTION_KEY` | AES-256-GCM encryption key |

### CI/CD (GitHub Actions secrets per environment)
| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN` | IAM role ARN for OIDC auth |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution to invalidate |
| `VITE_API_URL` | API Gateway URL for build |
| `VITE_COGNITO_REGION` | Cognito region for build |
| `VITE_COGNITO_USER_POOL_ID` | Cognito pool ID for build |
| `VITE_COGNITO_CLIENT_ID` | Cognito client ID for build |
| `SLACK_WEBHOOK_URL` | Slack webhook for failure alerts |

---

## Deployment Architecture

### Environments

| Environment | Branch | Domain | S3 Bucket | CloudFront |
|-------------|--------|--------|-----------|------------|
| dev | dev | dev.billtup.com | billtup-frontend-dev | E3IBYP7ZOWQE4R |
| stg | stg | stg.billtup.com | billtup-frontend-stg | EY7GQL9GE8S9I |
| prod | main | billtup.com | billtup-frontend-prod | E3UO9LEXKR9373 |

### Branch Promotion Flow (Strict)

```
dev  ----PR---->  stg  ----PR---->  main
 |                 |                  |
 v                 v                  v
dev.billtup.com   stg.billtup.com   billtup.com
```

- All work is committed to `dev`
- Promote to `stg` via pull request merge (dev -> stg)
- Promote to `main` via pull request merge (stg -> main)
- Never skip a stage or push directly to main/stg
- Enforced by `enforce-promotion.yml` GitHub Actions workflow

### CI/CD Pipeline (GitHub Actions)

```
1. Push to dev / stg / main
   |
   v
2. GitHub Actions: deploy.yml triggers
   - OIDC authenticates to AWS IAM role (no stored credentials)
   - npm ci && npm run build (with env-specific Vite variables)
   |
   v
3. aws s3 sync build/ s3://billtup-frontend-{env}
   - Static assets: Cache-Control max-age=31536000, immutable
   - index.html: Cache-Control no-cache (always fresh)
   |
   v
4. aws cloudfront create-invalidation --paths "/*"
   |
   v
5. On failure: Slack notification via webhook
```

### Backend Deployment (SAM)

```
1. SAM template defines all Lambda functions + API Gateway
   |
   v
2. sam build && sam deploy --config-env {env}
   - Deploys to AWS CloudFormation stack
   - Creates/updates Lambda functions, API Gateway, DynamoDB tables
   |
   v
3. API Gateway routes map to individual Lambda functions
   |
   v
4. CloudWatch alarms monitor errors -> SNS -> Slack
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| Invoices | Create, send, track, and manage invoices |
| Estimates/Quotes | Create estimates, send for approval, convert to invoice |
| Payment Links | Shareable payment pages for customers |
| Line Item Autocomplete | Saved line items for faster invoice creation |
| Customer Management | Full customer CRUD with invoice history |
| Analytics | Revenue charts, invoice stats, customer insights |
| Custom Branding (Premium) | Custom colors, logo, and PDF templates |
| Overdue Invoice Tracking | Automatic overdue detection and alerts |
| Offline Support | Capacitor-based offline capability for mobile |
| 15 PDF Templates | Professional invoice/estimate PDF layouts |
| Notification Digests | Daily and weekly email summaries |
| Multi-Provider Payments | Stripe Connect + Square OAuth |
| Error Reporting | Client-side errors sent to backend for monitoring |

---

## Performance Considerations

### Current
- React lazy loading for code splitting
- Tailwind CSS for minimal CSS bundle
- Vite for fast builds and HMR
- CloudFront CDN for global edge caching
- S3 static assets with immutable cache headers (1 year)
- index.html served with no-cache for instant deploys
- Lambda cold start optimization (Node.js 22, minimal dependencies)

### Monitoring
- CloudWatch alarms on Lambda errors and API Gateway 5xx rates
- SNS topics forward alerts to Slack channels
- Client-side error reporter sends unhandled errors to `/error-report`
- Deploy failure notifications via Slack webhook

---

## Next Steps

- Review [Database Schema](./DATABASE.md)
- See [API Reference](./API_REFERENCE.md)
- Check [Security Guide](./SECURITY.md)
- Read [Deployment Guide](./DEPLOYMENT.md)

---

*Last Updated: February 2026*
