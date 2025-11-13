# Security & Compliance

Security features, best practices, and compliance information for BilltUp.

---

## Security Overview

BilltUp is built with enterprise-grade security features:

✅ **Authentication** - Secure JWT-based authentication  
✅ **Encryption** - AES-256-GCM for sensitive data  
✅ **PCI Compliance** - Via Stripe integration  
✅ **HTTPS Everywhere** - All communication encrypted  
✅ **Rate Limiting** - Multi-tier DDoS protection  
✅ **Data Isolation** - User data scoped by userId  
✅ **GDPR Ready** - Data export and deletion  

---

## Authentication & Authorization

### JWT Authentication

**How it works:**
1. User signs up/in via Supabase Auth
2. Receives JWT access token
3. Token included in all API requests
4. Backend validates token on every request

**Token Structure:**
```json
{
  "sub": "user_id_here",
  "email": "user@example.com",
  "iat": 1699804800,
  "exp": 1699891200
}
```

**Security Features:**
- ✅ Tokens expire after session timeout
- ✅ Refresh tokens for long sessions
- ✅ Secure httpOnly cookies (optional)
- ✅ CSRF protection

### Password Security

**Requirements:**
- Minimum 8 characters
- No maximum length
- Hashed with bcrypt
- Stored in Supabase Auth (never in app database)

**Best Practices:**
- ✅ Enforce strong passwords
- ✅ Implement password reset flow
- ✅ Rate limit login attempts
- ✅ Lock accounts after failed attempts

---

## Data Encryption

### AES-256-GCM Encryption

**Used for:**
- Bank account details
- Sensitive business information
- Payment method details

**Specifications:**
- **Algorithm:** AES-256-GCM
- **Key Size:** 256 bits
- **IV:** 12 bytes random per encryption
- **Salt:** 16 bytes random per encryption
- **Key Derivation:** PBKDF2 with 100,000 iterations

### Implementation

**Encryption:**
```typescript
import { encrypt } from './utils/encryption';

const encryptedData = await encrypt(
  sensitiveData,
  process.env.ENCRYPTION_KEY
);
```

**Decryption:**
```typescript
import { decrypt } from './utils/encryption';

const decryptedData = await decrypt(
  encryptedData,
  process.env.ENCRYPTION_KEY
);
```

### Encrypted Fields

**Business Profile:**
- `bankName`
- `accountHolderName`
- `accountNumber`
- `routingNumber`

**Payment Data:**
- `paymentIntentId` (Stripe)
- `paymentMethodId` (Stripe)

---

## PCI DSS Compliance

### How BilltUp is Compliant

✅ **No card data stored** - All card processing via Stripe  
✅ **Stripe Elements** - Secure card input fields  
✅ **HTTPS only** - All communication encrypted  
✅ **Tokenization** - Card details never touch server  
✅ **Secure storage** - Stripe handles all card data  

### What You Don't Need to Do

❌ Store card numbers  
❌ Handle CVV codes  
❌ Manage PCI certification  
❌ Undergo PCI audits  

**Why:** Stripe is PCI Level 1 certified and handles all card data.

### Payment Flow

```
Customer → Stripe.js (client) → Stripe API → Your Backend

Card data NEVER touches your server!
```

1. Customer enters card on frontend
2. Stripe.js tokenizes card data
3. Token sent to Stripe API
4. Stripe returns payment intent
5. Your backend receives only payment intent ID
6. No card data in your database

---

## DDoS Protection

### Multi-Tier Rate Limiting

**Tier 1: Authenticated Users**
- 100 requests per minute
- Applied per user ID
- Automatic blocking after limit

**Tier 2: IP Address**
- 60 requests per minute
- Applied per IP address
- Prevents unauthenticated abuse

**Tier 3: Login Attempts**
- 10 login attempts per 15 minutes
- Prevents brute force attacks
- Automatic account lockout

**Tier 4: Automatic IP Blocking**
- Blocks IP after 200 requests/minute
- 1-hour cooldown period
- Logged for security monitoring

### Query Limits

- ✅ Maximum 100 rows per request
- ✅ Pagination required for large datasets
- ✅ Response size limited to 5MB
- ✅ Protects database from query spam

### Implementation

```typescript
// Rate limiting is automatic in backend
// No frontend changes needed

// Backend checks on every request:
// 1. Is this IP blocked?
// 2. Has this user exceeded limit?
// 3. Has this IP exceeded limit?
```

---

## CORS Configuration

### Allowed Origins

**Development:**
- `http://localhost:5173`
- `http://localhost:3000`

**Production:**
- Your production domain
- Vercel preview URLs

### Headers

```typescript
// Automatically set by backend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrictable per environment
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};
```

---

## Security Headers

### Enabled Headers

**X-Frame-Options:**
```
X-Frame-Options: DENY
```
Prevents clickjacking attacks.

**X-Content-Type-Options:**
```
X-Content-Type-Options: nosniff
```
Prevents MIME-type sniffing.

**X-XSS-Protection:**
```
X-XSS-Protection: 1; mode=block
```
Enables browser XSS protection.

**Referrer-Policy:**
```
Referrer-Policy: strict-origin-when-cross-origin
```
Controls referrer information.

**Strict-Transport-Security:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
Enforces HTTPS everywhere.

### Configuration

Headers are set in `/vercel.json` for frontend and in Edge Function responses for backend.

---

## GDPR Compliance

### User Rights

**Right to Access:**
- ✅ Users can export all their data
- ✅ Data available in JSON format
- ✅ Includes invoices, customers, payments

**Right to Deletion:**
- ✅ Account deletion available
- ✅ All data purged from database
- ✅ Stripe data deletion requested
- ✅ 30-day grace period (optional)

**Right to Portability:**
- ✅ Data export in JSON
- ✅ All user data included
- ✅ Machine-readable format

### Implementation

**Export Data:**
```typescript
// API endpoint
GET /user/export-data

// Returns all user data as JSON
{
  "business": {...},
  "customers": [...],
  "invoices": [...],
  "payments": [...]
}
```

**Delete Account:**
```typescript
// API endpoint
DELETE /user/account

// Permanently deletes:
// - User account
// - Business profile
// - All customers
// - All invoices
// - All payment records
```

### Data Retention

**Active Accounts:**
- Data retained indefinitely
- User controls their data

**Deleted Accounts:**
- Data purged immediately
- No backup retention
- Stripe data deletion requested

**Legal Requirements:**
- Financial records may need 7-year retention
- Check local regulations
- Implement archive system if needed

---

## CCPA Compliance

### California Consumer Privacy Act

**Do Not Sell:**
- ✅ BilltUp does NOT sell user data
- ✅ No third-party data sharing
- ✅ No advertising networks

**User Rights:**
- ✅ Right to know what data is collected
- ✅ Right to delete data
- ✅ Right to opt-out of sale (N/A - we don't sell)

---

## Security Best Practices

### For Developers

**Environment Variables:**
- ✅ Use `.env.local` for local development
- ✅ Never commit `.env` files to Git
- ✅ Use Supabase secrets for backend
- ✅ Rotate keys periodically

**API Keys:**
- ✅ Keep secret keys server-side only
- ✅ Use publishable keys in frontend
- ✅ Restrict API key permissions
- ✅ Monitor API key usage

**Code Security:**
- ✅ Validate all user input
- ✅ Sanitize HTML output
- ✅ Use parameterized queries
- ✅ Avoid `eval()` and `innerHTML`

### For Users

**Account Security:**
- ✅ Use strong, unique passwords
- ✅ Enable 2FA (if available)
- ✅ Don't share credentials
- ✅ Log out on shared devices

**Data Protection:**
- ✅ Only enter necessary information
- ✅ Review who has access
- ✅ Regularly audit invoices
- ✅ Report suspicious activity

---

## Security Monitoring

### What to Monitor

**Failed Login Attempts:**
```bash
# Check backend logs
npx supabase functions logs server | grep "login failed"
```

**Rate Limit Violations:**
```bash
# Check for blocked IPs
npx supabase functions logs server | grep "rate limit"
```

**Payment Failures:**
```bash
# Check Stripe Dashboard
https://dashboard.stripe.com/logs
```

### Alerts to Set Up

Recommended alerts:
- [ ] Multiple failed login attempts
- [ ] Unusual payment patterns
- [ ] High error rates
- [ ] Database query failures
- [ ] API endpoint failures

### Tools

**Recommended Services:**
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring
- **PagerDuty** - Incident alerting

---

## Incident Response

### If a Security Issue is Discovered

**1. Assess:**
- What data was exposed?
- How many users affected?
- How did it happen?

**2. Contain:**
- Immediately patch vulnerability
- Revoke compromised credentials
- Block malicious IPs

**3. Notify:**
- Affected users (within 72 hours for GDPR)
- Regulatory authorities if required
- Law enforcement if criminal activity

**4. Remediate:**
- Fix root cause
- Update security measures
- Conduct security audit

**5. Document:**
- What happened
- How it was fixed
- Lessons learned
- Prevention measures

---

## Security Checklist

### Development

- [ ] ✅ Environment variables configured
- [ ] ✅ No secrets in code
- [ ] ✅ Input validation everywhere
- [ ] ✅ Output sanitization
- [ ] ✅ HTTPS in development
- [ ] ✅ CORS configured correctly

### Deployment

- [ ] ✅ Production secrets set
- [ ] ✅ HTTPS enforced
- [ ] ✅ Security headers enabled
- [ ] ✅ Rate limiting active
- [ ] ✅ Error logging configured
- [ ] ✅ Monitoring set up

### Ongoing

- [ ] ✅ Regular security audits
- [ ] ✅ Dependency updates
- [ ] ✅ Key rotation
- [ ] ✅ Access reviews
- [ ] ✅ Backup testing
- [ ] ✅ Incident response plan

---

## Penetration Testing

### Areas to Test

**Authentication:**
- [ ] Brute force protection
- [ ] Session hijacking
- [ ] Password reset vulnerabilities
- [ ] JWT token manipulation

**API Security:**
- [ ] SQL injection (N/A - using KV store)
- [ ] XSS vulnerabilities
- [ ] CSRF protection
- [ ] Rate limit bypass

**Data Protection:**
- [ ] Encryption strength
- [ ] Key management
- [ ] Data leakage
- [ ] Access control bypass

---

## Security Resources

### Official Documentation

- **Supabase Security:** https://supabase.com/docs/guides/platform/security
- **Stripe Security:** https://stripe.com/docs/security
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

### Compliance Standards

- **PCI DSS:** https://www.pcisecuritystandards.org/
- **GDPR:** https://gdpr.eu/
- **CCPA:** https://oag.ca.gov/privacy/ccpa

---

## Contact & Reporting

**Security Issues:**
Report security vulnerabilities to: security@billtup.com

**Bug Bounty:**
Currently not available (consider implementing for production)

---

**Last Updated:** November 11, 2025  
**Security Audit:** Pending  
**Compliance Status:** PCI DSS Compliant (via Stripe), GDPR Ready
