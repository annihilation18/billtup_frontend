# Stripe Connect Application Fees - How BilltUp Collects 0.6% + $0.20

## Overview
BilltUp uses **Stripe Connect with Application Fees** to collect platform fees without paying Stripe's processing fees on those application fees.

## How It Works

### 1. **Stripe Connect OAuth Flow**
- When a business signs up, they connect their own Stripe account via OAuth
- This creates a "Connected Account" linked to the BilltUp platform
- The business owns their Stripe account and receives payouts directly

### 2. **Payment Flow Architecture**
```
Customer Pays → Business's Stripe Account → Automatic Fee Split
```

**Example Transaction: $100.00 Invoice**

| Party | Amount | Description |
|-------|--------|-------------|
| Customer Charged | $104.00 | Invoice + processing fee |
| Stripe Takes | $3.32 | 2.9% + $0.30 on $104 |
| BilltUp Platform Fee | $0.82 | 0.6% + $0.20 (NET - no Stripe fees!) |
| Business Receives | $99.86 | Net amount after all fees |

### 3. **Application Fee Magic**
When creating a payment intent, the backend uses:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 10400, // $104.00 in cents
  currency: 'usd',
  application_fee_amount: 82, // $0.82 - BilltUp's platform fee
  transfer_data: {
    destination: connectedAccountId, // Business's Stripe account
  },
});
```

**Key Benefits:**
- ✅ BilltUp receives $0.82 directly to platform Stripe account
- ✅ Stripe does NOT charge 2.9% + $0.30 on the $0.82 application fee
- ✅ The application fee is a direct transfer, not a separate charge
- ✅ Business pays Stripe fees only, BilltUp's fee is separate

## Fee Breakdown

### For Customers:
- **Invoice Amount:** Variable
- **Processing Fee:** 3.5% + $0.50
- **Total Charged:** Invoice + Processing Fee

### For Businesses:
On a $100 invoice:
- Customer pays: $104.00
- Stripe fee: $3.32 (2.9% + $0.30)
- Platform fee: $0.82 (0.6% + $0.20)
- **Business receives: $99.86**

### For BilltUp (Platform):
- **Revenue per $100 invoice:** $0.82 NET
- **No additional fees:** Stripe doesn't charge processing fees on application fees
- **Direct transfer:** Money automatically transferred to platform account

## Technical Implementation

### Backend (Supabase Edge Function)
Located in: `/supabase/functions/server/index.tsx`

**Lines 1594-1614:** Payment intent creation with application fees
```typescript
const platformFee = Math.round((amount * 0.6 / 100 + 0.20) * 100);

const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: 'usd',
  application_fee_amount: platformFee,
  transfer_data: {
    destination: business.stripeConnectedAccountId,
  },
});
```

### Frontend Components

**1. StripeConnectSettings.tsx**
- Handles OAuth connection flow
- Shows fee breakdown to businesses
- Disconnect functionality
- Account status monitoring

**2. PaymentScreen.tsx**
- Displays fee breakdown to customers
- Processes payments via Stripe Elements
- Shows transparent pricing

**3. API Utils (utils/api.tsx)**
- `stripeConnectApi.getOAuthUrl()` - Start connection
- `stripeConnectApi.getAccountStatus()` - Check connection status
- `stripeConnectApi.disconnect()` - Disconnect account
- `paymentApi.createPaymentIntent()` - Create payment with fees

## Stripe Connect Account Types

BilltUp uses **Standard Connect Accounts**:
- ✅ Business owns the Stripe account
- ✅ Business receives payouts directly to their bank
- ✅ Business manages their own Stripe dashboard
- ✅ Platform automatically deducts application fee
- ✅ Best for marketplaces and platforms

## OAuth Setup Parameters

The OAuth URL includes these parameters:
```javascript
stripe_user[business_type]=company
suggested_capabilities[]=card_payments
suggested_capabilities[]=transfers
```

This ensures the connected account can:
1. Accept card payments
2. Support transfers (required for application fees)

## Payout Timeline

- **Business Payouts:** 2-7 business days to their bank (standard Stripe)
- **Platform Fee:** Automatically transferred immediately after payment
- **Refunds:** Platform fee is automatically refunded if payment is refunded

## Security & Compliance

- ✅ PCI Compliance: Stripe handles all card data
- ✅ Bank-level encryption: All data encrypted in transit and at rest
- ✅ No PII storage: Payment data never stored on BilltUp servers
- ✅ OAuth security: Secure token exchange for account connection
- ✅ Disconnection: Businesses can disconnect anytime

## Production Deployment Checklist

Before going live, ensure:
- [ ] Stripe account created and verified
- [ ] Stripe Connect enabled on your account
- [ ] `STRIPE_CLIENT_ID` environment variable set
- [ ] `STRIPE_SECRET_KEY` environment variable set
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` environment variable set
- [ ] OAuth redirect URLs configured in Stripe Dashboard
- [ ] Test mode used for development
- [ ] Live mode enabled only for production

## Testing

### Test Cards (Stripe Test Mode)
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

### Fee Calculation Test
```javascript
// Example: $100 invoice
Invoice: $100.00
Platform Fee: ($100 * 0.006) + $0.20 = $0.80
Stripe Fee: ($100 * 0.029) + $0.30 = $3.20
Total Processing: $4.00
Customer Pays: $104.00
Business Receives: $96.00
```

## Support & Documentation

- **Stripe Connect Docs:** https://stripe.com/docs/connect
- **Application Fees:** https://stripe.com/docs/connect/charges#application-fees
- **OAuth Flow:** https://stripe.com/docs/connect/oauth-reference
- **Stripe Dashboard:** https://dashboard.stripe.com

---

## Summary

BilltUp's fee structure is transparent and fair:
- **Platform earns:** 0.6% + $0.20 per transaction (NET)
- **Business pays:** 3.5% + $0.50 total fees
- **Stripe takes:** 2.9% + $0.30 for processing
- **No hidden fees:** All fees disclosed upfront
- **Direct payouts:** Businesses receive money directly from Stripe

This architecture ensures BilltUp can sustainably operate while keeping costs transparent for businesses. 💰✨
