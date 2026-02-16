# Payment Security FAQ

**Frequently Asked Questions about Payment Data Handling and PCI DSS Compliance**

---

## The Most Important Question

### ❓ "Does BilltUp store credit card information?"

**Answer: NO. Absolutely not.**

BilltUp **NEVER** stores:
- ❌ Credit card numbers
- ❌ CVV/CVC codes
- ❌ Card expiry dates
- ❌ Any raw payment card data

**What we DO store:**
- ✅ Stripe Payment Intent IDs (e.g., `pi_1234567890abcdef`)
- ✅ Stripe Payment Method IDs (e.g., `pm_1234567890abcdef`)
- ✅ Payment method TYPE only ("card" or "nfc")
- ✅ Payment status ("succeeded", "failed", etc.)

---

## How Payment Processing Works

### The Secure Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User Enters Card Details                           │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Frontend (Browser)                                    │   │
│ │ User types: 4242 4242 4242 4242                       │   │
│ │            12/25, CVV: 123                            │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Stripe.js Intercepts (Client-Side)                 │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Stripe.js (Browser Library)                           │   │
│ │ - Encrypts card data                                  │   │
│ │ - Sends DIRECTLY to Stripe servers                    │   │
│ │ - BilltUp backend NEVER sees the card data            │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Stripe Processes Payment (PCI DSS Level 1)         │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Stripe Servers                                        │   │
│ │ - Validates card                                      │   │
│ │ - Processes payment                                   │   │
│ │ - Returns Payment Intent ID                           │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 4: BilltUp Receives Only the Reference ID             │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ BilltUp Backend                                       │   │
│ │ Receives: { paymentIntentId: "pi_abc123..." }        │   │
│ │ (This is just a reference, not card data)             │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Stored in Database                                 │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ BilltUp Database                                      │   │
│ │ Stores: {                                             │   │
│ │   paymentIntentId: "pi_abc123...",                    │   │
│ │   status: "succeeded",                                │   │
│ │   amount: 10000  // in cents                          │   │
│ │ }                                                     │   │
│ │ NO CARD DATA WHATSOEVER                               │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Understanding Payment Intent IDs

### What is a Payment Intent ID?

A **Payment Intent ID** is Stripe's secure reference to a payment transaction.

**Example:** `pi_1234567890abcdef`

**What it contains:**
- ✅ Unique transaction identifier
- ✅ Secure reference to payment in Stripe's system

**What it does NOT contain:**
- ❌ NO card number
- ❌ NO CVV
- ❌ NO expiry date
- ❌ NO billing address
- ❌ NO cardholder name

### Why is this secure?

The Payment Intent ID is **useless** to attackers:
- Cannot be used to make fraudulent charges
- Cannot be reversed to get card details
- Cannot access the original card information
- Only Stripe can use it to lookup transaction details
- Requires authentication to access associated data

### Analogy

Think of it like a **package tracking number**:
- You can use it to check the status
- You can reference it to customer service
- But you CANNOT use it to:
  - Open the package
  - See what's inside
  - Change the contents
  - Create a new identical package

---

## PCI DSS Compliance

### What is PCI DSS?

**PCI DSS** = Payment Card Industry Data Security Standard

It's a set of security requirements for anyone who:
- Stores credit card data
- Processes credit card data
- Transmits credit card data

### Compliance Levels

| Level | Requirements | Who Needs It |
|-------|--------------|--------------|
| **Level 1** | Strictest - Full SAQ, Quarterly scans, Annual audit | Process 6M+ transactions/year |
| **Level 2** | SAQ, Quarterly scans | Process 1-6M transactions/year |
| **Level 3** | SAQ, Quarterly scans | Process 20K-1M e-commerce transactions/year |
| **Level 4** | SAQ | Process <20K e-commerce transactions/year |

### BilltUp's Compliance Status

**✅ We maintain PCI DSS compliance by NOT storing card data**

Because BilltUp never touches card data:
- We don't need to be PCI DSS certified
- We don't need annual audits
- We don't need quarterly vulnerability scans
- We don't need a SAQ (Self-Assessment Questionnaire)

**Instead:**
- Stripe is PCI DSS Level 1 certified
- Stripe handles all card data
- We inherit Stripe's compliance
- Customers' card data is protected by Stripe's security

---

## Common Misconceptions

### ❌ Myth #1: "You must be storing SOME card data"

**Reality:** We store ZERO card data. Not even encrypted. Not even hashed. Nothing.

**What we store:** Only Stripe's reference IDs, which contain no card information.

### ❌ Myth #2: "The last 4 digits are stored for display"

**Reality:** Even the last 4 digits are NOT stored by us.

**How it works:**
- Stripe provides the last 4 digits through their API
- We fetch it on-demand when needed
- It's never written to our database

### ❌ Myth #3: "Payment method ID contains card info"

**Reality:** Payment Method IDs are secure references only.

**Example Payment Method ID:** `pm_1234567890abcdef`
- Just an identifier in Stripe's system
- Cannot be decoded to get card details
- Requires authentication to use

### ❌ Myth #4: "You need the CVV for refunds"

**Reality:** CVV is NEVER stored (even by Stripe) and isn't needed for refunds.

**How refunds work:**
- Use the Payment Intent ID
- Stripe handles the refund
- No card data needed

---

## Security Audit Questions

### "Where do you store credit card numbers?"

**Answer:** We don't. Stripe stores them. We only store Stripe's reference IDs.

### "Is card data encrypted in your database?"

**Answer:** There is no card data in our database to encrypt. We only store non-sensitive reference IDs.

### "Can you show me the card data in your database?"

**Answer:** There is none. We can show you Payment Intent IDs, which are just identifiers.

### "What happens if your database is breached?"

**Answer:** 
- No card data to steal
- Payment Intent IDs are useless without authentication
- Attackers cannot make charges with just the IDs
- No customer card data is compromised

### "How do you handle PCI DSS compliance?"

**Answer:**
- We don't need to be PCI DSS certified
- We never store, process, or transmit card data
- Stripe (PCI DSS Level 1) handles all card data
- We use Stripe.js to keep card data off our servers

---

## Technical Implementation

### Frontend Card Collection

```typescript
// ✅ CORRECT: Stripe.js handles card data
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_...');
const cardElement = elements.create('card');

// Card data goes directly to Stripe
const { paymentMethod } = await stripe.createPaymentMethod({
  type: 'card',
  card: cardElement  // Stripe.js handles this securely
});

// Send only the ID to our backend
await fetch('/payments/create', {
  method: 'POST',
  body: JSON.stringify({
    paymentMethodId: paymentMethod.id  // Safe to send
  })
});
```

```typescript
// ❌ WRONG: Never collect card data yourself
const cardData = {
  number: document.getElementById('cardNumber').value,  // NO!
  cvv: document.getElementById('cvv').value,            // NO!
  expiry: document.getElementById('expiry').value       // NO!
};

// Never send this to your backend
await fetch('/payments/create', {
  method: 'POST',
  body: JSON.stringify(cardData)  // PCI DSS violation!
});
```

### Backend Payment Processing

```typescript
// ✅ CORRECT: Only handle Payment Intent IDs
app.post('/payments/create', async (c) => {
  const { amount } = await c.req.json();
  
  // Create payment intent (no card data)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'usd'
  });
  
  // Return only the client secret
  return c.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id  // Safe to store
  });
});
```

```typescript
// ❌ WRONG: Never receive card data on backend
app.post('/payments/create', async (c) => {
  const { cardNumber, cvv, expiry } = await c.req.json();  // NO!
  
  // Never do this
  const encryptedCard = encrypt(cardNumber);  // Still wrong!
  await db.save({ cardNumber: encryptedCard }); // PCI DSS violation!
});
```

### Database Schema

```typescript
// ✅ CORRECT: Only store Stripe references
interface Invoice {
  id: string;
  amount: number;
  paymentIntentId?: string;  // e.g., "pi_abc123..."
  paymentMethodId?: string;  // e.g., "pm_xyz789..."
  status: 'pending' | 'paid';
  // NO card data fields
}
```

```typescript
// ❌ WRONG: Never have these fields
interface Invoice {
  cardNumber?: string;      // NO!
  cardLast4?: string;       // NO! (Get from Stripe API)
  cvv?: string;             // NO!
  expiryDate?: string;      // NO!
  cardholderName?: string;  // OK if just for billing address
}
```

---

## Best Practices

### ✅ Do's

1. **Use Stripe.js or Stripe Elements**
   - Let Stripe handle card input
   - Keep card data off your servers

2. **Store only Payment Intent IDs**
   - Safe to store
   - Use for refunds and status checks

3. **Fetch card details on-demand**
   - Get last 4 digits from Stripe API when needed
   - Don't cache card details

4. **Use HTTPS everywhere**
   - Encrypt data in transit
   - Required by PCI DSS

5. **Validate on client and server**
   - Client-side: Better UX
   - Server-side: Security

### ❌ Don'ts

1. **Never collect card data yourself**
   - Use Stripe Elements
   - Don't create custom card forms

2. **Never log card data**
   - Not in application logs
   - Not in error messages
   - Not anywhere

3. **Never store CVV**
   - Even Stripe doesn't store it
   - Against PCI DSS rules

4. **Never email card details**
   - To customers
   - To support
   - To yourself

5. **Never expose Payment Intent secrets**
   - `client_secret` should not be stored
   - Only used once during payment

---

## Compliance Checklist

### For Your Security Audit

- [x] Card data never touches our servers
- [x] Stripe.js handles all card collection
- [x] Only Stripe reference IDs stored
- [x] No card numbers in database
- [x] No CVV stored anywhere
- [x] No expiry dates stored
- [x] Payment data encrypted in transit (HTTPS)
- [x] Stripe is PCI DSS Level 1 certified
- [x] We inherit Stripe's compliance
- [x] Database breach would not expose card data
- [x] Payment Intent IDs cannot be used fraudulently
- [x] No custom card input forms
- [x] All payments processed through Stripe

---

## Resources

### Stripe Security Documentation

- [Stripe Security](https://stripe.com/docs/security)
- [PCI Compliance](https://stripe.com/docs/security/guide)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)

### PCI DSS Resources

- [PCI Security Standards Council](https://www.pcisecuritystandards.org/)
- [PCI DSS Quick Reference Guide](https://www.pcisecuritystandards.org/document_library)

### BilltUp Documentation

- [Database Schema](/docs/developers/DATABASE.md)
- [Security Best Practices](/docs/developers/SECURITY.md)
- [Stripe Setup Guide](/docs/developers/STRIPE_SETUP.md)

---

## Summary

**The Bottom Line:**

1. ✅ **BilltUp is PCI DSS compliant** because we don't store card data
2. ✅ **Stripe handles all card data** (PCI DSS Level 1 certified)
3. ✅ **We store only secure reference IDs** that cannot be used to access card details
4. ✅ **Your customers' card data is safe** and never touches our servers
5. ✅ **Database breach = NO card data exposed** because there is none to expose

---

**Last Updated:** November 21, 2025  
**Compliance Status:** ✅ Compliant via Stripe  
**Next Review:** Quarterly

---

*Questions about payment security? Contact: security@billtup.com*
