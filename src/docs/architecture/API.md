# Backend API Specification

Complete API reference for all 25 BilltUp backend endpoints.

---

## Base URL

All endpoints are prefixed with: `/make-server-dce439b6`

**Full URL:** `https://xrgywtdjdlqthpthyxwj.supabase.co/functions/v1/make-server-dce439b6`

---

## Authentication

All endpoints (except `/auth/*`) require authentication via JWT token:

```
Authorization: Bearer {accessToken}
```

Token is obtained from signup/signin endpoints and is valid for the session.

---

## API Endpoints Overview

**Total: 25 endpoints**

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Authentication** | 4 | Signup, signin, signout, session |
| **Business** | 4 | Create, read, update profile, upload logo |
| **Customers** | 5 | CRUD operations + get invoices |
| **Invoices** | 5 | CRUD operations + list with filters |
| **Payments** | 4 | Process card, process NFC, refund, retrieve |
| **Email** | 2 | Send invoice, send receipt |
| **Analytics** | 3 | Sales summary, revenue chart, monthly count |

---

## 1. Authentication APIs

### 1.1 Sign Up
**POST** `/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "businessName": "My Business"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Sign In
**POST** `/auth/signin`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### 1.3 Sign Out
**POST** `/auth/signout`

Requires: Authorization header

### 1.4 Get Session
**GET** `/auth/session`

Requires: Authorization header

---

## 2. Business Profile APIs

### 2.1 Create/Update Business Profile
**POST** `/business` or **PUT** `/business`

**Request:**
```json
{
  "businessName": "AutoDetailing Pro",
  "email": "info@business.com",
  "phone": "(555) 123-4567",
  "address": "123 Main St, City, State 12345",
  "industry": "Auto Detailing",
  "defaultTaxRate": "8.5",
  "chargeTax": true,
  "bankName": "Chase Bank",
  "accountHolderName": "Business LLC",
  "accountNumber": "****1234",
  "routingNumber": "021000021"
}
```

**Note:** Bank details are encrypted with AES-256-GCM before storage.

### 2.2 Get Business Profile
**GET** `/business`

Returns complete business profile including logo URL.

### 2.3 Upload Logo
**POST** `/business/logo`

**Request:**
```json
{
  "logo": "base64_encoded_image_data",
  "filename": "logo.png"
}
```

**Response:**
```json
{
  "success": true,
  "logoUrl": "https://storage.supabase.co/..."
}
```

---

## 3. Customer APIs

### 3.1 Create Customer
**POST** `/customers`

**Request:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "address": "123 Customer St",
  "notes": "Preferred customer"
}
```

### 3.2 Get All Customers
**GET** `/customers`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 100, max: 100)

**Response:**
```json
{
  "success": true,
  "customers": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 50
  }
}
```

### 3.3 Get Customer by ID
**GET** `/customers/:id`

### 3.4 Update Customer
**PUT** `/customers/:id`

### 3.5 Delete Customer
**DELETE** `/customers/:id`

### 3.6 Get Customer Invoices
**GET** `/customers/:id/invoices`

Returns all invoices for a specific customer with statistics.

---

## 4. Invoice APIs

### 4.1 Create Invoice
**POST** `/invoices`

**Request:**
```json
{
  "customerId": "cust_123",
  "customer": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "(555) 123-4567",
  "number": "INV-001",
  "date": "Nov 11, 2025",
  "dueDate": "Nov 25, 2025",
  "lineItems": [
    {
      "id": "item_1",
      "name": "Service A",
      "quantity": 2,
      "price": 50.00
    }
  ],
  "subtotal": 100.00,
  "tax": 8.50,
  "total": 108.50,
  "notes": "Thank you for your business",
  "signature": "base64_signature_image"
}
```

**Response:**
```json
{
  "success": true,
  "invoice": {
    "id": "inv_123",
    "number": "INV-001",
    "status": "pending",
    ...
  }
}
```

### 4.2 Get All Invoices
**GET** `/invoices`

**Query Parameters:**
- `status` (optional): Filter by status (pending, paid, refunded)
- `page` (optional): Page number
- `limit` (optional): Items per page

### 4.3 Get Invoice by ID
**GET** `/invoices/:id`

### 4.4 Update Invoice
**PUT** `/invoices/:id`

### 4.5 Delete Invoice
**DELETE** `/invoices/:id`

---

## 5. Payment APIs

### 5.1 Process Card Payment
**POST** `/payments/card`

**Request:**
```json
{
  "invoiceId": "inv_123",
  "amount": 108.50,
  "paymentMethodId": "pm_stripe_card_id",
  "customerEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "pay_123",
  "status": "succeeded",
  "receiptUrl": "https://stripe.com/receipt/..."
}
```

### 5.2 Process NFC Payment (Mobile)
**POST** `/payments/nfc`

**Request:**
```json
{
  "invoiceId": "inv_123",
  "amount": 108.50,
  "nfcData": "encrypted_nfc_payment_data"
}
```

### 5.3 Refund Payment
**POST** `/payments/refund`

**Request:**
```json
{
  "invoiceId": "inv_123",
  "amount": 108.50,  // Optional: partial refund
  "reason": "Customer request"
}
```

**Response:**
```json
{
  "success": true,
  "refundId": "ref_123",
  "status": "succeeded",
  "amount": 108.50
}
```

### 5.4 Get Payment Details
**GET** `/payments/:id`

---

## 6. Email APIs

### 6.1 Send Invoice Email
**POST** `/email/invoice`

**Request:**
```json
{
  "invoiceId": "inv_123",
  "recipientEmail": "customer@example.com",
  "subject": "Invoice INV-001 from AutoDetailing Pro",
  "attachPDF": true
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_123",
  "status": "sent"
}
```

### 6.2 Send Receipt Email
**POST** `/email/receipt`

**Request:**
```json
{
  "paymentId": "pay_123",
  "recipientEmail": "customer@example.com"
}
```

---

## 7. Analytics APIs

### 7.1 Get Sales Summary
**GET** `/analytics/sales-summary`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "monthToDate": {
      "totalRevenue": 5430.50,
      "invoiceCount": 12,
      "averageInvoice": 452.54,
      "paidInvoices": 10,
      "pendingInvoices": 2
    },
    "yearToDate": {
      "totalRevenue": 45230.75,
      "invoiceCount": 98,
      "averageInvoice": 461.54,
      "paidInvoices": 85,
      "pendingInvoices": 13
    }
  }
}
```

### 7.2 Get Revenue Chart Data
**GET** `/analytics/revenue-chart`

**Query Parameters:**
- `period`: 'monthly' | 'yearly'
- `year` (optional): Specific year
- `month` (optional): Specific month

**Response:**
```json
{
  "success": true,
  "chartData": [
    { "name": "Jan", "revenue": 3250.00 },
    { "name": "Feb", "revenue": 4180.50 },
    ...
  ]
}
```

### 7.3 Get Monthly Invoice Count
**GET** `/analytics/monthly-invoice-count`

**Response:**
```json
{
  "success": true,
  "invoiceCount": 15,
  "billingPeriod": {
    "start": "2025-11-01",
    "end": "2025-11-30",
    "daysRemaining": 19
  }
}
```

**Note:** Uses anniversary-based billing cycle, not calendar months.

---

## Rate Limiting

**Multi-tier rate limiting:**
- ✅ 100 requests/minute for authenticated users
- ✅ 60 requests/minute per IP address
- ✅ 10 login attempts per 15 minutes
- ✅ Automatic IP blocking after 200 requests/minute

**Response when rate limited:**
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `AUTH_REQUIRED` - Missing or invalid authorization token
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `PAYMENT_FAILED` - Payment processing error
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (1-based, default: 1)
- `limit`: Items per page (default: 100, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 250,
    "totalPages": 3
  }
}
```

---

## Testing

### Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "ok"
}
```

Use this to verify the backend is deployed and accessible.

---

## Implementation Status

**✅ All 25 endpoints fully implemented**
- Authentication: 4/4
- Business: 4/4
- Customers: 5/5
- Invoices: 5/5
- Payments: 4/4
- Email: 2/2
- Analytics: 3/3

**✅ Security Features:**
- JWT authentication
- Rate limiting
- DDoS protection
- Data encryption
- Input validation
- CORS configured

---

**Last Updated:** November 11, 2025  
**API Version:** 1.5.0  
**Status:** Production Ready
