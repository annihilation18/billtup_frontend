# Quick Start Guide

Get BilltUp running on your local machine in minutes.

## Prerequisites

- Node.js 18+ and npm
- Git
- A Supabase account
- A Stripe account (for payment features)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/billtup/billtup.git
cd billtup
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

The following environment variables are already configured in Supabase:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`

No additional `.env` file is needed for local development.

### 4. Start Development Server

```bash
# Windows
start-dev.bat

# Mac/Linux
./start-dev.sh
```

The application will open at `http://localhost:5173`

## Project Structure

```
billtup/
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── website/        # Marketing website components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── mockups/        # Mobile app mockups
├── supabase/
│   └── functions/
│       └── server/     # Backend API (Edge Functions)
├── utils/              # Utility functions
│   ├── api.tsx         # Legacy API client
│   ├── dashboard-api.tsx # Dashboard API client
│   ├── encryption.ts   # Encryption utilities
│   └── supabase/       # Supabase client
├── styles/             # Global styles
└── docs/               # Documentation
```

## Key Features

### 1. Authentication
- Sign up with email/password
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

1. **Frontend Changes**: Edit files in `/components` or `/App.tsx`
2. **Backend Changes**: Edit files in `/supabase/functions/server/`
3. **Styles**: Modify `/styles/globals.css` for global styles

### Testing Your Changes

1. Test locally at `http://localhost:5173`
2. Check browser console for errors
3. Test API endpoints via the dashboard

### Deploying Backend Changes

```bash
# Deploy to Supabase Edge Functions
./deploy-backend.sh  # Mac/Linux
deploy-backend.bat   # Windows
```

## Common Tasks

### Create a New Component

```tsx
// components/MyComponent.tsx
export function MyComponent() {
  return (
    <div className="p-4">
      <h1>My Component</h1>
    </div>
  );
}
```

### Add a New API Endpoint

```tsx
// supabase/functions/server/index.tsx
app.get("/make-server-dce439b6/my-endpoint", async (c) => {
  return c.json({ message: "Hello from my endpoint" });
});
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

1. Ensure Node.js 18+ is installed: `node --version`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear browser cache

### API Requests Failing

1. Check browser console for detailed error messages
2. Verify Supabase backend is deployed: `./deploy-backend.sh`
3. Check Supabase Edge Functions logs in the Supabase dashboard

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

*Last Updated: November 21, 2025*
