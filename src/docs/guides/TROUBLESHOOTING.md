# Troubleshooting Guide

Common issues and solutions for BilltUp.

---

## Quick Diagnostics

### Step 1: Check Backend Status

```bash
curl https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/health
```

**Expected:** `{"status":"ok"}`  
**If fails:** See [Backend Not Deployed](#backend-not-deployed) below

### Step 2: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Note the error type

### Step 3: Check Network Tab

1. Open DevTools → Network tab
2. Try the failing action
3. Look for failed requests (red)
4. Click on failed request → Response tab

---

## Most Common Issues

### 1. "Failed to Fetch" Error ⭐ MOST COMMON

**Symptom:**  
```
TypeError: Failed to fetch
```

**Root Cause:**  
Your Supabase Edge Function (backend API) is not deployed.

**Solution:**

#### Quick Fix (5 minutes)

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
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
npx supabase login

# 3. Link project
npx supabase link --project-ref xrgywtdjdlqthpthyxwj

# 4. Set secrets
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key
npx supabase secrets set EMAIL_HOST=smtp.gmail.com
npx supabase secrets set EMAIL_PORT=587
npx supabase secrets set EMAIL_USER=your-email@gmail.com
npx supabase secrets set EMAIL_PASSWORD=your-app-password

# 5. Deploy
npx supabase functions deploy server

# 6. Test
curl https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/health
```

**Verification:**  
You should see `{"status":"ok"}` response.

---

### 2. Email Not Sending

**Symptom:**  
- Invoices create successfully
- No email arrives
- No errors shown in UI

**Diagnosis:**
```bash
# Check Edge Function logs
npx supabase functions logs server
```

Look for email-related errors.

**Common Causes & Fixes:**

#### A. Wrong SMTP Credentials

**Solution:**
1. Go to your email provider and create/verify app password
2. Update Supabase secrets:

```bash
npx supabase secrets set EMAIL_HOST=smtp.gmail.com
npx supabase secrets set EMAIL_PORT=587
npx supabase secrets set EMAIL_USER=your-email@gmail.com
npx supabase secrets set EMAIL_PASSWORD=your-app-password
```

3. Redeploy:
```bash
npx supabase functions deploy server
```

#### B. Gmail App Password Not Created

**Gmail Setup:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to https://myaccount.google.com/apppasswords
4. Create new app password for "Mail"
5. Copy the 16-character password
6. Use this as `EMAIL_PASSWORD`

#### C. Port Blocked

**Solution:**  
Try different ports:
- Port 587 (TLS) - recommended
- Port 465 (SSL)
- Port 25 (sometimes blocked)

```bash
npx supabase secrets set EMAIL_PORT=465
npx supabase functions deploy server
```

---

### 3. Payment Fails

**Symptom:**  
- Card details entered
- "Payment failed" error
- Or infinite loading

**Common Causes:**

#### A. Using Real Card in Test Mode

**Solution:**  
Use Stripe test cards:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Decline |
| `4000 0027 6000 3184` | 3D Secure |

Use any future expiry date and any 3-digit CVC.

#### B. Wrong Stripe Keys

**Solution:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Secret key** (starts with `sk_test_`)
3. Update Supabase secret:

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_actual_key
npx supabase functions deploy server
```

#### C. Stripe Connect Not Set Up

**Solution:**  
See [Features → Payments](../features/PAYMENTS.md) for Stripe Connect OAuth setup.

---

### 4. Login/Signup Not Working

**Symptom:**  
- "Invalid credentials" on correct password
- Can't sign up
- Session expires immediately

**Diagnosis:**
1. Check browser console for errors
2. Check if backend is deployed
3. Verify Supabase project is active

**Solutions:**

#### A. Backend Not Deployed

See ["Failed to Fetch"](#1-failed-to-fetch-error) above.

#### B. Supabase Project Paused

**Check:**  
Visit https://app.supabase.com/project/xrgywtdjdlqthpthyxwj

If you see "Project paused" → Click "Restore project"

(Free tier projects pause after 7 days of inactivity)

#### C. Wrong Supabase Keys

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy **anon/public** key
3. Update `.env.local`:

```bash
VITE_SUPABASE_URL=https://xrgywtdjdlqthpthyxwj.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Restart dev server:
```bash
npm run dev
```

---

### 5. PDF Not Generating

**Symptom:**  
- Invoice creates successfully
- "Download PDF" button doesn't work
- Or PDF is blank/corrupted

**Solutions:**

#### A. Check Browser Console

Look for errors related to PDF generation.

#### B. Clear Browser Cache

1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or clear cache and reload

#### C. Check Line Items

- Ensure invoice has at least one line item
- Verify line item has name, quantity, and price

---

### 6. Mobile Build Errors

**Symptom:**  
- `npx cap sync` fails
- Android Studio shows errors
- Xcode build fails

**Solutions:**

#### A. Android Build Fails

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run build
npx cap sync
npx cap open android
```

**Common Android Issues:**
- Gradle version mismatch → Update Android Studio
- SDK not found → Install Android SDK via Android Studio
- Build tools missing → Install via SDK Manager

#### B. iOS Build Fails (Mac only)

```bash
# Clean and rebuild
cd ios/App
pod install
cd ../..
npm run build
npx cap sync
npx cap open ios
```

**Common iOS Issues:**
- CocoaPods not installed → `sudo gem install cocoapods`
- Xcode not installed → Install from App Store
- Signing issues → Configure in Xcode → Signing & Capabilities

---

### 7. Connection/Network Issues

**Symptom:**  
- Intermittent failures
- Some requests work, others don't
- Timeouts

**Solutions:**

#### A. CORS Errors

**Symptom:** Console shows CORS policy error

**Fix:**
```bash
# Redeploy Edge Function (it has CORS enabled)
npx supabase functions deploy server
```

#### B. Firewall Blocking

**Test:**
```bash
# Try from different network
# Use mobile hotspot
# Check corporate firewall settings
```

#### C. Supabase Outage

**Check:**  
https://status.supabase.com

---

### 8. White Screen / App Won't Load

**Diagnosis:**
1. Check browser console (F12)
2. Look for JavaScript errors
3. Check Network tab for failed requests

**Solutions:**

#### A. Missing Environment Variables

**Fix:**
1. Verify `.env.local` exists with:
```bash
VITE_SUPABASE_URL=https://xrgywtdjdlqthpthyxwj.supabase.co
VITE_SUPABASE_ANON_KEY=your_key
```

2. Restart dev server:
```bash
npm run dev
```

#### B. Build Issues

**Fix:**
```bash
# Clear node_modules and rebuild
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

#### C. Backend Not Deployed

See ["Failed to Fetch"](#1-failed-to-fetch-error) above.

---

## Less Common Issues

### Dashboard Shows "—" for Stats

**Cause:** No data yet or backend not deployed

**Fix:**
1. Create an invoice
2. Process a payment
3. Refresh page
4. If still showing "—", check backend deployment

---

### Stripe Connect OAuth Fails

**Symptom:**  
- Click "Connect Stripe" button
- Redirects but shows error
- Or redirect doesn't work

**Solution:**
1. Check redirect URI in Stripe Dashboard:
   - Go to https://dashboard.stripe.com/settings/connect
   - Add: `https://your-domain.com/oauth/stripe/callback`
   
2. For localhost testing:
   - Add: `http://localhost:5173/oauth/stripe/callback`

---

### Customer Data Not Saving

**Symptom:**  
- Form submits
- Success message shows
- But data doesn't appear

**Diagnosis:**
```bash
# Check backend logs
npx supabase functions logs server
```

**Solution:**
1. Verify backend is deployed
2. Check if KV store quota exceeded (unlikely)
3. Check browser console for errors

---

### Invoice Number Not Auto-Incrementing

**Symptom:**  
- All invoices show "INV-001"
- Or duplicate invoice numbers

**Cause:**  
This is a known limitation of the current implementation.

**Workaround:**  
Manually set unique invoice numbers when creating invoices.

**Permanent Fix:**  
Will be addressed in future update with proper sequence generation.

---

## Debugging Tools

### 1. Browser DevTools

**Open:** F12 or Cmd+Option+I (Mac)

**Useful Tabs:**
- **Console:** JavaScript errors
- **Network:** API requests/responses
- **Application:** Local storage, cookies

### 2. Supabase Dashboard

**Edge Function Logs:**  
https://app.supabase.com/project/xrgywtdjdlqthpthyxwj/logs/edge-functions

**Database:**  
https://app.supabase.com/project/xrgywtdjdlqthpthyxwj/editor

### 3. Stripe Dashboard

**Test Payments:**  
https://dashboard.stripe.com/test/payments

**Logs:**  
https://dashboard.stripe.com/test/logs

### 4. Email Logs

**Gmail Sent Mail:**  
Check your Gmail sent folder

**Email Provider Logs:**  
Check your SMTP provider's dashboard

---

## Getting More Help

### 1. Check Logs

**Backend Logs:**
```bash
npx supabase functions logs server
```

**Browser Console:**
- F12 → Console tab
- Look for errors (red text)

### 2. Verify Configuration

```bash
# List Supabase secrets (values hidden)
npx supabase secrets list
```

### 3. Test Individual Components

**Test Backend:**
```bash
curl https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/health
```

**Test Signup:**
```bash
curl -X POST https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","password":"password123","businessName":"Test"}'
```

---

## Prevention Checklist

To avoid common issues:

- [ ] ✅ Backend deployed before testing
- [ ] ✅ All environment variables set correctly
- [ ] ✅ Using correct Stripe keys (test vs live)
- [ ] ✅ Email SMTP credentials configured
- [ ] ✅ Supabase project active (not paused)
- [ ] ✅ Using supported browser (Chrome, Firefox, Safari, Edge)
- [ ] ✅ JavaScript enabled in browser
- [ ] ✅ No ad blockers interfering
- [ ] ✅ Stable internet connection

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Failed to fetch | `./deploy-backend.sh` |
| Email not sending | Check SMTP credentials in Supabase secrets |
| Payment fails | Use test card `4242 4242 4242 4242` |
| White screen | Check browser console, verify env variables |
| Login fails | Check backend deployed, Supabase active |
| PDF blank | Check line items exist |
| Mobile build fails | `npm run build && npx cap sync` |

---

**Still stuck?**  
1. Check browser console (F12)
2. Check backend logs (`npx supabase functions logs server`)
3. Verify all secrets are set (`npx supabase secrets list`)
4. Try the action again with Network tab open

---

**Last Updated:** November 11, 2025  
**Most Common Issue:** Backend not deployed (90% of problems!)
