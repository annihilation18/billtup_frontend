# Developer Documentation

Technical documentation for developers working on the BilltUp platform.

## Documentation Index

### Core
- [Quick Start Guide](./QUICK_START.md) — Get up and running in minutes
- [Architecture](./ARCHITECTURE.md) — System design, tech stack, data flow
- [Database](./DATABASE.md) — DynamoDB schema, key patterns, entities
- [Deployment](./DEPLOYMENT.md) — Environments, CI/CD, SAM, CloudFront
- [Security](./SECURITY.md) — Auth, encryption, PCI DSS, secrets

### Payments
- [Stripe Setup](./STRIPE_SETUP.md) — Stripe Connect configuration and testing
- [Payment Security FAQ](./PAYMENT_SECURITY_FAQ.md) — PCI DSS compliance details

### Testing
- [Testing Guide](./TESTING.md) — Manual test scenarios and test cards

## Quick Reference

### Common Commands

```bash
npm run dev -- --host      # Start dev server (--host required)
npm run build              # Production build
npx vitest run             # Run tests (214 tests)
npx vitest --ui            # Vitest UI
npm run type-check         # TypeScript checking
sam deploy                 # Deploy backend (dev)
sam deploy --config-env prod  # Deploy backend (prod)
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite 6.3, Tailwind CSS v4, shadcn/ui |
| Mobile | Capacitor 8 (Android + iOS) |
| Backend | Hono on Node.js 22 (AWS Lambda) |
| Database | DynamoDB (KV table) |
| Storage | S3 (logos, invoices) |
| Auth | AWS Cognito (JWT) |
| Payments | Stripe Connect, Square OAuth |
| Email | Resend API |
| CI/CD | GitHub Actions, SAM (CloudFormation) |
| Monitoring | CloudWatch alarms, SNS, Slack alerts |

### Environments

| Env | Branch | Domain | S3 Bucket |
|-----|--------|--------|-----------|
| dev | `dev` | dev.billtup.com | billtup-frontend-dev |
| stg | `stg` | stg.billtup.com | billtup-frontend-stg |
| prod | `main` | billtup.com | billtup-frontend-prod |

### Branch Promotion

`dev` → `stg` → `main` (via PR merges, never skip stages)

---

*Last Updated: February 2026*
