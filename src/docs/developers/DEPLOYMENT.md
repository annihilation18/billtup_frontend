# Production Deployment Guide

Complete guide for deploying BilltUp to production securely and at scale.

## Quick Start

**Recommended Stack:**
- Frontend: Vercel (Free tier)
- Backend: Supabase (Already deployed)
- Payments: Stripe
- Email: Resend/Nodemailer

**Total cost to start:** $0/month (free tiers)

---

## Deployment Architecture

```
User's Device
     ↓
Vercel CDN (Frontend)
  - React App
  - Static Assets
     ↓
Supabase (Backend - Already Deployed)
  - Edge Functions API
  - PostgreSQL Database
  - File Storage
     ↓
External Services
  - Stripe (Payments)
  - Resend (Emails)
```

---

## Step 1: Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free)
- Domain name (optional)

### Deploy Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git remote add origin https://github.com/yourusername/billtup.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework: Vite (auto-detected)
     - Build Command: `npm run build`
     - Output Directory: `dist`
   
3. **Add Environment Variables**
   - `VITE_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live!

### Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `app.billtup.com`)
3. Update DNS records as instructed
4. SSL is automatic!

---

## Step 2: Security Configuration

### Add Security Headers

Create or update `/vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

### Configure Supabase Auth

1. Go to Supabase Dashboard → Authentication → Settings
2. Enable:
   - Secure email change
   - Refresh token rotation
3. Set JWT expiration to 3600 (1 hour)

---

## Step 3: Stripe Configuration

### Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. Copy "Signing secret"
5. Add to Supabase secrets:
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Switch to Live Mode (When Ready)

1. Complete Stripe account activation
2. Add bank account for payouts
3. Toggle to "Live" mode in Stripe
4. Update `STRIPE_SECRET_KEY` with live key

---

## Step 4: Monitoring Setup

### Vercel Analytics (Free)

```bash
npm install @vercel/analytics
```

```typescript
// Add to App.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      {/* Your app */}
      <Analytics />
    </>
  );
}
```

### Error Tracking (Optional)

**Sentry** (Free tier: 5,000 errors/month)

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

---

## Step 5: Pre-Launch Checklist

### Security
- [ ] All secrets in environment variables
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled (see SECURITY.md)
- [ ] Security headers configured
- [ ] Stripe webhooks verified

### Functionality
- [ ] Sign up/sign in works
- [ ] Invoice creation works
- [ ] Payment processing works
- [ ] Email sending works
- [ ] PDF generation works

### Legal
- [ ] Privacy Policy added
- [ ] Terms of Service added
- [ ] Cookie notice implemented
- [ ] GDPR compliance (data export/deletion)

### Performance
- [ ] Page load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Cross-browser tested

---

## Cost Breakdown

### Starter (0-100 users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Free | $0/mo |
| Supabase | Free | $0/mo |
| Stripe | Pay-per-use | ~2.9% + $0.30 |
| Domain | Annual | ~$12/year |
| **Total** | | **$0-1/mo** |

### Growing (100-1000 users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Pro | $20/mo |
| Supabase | Pro | $25/mo |
| Stripe | Pay-per-use | ~2.9% + $0.30 |
| Monitoring | Sentry Free | $0/mo |
| **Total** | | **$45/mo** |

---

## Scaling Strategy

### 0-100 Users (Months 1-6)
- Stay on free tiers
- Monitor usage
- Gather feedback
- **Action:** None

### 100-1000 Users (Months 6-12)
- Upgrade Vercel → Pro ($20/mo)
- Upgrade Supabase → Pro ($25/mo)
- Add monitoring
- **Action:** Upgrade when approaching limits

### 1000+ Users (Year 2+)
- Consider Supabase Team plan
- Add CDN caching
- Implement data archiving
- **Action:** Plan for optimization

---

## Disaster Recovery

### Backup Strategy

**Automatic (Supabase):**
- Daily database snapshots
- 7-day retention (Free)
- 30-day retention (Pro)

**Manual (Recommended monthly):**
```bash
# Export user data
curl https://your-project.supabase.co/functions/v1/make-server-dce439b6/user/export \
  -H "Authorization: Bearer {token}" \
  > backup-$(date +%Y%m%d).json
```

### Recovery Scenarios

1. **Supabase Outage** (< 1 hour)
   - Display maintenance message
   - Monitor Supabase status page

2. **Data Corruption**
   - Restore from Supabase backup
   - Recovery time: < 1 hour

3. **Stripe Outage** (rare)
   - Queue payments for retry
   - Usually < 30 minutes

---

## Launch Timeline

### Week 1: Security Hardening
- [ ] Add rate limiting
- [ ] Configure security headers
- [ ] Set up Stripe webhooks
- [ ] Add legal pages

### Week 2: Deploy to Production
- [ ] Deploy to Vercel
- [ ] Test thoroughly
- [ ] Set up monitoring
- [ ] Configure custom domain

### Week 3: Soft Launch
- [ ] Invite 10 beta users
- [ ] Gather feedback
- [ ] Fix bugs
- [ ] Monitor performance

### Week 4: Public Launch
- [ ] Open registration
- [ ] Marketing push
- [ ] Monitor closely
- [ ] Provide support

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Project Docs:** See `/docs/developers/`

---

## Next Steps

1. Review [Security Guide](./SECURITY.md)
2. Set up monitoring
3. Test in staging
4. Deploy to production
5. Launch! 🚀

---

*Last Updated: November 21, 2025*
