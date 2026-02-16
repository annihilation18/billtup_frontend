# Developer Documentation

This section contains technical documentation for developers working on the BilltUp platform.

## Table of Contents

### Getting Started
- [Quick Start Guide](./QUICK_START.md) - Get up and running quickly
- [Development Environment Setup](./SETUP.md) - Detailed setup instructions
- [Project Structure](./PROJECT_STRUCTURE.md) - Understanding the codebase

### Architecture & Design
- [System Architecture](./ARCHITECTURE.md) - High-level system design
- [Database Schema](./DATABASE.md) - Database structure and relationships
- [Authentication Flow](./AUTHENTICATION.md) - Auth system documentation
- [Payment Integration](./PAYMENTS.md) - Stripe integration guide

### API Documentation
- [API Reference](./API_REFERENCE.md) - Complete API endpoint documentation
- [API Testing Guide](./API_TESTING.md) - Testing your API integrations
- [Webhooks](./WEBHOOKS.md) - Webhook events and handling

### Security
- [Security Best Practices](./SECURITY.md) - Security guidelines and standards
- [Environment Variables](./ENVIRONMENT.md) - Managing secrets and config
- [Compliance Guide](./COMPLIANCE.md) - GDPR, PCI-DSS, and legal compliance

### Development Guides
- [Frontend Development](./FRONTEND.md) - React, TypeScript, and UI components
- [Backend Development](./BACKEND.md) - Supabase Edge Functions guide
- [Testing Guide](./TESTING.md) - Unit, integration, and E2E testing
- [Performance Optimization](./PERFORMANCE.md) - Best practices for performance

### Deployment
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment steps
- [CI/CD Pipeline](./CICD.md) - Automated deployment setup
- [Monitoring & Logging](./MONITORING.md) - Application monitoring

### Contributing
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute
- [Code Style Guide](./CODE_STYLE.md) - Code formatting and conventions
- [Git Workflow](./GIT_WORKFLOW.md) - Branching and PR guidelines

## Quick Reference

### Common Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Deploy backend
./deploy-backend.sh

# Type checking
npm run type-check
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Deno), Hono
- **Database**: PostgreSQL (via Supabase)
- **Payments**: Stripe
- **Authentication**: Supabase Auth
- **Email**: Nodemailer

### Project Links

- Production: https://billtup.com
- Staging: https://staging.billtup.com
- API Base: https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6

---

**Need help?** Check the [Troubleshooting Guide](./TROUBLESHOOTING.md) or reach out to the development team.
