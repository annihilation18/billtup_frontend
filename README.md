# BilltUp Website

The source code for [billtup.com](https://billtup.com), the website for BilltUp, an invoicing app for service businesses.

The site has:

- **Marketing pages**: home, features, pricing, integrations, FAQ, about, contact, roadmap, changelog.
- **Help**: the Help Center (`/help`) and the docs page (`/docs`).
- **Legal pages**: privacy, terms, security, and `/delete-account` (how to delete an account).
- **Sign-up and sign-in**: new accounts start a 14-day free trial with no credit card.
- **Web dashboard** (`/dashboard`): account overview, analytics (Premium), and settings: account and subscription, business profile, customer analytics (Premium), payment settings (connect Stripe or Square), email notifications, saved items and discounts, and Custom Branding (Premium).
- **Customer pages** (no sign-in): pay an invoice (`/pay/:token`), approve or reject an estimate (`/estimate/:token`), and sign a document (`/sign/:token`).

Users create and send invoices and estimates in the BilltUp mobile app. The website does not create invoices. The mobile app and the API live in a separate repository.

## Live sites

| Environment | URL | Branch |
|-------------|-----|--------|
| Production | https://billtup.com (and www.billtup.com) | `main` |
| Staging | https://stg.billtup.com | `stg` |
| Development | https://dev.billtup.com | `dev` |

## Tech stack

- React 18, TypeScript, Vite 6 (with the SWC React plugin)
- React Router 7
- UI: Radix UI primitives with shadcn/ui-style components (`src/components/ui/`), lucide-react icons, Recharts, Sonner toasts
- Styles: a pre-built Tailwind CSS v4 stylesheet (`src/index.css`). Tailwind is not installed, so only classes already in that file work.
- Auth: Amazon Cognito, called directly over HTTPS (no AWS SDK)
- API: the BilltUp API on AWS (API Gateway + Lambda), set by `VITE_API_URL`
- Payments: Stripe (subscriptions and invoice payments) and Square (invoice payments)
- Hosting: Amazon S3 + CloudFront, one per environment, deployed by GitHub Actions

## Quick start

You need Node.js 20 and npm.

```bash
npm install
cp .env.example .env     # then fill in the values (see below)
npm run dev -- --host
```

Always start the dev server with `--host`. The server runs on port 3000 and opens a browser.

`.env` needs these values. `.env.example` lists them; ask a maintainer for the dev values. Never commit `.env`.

| Variable | What it is |
|----------|------------|
| `VITE_API_URL` | Base URL of the BilltUp API (no trailing path). The code adds `/billtup-api`. |
| `VITE_COGNITO_REGION` | AWS region of the Cognito user pool |
| `VITE_COGNITO_USER_POOL_ID` | Cognito user pool ID |
| `VITE_COGNITO_CLIENT_ID` | Cognito app client ID |

All `VITE_` values end up in the browser bundle. Never put a secret in one.

## Build

```bash
npm run build
```

The output goes to `build/`. The repo has no lint, test, or type-check script. See [Testing](src/docs/developers/TESTING.md).

## Deploys

Pushing to `dev`, `stg`, or `main` runs `.github/workflows/deploy.yml`. It builds the site and syncs `build/` to that environment's S3 bucket, then clears the CloudFront cache.

Changes move `dev` → `stg` → `main` through pull requests. The `enforce-promotion.yml` workflow fails any PR to `stg` that is not from `dev`, and any PR to `main` that is not from `stg`.

Details: [Deployment](src/docs/developers/DEPLOYMENT.md).

## Docs

- [Docs index](src/docs/README.md)
- [Changelog](CHANGELOG.md)

## Support

support@billtup.com
