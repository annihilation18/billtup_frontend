# Database Schema

Complete database schema and data model documentation.

## Overview

BilltUp uses **Amazon DynamoDB** with a **key-value store** pattern. Each environment has its own table:

| Environment | Table Name          |
|-------------|---------------------|
| dev         | `billtup-dev-data`  |
| stg         | `billtup-stg-data`  |
| prod        | `billtup-prod-data` |

All data is accessed via the KV utility functions in `lambda/src/kv_store.ts`, which wraps the DynamoDB Document Client SDK (`GetCommand`, `PutCommand`, `DeleteCommand`, `QueryCommand`, `BatchWriteCommand`, `BatchGetCommand`).

### Table Structure

Each table uses a composite primary key:

| Attribute | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| `pk`      | String | Partition key (fixed value `"DATA"`)          |
| `sk`      | String | Sort key (the logical key, e.g. `business:abc123`) |
| `value`   | Map    | The stored JSON value                         |
| `ttl`     | Number | Optional TTL epoch (for expiring records)     |

The fixed partition key `"DATA"` combined with the sort key allows efficient prefix queries via `begins_with(sk, :prefix)`.

A separate DynamoDB table (`rate-limits`) is used for API rate limiting, also with TTL-based expiration.

**IMPORTANT SECURITY NOTE**:
- Card data NEVER stored: Credit card numbers, CVV, and expiry dates never touch our servers
- Stripe handles payment data: All sensitive payment info processed by Stripe (PCI DSS Level 1 compliant)
- Only Stripe IDs stored: We store payment intent IDs and payment method IDs (Stripe's secure references)
- No raw payment credentials: Bank account details are encrypted when stored for invoice display only

---

## Entity Relationship Diagram

```
+-----------------+
|      User       | (from AWS Cognito)
| - userId        |
| - email         |
+--------+--------+
         | 1:1
         v
+-----------------+
| Business Profile|
| - businessName  |
| - email, phone  |
| - address       |
| - logo          |
| - brandColor    |
| - bankInfo (enc)|
+--------+--------+
         | 1:N
         v
+-----------+           +-----------+           +-----------+
| Customer  |<------+   |  Invoice  |           | Estimate  |
| - name    |       |   | - number  |           | - number  |
| - email   |       +---| - customer|           | - customer|
| - phone   |       |   | - items   |           | - items   |
| - notes   |       |   | - total   |           | - total   |
+-----------+       |   | - status  |           | - status  |
                    |   | - dueDate |           | - validUntil
                    |   +-----+-----+           +-----------+
                    |         |
                    |         v
                    |   +-------------+
                    |   | Payment Link|
                    +---| - invoiceId |
                        | - token     |
                        | - expiresAt |
                        +-------------+
```

---

## Key Naming Convention

```
business:{userId}             - Business profile for a user
customers:{userId}            - Array of all customers for a user
invoices:{userId}             - Array of all invoices for a user
estimates:{userId}            - Array of all estimates for a user
line_items:{userId}           - Array of saved line items for autocomplete
password_reset:{token}        - Password reset token data (TTL-expiring)
password_reset_user:{userId}  - User-to-token mapping for password resets
payment_link:{token}          - Payment link token data (30-day TTL)
```

---

## Data Entities

### 1. Business Profile

**Key:** `business:{userId}`

```typescript
{
  userId: string;
  businessName: string;
  email: string;
  contactEmail?: string;             // Separate contact email (if different from account email)
  phone: string;
  address: string;
  industry: string;
  logo?: string;                     // Base64 or URL
  logoPath?: string;                 // S3 path for uploaded logo
  customLogo?: boolean;              // Whether the user has uploaded a custom logo
  defaultTaxRate: string;
  chargeTax?: boolean;

  // Branding
  brandColor?: string;               // Primary brand color (hex)
  accentColor?: string;              // Accent color (hex)
  invoiceTemplate?: string;          // Selected invoice template ID

  // Encrypted fields (AES-256-GCM)
  bankName?: string;                 // Encrypted
  accountHolderName?: string;        // Encrypted
  accountNumber?: string;            // Encrypted
  routingNumber?: string;            // Encrypted

  // Subscription
  plan: 'basic' | 'premium';
  planType: 'trial' | 'active' | 'canceled';
  isTrial: boolean;
  trialEndsAt?: string;             // ISO timestamp
  billingCycleStartDate: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  updatedAt: string;
  createdAt: string;
}
```

---

### 2. Customers

**Key:** `customers:{userId}` (array)

```typescript
{
  id: string;                        // UUID
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalInvoices: number;             // Computed
  totalRevenue: number;              // Computed
  createdAt: string;
  updatedAt: string;
}
```

---

### 3. Invoices

**Key:** `invoices:{userId}` (array)

```typescript
{
  id: string;                        // UUID
  userId: string;
  customerId?: string;               // FK to customer
  number: string;                    // INV-001, INV-002, etc.

  customer: string;                  // Customer name
  customerEmail: string;
  customerPhone?: string;

  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;                  // Per-item notes
  }>;

  subtotal: number;
  tax: number;
  total: number;

  date: string;                      // Display date
  dueDate?: string;                  // Due date (ISO string)
  status: 'pending' | 'paid' | 'refunded' | 'partially_refunded' | 'overdue';
  overdueNotifiedAt?: string;        // ISO timestamp when overdue notification was sent

  signature?: string;                // Base64 signature image
  notes?: string;

  // Stripe reference IDs only (NOT payment data)
  paymentIntentId?: string;          // Stripe payment intent ID (e.g., pi_abc123...)
  paymentMethod?: string;            // Payment method TYPE (e.g., "card", "nfc") NOT card details
  paidAt?: string;                   // ISO timestamp

  // Refund tracking
  refundedAmount?: number;
  refundDate?: string;
  refundReason?: string;

  createdAt: string;
  updatedAt: string;
}
```

**Security Notes**:
- `paymentIntentId`: Stripe's reference ID only -- cannot be used to access payment details
- `paymentMethod`: Just the type ("card", "nfc") -- NO card numbers, NO CVV, NO expiry
- Card data flows: Frontend -> Stripe.js -> Stripe Servers (never touches our backend)

---

### 4. Estimates

**Key:** `estimates:{userId}` (array)

```typescript
{
  id: string;                        // UUID
  userId: string;
  number: string;                    // EST-001, EST-002, etc.

  customer: string;                  // Customer name
  customerEmail: string;

  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;                  // Per-item notes
  }>;

  subtotal: number;
  tax: number;
  total: number;

  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
  validUntil?: string;              // ISO date -- estimate expiration
  approvalToken?: string;           // Token for customer approval link

  createdAt: string;
  updatedAt: string;
}
```

---

### 5. Payment Links

**Key:** `payment_link:{token}`

```typescript
{
  invoiceId: string;                 // FK to invoice
  token: string;                     // Unique token in the payment URL
  expiresAt: number;                 // TTL epoch (30-day expiration)
  used: boolean;                     // Whether the link has been used
}
```

Payment link records use DynamoDB TTL for automatic expiration after 30 days.

---

### 6. Saved Line Items

**Key:** `line_items:{userId}` (array)

```typescript
{
  name: string;                      // Item name
  notes?: string;                    // Default notes for this item
  price: number;                     // Default price
  quantity: number;                  // Default quantity
  usageCount: number;                // How many times this item has been used (for sorting)
}
```

Saved line items power the autocomplete feature when creating invoices or estimates.

---

### 7. Password Reset Tokens

**Keys:**
- `password_reset:{token}` -- Token data (TTL-expiring)
- `password_reset_user:{userId}` -- User-to-token mapping

```typescript
{
  userId: string;
  email: string;
  expiresAt: number;                 // TTL epoch timestamp
  used: boolean;
}
```

Password reset records use DynamoDB TTL for automatic cleanup after expiration.

---

## Security Implementation

### Encryption Standards

**Algorithm:** AES-256-GCM
**Key Size:** 256 bits
**IV:** 12 bytes random per encryption
**Salt:** 16 bytes random per encryption
**Key Derivation:** PBKDF2 with 100,000 iterations (SHA-256)
**Runtime:** Node.js Web Crypto API (`crypto.subtle`)
**Key Source:** AWS Secrets Manager (retrieved at Lambda cold start)

### Encrypted Fields

1. **Business Profile:**
   - `bankName`
   - `accountHolderName`
   - `accountNumber`
   - `routingNumber`

### Implementation Example

```typescript
import { encrypt, decrypt } from './utils/encryption';

// Encryption key retrieved from AWS Secrets Manager
const encryptionKey = process.env.ENCRYPTION_KEY;

// Encrypting
const encrypted = await encrypt(accountNumber, encryptionKey);

// Decrypting
const decrypted = await decrypt(encrypted, encryptionKey);
```

---

## Data Access Patterns

### KV Store API (`lambda/src/kv_store.ts`)

The KV store exposes the following functions:

| Function            | Description                                           |
|---------------------|-------------------------------------------------------|
| `get(key)`          | Retrieve a single value by key                        |
| `set(key, value)`   | Store/upsert a key-value pair                         |
| `del(key)`          | Delete a key-value pair                               |
| `mget(keys)`        | Batch retrieve multiple values (up to 100 per batch)  |
| `mset(keys, values)`| Batch store multiple key-value pairs (up to 25 per batch) |
| `mdel(keys)`        | Batch delete multiple key-value pairs (up to 25 per batch) |
| `getByPrefix(prefix)` | Query all values whose keys start with a prefix     |
| `getByPrefixWithKeys(prefix)` | Query all key-value pairs by prefix (returns keys too) |

### Common Queries

```typescript
import * as kv from './kv_store';

// Get all invoices for a user
const invoices = await kv.get(`invoices:${userId}`);

// Get business profile
const business = await kv.get(`business:${userId}`);

// Get all estimates for a user
const estimates = await kv.get(`estimates:${userId}`);

// Get saved line items for autocomplete
const lineItems = await kv.get(`line_items:${userId}`);

// Filter customer invoices in-memory
const allInvoices = await kv.get(`invoices:${userId}`);
const customerInvoices = allInvoices.filter(
  (inv: any) => inv.customerId === customerId
);

// Batch read multiple users' profiles
const profiles = await kv.mget([
  `business:${userId1}`,
  `business:${userId2}`,
]);

// Prefix query for all password reset tokens
const resets = await kv.getByPrefix('password_reset:');
```

---

## Data Validation Rules

1. **Email addresses** -- Must be valid format
2. **Phone numbers** -- Stored with country code
3. **Monetary values** -- Numbers with 2 decimal precision
4. **Dates** -- Stored as ISO 8601 strings
5. **IDs** -- UUID v4 format
6. **TTL values** -- Unix epoch timestamps (seconds)

---

## Referential Integrity

DynamoDB does not enforce foreign keys. Integrity is maintained at the application layer:

- When deleting a customer, related invoices are preserved (customer name stored inline)
- When deleting an invoice, related payment records are preserved for audit trail
- Soft deletes can use a `deleted: boolean` flag

---

## TTL (Time-to-Live)

DynamoDB TTL is used for automatic expiration of temporary records:

| Record Type        | TTL Duration | Purpose                          |
|--------------------|-------------|----------------------------------|
| Password reset     | 1 hour      | Auto-cleanup expired reset tokens |
| Payment link       | 30 days     | Auto-cleanup expired payment links |
| Rate limit entries | Variable    | Auto-cleanup rate limit windows   |

TTL is configured on the `ttl` attribute of the DynamoDB table. DynamoDB automatically deletes items after their TTL epoch has passed.

---

## Backup & Recovery

1. **DynamoDB Point-in-Time Recovery (PITR)** -- Enabled on all environment tables, providing continuous backups with restore to any second within the last 35 days
2. **Export Function** -- Data can be exported to JSON via DynamoDB export to S3
3. **Encryption Keys** -- Stored securely in AWS Secrets Manager (never in environment variables or code)
4. **Key Rotation** -- Plan for periodic rotation of encryption keys in Secrets Manager

---

## Scalability Considerations

### Current Design

- KV store pattern with arrays per user is suitable for small-to-medium businesses
- DynamoDB provides single-digit millisecond latency at any scale
- The fixed partition key `"DATA"` works well for the current workload size

### For High-Volume Users

- If a user accumulates thousands of invoices, consider:
  - Implementing pagination on array reads
  - Splitting large arrays into individual records with prefix queries
  - Using DynamoDB Streams for event-driven processing
  - Caching frequently accessed data in Lambda memory or ElastiCache

---

## Compliance

### Data Privacy (GDPR, CCPA)

- **Right to Access** -- Users can export their data
- **Right to Deletion** -- Account deletion purges all KV entries for the user
- **Right to Portability** -- Data stored as JSON, easily exportable
- **Encryption at Rest** -- DynamoDB encrypts all data at rest; sensitive fields additionally encrypted with AES-256-GCM

### Financial Compliance (PCI DSS)

- **No card data stored** -- All payment processing via Stripe
- **Encrypted bank info** -- Bank details encrypted with AES-256-GCM
- **Audit trail** -- All transactions logged with timestamps
- **Access control** -- Cognito-based user authentication; Lambda IAM roles for DynamoDB access

---

## Monitoring

Track:
- DynamoDB consumed read/write capacity units (CloudWatch)
- Encryption/decryption performance
- Failed data access attempts (Lambda error logs)
- TTL deletions (DynamoDB Streams, if enabled)
- Table item count and storage size

---

## Maintenance Tasks

- Archive old paid invoices (>1 year) to reduce array sizes
- Monitor TTL cleanup of expired tokens and payment links
- Clean up orphaned data (e.g., customers with no linked invoices)
- Review and optimize large per-user arrays

---

*Last Updated: February 2026*
