# Database Schema

Complete database schema and data models for BilltUp.

---

## Overview

BilltUp uses a **key-value store** architecture with a relational schema design pattern. All data is stored in the `kv_store_dce439b6` table in Supabase PostgreSQL, accessed via the KV utility functions.

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│             │
│ - userId    │ (from Supabase Auth)
│ - email     │
└──────┬──────┘
       │
       │ 1:1
       ▼
┌─────────────────┐
│ Business Profile│
│                 │
│ - businessName  │
│ - email         │
│ - phone         │
│ - address       │
│ - logo          │
│ - taxRate       │
│ - bankInfo (🔒) │
└──────┬──────────┘
       │
       │ 1:N
       ▼
┌─────────────┐         ┌─────────────┐
│  Customer   │◄────┐   │   Invoice   │
│             │     │   │             │
│ - name      │     │   │ - number    │
│ - email     │     │   │ - customer  │
│ - phone     │     │   │ - lineItems │
│ - notes     │     │   │ - total     │
│             │     └───│ - customerId│
└─────────────┘         │ - status    │
                        │ - signature │
                        │ - payment (🔒)│
                        └──────┬───────┘
                               │
                               │ 1:N
                               ▼
                        ┌─────────────┐
                        │  Payment    │
                        │             │
                        │ - amount    │
                        │ - method    │
                        │ - intentId  │
                        │ - status    │
                        │ - refunds   │
                        └─────────────┘
```

---

## Key Naming Convention

All data is stored using hierarchical keys following this pattern:

```
{entity}:{userId}                    - List of all entities for a user
{entity}:{entityId}                  - Individual entity details
{entity}:{userId}:{customerId}       - User-specific entity subset
```

---

## Data Entities

### 1. User Profile

**Key:** `user:{userId}`

Stores authenticated user information (linked to Supabase Auth).

```typescript
{
  id: string;           // Supabase Auth user ID
  email: string;        // User email from auth
  createdAt: string;    // ISO timestamp
  lastLogin: string;    // ISO timestamp
}
```

**Security:** User ID from Supabase Auth JWT

---

### 2. Business Profile

**Key:** `business:{userId}`

One business profile per user.

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
  
  // Premium Features
  customLogo?: string;              // Custom uploaded logo (premium)
  contactEmail?: string;            // Contact email for invoices
  brandColor?: string;              // Primary brand color (premium)
  accentColor?: string;             // Secondary/accent color (premium)
  invoiceTemplate?: string;         // Invoice template selection (premium)
  
  // User Preferences (persisted across devices)
  darkMode?: boolean;               // Dark mode preference
  notificationsEnabled?: boolean;   // Push notifications enabled
  nfcEnabled?: boolean;             // NFC payments enabled
  biometricEnabled?: boolean;       // Biometric authentication enabled
  
  // Subscription Status (cached for quick access)
  subscriptionStatus?: {            // Cached from subscription:userId
    planType?: 'trial' | 'basic' | 'premium';
    isTrial?: boolean;
    isTrialExpired?: boolean;
    trialEndsAt?: string;
  };
  
  // 🔒 ENCRYPTED FIELDS
  bankName?: string;                // Encrypted
  accountHolderName?: string;       // Encrypted
  accountNumber?: string;           // Encrypted
  routingNumber?: string;           // Encrypted
  
  updatedAt: string;                // ISO timestamp
  createdAt: string;                // ISO timestamp
}
```

**Security:** Banking information is encrypted using AES-256-GCM

---

### 3. Customers

**Key:** `customers:{userId}` (array)  
**Individual:** `customer:{customerId}`

Stores customer information for invoicing.

```typescript
{
  id: string;                       // UUID
  userId: string;                   // Owner user ID
  name: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalInvoices: number;            // Computed
  totalRevenue: number;             // Computed
  createdAt: string;                // ISO timestamp
  updatedAt: string;                // ISO timestamp
}
```

**Relationships:**
- One user has many customers (1:N)
- One customer has many invoices (1:N)

---

### 4. Invoices

**Key:** `invoices:{userId}` (array)  
**Individual:** `invoice:{invoiceId}`

Stores invoice data.

```typescript
{
  id: string;                       // UUID
  userId: string;                   // Owner user ID
  customerId?: string;              // FK to customer
  number: string;                   // Invoice number (INV-001)
  
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
  
  // 🔒 PAYMENT FIELDS
  paymentIntentId?: string;         // Stripe payment intent
  paymentMethod?: string;           // Payment method type
  paidAt?: string;                  // ISO timestamp
  
  // Refund tracking
  refundedAmount?: number;
  refundDate?: string;
  refundReason?: string;
  
  createdAt: string;                // ISO timestamp
  updatedAt: string;                // ISO timestamp
}
```

**Relationships:**
- One user has many invoices (1:N)
- One customer has many invoices (1:N)
- One invoice has many line items (embedded)

**Security:** 
- Payment intent IDs are sensitive and should be handled carefully
- Signature images are stored as base64

---

### 5. Payments

**Key:** `payments:{userId}` (array)  
**Individual:** `payment:{paymentId}`

Tracks all payment transactions.

```typescript
{
  id: string;                       // UUID
  userId: string;                   // Owner user ID
  invoiceId: string;                // FK to invoice
  customerId?: string;              // FK to customer
  
  amount: number;
  currency: string;                 // USD
  status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded';
  
  // 🔒 STRIPE FIELDS
  paymentIntentId: string;          // Stripe payment intent
  paymentMethodId?: string;         // Stripe payment method
  receiptUrl?: string;              // Stripe receipt
  
  // Refund data
  refunds: Array<{
    id: string;
    amount: number;
    reason?: string;
    status: string;
    createdAt: string;
  }>;
  
  metadata?: Record<string, any>;   // Additional payment data
  
  createdAt: string;                // ISO timestamp
  updatedAt: string;                // ISO timestamp
}
```

**Security:** Stripe IDs and payment methods are sensitive

---

### 6. Subscription

**Key:** `subscription:{userId}`

Tracks user's subscription plan and trial status.

```typescript
{
  planType: 'trial' | 'basic' | 'premium';
  isActive: boolean;
  isTrial: boolean;
  trialEndsAt?: string;             // ISO timestamp when trial expires
  isTrialExpired?: boolean;         // Computed field
  
  // Stripe subscription data
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodStart?: string;      // ISO timestamp
  currentPeriodEnd?: string;        // ISO timestamp
  
  // Usage tracking
  invoicesThisPeriod: number;       // Monthly invoice count
  customerCount: number;            // Total customers
  totalInvoices: number;            // All-time invoices
  totalCustomers: number;           // All-time customers
  
  createdAt: string;                // ISO timestamp
  updatedAt?: string;               // ISO timestamp
}
```

**Trial Behavior:**
- New users automatically get a 14-day trial with full Premium features
- Trial expires 14 days after account creation
- `isTrialExpired` is computed on each status check (not stored)
- After trial expires, users must choose a paid plan

**Plan Limits:**
- **Trial:** Unlimited invoices, unlimited customers, all features
- **Basic:** 50 invoices/month, 100 customers, basic features
- **Premium:** Unlimited everything, advanced features

---

## Security Implementation

### Encryption Standards

**Algorithm:** AES-256-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Size:** 256 bits
- **Authentication:** Built-in message authentication
- **IV (Initialization Vector):** 12 bytes random per encryption
- **Salt:** 16 bytes random per encryption
- **Key Derivation:** PBKDF2 with 100,000 iterations

### Encrypted Fields

The following fields are encrypted at rest:

1. **Business Profile:**
   - `bankName`
   - `accountHolderName`
   - `accountNumber`
   - `routingNumber`

2. **Payment Data:**
   - `paymentIntentId` (Stripe)
   - `paymentMethodId` (Stripe)

### Implementation Example

```typescript
import { encrypt, decrypt } from './utils/encryption';

// Encrypting sensitive data
const encryptedAccountNumber = await encrypt(
  accountNumber,
  process.env.ENCRYPTION_KEY
);

// Decrypting for use
const accountNumber = await decrypt(
  encryptedAccountNumber,
  process.env.ENCRYPTION_KEY
);
```

---

## Data Access Patterns

### Common Queries

1. **Get all invoices for a user:**
   ```typescript
   const invoices = await kv.get(`invoices:${userId}`);
   ```

2. **Get specific invoice:**
   ```typescript
   const invoice = await kv.get(`invoice:${invoiceId}`);
   ```

3. **Get customer invoices:**
   ```typescript
   const allInvoices = await kv.get(`invoices:${userId}`);
   const customerInvoices = allInvoices.filter(
     inv => inv.customerId === customerId
   );
   ```

4. **Get business profile:**
   ```typescript
   const business = await kv.get(`business:${userId}`);
   ```

---

## Data Integrity

### Validation Rules

1. **Email addresses** must be valid format
2. **Phone numbers** stored with country code
3. **Monetary values** stored as numbers with 2 decimal precision
4. **Dates** stored as ISO 8601 strings
5. **UUIDs** used for all entity IDs

### Referential Integrity

- When deleting a customer, related invoices are NOT automatically deleted (preserve financial records)
- When deleting an invoice, related payments remain for audit purposes
- Soft deletes can be implemented by adding `deleted: boolean` flag

---

## Backup & Recovery

### Recommendations

1. **Regular Backups:** Use Supabase's built-in backup features
2. **Export Function:** Implement data export to JSON
3. **Encryption Keys:** Store encryption keys securely in environment variables
4. **Key Rotation:** Plan for periodic encryption key rotation

---

## Scalability Considerations

### Current Limitations

- KV store is suitable for prototyping and small-medium businesses
- For production with thousands of invoices, consider:
  - Implementing pagination
  - Using database indexes
  - Caching frequently accessed data

### Migration Path

To migrate to full relational tables:

1. Create PostgreSQL migrations
2. Export data from KV store
3. Transform to relational schema
4. Import into new tables
5. Update API endpoints

---

## Compliance Notes

### Data Privacy (GDPR, CCPA)

- **Right to Access:** Users can export their data
- **Right to Deletion:** Implement account deletion with data purge
- **Right to Portability:** Data in JSON format
- **Encryption:** Sensitive data encrypted at rest

### Financial Compliance (PCI DSS)

- **No card data stored:** All payment processing through Stripe
- **Encrypted bank info:** Bank account details encrypted
- **Audit trail:** All payment transactions logged
- **Access control:** User-based authentication required

---

## Maintenance

### Monitoring

- Track KV store size per user
- Monitor encryption/decryption performance
- Log failed data access attempts
- Alert on unusual data patterns

### Cleanup Tasks

- Archive old paid invoices (>1 year)
- Purge failed payment attempts (>30 days)
- Clean up orphaned data
- Optimize large arrays in KV store

---

**Last Updated:** November 11, 2025  
**Schema Version:** 1.2