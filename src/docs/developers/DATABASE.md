# Database Schema

Complete database schema and data model documentation.

## Overview

BilltUp uses a **key-value store** pattern with PostgreSQL through Supabase. All data is accessed via the KV utility functions.

**IMPORTANT SECURITY NOTE**: 
- ✅ **Card data NEVER stored**: Credit card numbers, CVV, and expiry dates never touch our servers
- ✅ **Stripe handles payment data**: All sensitive payment info processed by Stripe (PCI DSS Level 1 compliant)
- ✅ **Only Stripe IDs stored**: We store payment intent IDs and payment method IDs (Stripe's secure references)
- ✅ **No raw payment credentials**: Bank account details are encrypted when stored for invoice display only

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │ (from Supabase Auth)
│ - userId    │
│ - email     │
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────────┐
│ Business Profile│
│ - businessName  │
│ - email, phone  │
│ - address       │
│ - logo          │
│ - bankInfo (🔒) │
└──────┬──────────┘
       │ 1:N
       ▼
┌─────────────┐         ┌─────────────┐
│  Customer   │◄────┐   │   Invoice   │
│ - name      │     │   │ - number    │
│ - email     │     └───│ - customerId│
│ - phone     │         │ - lineItems │
│ - notes     │         │ - total     │
└─────────────┘         │ - status    │
                        │ - payment 🔒│
                        └──────┬───────┘
                               │ 1:N
                               ▼
                        ┌─────────────┐
                        │  Payment    │
                        │ - amount    │
                        │ - method    │
                        │ - intentId  │
                        │ - status    │
                        └─────────────┘
```

---

## Key Naming Convention

```
{entity}:{userId}                    - List of all entities for a user
{entity}:{entityId}                  - Individual entity details
{entity}:{userId}:{customerId}       - User-specific entity subset
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
  phone: string;
  address: string;
  industry: string;
  logo?: string;                    // Base64 or URL
  defaultTaxRate: string;
  chargeTax?: boolean;
  
  // 🔒 ENCRYPTED FIELDS
  bankName?: string;                // Encrypted
  accountHolderName?: string;       // Encrypted
  accountNumber?: string;           // Encrypted
  routingNumber?: string;           // Encrypted
  
  plan: 'basic' | 'premium';
  planType: 'trial' | 'active' | 'canceled';
  isTrial: boolean;
  trialEndsAt?: string;            // ISO timestamp
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
  id: string;                       // UUID
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalInvoices: number;            // Computed
  totalRevenue: number;             // Computed
  createdAt: string;
  updatedAt: string;
}
```

---

### 3. Invoices

**Key:** `invoices:{userId}` (array)

```typescript
{
  id: string;                       // UUID
  userId: string;
  customerId?: string;              // FK to customer
  number: string;                   // INV-001, INV-002, etc.
  
  customer: string;                 // Customer name
  customerEmail: string;
  customerPhone?: string;
  
  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  
  subtotal: number;
  tax: number;
  total: number;
  
  date: string;                     // Display date
  dueDate?: string;                 // Due date
  status: 'pending' | 'paid' | 'refunded' | 'partially_refunded' | 'overdue';
  
  signature?: string;               // Base64 signature image
  notes?: string;
  
  // 🔒 STRIPE REFERENCE IDs ONLY (NOT payment data)
  paymentIntentId?: string;         // Stripe payment intent ID (e.g., pi_abc123...)
  paymentMethod?: string;           // Payment method TYPE (e.g., "card", "nfc") NOT card details
  paidAt?: string;                  // ISO timestamp
  
  // Refund tracking
  refundedAmount?: number;
  refundDate?: string;
  refundReason?: string;
  
  createdAt: string;
  updatedAt: string;
}
```

**Security Notes**:
- `paymentIntentId`: Stripe's reference ID only - cannot be used to access payment details
- `paymentMethod`: Just the type ("card", "nfc") - NO card numbers, NO CVV, NO expiry
- Card data flows: Frontend → Stripe.js → Stripe Servers (never touches our backend)

---

### 4. Payments

**Key:** `payments:{userId}` (array)

```typescript
{
  id: string;                       // UUID
  userId: string;
  invoiceId: string;                // FK to invoice
  customerId?: string;              // FK to customer
  
  amount: number;
  currency: string;                 // USD
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';
  
  // 🔒 STRIPE REFERENCE IDs ONLY
  paymentIntentId: string;          // Stripe payment intent ID
  paymentMethodId?: string;         // Stripe payment method ID (secure reference)
  receiptUrl?: string;              // Stripe receipt URL
  
  // Refund data
  refunds: Array<{
    id: string;
    amount: number;
    reason?: string;
    status: string;
    createdAt: string;
  }>;
  
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

**Security Notes**:
- All fields are Stripe's secure reference IDs
- Cannot be reverse-engineered to obtain card details
- Receipt URL points to Stripe-hosted receipt (secure)

---

### 5. Password Reset Tokens

**Keys:**
- `password_reset:{token}` - Token data
- `password_reset_user:{userId}` - User → token mapping

```typescript
{
  userId: string;
  email: string;
  expiresAt: number;                // Timestamp
  used: boolean;
}
```

---

## Security Implementation

### Encryption Standards

**Algorithm:** AES-256-GCM  
**Key Size:** 256 bits  
**IV:** 12 bytes random per encryption  
**Salt:** 16 bytes random per encryption  
**Key Derivation:** PBKDF2 with 100,000 iterations

### Encrypted Fields

1. **Business Profile:**
   - `bankName`
   - `accountHolderName`
   - `accountNumber`
   - `routingNumber`

2. **Email Configuration:**
   - `host`, `port`, `user`, `password`

3. **Payment Data:**
   - `paymentIntentId` (Stripe)
   - `paymentMethodId` (Stripe)

### Implementation Example

```typescript
import { encrypt, decrypt } from './utils/encryption';

// Encrypting
const encrypted = await encrypt(
  accountNumber,
  Deno.env.get('ENCRYPTION_KEY')
);

// Decrypting
const decrypted = await decrypt(
  encrypted,
  Deno.env.get('ENCRYPTION_KEY')
);
```

---

## Data Access Patterns

### Common Queries

```typescript
// Get all invoices for a user
const invoices = await kv.get(`invoices:${userId}`);

// Get specific invoice
const invoice = await kv.get(`invoice:${invoiceId}`);

// Get customer invoices
const allInvoices = await kv.get(`invoices:${userId}`);
const customerInvoices = allInvoices.filter(
  inv => inv.customerId === customerId
);

// Get business profile
const business = await kv.get(`business:${userId}`);
```

---

## Data Validation Rules

1. **Email addresses** - Must be valid format
2. **Phone numbers** - Stored with country code
3. **Monetary values** - Numbers with 2 decimal precision
4. **Dates** - Stored as ISO 8601 strings
5. **IDs** - UUID v4 format

---

## Referential Integrity

- When deleting customer → related invoices preserved
- When deleting invoice → related payments preserved (audit trail)
- Soft deletes can use `deleted: boolean` flag

---

## Backup & Recovery

### Recommendations

1. **Regular Backups** - Use Supabase's built-in features
2. **Export Function** - Implement data export to JSON
3. **Encryption Keys** - Store securely in environment variables
4. **Key Rotation** - Plan for periodic key rotation

---

## Scalability Considerations

### Current Limitations

- KV store suitable for small-medium businesses
- For thousands of invoices, consider:
  - Implementing pagination
  - Using database indexes
  - Caching frequently accessed data

### Migration Path to Relational Tables

1. Create PostgreSQL migrations
2. Export data from KV store
3. Transform to relational schema
4. Import into new tables
5. Update API endpoints

---

## Compliance

### Data Privacy (GDPR, CCPA)

- **Right to Access** - Users can export data
- **Right to Deletion** - Account deletion purges data
- **Right to Portability** - Data in JSON format
- **Encryption** - Sensitive data encrypted at rest

### Financial Compliance (PCI DSS)

- **No card data stored** - All via Stripe
- **Encrypted bank info** - Bank details encrypted
- **Audit trail** - All transactions logged
- **Access control** - User-based authentication

---

## Monitoring

Track:
- KV store size per user
- Encryption/decryption performance
- Failed data access attempts
- Unusual data patterns

---

## Maintenance Tasks

- Archive old paid invoices (>1 year)
- Purge failed payment attempts (>30 days)
- Clean up orphaned data
- Optimize large arrays

---

*Last Updated: November 21, 2025*