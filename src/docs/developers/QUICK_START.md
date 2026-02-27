# Quick Start Guide

Get BilltUp running on your local machine in minutes.

## Prerequisites

- Node.js 22+ and npm
- Git
- AWS CLI + SAM CLI (for backend work)
- Stripe account (for payment features)

## Installation

### 1. Clone the Repository

```bash
git clone <repo-url>
cd billtup_frontend   # Website (Vite + React)
# or
cd Billtup            # Android app (React Native)
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Frontend needs a `.env` file with:

```env
VITE_API_URL=<AWS API Gateway URL>
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=<Cognito User Pool ID>
VITE_COGNITO_CLIENT_ID=<Cognito App Client ID>
VITE_STRIPE_PUBLISHABLE_KEY=<Stripe publishable key>
```

Backend secrets are stored in AWS Secrets Manager (`billtup-{env}-secrets`) and synced automatically via CI/CD. You do not need backend secrets for frontend-only development.

### 4. Start Development Server

```bash
npm run dev -- --host
```

The application will open at `http://localhost:5173`

## Project Structure (Website)

```
src/
├── components/
│   ├── dashboard/         # Dashboard UI (tabs, modals)
│   ├── website/           # Marketing pages
│   └── ui/                # Reusable UI (shadcn)
├── utils/
│   ├── dashboard-api.tsx  # Dashboard API client
│   ├── auth/              # Cognito auth
│   └── config.ts          # API config
├── docs/                  # Documentation
└── App.tsx                # Main app + routing
```

## Project Structure (App)

```
src/
├── components/            # React components (screens + UI)
├── hooks/                 # Custom hooks
├── utils/                 # API client, auth, formatters
├── tests/                 # Vitest tests (214 passing)
└── docs/                  # Dev docs

lambda/                    # Backend (AWS Lambda)
├── src/
│   ├── functions/         # 22 Lambda entry points
│   ├── routes/            # 19 route modules
│   ├── middleware/         # Auth, rate limiting
│   └── utils/             # Logger, kv_store, cognito, storage
├── template.yaml          # SAM CloudFormation template
└── samconfig.toml         # Multi-env config
```

## Key Features

### 1. Authentication
- Sign up with email/password (AWS Cognito)
- Stripe payment integration during signup
- Password reset functionality
- 14-day free trial for all new users

### 2. Dashboard
- Overview with analytics
- Customer management
- Invoice creation and tracking
- Payment processing
- Business profile settings

### 3. Billing
- Basic Plan: $4.99/month (up to 25 invoices)
- Premium Plan: $9.99/month (unlimited invoices)
- Annual billing available (discounted)
- 8.5% tax on subscriptions

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit components in `src/components/`, hot-reload via Vite
2. **Backend Changes**: Edit files in `lambda/src/`, deploy via `sam deploy` or push to the `dev` branch (CI/CD handles deployment)
3. **Tests**: Run `npx vitest run`

### Testing Your Changes

1. Test locally at `http://localhost:5173`
2. Check browser console for errors
3. Test API endpoints via the dashboard

### Deploying

- **Frontend**: Push to `dev` branch; GitHub Actions deploys to dev environment automatically
- **Backend**: Push to `dev` branch for CI/CD deployment, or deploy manually with `sam deploy`
- **Promotion**: dev -> stg -> main via pull requests (never skip a stage)

## Common Tasks

### Create a New Component

```tsx
// src/components/MyComponent.tsx
export function MyComponent() {
  return (
    <div className="p-4">
      <h1>My Component</h1>
    </div>
  );
}
```

### Add a New API Endpoint

```typescript
// lambda/src/routes/my-route.ts
import { Router } from '../utils/router';

const router = new Router();

router.get('/my-endpoint', async (req) => {
  return { message: 'Hello from my endpoint' };
});

export default router;
```

### Use Existing UI Components

```tsx
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';

function MyForm() {
  return (
    <Card className="p-6">
      <Input placeholder="Enter something" />
      <Button>Submit</Button>
    </Card>
  );
}
```

## Troubleshooting

### Development Server Won't Start

1. Ensure Node.js 22+ is installed: `node --version`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear browser cache

### API Requests Failing

1. Check browser console for detailed error messages
2. Verify `.env` has the correct `VITE_API_URL` pointing to API Gateway
3. Check CloudWatch logs for Lambda errors in the AWS Console

### Build Errors

1. Run type checking: `npm run type-check`
2. Check for missing imports
3. Ensure all dependencies are installed: `npm install`

## Next Steps

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Reference](./API_REFERENCE.md)
- [Security Best Practices](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Getting Help

- Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review [API Documentation](./API_REFERENCE.md)
- Contact the development team

---

*Last Updated: February 2026*
