# Web Hosting & Production Deployment

Complete guide for deploying BilltUp to production web hosting.

---

## Quick Deploy to Vercel (5 Minutes)

Your project is already configured for Vercel deployment with security headers and proper routing.

### Prerequisites
- ✅ Your BilltUp app working locally
- ✅ GitHub account (recommended) or Vercel CLI
- ✅ Supabase backend deployed (see below)

### Option 1: Deploy via GitHub (Recommended)

**Step 1: Push to GitHub**
```bash
# If you haven't already
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/billtup.git
git push -u origin main
```

**Step 2: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your BilltUp repository
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `dist` (already configured)
   - **Install Command**: `npm install`

**Step 3: Add Environment Variables**

In Vercel dashboard, add these environment variables:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (if using client-side)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

**Step 4: Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live at `https://billtup.vercel.app`

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? billtup
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

---

## Backend Deployment (Required First!)

**Before deploying the frontend, you MUST deploy your backend:**

### Quick Backend Deploy

**Mac/Linux:**
```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

**Windows:**
```bash
deploy-backend.bat
```

**Manual Deploy:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
npx supabase login

# Link project
npx supabase link --project-ref xrgywtdjdlqthpthyxwj

# Set secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
npx supabase secrets set EMAIL_HOST=smtp.gmail.com
npx supabase secrets set EMAIL_PORT=587
npx supabase secrets set EMAIL_USER=your-email@gmail.com
npx supabase secrets set EMAIL_PASSWORD=your-app-password

# Deploy
npx supabase functions deploy server

# Test
curl https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/health
```

Expected response: `{"status":"ok"}`

---

## Custom Domain Setup

**In Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add your domain (e.g., `billtup.com`)
3. Add DNS records as instructed:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

**Update Supabase Redirect URLs:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your production URLs:
   - Site URL: `https://billtup.com`
   - Redirect URLs: `https://billtup.com/**`

**Update Stripe Redirect URLs:**
1. Go to Stripe Dashboard → Settings → Connect → Settings
2. Update OAuth redirect URIs:
   - Add: `https://billtup.com/oauth/stripe/callback`

---

## Alternative: Deploy to Netlify

### Quick Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build your app
npm run build

# Deploy
netlify deploy --prod

# Follow prompts and select 'dist' as the publish directory
```

### Configuration

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Alternative: Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages publish dist
```

Or use the Cloudflare Pages dashboard to connect your GitHub repo.

---

## Production Checklist

### Before Deploying

- [ ] Backend deployed and tested
- [ ] Environment variables documented
- [ ] Stripe keys switched to live mode (if ready)
- [ ] Email configuration tested
- [ ] Custom domain purchased (optional)
- [ ] SSL certificate configured (automatic on Vercel/Netlify)

### After Deploying

- [ ] ✅ App is accessible at production URL
- [ ] ✅ HTTPS is working (SSL certificate)
- [ ] ✅ Environment variables are set correctly
- [ ] ✅ Supabase connection works
- [ ] ✅ Stripe payments process successfully
- [ ] ✅ Email sending works
- [ ] ✅ All authentication flows work (login, signup, reset password)
- [ ] ✅ Stripe Connect OAuth callback works
- [ ] ✅ Security headers are present (check DevTools → Network)
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ Analytics set up (Google Analytics, Plausible, etc.)
- [ ] ✅ Error tracking configured (Sentry, LogRocket, etc.)

---

## Updating Your App

### Making Changes

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Vercel/Netlify auto-deploys on push
# Or manually deploy with CLI
vercel --prod
# or
netlify deploy --prod
```

### Updating Environment Variables

1. Go to Vercel/Netlify dashboard
2. Navigate to Project Settings → Environment Variables
3. Update variables
4. Trigger new deployment

---

## Monitoring & Performance

### Recommended Tools
- **Vercel Analytics**: Built-in for Vercel users
- **Google Analytics**: Free, comprehensive
- **Sentry**: Error tracking and performance
- **LogRocket**: Session replay and debugging
- **Stripe Dashboard**: Payment analytics

### Performance Optimization
- ✅ Vite already optimizes build
- ✅ Images are lazy-loaded
- ✅ Code splitting enabled
- ✅ CDN delivery (Vercel/Netlify)
- ✅ Gzip compression automatic

---

## Cost Summary

### Development & Testing
- **Supabase Free Tier**: $0/month (500MB database)
- **Stripe**: $0 (only pay when processing payments)
- **Vercel/Netlify Free**: $0/month
- **Total: $0/month**

### Production (Low Volume)
- **Hosting**: $0-20/month (Vercel/Netlify free tier usually sufficient)
- **Database**: $25/month (Supabase Pro)
- **Email**: $0-20/month (SMTP provider)
- **Stripe**: 3.5% + $0.50 per transaction
- **Total:** ~$25-45/month + transaction fees

### Production (High Volume)
- **Hosting**: $20/month (Vercel Pro)
- **Database**: $25-100/month (Supabase Pro/Team)
- **Email**: $20-100/month (SendGrid, etc.)
- **Stripe**: 2.9% + $0.30 per transaction (if using Stripe Connect)
- **Total:** ~$65-220/month + transaction fees

---

## Troubleshooting

### Build Fails on Vercel

```bash
# Solution: Check build logs
# Common issues:
# - Missing environment variables
# - Dependency conflicts
# - TypeScript errors

# Test build locally first
npm run build
```

### API Calls Fail in Production

```bash
# Solution: Check CORS and environment variables
# Ensure Supabase URL/keys are correct
# Check browser console for errors
```

### White Screen After Deploy

```bash
# Solution:
# 1. Check browser console for errors
# 2. Verify environment variables are set
# 3. Check that backend is deployed
# 4. Verify routing is configured correctly
```

---

## Security Best Practices

### HTTPS Only
- ✅ Automatically enforced by Vercel/Netlify
- ✅ Security headers configured in vercel.json

### Environment Variables
- ❌ Never commit API keys to Git
- ✅ Use environment variables for all secrets
- ✅ Different keys for development/production

### API Security
- ✅ All API calls authenticated
- ✅ CORS properly configured
- ✅ Rate limiting enabled (see Security guide)

---

## Quick Reference Commands

### Vercel
```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# Check deployment status
vercel ls
```

### Netlify
```bash
# Deploy to production
netlify deploy --prod

# View logs
netlify logs

# Open dashboard
netlify open
```

### Cloudflare Pages
```bash
# Deploy
wrangler pages publish dist

# View logs
wrangler pages deployment list
```

---

## Next Steps

After successful deployment:

1. ✅ Test all features in production
2. ✅ Set up error tracking (Sentry)
3. ✅ Configure analytics (Google Analytics)
4. ✅ Set up uptime monitoring (UptimeRobot)
5. ✅ Document your deployment process
6. ✅ Share with beta users!

**For mobile apps:** See [MOBILE_APPS.md](./MOBILE_APPS.md)

---

**Last Updated:** November 11, 2025  
**Deployment Time:** 5-10 minutes  
**Difficulty:** Easy
