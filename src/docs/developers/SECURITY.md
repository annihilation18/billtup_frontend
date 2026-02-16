# Security Best Practices & Guidelines

This document outlines security standards, practices, and guidelines for the BilltUp platform.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Data Protection](#data-protection)
3. [API Security](#api-security)
4. [Payment Security (PCI DSS)](#payment-security-pci-dss)
5. [Environment Variables](#environment-variables)
6. [Common Vulnerabilities](#common-vulnerabilities)
7. [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### JWT Token Management

**✅ Current Implementation:**
- Tokens stored in `localStorage` (acceptable for web apps)
- Automatic token refresh on API calls
- Session validation on each request

**🔒 Security Requirements:**

1. **Token Expiration:** Tokens should expire within 1 hour
2. **Refresh Tokens:** Implement refresh token rotation
3. **Secure Storage:** Use `httpOnly` cookies for enhanced security (production)

```typescript
// Good: Validate token on every request
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken || accessToken === publicAnonKey) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const { user, error } = await supabase.auth.getUser(accessToken);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  await next();
}
```

### Password Requirements

**Minimum Standards:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (optional but recommended)

**🚨 Never log passwords:**

```typescript
// ❌ BAD
console.log('User password:', password);

// ✅ GOOD
console.log('Password validation successful');
```

---

## Data Protection

### Encryption at Rest

**Sensitive Data Requiring Encryption:**

1. Bank account numbers
2. Routing numbers  
3. Email passwords (SMTP credentials)
4. API keys stored in database

**Implementation:**

```typescript
import { encrypt, decrypt } from './utils/encryption';

// Encrypting data
const encryptedData = await encrypt(
  sensitiveData,
  Deno.env.get('ENCRYPTION_KEY')!
);

// Decrypting data
const decryptedData = await decrypt(
  encryptedData,
  Deno.env.get('ENCRYPTION_KEY')!
);
```

**Encryption Standard:**
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **IV:** 12 bytes random per encryption
- **Salt:** 16 bytes random per encryption

### Data Sanitization

**Always sanitize user input:**

```typescript
// ❌ BAD - Direct storage without validation
await kv.set(`customer:${customerId}`, rawInput);

// ✅ GOOD - Validate and sanitize
const sanitizedData = {
  name: sanitizeString(input.name),
  email: validateEmail(input.email),
  phone: sanitizePhone(input.phone)
};
await kv.set(`customer:${customerId}`, sanitizedData);
```

---

## API Security

### CORS Configuration

**⚠️ Current Issue:** CORS is too permissive
```typescript
// ❌ CURRENT - Too permissive
cors({ origin: "*" })
```

**✅ Recommended Fix:**
```typescript
// Production configuration
cors({
  origin: [
    'https://billtup.com',
    'https://www.billtup.com',
    'https://staging.billtup.com'
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
})

// Development configuration
cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://billtup.com'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
})
```

### Rate Limiting

**🚨 Currently Missing:** No rate limiting implemented

**✅ Recommended Implementation:**

```typescript
import { rateLimiter } from 'npm:hono-rate-limiter';

// Apply rate limiting
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
}));

// Stricter limits for auth endpoints
app.use('/auth/*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 auth attempts per 15 minutes
  message: 'Too many login attempts'
}));
```

### Input Validation

**Always validate input:**

```typescript
// ❌ BAD - No validation
app.post('/customers', async (c) => {
  const body = await c.req.json();
  await kv.set(`customer:${uuid}`, body);
});

// ✅ GOOD - Validate all inputs
app.post('/customers', async (c) => {
  const body = await c.req.json();
  
  // Validate required fields
  if (!body.name || !body.email) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  
  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return c.json({ error: 'Invalid email format' }, 400);
  }
  
  // Validate string lengths
  if (body.name.length > 255) {
    return c.json({ error: 'Name too long' }, 400);
  }
  
  // Proceed with validated data
  await kv.set(`customer:${uuid}`, sanitizeCustomer(body));
});
```

### SQL Injection Prevention

**KV Store is safe from SQL injection**, but if migrating to direct SQL:

```typescript
// ❌ BAD - SQL Injection vulnerability
const result = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);

// ✅ GOOD - Use parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

---

## Payment Security (PCI DSS)

### PCI DSS Compliance

**✅ Current Implementation:** Stripe handles all card data
- Card information never touches our servers
- Stripe.js collects card details client-side
- Only Stripe Payment Intent IDs and Payment Method IDs stored on backend
- All sensitive payment data remains with Stripe (PCI DSS Level 1 compliant)

**Payment Data Flow:**
```
User enters card details
    ↓
Stripe.js (client-side) → Tokenizes card data
    ↓
Stripe Servers (PCI DSS Level 1)
    ↓
Returns Payment Intent ID (e.g., pi_abc123...)
    ↓
BilltUp Backend → Stores ONLY the Intent ID
    ↓
BilltUp Database → No card data, only references
```

**What We Store:**
- ✅ Payment Intent IDs (e.g., `pi_1234567890abcdef`)
- ✅ Payment Method IDs (e.g., `pm_1234567890abcdef`)
- ✅ Payment method TYPE (e.g., "card" or "nfc")
- ❌ NO card numbers
- ❌ NO CVV codes
- ❌ NO expiry dates

**Compliance Requirements:**

1. **Never store:**
   - Full credit card numbers
   - CVV/CVC codes
   - Expiration dates in plain text

2. **Always use:**
   - Stripe Elements for card input
   - Stripe Payment Intents for processing
   - Stripe webhooks for payment status

3. **Secure transmission:**
   - All payment requests over HTTPS only
   - TLS 1.2+ required

**Implementation:**

```typescript
// ✅ GOOD - Client-side Stripe.js handles card data
// Frontend creates payment intent
const { clientSecret, paymentIntentId } = await fetch('/payments/create-intent', {
  method: 'POST',
  body: JSON.stringify({
    amount: 1000,
    currency: 'usd'
  })
}).then(r => r.json());

// Stripe.js confirms payment (card data stays with Stripe)
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement, // Stripe Elements handles this securely
    billing_details: { name, email }
  }
});

// Backend only stores the payment intent ID
// Database: { paymentIntentId: 'pi_abc123...', status: 'succeeded' }
```

### Stripe Webhook Security

**Verify webhook signatures:**

```typescript
app.post('/webhooks/stripe', async (c) => {
  const sig = c.req.header('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      await c.req.text(),
      sig!,
      webhookSecret!
    );
    
    // Process verified event
    await handleStripeEvent(event);
    
    return c.json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return c.json({ error: 'Invalid signature' }, 400);
  }
});
```

---

## Environment Variables

### Secret Management

**✅ Current Secrets (Properly Configured):**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `STRIPE_SECRET_KEY` (server-only)
- `EMAIL_USER`
- `EMAIL_PASSWORD`

**🚨 Security Rules:**

1. **Never commit secrets to Git**
2. **Never expose server-only keys to frontend**
3. **Rotate secrets periodically**
4. **Use different keys for dev/staging/production**

**Frontend vs Backend:**

```typescript
// ✅ Frontend - Public keys only
const supabaseClient = createClient(
  publicUrl,
  publicAnonKey // Safe to expose
);

// ✅ Backend - Can use service role key
const supabaseAdmin = createClient(
  supabaseUrl,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Never exposed
);
```

### Hardcoded Secrets

**🚨 Security Issue Found:**

```typescript
// ❌ BAD - Hardcoded Stripe key in SignUpSection.tsx (line 39)
const stripePromise = loadStripe('pk_test_51QUnWrAEhJsFVtrcPnA4...');
```

**✅ Fix:**

```typescript
// Move to environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);
```

---

## Common Vulnerabilities

### XSS (Cross-Site Scripting)

**Prevention:**

```typescript
// ❌ BAD - Direct HTML injection
element.innerHTML = userInput;

// ✅ GOOD - React automatically escapes
<div>{userInput}</div>

// ✅ GOOD - Sanitize if HTML needed
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF (Cross-Site Request Forgery)

**Protection:**
- CORS properly configured
- SameSite cookies
- Token-based authentication

### Information Disclosure

**🚨 Issues to Fix:**

```typescript
// ❌ BAD - Logs too much detail
console.log('Login failed for:', email, 'with password:', password);

// ✅ GOOD - Log minimal information
console.log('Login attempt failed for user');

// ❌ BAD - Exposes system details in errors
return c.json({ error: error.stack }, 500);

// ✅ GOOD - Generic error message
return c.json({ error: 'An error occurred' }, 500);
console.error('Detailed error:', error); // Log server-side only
```

---

## Security Checklist

### Before Deploying to Production

- [ ] All secrets in environment variables (no hardcoded keys)
- [ ] CORS restricted to production domains
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation on all API endpoints
- [ ] Error messages don't expose system details
- [ ] Logging doesn't include sensitive data
- [ ] HTTPS enforced (no HTTP allowed)
- [ ] Authentication required on protected endpoints
- [ ] Webhook signatures verified
- [ ] Password requirements enforced
- [ ] SQL injection prevention (if using direct SQL)
- [ ] XSS prevention in all user inputs
- [ ] Encryption enabled for sensitive data
- [ ] Regular security audits scheduled
- [ ] Dependency security scanning enabled

### Monitoring & Alerts

**Set up alerts for:**
- Failed authentication attempts (>5 in 15 min)
- Unusual API usage patterns
- Database access errors
- Payment failures
- Webhook verification failures

---

## Security Incident Response

### If a Security Issue is Discovered:

1. **Immediately:**
   - Rotate all affected secrets
   - Disable compromised endpoints
   - Document the incident

2. **Within 24 hours:**
   - Assess impact
   - Notify affected users (if required by law)
   - Deploy fixes

3. **Within 1 week:**
   - Complete incident report
   - Update security procedures
   - Conduct security review

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**Last Updated:** November 21, 2025  
**Security Contact:** security@billtup.com