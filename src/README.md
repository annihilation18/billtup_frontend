# BilltUp - Modern Invoicing App

Professional invoicing application for service businesses (auto detailing, remodeling, photography, etc.) following Material Design 3 guidelines.

---

## 🚀 Quick Start

**New here?** → Start with [docs/getting-started/QUICKSTART.md](./docs/getting-started/QUICKSTART.md) - 10-minute setup guide

**Want to deploy?** → See [docs/deployment/WEB_HOSTING.md](./docs/deployment/WEB_HOSTING.md) - Deploy in 5 minutes

**Need help?** → Check [docs/guides/TROUBLESHOOTING.md](./docs/guides/TROUBLESHOOTING.md) - Common issues & solutions

---

## 📚 Documentation

All documentation is now organized in the `/docs` folder:

- **[docs/README.md](./docs/README.md)** - Documentation index and navigation
- **[docs/CHANGELOG.md](./docs/CHANGELOG.md)** - Complete version history
- **[docs/getting-started/](./docs/getting-started/)** - Setup guides
- **[docs/deployment/](./docs/deployment/)** - Web & mobile deployment
- **[docs/architecture/](./docs/architecture/)** - Technical documentation
- **[docs/features/](./docs/features/)** - Feature-specific guides
- **[docs/guides/](./docs/guides/)** - How-to guides

---

## ⚡ Latest Updates

### [1.5.0] - Monthly Invoice Tracking ✨

Track invoices created each month based on your account anniversary billing cycle:
- 📊 Dashboard shows invoices created this billing month
- 📅 Displays billing period dates and days remaining
- 🔄 Auto-resets counter on your monthly anniversary
- 📈 Foundation for usage-based features

**See:** [MONTHLY_INVOICE_TRACKING.md](./MONTHLY_INVOICE_TRACKING.md)

### [1.4.0] - Documentation Reorganization 📝

- Clean `/docs` folder structure
- Consolidated 62+ files → 16 organized docs
- Complete changelog with all historical changes
- Confluence-ready documentation

### [1.3.0] - DDoS Protection & Security

- Multi-tier rate limiting (100 req/min authenticated)
- Automatic IP blocking after 200 req/min
- Query limits and pagination for all endpoints
- Comprehensive logging and cleanup

### Previous Updates

See [docs/CHANGELOG.md](./docs/CHANGELOG.md) for complete version history.

---

## 📱 Features

### Core Functionality
- ✅ **User Authentication** - Sign up, login, password reset
- ✅ **Business Profile** - Branding, logo, tax settings, bank details
- ✅ **Customer Management** - Full CRUD, search, invoice history
- ✅ **Invoice Builder** - Line items, tax calculation, signature capture
- ✅ **Payment Processing** - Stripe integration (card + NFC)
- ✅ **Email Delivery** - Automatic invoice PDFs via SMTP
- ✅ **Analytics** - Sales tracking (MTD/YTD), revenue charts, monthly counts
- ✅ **Refunds** - Full and partial refund support
- ✅ **Settings** - Tax management, Stripe Connect OAuth

### Design
- 🎨 Material Design 3 principles
- 🎨 Custom color palette (Deep Blue #1E3A8A, Teal #14B8A6, Amber #F59E0B)
- 🎨 Typography system (Poppins, Inter, Roboto Mono)
- 🎨 Responsive (phone, tablet, desktop)
- 🎨 12dp rounded corners throughout

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Runtime:** Deno (Supabase Edge Functions)
- **Framework:** Hono.js
- **Database:** Supabase KV Store
- **Storage:** Supabase Storage
- **Authentication:** Supabase Auth

### External Services
- **Payments:** Stripe API
- **Email:** Nodemailer (SMTP)
- **Hosting:** Vercel (recommended)

**Learn more:** [docs/getting-started/FRAMEWORK.md](./docs/getting-started/FRAMEWORK.md)

---

## 📂 Project Structure

```
billtup/
├── docs/                        # 📚 All documentation
│   ├── README.md               # Documentation index
│   ├── CHANGELOG.md            # Version history
│   ├── getting-started/        # Setup guides
│   ├── deployment/             # Deployment guides
│   ├── architecture/           # Technical docs
│   ├── features/               # Feature guides
│   └── guides/                 # How-to guides
│
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── Dashboard.tsx           # Main dashboard
│   ├── InvoiceBuilder.tsx      # Invoice creation
│   └── ...                     # Other components
│
├── supabase/functions/server/   # Backend API
│   ├── index.tsx               # Main API server
│   └── kv_store.tsx            # Database operations
│
├── utils/
│   ├── api.tsx                 # API client
│   └── supabase/               # Supabase config
│
├── styles/
│   └── globals.css             # Global styles + design tokens
│
├── App.tsx                      # Main app component
├── main.tsx                     # Vite entry point
└── Guidelines.md                # Design system
```

---

## 🔐 Security

### Built-in Security Features
- ✅ HTTPS enforced
- ✅ Secure authentication (JWT)
- ✅ Server-side API keys only
- ✅ PCI DSS compliant (via Stripe)
- ✅ Enterprise-grade DDoS protection
- ✅ Multi-tier rate limiting
- ✅ CORS configured
- ✅ Security headers enabled
- ✅ Request validation
- ✅ User data isolation
- ✅ GDPR compliant

**Learn more:** [docs/guides/SECURITY.md](./docs/guides/SECURITY.md)

---

## 💰 Pricing & Costs

### Development & Testing
- **FREE** - Supabase, Stripe (test mode), Gmail, Vercel
- **Total: $0/month**

### Production (Low Volume)
- **Hosting:** $20/month (Vercel Pro)
- **Database:** $25/month (Supabase Pro)
- **Email:** $0-20/month (SMTP provider)
- **Stripe:** 2.9% + $0.30 per transaction
- **Total:** ~$65/month + transaction fees

**Break even:** 7 customers at $10/month  
**Profitable:** Customer #8 and beyond

---

## 🎯 Getting Started

### 1. Deploy Backend (5 minutes)

```bash
# Mac/Linux
chmod +x deploy-backend.sh
./deploy-backend.sh

# Windows
deploy-backend.bat
```

You'll need:
- Stripe test key from https://dashboard.stripe.com/test/apikeys
- Gmail app password (see [docs/features/EMAIL.md](./docs/features/EMAIL.md))

### 2. Run Locally (2 minutes)

```bash
npm install
npm run dev
```

Open: http://localhost:5173

### 3. Test (3 minutes)

1. Sign up: `test@example.com` / `password123`
2. Complete onboarding
3. Create first invoice
4. Process test payment: `4242 4242 4242 4242`
5. Check email for PDF!

**Full guide:** [docs/getting-started/QUICKSTART.md](./docs/getting-started/QUICKSTART.md)

---

## 🧪 Testing

### Stripe Test Cards

| Scenario | Card Number |
|----------|-------------|
| **Success** | `4242 4242 4242 4242` |
| **Decline** | `4000 0000 0000 0002` |
| **3D Secure** | `4000 0027 6000 3184` |

Use any future date and any 3-digit CVC.

**Full testing guide:** [docs/guides/TESTING.md](./docs/guides/TESTING.md)

---

## 📱 Mobile Apps

Convert to native Android/iOS apps using Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init BilltUp com.billtup.app
npx cap add android ios
npm run build
npx cap sync
```

**Complete guide:** [docs/deployment/MOBILE_APPS.md](./docs/deployment/MOBILE_APPS.md)

---

## 🛠️ Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Guidelines:** [docs/getting-started/FRAMEWORK.md](./docs/getting-started/FRAMEWORK.md)

---

## 🐛 Troubleshooting

### Common Issues

**"Failed to fetch"** → Backend not deployed. Run `./deploy-backend.sh`

**Payment fails** → Use test card `4242 4242 4242 4242`

**Email not arriving** → Check SMTP credentials in Supabase secrets

**White screen** → Check browser console (F12) for errors

**Full troubleshooting:** [docs/guides/TROUBLESHOOTING.md](./docs/guides/TROUBLESHOOTING.md)

---

## 🎓 Learning Path

### Day 1: Local Setup
1. Deploy backend (5 min)
2. Run locally (2 min)
3. Test all features (30 min)

### Day 2: Customization
1. Update branding colors
2. Modify features
3. Test payment flows

### Day 3: Production Deploy
1. Deploy to Vercel
2. Configure custom domain
3. Test in production
4. Invite beta users

### Week 2+: Mobile Apps
1. Follow Capacitor guide
2. Build Android/iOS apps
3. Submit to app stores

---

## 📊 Success Metrics

**✅ 25 Backend APIs** - Fully implemented and tested  
**✅ 12+ Screens** - Complete user journey  
**✅ PCI Compliant** - Via Stripe integration  
**✅ GDPR Ready** - Data export/deletion  
**✅ Mobile Ready** - Capacitor setup included  
**✅ Production Ready** - Security hardened  
**✅ Well Documented** - Organized `/docs` folder  
**✅ Monthly Tracking** - Invoice counting by billing cycle  

---

## 🆘 Getting Help

### Quick Links

- **📖 Documentation:** [docs/README.md](./docs/README.md)
- **🚀 Quick Start:** [docs/getting-started/QUICKSTART.md](./docs/getting-started/QUICKSTART.md)
- **🔧 Troubleshooting:** [docs/guides/TROUBLESHOOTING.md](./docs/guides/TROUBLESHOOTING.md)
- **💳 Payments:** [docs/features/PAYMENTS.md](./docs/features/PAYMENTS.md)
- **📧 Email:** [docs/features/EMAIL.md](./docs/features/EMAIL.md)
- **🚀 Deploy:** [docs/deployment/WEB_HOSTING.md](./docs/deployment/WEB_HOSTING.md)

### External Resources

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## 🚀 Next Steps

After local setup:

1. ✅ **Test thoroughly** - Try all features
2. ✅ **Deploy to production** - [WEB_HOSTING.md](./docs/deployment/WEB_HOSTING.md)
3. ✅ **Create mobile apps** - [MOBILE_APPS.md](./docs/deployment/MOBILE_APPS.md)
4. ✅ **Launch your business** - Start acquiring customers!

---

## 📝 License

This is a proprietary application. All rights reserved.

---

## 🎉 Latest Features

### Monthly Invoice Tracking
- Track invoices by account anniversary billing cycle
- View count and days remaining in Dashboard
- Auto-reset each billing month
- See [MONTHLY_INVOICE_TRACKING.md](./MONTHLY_INVOICE_TRACKING.md)

### Documentation Reorganization
- Clean `/docs` folder structure
- 62+ files consolidated to 16
- Complete changelog
- Confluence-ready format

---

**Ready to get started?** → [docs/getting-started/QUICKSTART.md](./docs/getting-started/QUICKSTART.md)

**Need to deploy?** → [docs/deployment/WEB_HOSTING.md](./docs/deployment/WEB_HOSTING.md)

**Questions?** → [docs/guides/TROUBLESHOOTING.md](./docs/guides/TROUBLESHOOTING.md)

---

*Last updated: November 11, 2025*  
*Version: 1.5.0*  
*Status: Production Ready ✅*
