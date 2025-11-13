# Payments & Stripe Integration

Complete guide for payment processing with Stripe in BilltUp.

---

## Overview

BilltUp uses Stripe for secure payment processing with these features:
- ✅ Card payments (credit/debit)
- ✅ NFC contactless payments (mobile)
- ✅ Stripe Connect OAuth
- ✅ Full and partial refunds
- ✅ Payment receipts
- ✅ PCI DSS compliance

---

## Fee Structure

**Total Transaction Fee: 3.5% + $0.50**

Breakdown:
- **Platform Fee:** 0.6% + $0.20
- **Stripe Fee:** 2.9% + $0.30

**Example:**
- Invoice total: $100.00
- Fees: $3.50
- You receive: $96.50

---

## Quick Setup

### 1. Get Stripe API Keys

**Test Mode (Development):**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Secret key** (starts with `sk_test_`)
3. Copy **Publishable key** (starts with `pk_test_`)

**Live Mode (Production):**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Secret key** (starts with `sk_live_`)
3. Copy **Publishable key** (starts with `pk_live_`)

### 2. Configure Backend

Add to Supabase secrets:

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
```

### 3. Configure Frontend (Optional)

If using client-side Stripe:

```bash
# In .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Deploy

```bash
npx supabase functions deploy server
```

---

## Testing Payments

### Stripe Test Cards

Use these cards in test mode:

| Card Number | Scenario | CVC | Date |
|-------------|----------|-----|------|
| `4242 4242 4242 4242` | ✅ Success | Any | Any future |
| `4000 0000 0000 0002` | ❌ Decline | Any | Any future |
| `4000 0027 6000 3184` | 🔐 3D Secure | Any | Any future |
| `4000 0000 0000 9995` | ⚠️ Insufficient funds | Any | Any future |

**For all test cards:**
- Use any future expiry date (e.g., 12/26)
- Use any 3-digit CVC
- Use any billing ZIP code

### Testing Workflow

1. Create an invoice
2. Go to Payment screen
3. Enter test card details
4. Click "Process Payment"
5. Check Stripe Dashboard → Payments

---

## Stripe Connect OAuth

### What is Stripe Connect?

Stripe Connect allows users to connect their own Stripe accounts to receive payments directly into their bank account.

### Setup OAuth (Optional)

**1. Enable Connect in Stripe:**
- Go to https://dashboard.stripe.com/settings/connect
- Complete account setup

**2. Get OAuth Credentials:**
- Client ID: Found in Connect settings
- Add redirect URI: `https://yourdomain.com/oauth/stripe/callback`

**3. Add to Environment:**
```bash
STRIPE_CONNECT_CLIENT_ID=ca_your_client_id
```

**4. User Flow:**
1. User clicks "Connect Stripe" in Settings
2. Redirected to Stripe OAuth page
3. Authorizes connection
4. Redirected back with access token
5. Future payments go to their account

---

## Processing Payments

### Card Payment Flow

```typescript
// Frontend makes API call
const response = await paymentApi.processCard({
  invoiceId: "inv_123",
  amount: 108.50,
  paymentMethodId: "pm_stripe_id"
});

// Backend processes via Stripe
// - Creates payment intent
// - Confirms payment
// - Updates invoice status
// - Sends receipt email
```

### NFC Payment (Mobile Only)

```typescript
// Use Capacitor NFC plugin
import { NFC } from '@capacitor-community/nfc';

const response = await NFC.read();
const payment = await paymentApi.processNFC({
  invoiceId: "inv_123",
  amount: 108.50,
  nfcData: response.data
});
```

---

## Refunds

### Full Refund

```typescript
const refund = await paymentApi.refund({
  invoiceId: "inv_123",
  reason: "Customer request"
});
```

### Partial Refund

```typescript
const refund = await paymentApi.refund({
  invoiceId: "inv_123",
  amount: 50.00,  // Partial amount
  reason: "Partial service"
});
```

---

## Going Live

### Checklist Before Production

- [ ] Switch to live API keys
- [ ] Complete Stripe account verification
- [ ] Set up bank account for payouts
- [ ] Configure payout schedule
- [ ] Enable webhook notifications (optional)
- [ ] Test with real card (small amount)
- [ ] Update redirect URIs to production domain

### Switch to Live Mode

**1. Update Backend:**
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_your_live_key
npx supabase functions deploy server
```

**2. Update Frontend:**
```bash
# In .env.local or Vercel
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
```

**3. Configure Payouts:**
1. Go to https://dashboard.stripe.com/settings/payouts
2. Add your bank account
3. Verify with test deposits
4. Set automatic payout schedule (daily/weekly/monthly)

---

## Troubleshooting

### Payment Fails

**Using test card in live mode:**
- Switch to test mode OR use real card

**Wrong API keys:**
```bash
# Verify keys in Supabase
npx supabase secrets list

# Update if needed
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
npx supabase functions deploy server
```

### Stripe Dashboard Shows No Payments

**Backend not deployed:**
```bash
npx supabase functions deploy server
```

**Check logs:**
```bash
npx supabase functions logs server
```

### "Payment Intent" Error

**Invalid amount:**
- Amount must be > $0.50
- Amount in cents (multiply by 100)

**Authentication failed:**
- Check API key is correct
- Ensure key matches mode (test/live)

---

## Security

### PCI Compliance

✅ **BilltUp is PCI compliant** because:
- Card data goes directly to Stripe
- No card numbers stored in database
- Uses Stripe's secure payment elements
- All communication over HTTPS

### Best Practices

- ✅ Never log card details
- ✅ Use environment variables for keys
- ✅ Keep secret keys server-side only
- ✅ Validate amounts before processing
- ✅ Implement rate limiting (already done)
- ✅ Monitor for suspicious activity

---

## Stripe Dashboard

### Important Sections

**Payments:**
https://dashboard.stripe.com/payments
- View all transactions
- Search by amount, customer, date
- Issue refunds

**Balance:**
https://dashboard.stripe.com/balance
- View available balance
- See pending payouts
- Configure payout schedule

**Logs:**
https://dashboard.stripe.com/logs
- Debug API errors
- View request/response details

**Webhooks (Optional):**
https://dashboard.stripe.com/webhooks
- Get real-time payment notifications
- Handle async events

---

## Cost Breakdown Example

**Scenario:** $1,000 invoice

```
Invoice total:          $1,000.00
Stripe fee (2.9%):        -$29.00
Stripe fixed fee:          -$0.30
Platform fee (0.6%):       -$6.00
Platform fixed fee:        -$0.20
-------------------------
You receive:             $964.50
Total fees:              $35.50 (3.55%)
```

---

## API Reference

See [Architecture → API](../architecture/API.md) for complete payment endpoint documentation.

**Key Endpoints:**
- `POST /payments/card` - Process card payment
- `POST /payments/nfc` - Process NFC payment
- `POST /payments/refund` - Issue refund
- `GET /payments/:id` - Get payment details

---

**Last Updated:** November 11, 2025  
**Stripe API Version:** Latest  
**Status:** Production Ready
