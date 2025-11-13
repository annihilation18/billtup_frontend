# 🚀 BilltUp Quickstart Guide

Get BilltUp up and running in **10 minutes**.

---

## Prerequisites

Before you start, ensure you have:
- ✅ **Node.js 16+** installed ([download here](https://nodejs.org))
- ✅ **Git** (optional but recommended)
- ✅ **Stripe account** (free, for payment processing)
- ✅ **Gmail or SMTP email** (for sending invoices)

---

## What You're Getting

BilltUp is a complete, production-ready invoicing application:

✅ User authentication (sign up, login, password reset)  
✅ Business profile management with logo upload  
✅ Customer management (CRUD operations)  
✅ Invoice builder with line items and tax calculation  
✅ Payment processing via Stripe  
✅ Automatic email delivery of invoices  
✅ Sales analytics and reporting  
✅ Refund support (full and partial)  
✅ Material Design 3 UI  
✅ Fully responsive (mobile, tablet, desktop)  
✅ 25 backend API endpoints  

---

## Quick Setup (3 Steps)

### Step 1: Deploy Backend (5 minutes)

Your backend code exists in `/supabase/functions/server/` but needs to be deployed to Supabase.

**Mac/Linux:**
```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

**Windows:**
```bash
deploy-backend.bat
```

The script will guide you through:
1. Logging into Supabase
2. Linking your project
3. Setting environment variables (Stripe, Email)
4. Deploying the server function

**You'll need:**
- **Stripe Test Key** from https://dashboard.stripe.com/test/apikeys
- **Email SMTP credentials** (see [Email Setup](#email-setup) below)

---

### Step 2: Run Locally (2 minutes)

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Open your browser to: **http://localhost:5173**

---

### Step 3: Test It Works (3 minutes)

**1. Sign Up**
- Click "Get Started"
- Email: `test@example.com`
- Password: `password123`
- Business Name: `My Test Business`

**2. Complete Onboarding**
- Fill in business details
- Upload a logo (optional)
- Add bank information

**3. Create Your First Invoice**
- Click "Create Invoice"
- Add a customer (or create new)
- Add line items
- Set totals

**4. Process a Test Payment**
- Use Stripe test card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- Click "Pay"

**5. Check Your Email**
- Invoice PDF should arrive automatically!
- Check spam folder if not in inbox

---

## ✅ Success Checklist

You know it's working when:

- [ ] Health check passes: `curl https://YOUR_PROJECT.supabase.co/functions/v1/server/health`
- [ ] You can sign up and log in
- [ ] Can create customers
- [ ] Can create invoices
- [ ] Test payment succeeds
- [ ] Email arrives with PDF attachment
- [ ] Dashboard shows analytics

---

## Email Setup

BilltUp uses **Nodemailer** to send invoice emails via SMTP.

### Option 1: Gmail (Recommended for Testing)

**1. Enable 2-Factor Authentication**
- Go to https://myaccount.google.com/security
- Enable 2-Step Verification

**2. Create App Password**
- Visit https://myaccount.google.com/apppasswords
- Select "Mail" and "Other (Custom name)"
- Name it "BilltUp"
- Copy the 16-character password

**3. Add to Supabase**
```bash
npx supabase secrets set SMTP_HOST=smtp.gmail.com
npx supabase secrets set SMTP_PORT=587
npx supabase secrets set SMTP_USER=your.email@gmail.com
npx supabase secrets set SMTP_PASSWORD=your-16-char-app-password
npx supabase secrets set SMTP_FROM_EMAIL=your.email@gmail.com
npx supabase secrets set SMTP_FROM_NAME="Your Business Name"
```

### Option 2: Other SMTP Providers

**Popular options:**
- **Outlook/Office 365**: `smtp.office365.com`, port 587
- **SendGrid**: `smtp.sendgrid.net`, port 587
- **Mailgun**: `smtp.mailgun.org`, port 587

Use the same `npx supabase secrets set` commands with your provider's settings.

**Need more help?** See [docs/features/EMAIL.md](../features/EMAIL.md)

---

## Troubleshooting

### "Failed to Fetch" Error

**Problem:** Frontend can't reach the backend  
**Solution:** Backend isn't deployed yet

```bash
# Run the deployment script
./deploy-backend.sh  # Mac/Linux
deploy-backend.bat   # Windows
```

Check deployment:
```bash
# Test health endpoint
curl https://YOUR_PROJECT.supabase.co/functions/v1/server/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

### Payment Fails

**Problem:** "Payment failed" error  
**Solution:** Make sure you're using a Stripe test card

**Valid test cards:**
```
Success:     4242 4242 4242 4242
Decline:     4000 0000 0000 0002
3D Secure:   4000 0027 6000 3184
```

Use any future expiry date and any 3-digit CVC.

**In production:** Use `STRIPE_SECRET_KEY` starting with `sk_live_...`

---

### Email Not Arriving

**Problem:** Invoice email doesn't arrive  
**Solution:** Check your SMTP credentials

**Debugging steps:**
1. Check Supabase Function logs:
   ```bash
   npx supabase functions logs server
   ```

2. Verify SMTP secrets are set:
   ```bash
   npx supabase secrets list
   ```

3. Test email credentials outside of app:
   ```bash
   # Use an online SMTP tester or mail client
   ```

4. Check spam folder

**For Gmail:** Make sure you're using an App Password, not your regular password

---

### White Screen / App Won't Load

**Problem:** Blank white screen  
**Solution:** Check browser console for errors

1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for error messages
4. Common issues:
   - Environment variables not set
   - Backend URL incorrect in `utils/supabase/client.tsx`
   - CORS issues (check backend logs)

---

### "npm command not found"

**Problem:** `npm: command not found`  
**Solution:** Install Node.js

Download from https://nodejs.org (LTS version recommended)

Verify installation:
```bash
node --version  # Should show v16 or higher
npm --version   # Should show 8 or higher
```

---

## Your Supabase Project

**Project Details:**
- **Project ID:** `xrgywtdjdlqthpthyxwj`
- **Dashboard:** https://app.supabase.com/project/xrgywtdjdlqthpthyxwj
- **API URL:** https://xrgywtdjdlqthpthyxwj.supabase.co

**Backend URL:**
```
https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/server
```

**Health Check:**
```bash
curl https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/server/health
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy backend
./deploy-backend.sh

# View backend logs
npx supabase functions logs server

# Run backend tests
curl https://YOUR_PROJECT.supabase.co/functions/v1/server/health
```

---

## Test Data

### Stripe Test Cards

| Scenario | Card Number | Description |
|----------|-------------|-------------|
| **Success** | `4242 4242 4242 4242` | Payment succeeds |
| **Decline** | `4000 0000 0000 0002` | Card declined |
| **Insufficient Funds** | `4000 0000 0000 9995` | Insufficient funds |
| **3D Secure** | `4000 0027 6000 3184` | Requires authentication |

**For all cards:**
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Test User Flow

1. **Sign up:** test@example.com / password123
2. **Business:** My Test Business
3. **Customer:** John Doe / john@example.com
4. **Invoice:** 
   - Item 1: Consulting / $100
   - Item 2: Design Work / $150
   - Tax: 8.5%
   - Total: $271.25
5. **Payment:** Test card `4242 4242 4242 4242`
6. **Receipt:** Check email for PDF

---

## Environment Variables

### Frontend (.env.local)

Create a `.env.local` file in the project root:

```bash
# Supabase
VITE_SUPABASE_URL=https://xrgywtdjdlqthpthyxwj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Stripe (for client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

Get your anon key from: Supabase Dashboard → Settings → API

### Backend (Supabase Secrets)

Set via CLI (already done in deploy script):

```bash
# Stripe
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key

# Email (Nodemailer SMTP)
npx supabase secrets set SMTP_HOST=smtp.gmail.com
npx supabase secrets set SMTP_PORT=587
npx supabase secrets set SMTP_USER=your.email@gmail.com
npx supabase secrets set SMTP_PASSWORD=your_app_password
npx supabase secrets set SMTP_FROM_EMAIL=your.email@gmail.com
npx supabase secrets set SMTP_FROM_NAME="Your Business"

# Stripe Connect (optional, for platform mode)
npx supabase secrets set STRIPE_CONNECT_CLIENT_ID=ca_your_id
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret
```

---

## Costs

### Development & Testing

**FREE** - All services have generous free tiers:
- **Supabase:** $0/month (500MB database, 1GB storage, 2GB bandwidth)
- **Stripe:** $0 (only pay per transaction: 2.9% + $0.30)
- **Email (Gmail):** $0 (use your personal Gmail)
- **Vercel (hosting):** $0/month

**Total:** $0 to start!

### Production (Low Volume)

**For ~100 businesses:**
- **Hosting (Vercel Pro):** $20/month
- **Supabase Pro:** $25/month
- **Email (SendGrid):** $20/month or use transactional provider
- **Stripe fees:** 2.9% + $0.30 per transaction

**Total:** ~$65/month + transaction fees

**Break even:** 7 customers at $10/month  
**Profitable:** Customer #8 and beyond

---

## Next Steps

### After Local Setup Works

1. ✅ **Test thoroughly** - Try all features, explore the UI
2. ✅ **Deploy to production** - See [docs/deployment/WEB_HOSTING.md](../deployment/WEB_HOSTING.md)
3. ✅ **Configure custom domain** - Point your domain to Vercel
4. ✅ **Switch to production Stripe** - Use `sk_live_...` keys
5. ✅ **Set up production email** - Configure reliable SMTP provider

### Optional: Mobile Apps

Want native Android/iOS apps?

See [docs/deployment/MOBILE_APPS.md](../deployment/MOBILE_APPS.md) for:
- Capacitor setup (wraps your web app)
- 30-60 minute setup
- NFC payment support
- Camera integration
- App store submission

---

## Learning Path

### Day 1: Local Setup & Testing
1. Deploy backend (5 min)
2. Run locally (2 min)
3. Test all features (30 min)
4. Familiarize with UI and workflows

### Day 2: Customization
1. Update branding colors in `styles/globals.css`
2. Modify features as needed
3. Test payment flows extensively
4. Add your business logo

### Day 3: Production Deployment
1. Deploy to Vercel ([WEB_HOSTING.md](../deployment/WEB_HOSTING.md))
2. Configure custom domain
3. Test in production with real payments
4. Invite beta users

### Week 2+: Advanced Features
1. Mobile apps ([MOBILE_APPS.md](../deployment/MOBILE_APPS.md))
2. Advanced analytics
3. Custom invoice templates
4. Integration with other tools

---

## Documentation

### Essential Docs
- **[FRAMEWORK.md](./FRAMEWORK.md)** - Technical stack and architecture
- **[WEB_HOSTING.md](../deployment/WEB_HOSTING.md)** - Deploy to production
- **[TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md)** - Common issues

### Feature Docs
- **[PAYMENTS.md](../features/PAYMENTS.md)** - Stripe integration guide
- **[EMAIL.md](../features/EMAIL.md)** - Email configuration
- **[ANALYTICS.md](../features/ANALYTICS.md)** - Sales tracking

### Reference Docs
- **[API.md](../architecture/API.md)** - Backend API specification
- **[DATABASE.md](../architecture/DATABASE.md)** - Database schema
- **[SECURITY.md](../guides/SECURITY.md)** - Security best practices

---

## Getting Help

### Self-Service (Fastest)

1. **Check this quickstart** - Covers 90% of setup issues
2. **Check [TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md)** - Common problems & solutions
3. **Check browser console** - F12 → Console tab for errors
4. **Check backend logs** - `npx supabase functions logs server`

### Service Dashboards

- **Supabase:** https://app.supabase.com/project/xrgywtdjdlqthpthyxwj
- **Stripe:** https://dashboard.stripe.com
- **Gmail (if used):** https://mail.google.com

### External Resources

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs

---

## Success!

You're ready to go when all these work:

✅ Backend health check returns `{"status":"ok"}`  
✅ Can sign up and log in  
✅ Can create customers  
✅ Can create invoices  
✅ Test payment succeeds  
✅ Email arrives with PDF  
✅ Dashboard shows stats  

**Congratulations! You now have a fully functional invoicing application.** 🎉

---

## What's Included

**25 Backend API Endpoints:**
- Authentication (3): Login, signup, session
- Business (5): CRUD, logo, settings
- Customers (4): CRUD operations
- Invoices (6): Create, read, update, list, delete, PDF
- Payments (5): Process, refund, retrieve, list
- Email (2): Send invoice, send receipt

**12+ Frontend Screens:**
- Splash screen
- Login/signup
- Onboarding
- Dashboard
- Invoice builder
- Payment processing
- Receipt screen
- Customer management
- Invoice detail
- Settings
- Password reset
- Stripe OAuth callback

**Security Features:**
- HTTPS enforced
- JWT authentication
- Server-side API keys only
- PCI compliant (via Stripe)
- CORS configured
- Security headers
- Rate limiting
- Input validation

---

**Ready to deploy to production?** → [WEB_HOSTING.md](../deployment/WEB_HOSTING.md)

**Need help?** → [TROUBLESHOOTING.md](../guides/TROUBLESHOOTING.md)

**Want to understand the code?** → [FRAMEWORK.md](./FRAMEWORK.md)

---

*Last updated: November 11, 2025*
