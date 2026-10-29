# Architecture

## Overview

The website is a static React single-page app. It has no server code and no database of its own. Everything dynamic goes through two services:

- **Amazon Cognito** for sign-in, token refresh, and sign-out.
- **The BilltUp API** (API Gateway + Lambda, in the app repo) for everything else: account data, subscriptions, analytics, payment provider connections, and the public pay, estimate, and sign pages.

```
Browser (React SPA from S3 + CloudFront)
  ├── Cognito (https://cognito-idp.<region>.amazonaws.com)   sign-in, refresh, sign-out
  ├── BilltUp API (<VITE_API_URL>/billtup-api/...)            all data, with "Authorization: Bearer <Cognito ID token>"
  ├── Stripe.js                                               card form in the Subscribe dialog
  └── Stripe / Square hosted checkout                         invoice payments from /pay/:token
```

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18, TypeScript |
| Build | Vite 6.3 with `@vitejs/plugin-react-swc`. Output in `build/`. |
| Routing | `react-router-dom` 7 (`BrowserRouter`) |
| UI | Radix UI primitives wrapped as shadcn/ui-style components in `src/components/ui/`; lucide-react icons; Recharts; Sonner toasts |
| Styles | `src/index.css` is a pre-built Tailwind CSS v4.1 file. Tailwind is not a dependency and does not run at build time. A Tailwind class works only if it is already in `index.css`. |
| Payments | `@stripe/stripe-js` and `@stripe/react-stripe-js` |

There is no `tsconfig.json`. Vite strips TypeScript types but does not type-check.

## Routes

Defined in `src/App.tsx`.

| Path | What it shows | Auth |
|------|---------------|------|
| `/` | Home: hero, feature highlights, mobile app section, pricing preview | Public |
| `/features`, `/pricing`, `/integrations`, `/faq`, `/about`, `/contact`, `/roadmap`, `/changelog` | Marketing pages | Public |
| `/docs` | Docs page (`DocumentationSectionNew`) | Public |
| `/help` | Help Center | Public |
| `/privacy`, `/terms`, `/security`, `/delete-account` | Legal and account-deletion pages | Public |
| `/signup`, `/signin` | Sign-up and sign-in | Public |
| `/reset-password` | Password reset (no header or footer) | Public |
| `/logo-export` | Logo export tool | Public |
| `/pay/:token`, `/pay/:token/success` | Customer pays an invoice | Public, token in URL |
| `/estimate/:token` | Customer approves or rejects an estimate | Public, token in URL |
| `/sign/:token` | Customer signs a document | Public, token in URL |
| `/dashboard` | Overview | Signed in |
| `/dashboard/analytics` | Analytics (Premium and trial only) | Signed in |
| `/dashboard/settings` | Settings cards that open dialogs | Signed in |
| `/dashboard/oauth/stripe/callback`, `/dashboard/oauth/square/callback` | Finish connecting Stripe or Square | Signed in |
| Anything else | Redirects to `/` | — |

When the app loads with a valid session on `/`, `/signin`, or `/signup`, it goes to `/dashboard`. A signed-in user who leaves the dashboard for another public page is asked whether to log out or go back. Signed-out users who open a `/dashboard` path go to `/signin?redirect=<path>` and come back after signing in.

## Web dashboard

`src/components/dashboard/DashboardSection.tsx` holds the layout and three tabs:

- **Overview** (`OverviewTab.tsx`): quick links and this billing cycle's invoice usage.
- **Analytics** (`AnalyticsTab.tsx`): sales stats, revenue trend, and top customers for a chosen period. Premium and trial only.
- **Settings** (`SettingsTab.tsx`): cards that open these dialogs:
  - Account (`AccountSettingsModal.tsx`): plan, change plan, cancel or reactivate, promo codes, password reset email, delete account.
  - Business Profile (`BusinessProfileModal.tsx`)
  - Customer Analytics (`CustomerAnalyticsModal.tsx`): Premium and trial only.
  - Payment Settings (`PaymentSettingsModal.tsx`): connect or disconnect Stripe and Square, choose the active provider.
  - Email Notifications (`EmailNotificationsModal.tsx`)
  - Saved Items & Discounts (`SavedItemsModal.tsx`)
  - Custom Branding (`CustomBrandingModal.tsx`, with `TemplateBrowserModal.tsx`): logo, logo shape, colors, invoice template. Premium and trial only.
  - Help & Support

The dashboard does not create or edit invoices, estimates, or customers. Those features moved to the mobile app on 2026-03-10.

Several older components are still in the repo but are not imported by any route: `InvoicesTab`, `CustomersTab`, `EstimatesTab`, the create/edit/view/delete invoice, estimate, and customer dialogs, `TakePaymentModal`, `RefundModal`, the `src/components/*Screen.tsx` files, `Dashboard.tsx`, and `src/billtup_guide.tsx`. Do not document them as live features.

## Subscriptions and the trial

- Sign-up (`SignUpSection.tsx`) calls `POST /auth/signup`. Every new account gets a 14-day free trial with all Premium features and no card.
- The dashboard reads `GET /subscription/status` (via `fetchSubscription`) to show the trial banner, days left, and the plan badge.
- When the trial ends without a subscription, the account is read-only. Data stays visible. The API answers write requests with HTTP 402 and `code: "SUBSCRIPTION_REQUIRED"`; `apiCall` in `src/utils/dashboard-api.tsx` turns that into a `billtup:subscription-required` browser event, and the dashboard shows a "Choose a plan" banner and toast.
- The Subscribe dialog (`SubscribeModal.tsx`) collects a card with Stripe's Payment Element: it gets a SetupIntent from the API, confirms it with Stripe.js, then calls the API to start the subscription.
- Plans: Basic $4.99/month (up to 10 invoices per month, up to 10 customers) and Premium $9.99/month (unlimited, plus analytics and Custom Branding). The website only shows these limits; the API enforces them.

## Authentication

`src/utils/auth/cognito.ts` calls the Cognito Identity Provider API with `fetch` (no AWS SDK):

- Sign-in uses `USER_PASSWORD_AUTH`. Emails are lower-cased first.
- Tokens (ID, access, refresh), expiry, user ID, and email are kept in `localStorage`.
- `getSession()` refreshes tokens with `REFRESH_TOKEN_AUTH` when the ID token has less than 60 seconds left.
- Every API call sends the Cognito ID token as `Authorization: Bearer <token>`.
- `src/utils/sessionTimeout.ts` signs the user out after 1 hour with no activity on `/dashboard` pages.

Config comes from `src/utils/auth/config.ts`, which reads the `VITE_` environment variables.

## API access

- `API_CONFIG.baseUrl` (`src/utils/config.ts`) is `${VITE_API_URL}/billtup-api`.
- Most dashboard calls go through `apiCall()` in `src/utils/dashboard-api.tsx`. `src/utils/api.tsx` is an older client still used by `SavedItemsModal` and some unused dialogs.
- Public pages (`/pay`, `/estimate`, `/sign`, sign-up, password reset) call the API with `fetch` and no token.

## Error reporting

`src/utils/errorReporter.ts` sends errors to the API's `/billtup-api/error-report` endpoint, which forwards them to Slack. `apiCall` reports every 5xx response. In production builds `src/main.tsx` silences `console.log`, `console.debug`, and `console.info`; `console.warn` and `console.error` still work.

## Project structure

```
.github/workflows/      deploy.yml (build + S3 + CloudFront), enforce-promotion.yml
public/                 static files copied to build/ (.htaccess is unused)
src/
  main.tsx              entry point; BrowserRouter
  App.tsx               routes, session check, auth guard, sign-out
  index.css             pre-built Tailwind CSS v4 + theme
  reset-password.tsx    /reset-password page
  components/
    website/            marketing, help, legal, sign-in and sign-up pages
    dashboard/          web dashboard tabs and settings dialogs
    pay/                /pay/:token pages
    estimate/           /estimate/:token page
    sign/               /sign/:token page
    mockups/            phone mockups used on marketing pages
    ui/                 shadcn/ui-style components
  utils/
    auth/               Cognito client and config
    config.ts           API base URL, Stripe publishable key, app constants
    dashboard-api.tsx   authenticated API helpers
    api.tsx             older API client
    routes.ts           path <-> section helpers
    sessionTimeout.ts   inactivity sign-out
    errorReporter.ts    error reports to the API
  docs/                 these docs
```
