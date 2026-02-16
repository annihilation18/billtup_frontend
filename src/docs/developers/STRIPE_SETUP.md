# Stripe Setup Guide

Complete guide for configuring Stripe payments in BilltUp.

## Current Status

✅ **Stripe Integration Complete** - The backend is fully configured to process payments.

✅ **Secret Key Configured** - `STRIPE_SECRET_KEY` environment variable is set.

---

## What Stripe Does in BilltUp

### Payment Processing (Implemented)

Stripe handles **incoming payments from your customers**:

- ✅ Creates payment intents
- ✅ Processes credit/debit card payments  
- ✅ Handles refunds
- ✅ Provides payment receipts
- ✅ PCI DSS Level 1 compliant

### What Stripe Does NOT Do

Stripe in this app **does NOT handle payouts** to your business bank account. That's configured separately in your Stripe Dashboard.

---

## Receiving Money (Payouts)

### Configure in Stripe Dashboard

1. **Log into Stripe**
   - https://dashboard.stripe.com

2. **Navigate to Balance Settings**
   - Click "Balance" in sidebar
   - Click "Payouts" tab
   - Click "Edit payout details"

3. **Add Your Bank Account**
   - Enter bank routing number
   - Enter full bank account number
   - Verify (Stripe makes 2 test deposits)

4. **Set Payout Schedule**
   - Automatic payouts (recommended)
   - Daily, weekly, or monthly
   - Funds transfer automatically

5. **Verify Identity (if required)**
   - May need EIN/SSN
   - Business verification documents

---

## Bank Details in BilltUp

### Purpose

The "Bank Account" section in BilltUp Settings:

1. **Display on Invoices** - For customers who want to pay via wire transfer
2. **Record Keeping** - Your reference only
3. **NOT connected to Stripe** - These are informational only

### Fields Collected

```
- Bank Name (e.g., "Chase Bank")
- Account Holder Name
- Account Number (last 4 digits displayed)
- Routing Number
```

**Note:** These fields are encrypted in the database for security.

---

## Test Mode vs Live Mode

### Current Status: Test Mode

Your Stripe integration is in **Test Mode**:

- ✅ Test the full payment flow
- ✅ No real money charged
- ❌ Customers can't make real payments
- ❌ No real payouts

### Test Card Numbers

```
Successful Payment:
4242 4242 4242 4242

Payment Declined:
4000 0000 0000 0002

Requires Authentication (3D Secure):
4000 0027 6000 3184

Use any future expiry date (e.g., 12/34)
Use any 3-digit CVV (e.g., 123)
```

### Switch to Live Mode

When ready for real payments:

1. **Complete Stripe Activation**
   - Submit business documents
   - Pass identity verification
   - Add bank for payouts

2. **Get Live API Keys**
   - Toggle from "Test" to "Live" in Stripe Dashboard
   - Copy **Live Secret Key** (starts with `sk_live_`)

3. **Update Environment Variable**
   ```bash
   # In Supabase Dashboard → Edge Functions → Secrets
   STRIPE_SECRET_KEY=sk_live_...
   ```

4. **Test First**
   - Process small transaction
   - Verify funds arrive in bank
   - Then go fully live

---

## Webhook Configuration

### Why Webhooks?

Webhooks notify your app when:
- Payment succeeds
- Payment fails
- Refund processed
- Subscription updated

### Setup Steps

1. **Go to Stripe Dashboard**
   - Developers → Webhooks

2. **Add Endpoint**
   ```
   https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6/webhooks/stripe
   ```

3. **Select Events**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. **Copy Signing Secret**
   - Copy the `whsec_...` value

5. **Add to Supabase**
   ```bash
   npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Verify Webhook

The backend automatically verifies webhook signatures for security.

---

## Security Considerations

### What's Secure ✅

- **Card data never touches your servers** → Stripe.js handles card collection client-side
- **CVV codes** → Never stored anywhere (Stripe discards after processing)
- **PCI DSS compliance** → Handled by Stripe (Level 1 certified)
- **Stripe Secret Key** → Server-only (never exposed to frontend)
- **Only secure references stored** → Payment Intent IDs and Payment Method IDs in database

### Payment Data Flow (Secure)

```
1. User enters card details
   ↓
2. Stripe.js (frontend) → Collects card data securely
   ↓
3. Stripe Servers → Processes card data (PCI DSS Level 1)
   ↓
4. Returns Payment Intent ID (e.g., pi_abc123...)
   ↓
5. Your Backend → Receives ONLY the Intent ID
   ↓
6. Your Database → Stores ONLY the Intent ID
```

**What Gets Stored in Your Database:**
- ✅ Payment Intent IDs (e.g., `pi_1234567890abcdef`)
- ✅ Payment Method IDs (e.g., `pm_1234567890abcdef`)  
- ✅ Payment method TYPE ("card", "nfc")
- ✅ Payment status ("succeeded", "failed", etc.)
- ❌ NO card numbers
- ❌ NO CVV codes
- ❌ NO expiry dates
- ❌ NO cardholder data

**Result:** Your servers remain PCI DSS compliant without storing sensitive payment data.

### What to Avoid ❌

- Don't attempt to store full credit card numbers (violates PCI DSS)
- Don't share Stripe Secret Key publicly (security breach)
- Don't hardcode API keys in frontend code (must use environment variables)
- Don't skip webhook signature verification (security risk)
- Don't process payments without Stripe.js (loses PCI compliance)

---

## Stripe Account Setup

### If You Don't Have an Account

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Click "Sign Up"
   - Enter email and password
   - Choose your country

2. **Activate Your Account**
   - Complete business information
   - Provide tax ID (EIN or SSN)
   - Add business owner details
   - Verify identity

3. **Get API Keys**
   - Developers → API Keys
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### If You Have an Account

- Your account is already connected via the secret key
- Just configure payouts as described above

---

## Common Issues & Solutions

### Issue: Payment Fails

**Causes:**
- Stripe key not configured
- Network error
- Invalid card details

**Solutions:**
- Verify `STRIPE_SECRET_KEY` is set
- Use test card: 4242 4242 4242 4242
- Check browser console
- Verify internet connection

### Issue: Webhook Not Receiving Events

**Causes:**
- Webhook endpoint not added
- Wrong endpoint URL
- Signature verification failing

**Solutions:**
- Double-check endpoint URL
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check Edge Function logs

### Issue: Payouts Not Working

**Causes:**
- Bank account not added in Stripe Dashboard
- Account not fully activated
- Verification pending

**Solutions:**
- Complete account activation
- Add bank account in Stripe Dashboard
- Wait for verification (1-2 days)

---

## Testing Checklist

- [ ] Test card payment succeeds
- [ ] Test declined card fails gracefully
- [ ] Test 3D Secure authentication
- [ ] Test refund processing
- [ ] Verify webhook events received
- [ ] Check Stripe Dashboard for transactions
- [ ] Test with small real payment (live mode only)

---

## FAQ

### Q: Do I need to enter bank info in BilltUp?
**A:** No, not for Stripe. Bank fields in BilltUp are optional for display purposes only.

### Q: How do I receive money from Stripe?
**A:** Configure payouts in Stripe Dashboard by adding your bank account there.

### Q: Can I use Stripe without the bank fields in BilltUp?
**A:** Yes! Those fields are separate and optional.

### Q: What if I want bank info on invoices?
**A:** Fill out the bank fields in BilltUp Settings. They'll appear on invoice PDFs.

### Q: How do I know if Stripe is configured correctly?
**A:** Check Stripe Dashboard:
- ✅ Account status is "Active"
- ✅ Payouts are enabled  
- ✅ Bank account connected
- ✅ Identity verification complete

---

## Next Steps

### To Start Accepting Real Payments:

1. ✅ Stripe Secret Key - Already configured
2. ⏳ Log into Stripe Dashboard
3. ⏳ Complete account activation
4. ⏳ Add bank account for payouts
5. ⏳ Test in test mode
6. ⏳ Switch to live mode
7. ⏳ Process first real payment
8. ✅ Start invoicing!

---

## Resources

### Stripe Documentation
- **Getting Started:** https://stripe.com/docs
- **Payouts Guide:** https://stripe.com/docs/payouts
- **Test Cards:** https://stripe.com/docs/testing
- **Webhooks:** https://stripe.com/docs/webhooks

### Stripe Dashboard
- **Login:** https://dashboard.stripe.com
- **Support:** https://support.stripe.com

---

*Last Updated: November 21, 2025*