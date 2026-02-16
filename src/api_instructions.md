# BilltUp API Documentation

## Overview

This document provides comprehensive documentation for all 27 API endpoints in the BilltUp invoicing platform. The API follows RESTful principles and uses JSON for request and response payloads.

## Base URL

```
https://{projectId}.supabase.co/functions/v1/make-server-dce439b6
```

All endpoints must be prefixed with `/make-server-dce439b6`.

## Authentication

Most endpoints require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer {access_token}
```

### Public Endpoints (No Auth Required)
- POST `/make-server-dce439b6/signup`
- POST `/make-server-dce439b6/signin`
- POST `/make-server-dce439b6/auth/google` (OAuth)

### Protected Endpoints
All other endpoints require a valid access token obtained from sign-in or session.

## Common Headers

```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

---

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**Endpoint:** `POST /make-server-dce439b6/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "user_metadata": {
      "name": "John Doe"
    }
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

**Errors:**
- `400`: Invalid email or password format
- `409`: User already exists

---

### 2. Sign In
Authenticate an existing user.

**Endpoint:** `POST /make-server-dce439b6/signin`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "session": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `400`: Missing email or password

---

### 3. Google OAuth Sign In
Authenticate using Google OAuth.

**Endpoint:** `POST /make-server-dce439b6/auth/google`

**Note:** Requires Google OAuth setup in Supabase. Follow instructions at https://supabase.com/docs/guides/auth/social-login/auth-google

**Response (200):**
```json
{
  "url": "https://accounts.google.com/oauth...",
  "provider": "google"
}
```

---

### 4. Sign Out
End the current user session.

**Endpoint:** `POST /make-server-dce439b6/signout`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

---

### 5. Get Session
Retrieve the current user session.

**Endpoint:** `GET /make-server-dce439b6/session`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "session": {
    "access_token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_metadata": {
        "name": "John Doe"
      }
    }
  }
}
```

**Errors:**
- `401`: No active session

---

## Subscription Endpoints

### 6. Get Subscription Status
Get the current user's subscription details, including trial status and billing cycle.

**Endpoint:** `GET /make-server-dce439b6/subscription/status`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "plan": "premium",
  "status": "active",
  "trialEndsAt": "2026-01-20T00:00:00Z",
  "isInTrial": true,
  "billingCycleStart": "2026-01-13",
  "billingCycleEnd": "2026-02-13",
  "nextBillingDate": "2026-02-13",
  "monthlyPrice": 9.99,
  "taxRate": 0.085,
  "totalWithTax": 10.84,
  "features": {
    "maxInvoices": -1,
    "maxCustomers": -1,
    "pdfExport": true,
    "stripePayments": true,
    "emailReminders": true,
    "analytics": true
  }
}
```

**Plans:**
- `basic`: $4.99/month (limited features)
- `premium`: $9.99/month (all features)
- `free`: Free trial or no subscription

**Errors:**
- `401`: Unauthorized

---

### 7. Create Subscription
Subscribe to a plan.

**Endpoint:** `POST /make-server-dce439b6/subscription/create`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "plan": "premium",
  "paymentMethodId": "pm_1234567890"
}
```

**Response (200):**
```json
{
  "subscriptionId": "sub_1234567890",
  "status": "active",
  "plan": "premium",
  "currentPeriodEnd": "2026-02-13T00:00:00Z"
}
```

**Errors:**
- `400`: Invalid plan or payment method
- `401`: Unauthorized
- `402`: Payment failed

---

### 8. Update Subscription
Change the subscription plan.

**Endpoint:** `PUT /make-server-dce439b6/subscription/update`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "plan": "basic"
}
```

**Response (200):**
```json
{
  "subscriptionId": "sub_1234567890",
  "plan": "basic",
  "status": "active",
  "message": "Subscription updated successfully"
}
```

**Errors:**
- `400`: Invalid plan
- `401`: Unauthorized
- `404`: No active subscription

---

### 9. Cancel Subscription
Cancel the current subscription.

**Endpoint:** `DELETE /make-server-dce439b6/subscription/cancel`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "message": "Subscription cancelled",
  "endsAt": "2026-02-13T00:00:00Z"
}
```

**Errors:**
- `401`: Unauthorized
- `404`: No active subscription

---

### 10. Get Payment Methods
Retrieve saved payment methods.

**Endpoint:** `GET /make-server-dce439b6/subscription/payment-methods`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "paymentMethods": [
    {
      "id": "pm_1234567890",
      "brand": "visa",
      "last4": "4242",
      "expiryMonth": 12,
      "expiryYear": 2028,
      "isDefault": true
    }
  ]
}
```

---

### 11. Add Payment Method
Add a new payment method using Stripe Elements.

**Endpoint:** `POST /make-server-dce439b6/subscription/payment-methods`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "paymentMethodId": "pm_1234567890",
  "setAsDefault": true
}
```

**Response (200):**
```json
{
  "id": "pm_1234567890",
  "message": "Payment method added successfully"
}
```

---

### 12. Delete Payment Method
Remove a saved payment method.

**Endpoint:** `DELETE /make-server-dce439b6/subscription/payment-methods/:id`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "message": "Payment method deleted successfully"
}
```

---

## Invoice Endpoints

### 13. List Invoices
Get all invoices for the current user.

**Endpoint:** `GET /make-server-dce439b6/invoices`

**Headers:** Requires Authorization

**Query Parameters:**
- `status` (optional): Filter by status (draft, sent, paid, overdue)
- `customerId` (optional): Filter by customer
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response (200):**
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2026-001",
      "customerId": "cust_123",
      "customerName": "Acme Corp",
      "amount": 1500.00,
      "status": "sent",
      "dueDate": "2026-02-01",
      "createdAt": "2026-01-13T10:00:00Z",
      "items": [
        {
          "description": "Web Design Services",
          "quantity": 1,
          "rate": 1500.00,
          "amount": 1500.00
        }
      ]
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

---

### 14. Get Invoice
Retrieve a specific invoice by ID.

**Endpoint:** `GET /make-server-dce439b6/invoices/:id`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "id": "inv_123",
  "invoiceNumber": "INV-2026-001",
  "customerId": "cust_123",
  "customerName": "Acme Corp",
  "customerEmail": "contact@acme.com",
  "amount": 1500.00,
  "tax": 127.50,
  "total": 1627.50,
  "status": "sent",
  "dueDate": "2026-02-01",
  "createdAt": "2026-01-13T10:00:00Z",
  "items": [
    {
      "description": "Web Design Services",
      "quantity": 1,
      "rate": 1500.00,
      "amount": 1500.00
    }
  ],
  "notes": "Payment due within 30 days"
}
```

**Errors:**
- `404`: Invoice not found
- `403`: Not authorized to view this invoice

---

### 15. Create Invoice
Create a new invoice.

**Endpoint:** `POST /make-server-dce439b6/invoices`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "customerId": "cust_123",
  "dueDate": "2026-02-01",
  "items": [
    {
      "description": "Web Design Services",
      "quantity": 1,
      "rate": 1500.00
    }
  ],
  "taxRate": 0.085,
  "notes": "Payment due within 30 days"
}
```

**Response (201):**
```json
{
  "id": "inv_123",
  "invoiceNumber": "INV-2026-001",
  "status": "draft",
  "total": 1627.50
}
```

**Feature Restrictions:**
- Basic plan: Max 50 invoices/month
- Premium plan: Unlimited invoices

**Errors:**
- `400`: Invalid request data
- `403`: Feature locked (requires upgrade)
- `401`: Unauthorized

---

### 16. Update Invoice
Update an existing invoice.

**Endpoint:** `PUT /make-server-dce439b6/invoices/:id`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "dueDate": "2026-02-15",
  "status": "sent",
  "items": [
    {
      "description": "Web Design Services",
      "quantity": 1,
      "rate": 1800.00
    }
  ]
}
```

**Response (200):**
```json
{
  "id": "inv_123",
  "invoiceNumber": "INV-2026-001",
  "status": "sent",
  "total": 1953.00
}
```

**Errors:**
- `404`: Invoice not found
- `403`: Not authorized or invoice already paid

---

### 17. Delete Invoice
Delete an invoice (only drafts can be deleted).

**Endpoint:** `DELETE /make-server-dce439b6/invoices/:id`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "message": "Invoice deleted successfully"
}
```

**Errors:**
- `404`: Invoice not found
- `403`: Cannot delete non-draft invoices

---

### 18. Generate PDF
Generate a PDF for an invoice.

**Endpoint:** `GET /make-server-dce439b6/invoices/:id/pdf`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "pdfUrl": "https://storage.supabase.co/signed-url...",
  "expiresAt": "2026-01-14T10:00:00Z"
}
```

**Feature Restrictions:**
- Premium plan only

**Errors:**
- `403`: Feature locked (requires Premium)
- `404`: Invoice not found

---

### 19. Send Invoice
Send an invoice via email to the customer.

**Endpoint:** `POST /make-server-dce439b6/invoices/:id/send`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "message": "Thank you for your business!"
}
```

**Response (200):**
```json
{
  "message": "Invoice sent successfully",
  "sentAt": "2026-01-13T10:00:00Z"
}
```

**Errors:**
- `404`: Invoice not found
- `400`: Customer email missing

---

## Customer Endpoints

### 20. List Customers
Get all customers for the current user.

**Endpoint:** `GET /make-server-dce439b6/customers`

**Headers:** Requires Authorization

**Query Parameters:**
- `search` (optional): Search by name or email
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response (200):**
```json
{
  "customers": [
    {
      "id": "cust_123",
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "phone": "+1-555-0123",
      "address": "123 Business St, City, ST 12345",
      "createdAt": "2026-01-10T10:00:00Z",
      "totalInvoices": 5,
      "totalRevenue": 12500.00
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

**Feature Restrictions:**
- Basic plan: Max 100 customers
- Premium plan: Unlimited customers

---

### 21. Get Customer
Retrieve a specific customer by ID.

**Endpoint:** `GET /make-server-dce439b6/customers/:id`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "id": "cust_123",
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "address": "123 Business St, City, ST 12345",
  "notes": "Preferred vendor",
  "createdAt": "2026-01-10T10:00:00Z",
  "recentInvoices": [
    {
      "id": "inv_123",
      "invoiceNumber": "INV-2026-001",
      "amount": 1500.00,
      "status": "paid"
    }
  ]
}
```

**Errors:**
- `404`: Customer not found
- `403`: Not authorized

---

### 22. Create Customer
Create a new customer.

**Endpoint:** `POST /make-server-dce439b6/customers`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+1-555-0123",
  "address": "123 Business St, City, ST 12345",
  "notes": "Preferred vendor"
}
```

**Response (201):**
```json
{
  "id": "cust_123",
  "name": "Acme Corp",
  "email": "contact@acme.com"
}
```

**Feature Restrictions:**
- Basic plan: Max 100 customers
- Premium plan: Unlimited customers

**Errors:**
- `400`: Invalid request data
- `403`: Feature locked (customer limit reached)

---

### 23. Update Customer
Update an existing customer.

**Endpoint:** `PUT /make-server-dce439b6/customers/:id`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "phone": "+1-555-9999"
}
```

**Response (200):**
```json
{
  "id": "cust_123",
  "name": "Acme Corporation",
  "email": "contact@acme.com",
  "phone": "+1-555-9999"
}
```

**Errors:**
- `404`: Customer not found
- `403`: Not authorized

---

### 24. Delete Customer
Delete a customer (only if they have no invoices).

**Endpoint:** `DELETE /make-server-dce439b6/customers/:id`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "message": "Customer deleted successfully"
}
```

**Errors:**
- `404`: Customer not found
- `403`: Cannot delete customer with invoices

---

## Payment Provider Endpoints

### 25. Get Active Payment Provider
Get the user's currently selected payment provider (Stripe or Square).

**Endpoint:** `GET /make-server-dce439b6/payment-provider/active`

**Headers:** Requires Authorization

**Response (200):**
```json
{
  "provider": "stripe"
}
```

**Possible Values:**
- `stripe` - Stripe Connect is active
- `square` - Square is active

**Default:** Returns `stripe` if no provider has been set.

**Errors:**
- `401`: Unauthorized

---

### 26. Set Payment Provider
Set or change the user's active payment provider.

**Endpoint:** `POST /make-server-dce439b6/payment-provider/set`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "provider": "stripe"
}
```

**Valid Values:** `stripe` or `square` only

**Response (200):**
```json
{
  "success": true,
  "provider": "stripe"
}
```

**Errors:**
- `400`: Invalid provider (not 'stripe' or 'square')
- `401`: Unauthorized

**Notes:**
- Users can switch freely between Stripe and Square
- Both accounts can be connected simultaneously
- Only one provider is "active" for new invoices
- Existing invoices keep their original payment provider

---

## Account Management Endpoints

### 27. Delete Account
Permanently delete the user account and all associated data.

**Endpoint:** `DELETE /make-server-dce439b6/account`

**Headers:** Requires Authorization

**Request Body:**
```json
{
  "confirmation": "DELETE",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

**Warning:** This action is irreversible. All invoices, customers, and data will be permanently deleted.

**Errors:**
- `400`: Invalid confirmation or password
- `401`: Unauthorized

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication token
- `403`: Forbidden - Feature locked or insufficient permissions
- `404`: Not Found - Resource does not exist
- `409`: Conflict - Resource already exists
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server-side error

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authenticated requests:** 100 requests per minute per user
- **Unauthenticated requests:** 20 requests per minute per IP

When rate limited, the API returns:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Pagination

List endpoints support pagination using `limit` and `offset` parameters:

```
GET /make-server-dce439b6/invoices?limit=20&offset=40
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "total": 150,
  "limit": 20,
  "offset": 40,
  "hasMore": true
}
```

---

## Platform Fees

BilltUp charges platform fees on successful payment transactions:

- **Basic Plan:** 3% platform fee
- **Premium Plan:** 1.5% platform fee

Platform fees are automatically calculated and displayed in the dashboard analytics.

---

## Webhook Events (Future)

The following webhook events will be supported for Stripe payment notifications:

- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `subscription.updated`
- `subscription.cancelled`

Configure webhook URL in dashboard settings.

---

## Support

For API support and questions:
- Email: support@billtup.com
- Documentation: https://billtup.com/docs
- Status Page: https://status.billtup.com

---

## Changelog

### Version 1.0.0 (January 2026)
- Initial API release
- 25 endpoints covering authentication, subscriptions, invoices, and customers
- Stripe payment integration
- PDF generation support
- Material 3 design compliance
