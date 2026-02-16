# BilltUp Deployment Guide - Namecheap Stellar Hosting

Complete setup guide for deploying to your Namecheap Stellar hosting with GitLab CI/CD.

---

## What You Have

✅ **Namecheap Domain**: billtup.com  
✅ **Namecheap Stellar Hosting**: Shared hosting with cPanel  
✅ **GitLab**: For code repository and CI/CD (you'll set this up)  
✅ **Supabase**: Backend (already configured)

---

## How It Works

```
Push Code → GitLab CI/CD → Build React App → Upload via FTP → Namecheap Server
```

**Three Environments:**
- `dev` branch → Auto-deploy → https://dev.billtup.com
- `staging` branch → Auto-deploy → https://staging.billtup.com  
- `main` branch → Manual deploy → https://billtup.com

---

## Part 1: Access Your Namecheap cPanel

### Step 1: Log into cPanel

1. Go to https://www.namecheap.com
2. Sign in to your account
3. Click "**Domain List**" (make sure "All Products" view is selected)
4. Hover over the **Hosting** icon for billtup.com
5. Click "**Manage**" from the drop-down menu
6. Click "**Go to cPanel**"

**Note:** It may take up to 30 minutes for your new hosting account to be activated after purchase.

---

## Part 2: Create Subdomains in cPanel

You need to create subdomains for dev and staging environments.

### Step 1: Find Domains Section

In cPanel, look for the **"Domains"** section and click on it.

### Step 2: Create DEV Subdomain

1. Click "**Create A New Domain**"
2. Fill in the form:
   - **Domain**: `dev.billtup.com`
   - **Document Root**: Leave as suggested (usually `/home/USERNAME/dev.billtup.com`)
   - **Uncheck** "Share document root" if checked
3. Click "**Submit**"

**Save the Document Root path shown** - you'll need this for GitLab! (Example: `/home/username123/dev.billtup.com`)

### Step 3: Create STAGING Subdomain

1. Click "**Create A New Domain**" again
2. Fill in the form:
   - **Domain**: `staging.billtup.com`
   - **Document Root**: Leave as suggested (usually `/home/USERNAME/staging.billtup.com`)
   - **Uncheck** "Share document root" if checked
3. Click "**Submit**"

**Save the Document Root path shown** - you'll need this for GitLab!

### Step 4: Verify Your Main Domain

Your main domain `billtup.com` should already be set up and point to:
- **Document Root**: `/home/USERNAME/public_html` (this is standard for cPanel)

You can verify this in cPanel → Domains section.

---

## Part 3: Enable SSL Certificates

Namecheap provides **free PositiveSSL certificates** for all domains.

### Enable SSL for All Domains:

1. In cPanel, find **"SSL/TLS Status"** (usually under "Security" section)
2. You should see all your domains listed:
   - billtup.com
   - www.billtup.com
   - dev.billtup.com
   - staging.billtup.com
3. Check the boxes next to all domains
4. Click "**Run AutoSSL**" or "**Install SSL**"
5. Wait 5-10 minutes for certificates to be issued

**Result:** All your domains will have HTTPS enabled automatically!

---

## Part 4: Create FTP Accounts

You'll need FTP credentials to deploy your website files.

### Option A: Find Your Main FTP Credentials (Easiest)

1. Check your email for "**Your Hosting Account Details for billtup.com**"
2. This email contains:
   - **FTP Host**: Usually `ftp.billtup.com` or your server name
   - **FTP Username**: Your main cPanel username
   - **FTP Password**: Your cPanel password
3. **Save these credentials** - you can use them for all three environments

**For the FTP paths:**
- **Production**: `/public_html`
- **Dev**: `/dev.billtup.com` (or the document root you saved earlier)
- **Staging**: `/staging.billtup.com` (or the document root you saved earlier)

### Option B: Create Separate FTP Accounts (More Secure)

In cPanel → **FTP Accounts**:

#### Create DEV FTP Account:
1. Click "**Add FTP Account**"
2. **Log in**: `dev` (this becomes `dev@billtup.com`)
3. **Password**: Create a strong password (save this!)
4. **Directory**: Select the dev.billtup.com directory (or leave default)
5. **Quota**: Unlimited
6. Click "**Create FTP Account**"

**Save these credentials:**
- Username: `dev@billtup.com`
- Password: (the one you just created)
- Path: The directory shown (e.g., `/home/username123/dev.billtup.com`)

#### Create STAGING FTP Account:
1. Click "**Add FTP Account**"
2. **Log in**: `staging` (becomes `staging@billtup.com`)
3. **Password**: Create a strong password (save this!)
4. **Directory**: Select the staging.billtup.com directory
5. Click "**Create FTP Account**"

**Save these credentials:**
- Username: `staging@billtup.com`
- Password: (the one you just created)
- Path: The directory shown

#### Create PRODUCTION FTP Account:
1. Click "**Add FTP Account**"
2. **Log in**: `production` (becomes `production@billtup.com`)
3. **Password**: Create a strong password (save this!)
4. **Directory**: `/public_html` (or your main domain root)
5. Click "**Create FTP Account**"

**Save these credentials:**
- Username: `production@billtup.com`
- Password: (the one you just created)
- Path: `/public_html`

---

## Part 5: Get Your FTP Host

You need to know your FTP server address.

### Find Your FTP Host:

**Method 1: Check Welcome Email**
- Look for email: "Your Hosting Account Details for billtup.com"
- Find the FTP hostname (usually `ftp.billtup.com` or `server123.web-hosting.com`)

**Method 2: Check cPanel**
- In cPanel, look for "FTP Accounts"
- Your FTP server is usually shown at the top

**Method 3: Use Your Domain**
- Try: `ftp.billtup.com` or just `billtup.com`

**Save this:** You'll use the same FTP host for all three environments.

---

## Part 6: Summary of Information Needed

Before proceeding to GitLab, make sure you have:

### ✅ FTP Credentials Collected:

**For DEV:**
- FTP Host: `ftp.billtup.com` (or your server)
- FTP Username: `dev@billtup.com` (or main account)
- FTP Password: (saved)
- FTP Path: `/dev.billtup.com` or `/home/username123/dev.billtup.com`

**For STAGING:**
- FTP Host: `ftp.billtup.com` (or your server)
- FTP Username: `staging@billtup.com` (or main account)
- FTP Password: (saved)
- FTP Path: `/staging.billtup.com` or `/home/username123/staging.billtup.com`

**For PRODUCTION:**
- FTP Host: `ftp.billtup.com` (or your server)
- FTP Username: `production@billtup.com` (or main account)
- FTP Password: (saved)
- FTP Path: `/public_html`

**Important Note on FTP Paths:**
- If using separate FTP accounts, paths are usually **relative** to that account's home directory
- Try using just `./` or `.` for the path (current directory)
- If that doesn't work, use the full absolute path: `/home/username123/dev.billtup.com`

---

## Part 7: GitLab Setup

### Step 1: Create GitLab Account & Repository

1. Go to https://gitlab.com
2. Sign up for a free account (if you don't have one)
3. Click "**New Project**" → "**Create blank project**"
4. **Project name**: `billtup-website`
5. **Visibility**: Private (recommended)
6. **Uncheck** "Initialize repository with a README"
7. Click "**Create project**"

### Step 2: Push Your Code to GitLab

Open a terminal in your project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add GitLab as remote
git remote add origin https://gitlab.com/YOUR_USERNAME/billtup-website.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Rename branch to main
git branch -M main

# Push to GitLab
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitLab username!**

### Step 3: Create Dev and Staging Branches

```bash
# Create dev branch
git checkout -b dev
git push -u origin dev

# Create staging branch
git checkout -b staging
git push -u origin staging

# Go back to main
git checkout main
```

---

## Part 8: Add CI/CD Variables to GitLab

Now you'll add all the credentials to GitLab so the pipeline can deploy automatically.

### How to Add Variables:

1. In GitLab, go to your project: `billtup-website`
2. Click **Settings** (left sidebar)
3. Click **CI/CD**
4. Expand **Variables** section
5. Click "**Add variable**"

### Variables to Add:

#### 1. Stripe Keys (3 variables)

Get these from https://dashboard.stripe.com → Developers → API Keys

| Key | Value | Masked | Protected |
|-----|-------|--------|-----------|
| `VITE_STRIPE_PUBLISHABLE_KEY_DEV` | `pk_test_xxxxx...` | ✅ Yes | ✅ Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY_STAGING` | `pk_test_xxxxx...` | ✅ Yes | ✅ Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY_PRODUCTION` | `pk_test_xxxxx...` (or live key) | ✅ Yes | ✅ Yes |

**Tip:** Use the same test key for all 3 initially. Switch production to live key when ready.

#### 2. FTP Credentials for DEV (4 variables)

Use the information you collected from cPanel:

| Key | Value | Masked | Protected |
|-----|-------|--------|-----------|
| `FTP_HOST_DEV` | `ftp.billtup.com` | ❌ No | ✅ Yes |
| `FTP_USERNAME_DEV` | `dev@billtup.com` | ❌ No | ✅ Yes |
| `FTP_PASSWORD_DEV` | (your dev FTP password) | ✅ Yes | ✅ Yes |
| `FTP_PATH_DEV` | `./` or `/dev.billtup.com` | ❌ No | ✅ Yes |

#### 3. FTP Credentials for STAGING (4 variables)

| Key | Value | Masked | Protected |
|-----|-------|--------|-----------|
| `FTP_HOST_STAGING` | `ftp.billtup.com` | ❌ No | ✅ Yes |
| `FTP_USERNAME_STAGING` | `staging@billtup.com` | ❌ No | ✅ Yes |
| `FTP_PASSWORD_STAGING` | (your staging FTP password) | ✅ Yes | ✅ Yes |
| `FTP_PATH_STAGING` | `./` or `/staging.billtup.com` | ❌ No | ✅ Yes |

#### 4. FTP Credentials for PRODUCTION (4 variables)

| Key | Value | Masked | Protected |
|-----|-------|--------|-----------|
| `FTP_HOST_PRODUCTION` | `ftp.billtup.com` | ❌ No | ✅ Yes |
| `FTP_USERNAME_PRODUCTION` | `production@billtup.com` | ❌ No | ✅ Yes |
| `FTP_PASSWORD_PRODUCTION` | (your production FTP password) | ✅ Yes | ✅ Yes |
| `FTP_PATH_PRODUCTION` | `./` or `/public_html` | ❌ No | ✅ Yes |

**Total: 15 variables**

### Important Notes on FTP_PATH:

**If you created separate FTP accounts:**
- Try using `./` (current directory) first
- The FTP user will log in directly to their assigned directory
- No need for full paths

**If you're using the main FTP account:**
- Use full paths like `/public_html`, `/dev.billtup.com`, `/staging.billtup.com`

**Not sure? Start with `./` and adjust if it fails.**

---

## Part 9: Test Your First Deployment

Everything is set up! Time to test.

### Test DEV Deployment:

```bash
# Make sure you're on dev branch
git checkout dev

# Make a small change to test
echo "# Deployment test" >> README.md

# Commit and push
git add README.md
git commit -m "Test dev deployment"
git push origin dev
```

**What happens next:**

1. GitLab CI/CD automatically detects the push
2. Runs the pipeline:
   - ✅ Installs npm packages
   - ✅ Builds your React app
   - ✅ Uploads to Namecheap via FTP
3. Your site is live at https://dev.billtup.com

### Watch the Pipeline:

1. Go to your GitLab project
2. Click **CI/CD** → **Pipelines** (left sidebar)
3. You'll see a pipeline running (blue spinner)
4. Click on it to see details
5. Click on each job to see logs

**If it succeeds:** ✅ Visit https://dev.billtup.com

**If it fails:** See troubleshooting section below

### Test STAGING Deployment:

```bash
# Switch to staging
git checkout staging

# Merge dev changes
git merge dev

# Push
git push origin staging
```

**Access:** https://staging.billtup.com

### Test PRODUCTION Deployment:

```bash
# Switch to main
git checkout main

# Merge staging
git merge staging

# Push
git push origin main
```

**What happens:**
1. Pipeline starts
2. **Pauses** at the deploy step
3. Go to **CI/CD → Pipelines**
4. Click on the running pipeline
5. Click the **Play** button (▶️) next to `deploy_production`
6. Deployment proceeds

**Access:** https://billtup.com

---

## Part 10: Verify Everything Works

### Check Your Sites:

| Environment | URL | Should Show |
|-------------|-----|-------------|
| Dev | https://dev.billtup.com | Your React app |
| Staging | https://staging.billtup.com | Your React app |
| Production | https://billtup.com | Your React app |

### What to Test:

- ✅ Site loads (no errors)
- ✅ HTTPS works (padlock 🔒 in browser)
- ✅ All pages work (Home, Pricing, Contact, etc.)
- ✅ React Router works (URL changes when navigating)
- ✅ Forms work (Contact form submits)
- ✅ Images load
- ✅ Mobile responsive
- ✅ Stripe integration (test mode)

---

## Daily Development Workflow

Once everything is working, here's your daily workflow:

### Making Changes:

```bash
# 1. Start on dev branch
git checkout dev
git pull origin dev

# 2. Make your changes
# ... edit files in your code editor ...

# 3. Test locally (optional)
npm run dev

# 4. Commit and push (auto-deploys to dev.billtup.com)
git add .
git commit -m "Add new feature"
git push origin dev

# 5. Wait for pipeline to complete
# Check https://dev.billtup.com

# 6. When ready for staging
git checkout staging
git pull origin staging
git merge dev
git push origin staging

# 7. Test on https://staging.billtup.com

# 8. When ready for production
git checkout main
git pull origin main
git merge staging
git push origin main

# 9. Approve deployment in GitLab
# Go to CI/CD → Pipelines → Click Play button
```

---

## Troubleshooting

### Issue: Pipeline fails with "Login incorrect"

**Cause:** Wrong FTP credentials

**Solution:**
1. Go to cPanel → FTP Accounts
2. Verify the username format (should be `user@billtup.com`)
3. Reset password if needed
4. Update GitLab CI/CD variables with correct credentials

### Issue: Pipeline fails with "Can't change directory to..."

**Cause:** Wrong FTP path

**Solutions to try (in order):**

1. **Try relative path:** Change FTP_PATH to `./`
2. **Try current directory:** Change FTP_PATH to `.`
3. **Try without path:** Change FTP_PATH to empty string (just leave value blank)
4. **Try subdomain name:** Change FTP_PATH to `/dev.billtup.com`
5. **Try absolute path:** Use full path from cPanel (e.g., `/home/username123/dev.billtup.com`)

**How to update:**
- GitLab → Settings → CI/CD → Variables
- Find the FTP_PATH variable
- Click edit (pencil icon)
- Change the value
- Save
- Push to that branch again to re-trigger pipeline

### Issue: Pipeline succeeds but site shows cPanel default page

**Cause:** Files uploaded to wrong directory

**Solution:**
1. Log into cPanel → File Manager
2. Navigate to the directory (e.g., `/dev.billtup.com`)
3. Check if your files are there (should see `index.html`, `assets/`, etc.)
4. If files are in wrong place, adjust FTP_PATH and redeploy

### Issue: Site works but shows 404 on page refresh (React Router issue)

**Cause:** `.htaccess` file not working or missing

**Solution:**
1. Check cPanel File Manager - verify `.htaccess` exists
2. Verify the file has correct content (should match the one in `/public/.htaccess`)
3. In cPanel → File Manager → Settings → Check "Show Hidden Files"
4. Make sure `.htaccess` is in the root of each domain directory

### Issue: SSL certificate not showing (not HTTPS)

**Cause:** SSL not enabled yet

**Solution:**
1. Wait 30 minutes after creating subdomains
2. cPanel → SSL/TLS Status
3. Check boxes for all domains
4. Click "Run AutoSSL" again
5. Wait 5-10 minutes

### Issue: Old version of site showing after deployment

**Cause:** Browser cache

**Solution:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or clear browser cache
3. Check in incognito/private window

### Issue: GitLab shows "Pipeline configuration is invalid"

**Cause:** Syntax error in `.gitlab-ci.yml`

**Solution:**
1. Go to GitLab → CI/CD → Editor
2. Click "Validate"
3. Fix any errors shown
4. Commit the fix

### Issue: FTP upload is very slow

**Cause:** Large files or slow connection

**Solution:**
1. This is normal for first deployment (uploads everything)
2. Subsequent deploys are faster (only uploads changed files)
3. Optimize images before committing
4. Consider compressing assets

---

## Testing FTP Connection Manually

If you want to verify your FTP credentials work before adding to GitLab:

### Use FileZilla (Free FTP Client):

1. Download FileZilla from https://filezilla-project.org
2. Install and open FileZilla
3. Enter your credentials:
   - **Host**: `ftp.billtup.com`
   - **Username**: `dev@billtup.com` (or your username)
   - **Password**: (your FTP password)
   - **Port**: 21
4. Click "Quickconnect"

**If it connects:** Your credentials are correct! ✅
**If it fails:** Check username, password, or FTP host

---

## Security Best Practices

1. **Use Strong Passwords**
   - 20+ characters
   - Mix of letters, numbers, symbols
   - Use a password manager

2. **Enable Two-Factor Authentication (2FA)**
   - Namecheap Account: Profile → Security → Enable 2FA
   - GitLab Account: Preferences → Account → Enable 2FA

3. **Use Separate FTP Accounts**
   - Don't use the same account for all environments
   - Easier to track and revoke access if needed

4. **Keep Stripe in Test Mode**
   - Use `pk_test_xxxxx` keys until ready to go live
   - Don't enable live payments until thoroughly tested

5. **Protected Branches**
   - GitLab → Settings → Repository → Protected Branches
   - Protect `main` and `staging` branches
   - Require merge requests for changes

6. **Never Commit Secrets**
   - Use GitLab CI/CD variables for all passwords/keys
   - Add sensitive files to `.gitignore`

7. **Regular Backups**
   - cPanel has automatic backups
   - Download manual backups occasionally
   - cPanel → Backup → Download a Full Account Backup

---

## Monitoring Your Sites

### 1. Uptime Monitoring (Free)

**UptimeRobot** (https://uptimerobot.com):
- Free plan: 50 monitors
- Set up monitors for all 3 domains
- Get email alerts if site goes down

### 2. Performance Monitoring

**Google PageSpeed Insights** (https://pagespeed.web.dev):
- Check your site speed
- Get optimization recommendations
- Aim for 90+ score

### 3. Error Monitoring (Optional)

**Sentry** (https://sentry.io):
- Free tier available
- Tracks JavaScript errors
- Helps debug production issues

### 4. Analytics (Optional)

**Google Analytics** (https://analytics.google.com):
- Track visitors
- See which pages are popular
- Understand user behavior

---

## Cost Summary

**What you're paying:**
- Namecheap Domain: ~$12/year ✅ (already paid)
- Namecheap Stellar Hosting: ~$24-48/year ✅ (already paid)
- SSL Certificates: FREE (included with hosting)

**What's free:**
- GitLab: 400 CI/CD minutes/month (FREE)
- Supabase: Free tier (already using)
- FTP deployment: FREE

**Total monthly cost: $0** 🎉

---

## When to Upgrade

You're on the free tier for everything except hosting (which you've already paid for).

**You might need to upgrade GitLab if:**
- You exceed 400 CI/CD minutes per month
- You need more than 5GB storage
- You want advanced features

**GitLab Premium:** $19/month per user
- 10,000 CI/CD minutes
- Advanced CI/CD features
- Better support

---

## Next Steps After Successful Deployment

### 1. Set Up Custom Email

In cPanel → Email Accounts:
- Create email addresses: contact@billtup.com, support@billtup.com
- Configure in your email client
- Update contact form to use your custom email

### 2. Configure Contact Form

Update your contact form to actually send emails:
- Use cPanel email SMTP
- Or integrate with a service like SendGrid, Mailgun
- Test thoroughly in dev environment first

### 3. Enable Google Analytics

1. Create Google Analytics account
2. Get tracking ID
3. Add to your React app
4. Deploy to production

### 4. Test Stripe Payments Thoroughly

- Test all payment flows in staging
- Verify subscription creation works
- Test edge cases (card declined, etc.)

### 5. Switch to Live Stripe Keys (When Ready)

1. Get live keys from Stripe Dashboard
2. Update `VITE_STRIPE_PUBLISHABLE_KEY_PRODUCTION` in GitLab
3. Deploy to production
4. Test with real (small) payment

### 6. Add Robots.txt and Sitemap

- For SEO optimization
- Help Google index your site
- Already included if using standard React setup

### 7. Set Up Regular Backups

- cPanel does automatic backups
- Download manual backup monthly: cPanel → Backup
- Store backups in safe location (external drive, cloud)

---

## Quick Reference Card

### 🔐 Where Everything Is:

**Namecheap:**
- cPanel: Domain List → Hover Hosting → Manage → Go to cPanel
- FTP Accounts: cPanel → FTP Accounts
- Subdomains: cPanel → Domains
- SSL: cPanel → SSL/TLS Status
- File Manager: cPanel → File Manager

**GitLab:**
- Pipelines: CI/CD → Pipelines
- Variables: Settings → CI/CD → Variables
- Code: Repository → Files

**Stripe:**
- API Keys: Dashboard → Developers → API Keys
- Test Mode: Toggle in top right of dashboard

### 📊 Branch Strategy:

```
dev → Auto-deploy → dev.billtup.com
staging → Auto-deploy → staging.billtup.com
main → Manual deploy → billtup.com (requires approval)
```

### 🚀 Deploy Commands:

```bash
# Deploy to dev
git checkout dev
git add .
git commit -m "Your changes"
git push origin dev

# Deploy to staging
git checkout staging
git merge dev
git push origin staging

# Deploy to production
git checkout main
git merge staging
git push origin main
# Then click "Play" in GitLab pipeline
```

### 📝 15 GitLab Variables Needed:

**Stripe (3):**
- VITE_STRIPE_PUBLISHABLE_KEY_DEV
- VITE_STRIPE_PUBLISHABLE_KEY_STAGING
- VITE_STRIPE_PUBLISHABLE_KEY_PRODUCTION

**FTP Dev (4):**
- FTP_HOST_DEV
- FTP_USERNAME_DEV
- FTP_PASSWORD_DEV
- FTP_PATH_DEV

**FTP Staging (4):**
- FTP_HOST_STAGING
- FTP_USERNAME_STAGING
- FTP_PASSWORD_STAGING
- FTP_PATH_STAGING

**FTP Production (4):**
- FTP_HOST_PRODUCTION
- FTP_USERNAME_PRODUCTION
- FTP_PASSWORD_PRODUCTION
- FTP_PATH_PRODUCTION

---

## Getting Help

### Namecheap Support
- 24/7 Live Chat: https://www.namecheap.com/support/live-chat/
- Email: support@namecheap.com
- Knowledge Base: https://www.namecheap.com/support/knowledgebase/

### GitLab Community
- Forum: https://forum.gitlab.com
- Documentation: https://docs.gitlab.com
- Support: Only on paid plans

### If Pipeline Keeps Failing
1. Check the job logs in GitLab (click on failed job)
2. Read the error message carefully
3. Verify all 15 variables are set correctly
4. Test FTP connection manually with FileZilla
5. Check cPanel File Manager to see if files are uploading

---

## Summary

You now have:
✅ Three environments (dev, staging, production)  
✅ Automated deployment via GitLab CI/CD  
✅ FTP deployment to Namecheap Stellar hosting  
✅ SSL certificates on all domains  
✅ React Router support via `.htaccess`  
✅ Manual approval for production (safety!)  
✅ Security headers and caching  
✅ All using hosting you've already paid for  

**Everything deploys automatically when you push code!**

**Total setup time:** 2-3 hours  
**Ongoing cost:** $0/month  
**Effort:** Just push code and it deploys!  

---

*This guide was created specifically for Namecheap Stellar Shared Hosting*  
*Last updated: November 26, 2025*
