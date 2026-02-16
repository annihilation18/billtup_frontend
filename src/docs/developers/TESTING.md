# Testing Guide

Complete guide for testing BilltUp functionality end-to-end.

## Prerequisites

✅ User account created and logged in  
✅ Business profile completed  
✅ Stripe test key configured  
✅ Email service configured

---

## Test Scenario 1: Complete Invoice Workflow

### Step 1: Add a Test Customer

1. Navigate to **Customers** tab
2. Click **"+ New Customer"**
3. Fill in details:
   ```
   Name: John Smith
   Email: your-email@example.com (use your real email)
   Phone: (555) 123-4567
   Address: 123 Main St, Anytown, ST 12345
   ```
4. Click **Save**
5. ✅ Verify customer appears in list

### Step 2: Create an Invoice

1. Navigate to **Invoices** tab
2. Click **"+ New Invoice"**
3. Select **"John Smith"** from dropdown
4. ✅ Verify email auto-fills
5. Add line items:

   **Line Item 1:**
   ```
   Item: Premium Car Detailing
   Quantity: 1
   Price: $150.00
   ```

   **Line Item 2:**
   ```
   Item: Interior Deep Clean
   Quantity: 1
   Price: $75.00
   ```

6. ✅ Verify totals:
   ```
   Subtotal: $225.00
   Tax (8.5%): $19.13
   Total: $244.13
   ```

7. Draw signature in signature pad
8. Click **"Preview PDF"**
9. ✅ Verify invoice looks correct
10. Click **"Create Invoice"**

### Step 3: Process Payment

1. On payment screen, click **"Enter Card Details"**
2. Use Stripe test card:
   ```
   Card Number: 4242 4242 4242 4242
   Expiry: 12/25
   CVV: 123
   Name: John Smith
   ```
3. Click **"Pay $244.13"**
4. ✅ Payment should succeed in 2-3 seconds

**Expected Results:**
- ✅ Payment success notification
- ✅ Redirected to receipt screen
- ✅ Invoice status is "Paid"

### Step 4: Send Invoice Email

1. On receipt screen, verify transaction details
2. Email field should be pre-filled
3. Click **"Send Invoice via Email"**
4. ✅ Success message appears
5. ✅ Check your email inbox (may be in spam)

### Step 5: Verify Email Content

Email should contain:
- ✅ Subject: "Invoice #INV-001 from [Your Business]"
- ✅ Business logo (if uploaded)
- ✅ Business contact information
- ✅ Invoice number and date
- ✅ Customer details
- ✅ Line items table
- ✅ Subtotal, tax, and total
- ✅ Signature image
- ✅ Professional formatting

### Step 6: Verify Dashboard

1. Return to dashboard
2. ✅ New invoice appears in list
3. ✅ Shows "Paid" status
4. ✅ Correct amount displayed
5. ✅ Customer name visible

---

## Test Scenario 2: Multiple Invoices

1. Create 3-5 more invoices with different:
   - Customers
   - Line items
   - Amounts

2. Verify in dashboard:
   - ✅ All invoices appear
   - ✅ Unique invoice numbers (INV-001, INV-002, etc.)
   - ✅ Correct statuses
   - ✅ Search functionality works

---

## Test Scenario 3: Customer Management

1. Navigate to **Customers** tab
2. Add multiple customers
3. ✅ All customers appear in list
4. Create invoices for different customers
5. ✅ Customer selection works in invoice builder

---

## Test Scenario 4: Settings & Logout

1. Navigate to **Settings** tab
2. ✅ Verify business information displayed correctly
3. Click **"Sign Out"**
4. ✅ Redirected to home page
5. Sign in again
6. ✅ All invoices and customers still there

---

## Common Issues & Solutions

### Issue: Email Not Received

**Possible Causes:**
1. Email in spam folder
2. Email service not configured
3. Using unverified email (Resend free tier)

**Solutions:**
- Check spam folder
- Verify email service credentials
- Use verified email address
- Check email service logs

### Issue: Payment Fails

**Possible Causes:**
1. Stripe key not configured
2. Network error
3. Invalid card details

**Solutions:**
- Verify `STRIPE_SECRET_KEY` is set
- Use test card: 4242 4242 4242 4242
- Check browser console
- Test internet connection

### Issue: Invoice Not Saved

**Possible Causes:**
1. Network error
2. Authentication expired
3. Backend error

**Solutions:**
- Check browser console
- Refresh page
- Sign out and sign in
- Verify backend is running

---

## Performance Testing

### Load Testing
1. Create 20+ invoices rapidly
2. ✅ All saved correctly
3. ✅ Search works with many invoices
4. ✅ Scrolling smooth

### Browser Testing

Test in multiple browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Responsive Testing

Test on different screen sizes:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

---

## API Testing

Use browser Network tab to verify:

- ✅ `POST /auth/signup` (201)
- ✅ `POST /auth/signin` (200)
- ✅ `GET /business` (200)
- ✅ `POST /customers` (201)
- ✅ `GET /customers` (200)
- ✅ `POST /invoices` (201)
- ✅ `GET /invoices` (200)
- ✅ `POST /payments/create-intent` (200)
- ✅ `POST /invoices/send-email` (200)

All should return successful status codes.

---

## Success Criteria

Your app is working correctly if:

✅ Users can create accounts  
✅ Business onboarding saves data  
✅ Customers can be added  
✅ Invoices can be created  
✅ Signature pad works  
✅ PDF preview shows correctly  
✅ Payments process successfully  
✅ Invoices saved with unique numbers  
✅ Dashboard displays invoices  
✅ Emails send successfully  
✅ Email contains all details  
✅ Search/filter works  
✅ Sign out/sign in preserves data

---

## Test Card Numbers

### Successful Payments

```
4242 4242 4242 4242 - Visa
5555 5555 5555 4444 - Mastercard
3782 822463 10005 - American Express
```

### Declined Payments

```
4000 0000 0000 0002 - Generic decline
4000 0000 0000 9995 - Insufficient funds
4000 0000 0000 9987 - Lost card
4000 0000 0000 9979 - Stolen card
```

### 3D Secure

```
4000 0027 6000 3184 - Requires authentication
```

**Use any:**
- Future expiry date (e.g., 12/25)
- 3-digit CVV (e.g., 123)
- Any cardholder name

---

## Next Steps

After successful testing:

1. ✅ Test with Stripe test mode
2. ✅ Test edge cases
3. ✅ Prepare for production
4. ✅ See [Deployment Guide](./DEPLOYMENT.md)

---

*Happy Testing! 🚀*

*Last Updated: November 21, 2025*
