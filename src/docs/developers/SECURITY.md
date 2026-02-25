# Security Best Practices & Guidelines

This document outlines security standards, practices, and guidelines for the BilltUp platform.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Data Protection](#data-protection)
3. [API Security](#api-security)
4. [Payment Security (PCI DSS)](#payment-security-pci-dss)
5. [Secret Management](#secret-management)
6. [Common Vulnerabilities](#common-vulnerabilities)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### AWS Cognito JWT Validation

**Current Implementation:**
- AWS Cognito handles user authentication (sign up, sign in, password reset)
- JWT tokens validated server-side using the `aws-jwt-verify` library
- `checkAuth()` middleware in `lambda/src/middleware/auth.ts` enforces authentication on protected routes
- Tokens stored in `localStorage` on the frontend

**Token Lifecycle:**
- **Access token**: 1-hour expiry, used for API authorization
- **Refresh token**: Automatic rotation for session continuity
- **ID token**: Contains user profile info (email, sub, etc.)

```typescript
// Backend: checkAuth middleware validates Cognito JWTs
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

async function checkAuth(event) {
  const token = event.headers.authorization?.split(' ')[1];
  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const payload = await verifier.verify(token);
    // Token is valid, payload contains user info
    return payload;
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token' }) };
  }
}
```

### Password Requirements

**Minimum Standards (enforced by Cognito):**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (optional but recommended)

**Never log passwords:**

```typescript
// BAD
console.log('User password:', password);

// GOOD
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
// Node.js Web Crypto API (AES-256-GCM)
import { encrypt, decrypt } from './utils/encryption';

// Encrypting data - key sourced from Secrets Manager
const encryptedData = await encrypt(sensitiveData, encryptionKey);

// Decrypting data
const decryptedData = await decrypt(encryptedData, encryptionKey);
```

**Encryption Standard:**
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **IV:** 12 bytes random per encryption
- **Salt:** 16 bytes random per encryption
- **Key Source:** AWS Secrets Manager (`billtup-{env}-secrets`)

### Data Sanitization

**Always sanitize user input:**

```typescript
// BAD - Direct storage without validation
await kvStore.set(`customer:${customerId}`, rawInput);

// GOOD - Validate and sanitize
const sanitizedData = {
  name: sanitizeString(input.name),
  email: validateEmail(input.email),
  phone: sanitizePhone(input.phone)
};
await kvStore.set(`customer:${customerId}`, sanitizedData);
```

---

## API Security

### CORS Configuration

**Current Implementation:** CORS is configured per environment with restricted origins.

```typescript
// Production - restricted to production domains
cors({
  origin: ['https://billtup.com', 'https://www.billtup.com'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
})

// Staging
cors({
  origin: ['https://stg.billtup.com'],
  ...
})

// Development
cors({
  origin: ['https://dev.billtup.com', 'http://localhost:5173'],
  ...
})
```

### Rate Limiting

**Current Implementation:** DynamoDB-backed sliding window rate limiter, already active on all environments.

- **General endpoints:** 100 requests per 15-minute window
- **Auth endpoints:** Stricter limits (fewer requests allowed)
- **Per-user tracking:** Rate limits applied per authenticated user or IP

```typescript
// Rate limiter middleware (lambda/src/middleware/rateLimiter.ts)
// Uses DynamoDB to track request counts per sliding window
// Different limits configured per endpoint type
```

### Input Validation

**Always validate input:**

```typescript
// BAD - No validation
app.post('/customers', async (event) => {
  const body = JSON.parse(event.body);
  await kvStore.set(`customer:${uuid}`, body);
});

// GOOD - Validate all inputs
app.post('/customers', async (event) => {
  const body = JSON.parse(event.body);

  if (!body.name || !body.email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid email format' }) };
  }

  if (body.name.length > 255) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name too long' }) };
  }

  await kvStore.set(`customer:${uuid}`, sanitizeCustomer(body));
});
```

### Injection Prevention

**DynamoDB (NoSQL) is not vulnerable to SQL injection**, but always validate and sanitize inputs to prevent other forms of injection. If any direct SQL is ever introduced, use parameterized queries:

```typescript
// BAD - SQL Injection vulnerability
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// GOOD - Use parameterized queries
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

---

## Payment Security (PCI DSS)

### PCI DSS Compliance

**Current Implementation:** Stripe handles all card data.
- Card information never touches our servers
- Stripe.js collects card details client-side
- Only Stripe Payment Intent IDs and Payment Method IDs stored on backend
- All sensitive payment data remains with Stripe (PCI DSS Level 1 compliant)

**Payment Data Flow:**
```
User enters card details
    |
Stripe.js (client-side) -> Tokenizes card data
    |
Stripe Servers (PCI DSS Level 1)
    |
Returns Payment Intent ID (e.g., pi_abc123...)
    |
BilltUp Backend -> Stores ONLY the Intent ID
    |
DynamoDB -> No card data, only references
```

**What We Store:**
- Payment Intent IDs (e.g., `pi_1234567890abcdef`)
- Payment Method IDs (e.g., `pm_1234567890abcdef`)
- Payment method TYPE (e.g., "card" or "nfc")
- NO card numbers
- NO CVV codes
- NO expiry dates

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
// Client-side: Stripe.js handles card data
const { clientSecret, paymentIntentId } = await fetch('/payments/create-intent', {
  method: 'POST',
  body: JSON.stringify({ amount: 1000, currency: 'usd' })
}).then(r => r.json());

// Stripe.js confirms payment (card data stays with Stripe)
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name, email }
  }
});

// Backend only stores the payment intent ID
// DynamoDB: { paymentIntentId: 'pi_abc123...', status: 'succeeded' }
```

### Stripe Webhook Security

**Webhook signature verification is enforced in production.** Unsigned webhook requests return 401.

```typescript
// lambda/src/routes/webhooks.ts
async function handleStripeWebhook(event) {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );

    await handleStripeEvent(stripeEvent);
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    logger.error('Webhook signature verification failed', { error: err });
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }
}
```

---

## Secret Management

### AWS Secrets Manager

**All backend secrets are stored in AWS Secrets Manager** under `billtup-{env}-secrets` (one secret per environment: dev, stg, prod).

**Backend Secrets (server-only, never exposed to frontend):**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ENCRYPTION_KEY`
- `EMAIL_USER` / `EMAIL_PASSWORD`
- `SLACK_WEBHOOK_URL`
- Cognito pool configuration

**Frontend Variables (public, safe to expose):**
- `VITE_COGNITO_REGION` - AWS region
- `VITE_COGNITO_USER_POOL_ID` - Cognito pool ID
- `VITE_COGNITO_CLIENT_ID` - Cognito app client ID
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (public by design)
- `VITE_API_URL` - API Gateway URL

**Security Rules:**

1. **Never commit secrets to Git**
2. **Never expose server-only keys to frontend** (only `VITE_` prefixed vars reach the browser)
3. **Rotate secrets periodically**
4. **Use different secrets per environment** (dev/stg/prod each have their own)
5. **GitHub environment secrets** are synced to Secrets Manager via CI/CD workflows

```typescript
// Backend: Secrets loaded from Secrets Manager at Lambda cold start
const secrets = await getSecrets(); // Fetches from billtup-{env}-secrets
const stripeKey = secrets.STRIPE_SECRET_KEY;

// Frontend: Only public config via Vite env vars
const apiUrl = import.meta.env.VITE_API_URL;
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
```

---

## Common Vulnerabilities

### XSS (Cross-Site Scripting)

**Prevention:**

```typescript
// BAD - Direct HTML injection
element.innerHTML = userInput;

// GOOD - React automatically escapes
<div>{userInput}</div>

// GOOD - Sanitize if HTML is needed
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF (Cross-Site Request Forgery)

**Protection:**
- CORS restricted to known domains per environment
- Token-based authentication (Authorization header)
- SameSite cookie attributes where applicable

### Information Disclosure

```typescript
// BAD - Logs too much detail
console.log('Login failed for:', email, 'with password:', password);

// GOOD - Log minimal information
logger.warn('Login attempt failed', { userId: anonymizedId });

// BAD - Exposes system details in errors
return { statusCode: 500, body: JSON.stringify({ error: error.stack }) };

// GOOD - Generic error message to client, detailed log server-side
logger.error('Detailed error', { error });
return { statusCode: 500, body: JSON.stringify({ error: 'An error occurred' }) };
```

**Note:** Production console logs are suppressed on the frontend (C18). All frontend errors are captured via `captureError()` and the React Error Boundary, which sends reports to a dedicated error-report Lambda.

---

## Monitoring & Alerting

### CloudWatch Alarms

The following alarms are configured and active:
- **API 5xx errors** - triggers on elevated server error rates
- **Lambda errors** - triggers on function invocation failures
- **DynamoDB throttling** - triggers when read/write capacity is exceeded

### Slack Alerts

- `logger.error()` and `logger.critical()` calls in Lambda functions send notifications to Slack via webhook
- Covers: payment failures, auth errors, webhook verification failures, unhandled exceptions

### Frontend Error Reporting

- `captureError()` utility captures frontend errors with context
- React Error Boundary catches unhandled component errors
- Errors sent to a dedicated `error-report` Lambda endpoint
- Production console logs suppressed to avoid information leakage

---

## Security Checklist

### Before Deploying to Production

- [ ] All secrets in AWS Secrets Manager (no hardcoded keys)
- [ ] CORS restricted to production domains only
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation on all API endpoints
- [ ] Error messages don't expose system details
- [ ] Logging doesn't include sensitive data
- [ ] HTTPS enforced (CloudFront handles TLS termination)
- [ ] Authentication required on protected endpoints
- [ ] Stripe webhook signatures verified (401 for unsigned)
- [ ] Password requirements enforced (Cognito policy)
- [ ] XSS prevention in all user inputs
- [ ] Encryption enabled for sensitive data (AES-256-GCM)
- [ ] Frontend `VITE_` env vars contain only public values
- [ ] CloudWatch alarms configured and tested
- [ ] Dependency security scanning enabled

---

## Security Incident Response

### If a Security Issue is Discovered:

1. **Immediately:**
   - Rotate all affected secrets in AWS Secrets Manager
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
- [AWS Cognito Security](https://docs.aws.amazon.com/cognito/latest/developerguide/security.html)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

**Last Updated:** February 2026
**Security Contact:** security@billtup.com
