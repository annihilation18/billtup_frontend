> **Archived 2026-10-28:** Old project README. Superseded by the root README.md and src/docs/README.md. Kept for history only; not maintained.

# BilltUp - Modern Invoicing for Service Businesses

A comprehensive invoicing platform with Stripe payment integration, customer management, and real-time analytics.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy backend (first time setup)
./deploy-backend.sh  # Mac/Linux
deploy-backend.bat   # Windows
```

Visit `http://localhost:5173` to see the app.

---

## 📚 Documentation

All documentation has been organized into `/docs/`:

### For Developers
- **[Quick Start Guide](./docs/developers/QUICK_START.md)** - Get up and running
- **[Architecture](./docs/developers/ARCHITECTURE.md)** - System design
- **[Security Guide](./docs/developers/SECURITY.md)** - Security best practices
- **[Database Schema](./docs/developers/DATABASE.md)** - Data models
- **[Deployment](./docs/developers/DEPLOYMENT.md)** - Production deployment
- **[Stripe Setup](./docs/developers/STRIPE_SETUP.md)** - Payment configuration
- **[Testing Guide](./docs/developers/TESTING.md)** - Testing workflows

### For Users
- **[Getting Started](./docs/users/GETTING_STARTED.md)** - New user guide
- **[User Documentation](./docs/users/README.md)** - Complete user guide

### Changelog
- **[Latest Release](./docs/changelog/LATEST.md)** - v1.1.0 release notes
- **[Version History](./docs/changelog/README.md)** - All releases

---

## ✨ Features

### Core Features
- 📄 **Invoice Management** - Create, send, and track professional invoices
- 👥 **Customer Management** - Organize and manage your client base
- 💳 **Payment Processing** - Accept payments via Stripe
- 📊 **Analytics Dashboard** - Track revenue and business metrics
- 📧 **Email Integration** - Automated invoice delivery
- 🔐 **Secure Authentication** - Email/password with JWT tokens

### Subscription Plans
- **Basic**: $4.99/month (up to 25 invoices)
- **Premium**: $9.99/month (unlimited invoices + advanced features)
- **14-day free trial** for all new users

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4
- **Backend**: Supabase Edge Functions (Deno + Hono)
- **Database**: PostgreSQL (via Supabase)
- **Payments**: Stripe
- **Email**: Nodemailer (SMTP)
- **Hosting**: Vercel (frontend), Supabase (backend)

---

## 🔒 Security

- ✅ PCI DSS Level 1 compliant (via Stripe)
- ✅ AES-256-GCM encryption for sensitive data
- ✅ JWT authentication with token rotation
- ✅ HTTPS enforced
- ✅ GDPR compliant

See [Security Guide](./docs/developers/SECURITY.md) for details.

---

## 📦 Project Structure

```
billtup/
├── components/          # React components
│   ├── dashboard/      # Dashboard UI
│   ├── website/        # Marketing website
│   └── ui/             # Reusable UI components
├── docs/               # Documentation
│   ├── developers/     # Developer docs
│   ├── users/          # User guides
│   └── changelog/      # Release notes
├── supabase/
│   └── functions/
│       └── server/     # Backend API
├── utils/              # Utilities
│   ├── api.tsx         # API client
│   ├── config.ts       # Configuration
│   └── encryption.ts   # Encryption utilities
└── styles/             # Global styles
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Deploy (automatic)

### Backend (Supabase)
```bash
./deploy-backend.sh
```

See [Deployment Guide](./docs/developers/DEPLOYMENT.md) for complete instructions.

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

See [Testing Guide](./docs/developers/TESTING.md) for test scenarios.

---

## 📝 Environment Variables

### Frontend (Vercel)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### Backend (Supabase)
Already configured:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [Contributing Guidelines](./docs/developers/CONTRIBUTING.md) (coming soon).

---

## 📄 License

Proprietary - All rights reserved

---

## 🆘 Support

- **Email**: support@billtup.com
- **Documentation**: [docs/](./docs/)
- **Issues**: Create a GitHub issue

---

## 🎯 Roadmap

See [Implementation Checklist](./docs/IMPLEMENTATION_CHECKLIST.md) for upcoming features.

---

## 📊 Status

- **Version**: 1.1.0
- **Status**: Production Ready
- **Last Updated**: November 21, 2025

---

**Built with ❤️ for service businesses**
