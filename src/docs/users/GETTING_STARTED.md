# Getting Started with BilltUp

Welcome to BilltUp! This guide will help you get up and running in minutes.

## Step 1: Create Your Account (2 minutes)

### Sign Up Process

1. **Visit** [billtup.com](https://billtup.com)
2. **Click** "Get Started" or "Sign Up"
3. **Enter** your information:
   - Full name
   - Email address
   - Business name
   - Password (min. 8 characters)

4. **Select** your plan:
   - **Basic**: $4.99/month (up to 25 invoices)
   - **Premium**: $9.99/month (unlimited invoices)

5. **Add** payment information:
   - Card details (secured by Stripe - PCI DSS Level 1 compliant)
   - Your card data never touches our servers - processed directly by Stripe
   - Don't worry - you won't be charged during your 14-day trial!

6. **Agree** to Terms of Service
7. **Click** "Start 14-Day Free Trial"

### ✅ You're In!

You now have:
- ✓ 14-day free trial activated
- ✓ Full access to all Premium features
- ✓ Secure payment method on file
- ✓ Access to your dashboard

---

## Step 2: Complete Your Business Profile (3 minutes)

### Why This Matters
Your business profile appears on all invoices. Make a great impression!

### What to Add

1. **Go to Dashboard** → **Settings** → **Business Profile**

2. **Required Information**:
   - Business name ✓ (already set)
   - Email address
   - Phone number
   - Business address

3. **Optional but Recommended**:
   - **Business logo** (appears on invoices)
     - Upload PNG or JPEG
     - Recommended size: 500x500px
     - Max file size: 2MB
   
   - **Tax settings**
     - Enable tax collection if needed
     - Set your tax rate (e.g., 8.5%)
   
   - **Bank information** (for payment instructions)
     - Bank name
     - Account holder name
     - Account number (last 4 digits shown)
     - Routing number

4. **Click** "Save Profile"

### 💡 Pro Tip
Add your logo now - it makes your invoices look 10x more professional!

---

## Step 3: Add Your First Customer (1 minute)

### Quick Add

1. **Go to Dashboard** → **Customers** tab
2. **Click** "+ New Customer"
3. **Enter** customer details:
   - Customer name *
   - Email address *
   - Phone number (optional)
   - Address (optional)
   - Notes (optional)

4. **Click** "Save Customer"

### Customer Information

**Required fields** (marked with *):
- Name
- Email (for sending invoices)

**Optional but helpful**:
- Phone - for quick contact
- Address - appears on invoices
- Notes - internal reminders

### Example
```
Name: John Smith
Email: john@example.com
Phone: (555) 123-4567
Address: 123 Main St, Anytown, CA 90210
Notes: Prefers payment via card, monthly service
```

---

## Step 4: Create Your First Invoice (3 minutes)

### Invoice Creation

1. **Go to** **Invoices** tab
2. **Click** "+ New Invoice"

3. **Select Customer**
   - Choose from your customer list
   - Or create new customer on the fly

4. **Add Line Items**
   - Click "+ Add Item"
   - Enter:
     - Service/product name
     - Quantity
     - Price per unit
   - Add more items as needed

5. **Set Invoice Details**
   - Invoice number (auto-generated)
   - Issue date (defaults to today)
   - Due date (optional but recommended)

6. **Add Notes** (optional)
   - Payment terms
   - Special instructions
   - Thank you message

7. **Review Total**
   - Subtotal
   - Tax (if enabled)
   - **Total amount**

8. **Click** "Create Invoice"

### Example Invoice

```
Customer: John Smith
Invoice #: INV-001
Date: November 21, 2025
Due: December 5, 2025

Line Items:
1. Auto Detail Service      1x  $150.00  = $150.00
2. Interior Steam Clean     1x  $75.00   = $75.00
3. Premium Wax Application  1x  $100.00  = $100.00

Subtotal: $325.00
Tax (8.5%): $27.63
Total: $352.63

Notes: Payment due within 14 days. Thank you for your business!
```

---

## Step 5: Send Your Invoice (1 minute)

### Sending Options

After creating an invoice, you can:

1. **Email to Customer**
   - Click "Send Invoice"
   - Email automatically sent with PDF attached
   - Includes payment link (if Stripe connected)

2. **Download PDF**
   - Click "Download PDF"
   - Save to your computer
   - Send however you prefer

3. **Copy Link**
   - Share unique invoice URL
   - Customer can view and pay online

### Email Preview

Your customer receives:
```
Subject: Invoice #INV-001 from [Your Business]

Hi John,

Thank you for your business! Please find your invoice attached.

Invoice #: INV-001
Amount Due: $352.63
Due Date: December 5, 2025

[View Invoice Online] [Pay Now]

Questions? Reply to this email or contact us at:
[Your business contact information]

Best regards,
[Your Business Name]
```

---

## Step 6: Track Payment Status (Ongoing)

### Invoice Statuses

- **Pending** 📋 - Sent, awaiting payment
- **Paid** ✅ - Payment received
- **Overdue** ⚠️ - Past due date
- **Partially Paid** 💰 - Partial payment received (Premium)

### Dashboard at a Glance

Your dashboard shows:
- Total revenue (paid invoices)
- Pending amount (unpaid invoices)
- Number of customers
- Recent activity

### Notifications

You'll receive emails when:
- Customer views invoice
- Payment is received
- Invoice becomes overdue (Premium)

---

## 🎉 You're All Set!

You've now:
- ✅ Created your account
- ✅ Set up your business profile
- ✅ Added your first customer
- ✅ Created and sent your first invoice
- ✅ Know how to track payments

---

## Next Steps

### Optimize Your Setup

1. **Enable Online Payments**
   - Go to Settings → Payment Settings
   - Connect Stripe account
   - Accept cards, Apple Pay, Google Pay

2. **Customize Invoice Design**
   - Add your logo
   - Set brand colors (Premium)
   - Customize templates (Premium)

3. **Set Up Notifications**
   - Email preferences
   - Payment reminders
   - Overdue alerts

### Learn Advanced Features

- [Customer Management](./CUSTOMERS.md) - Organize clients
- [Analytics](./ANALYTICS.md) - Track performance
- [Payment Processing](./PAYMENTS.md) - Accept online payments
- [Business Profile](./BUSINESS_PROFILE.md) - Customize branding

---

## Common First-Time Questions

### "When will I be charged?"

You have a 14-day free trial. Billing starts after the trial ends unless you cancel. You can cancel anytime.

### "Can I change my plan later?"

Yes! Upgrade or downgrade anytime from Settings → Account.

### "What happens if I hit my invoice limit?"

Basic plan allows 25 invoices/month. You can:
- Upgrade to Premium (unlimited)
- Wait for next billing cycle
- Delete old invoices to make room

### "Is my data safe?"

Absolutely! We use:
- Bank-level encryption (AES-256)
- Secure payment processing (Stripe)
- Regular backups
- GDPR compliance

### "Can I import existing customers?"

Not yet, but we're working on CSV import. For now, add customers manually or use our API (developers only).

---

## Getting Help

### Resources

- 📚 [User Guide](./README.md) - Complete documentation
- ❓ [FAQ](./FAQ.md) - Common questions
- 🔧 [Troubleshooting](./TROUBLESHOOTING.md) - Fix issues
- 📹 Video tutorials (coming soon)

### Support

- **Email**: support@billtup.com
- **Response time**: Within 24 hours
- **Premium users**: Priority support (4 hours)

### Tips for Better Support

When contacting support, include:
- Clear description of issue
- Screenshots (if applicable)
- What you've already tried
- Your account email

---

## Quick Reference Card

### Most Common Actions

| Task | Location | Shortcut |
|------|----------|----------|
| New Invoice | Invoices tab → "+ New Invoice" | Ctrl/Cmd + N |
| New Customer | Customers tab → "+ New Customer" | - |
| View Dashboard | Click "Overview" tab | - |
| Download Invoice | Invoice details → "Download PDF" | - |
| Send Invoice | Invoice details → "Send Invoice" | - |
| Edit Profile | Settings → Business Profile | - |

---

## 💡 Pro Tips for Success

1. **Add your logo first** - Makes invoices look professional
2. **Set due dates** - Helps customers know when to pay
3. **Enable online payments** - Get paid 3x faster
4. **Send promptly** - Invoice right after completing work
5. **Track regularly** - Check dashboard weekly
6. **Use notes** - Add payment terms or thank you messages
7. **Keep customers updated** - Good contact info helps

---

## Your 14-Day Trial Checklist

- [ ] Complete business profile
- [ ] Add business logo
- [ ] Add first customer
- [ ] Create first invoice
- [ ] Send first invoice
- [ ] Enable online payments (optional)
- [ ] Customize invoice template (Premium)
- [ ] Review analytics dashboard
- [ ] Set up email notifications
- [ ] Decide if you want to continue subscription

---

## Ready to Get Started?

[Go to Dashboard](/) | [Watch Tutorial Video](#) | [Contact Support](./SUPPORT.md)

---

*Last Updated: November 21, 2025*  
*Questions? Email support@billtup.com*