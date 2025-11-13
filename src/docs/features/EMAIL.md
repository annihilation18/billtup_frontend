# Email System & Configuration

Complete guide for email setup and troubleshooting in BilltUp.

---

## Overview

BilltUp uses **Nodemailer** (SMTP) to send invoice and receipt emails. You can use any email provider: Gmail, Outlook, SendGrid, Mailgun, or your own SMTP server.

**Features:**
- ✅ Automatic invoice emails with PDF attachments
- ✅ Payment receipt emails
- ✅ Support for any SMTP provider
- ✅ Secure credential handling

---

## Quick Setup (5 Minutes)

### Required Configuration

You need **5 environment variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | Your email address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Email password/app password | `abcdefghijklmnop` |
| `EMAIL_FROM` | Sender name and email | `BilltUp <noreply@yourdomain.com>` |

---

## Option 1: Gmail (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Required for app passwords

### Step 2: Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app → **Mail**
3. Select device → **Other** → Type "BilltUp"
4. Click **Generate**
5. **Copy the 16-character password**
6. Remove spaces: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### Step 3: Add to Supabase

```bash
npx supabase secrets set EMAIL_HOST=smtp.gmail.com
npx supabase secrets set EMAIL_PORT=587
npx supabase secrets set EMAIL_USER=your-email@gmail.com
npx supabase secrets set EMAIL_PASSWORD=abcdefghijklmnop
npx supabase secrets set EMAIL_FROM="BilltUp <your-email@gmail.com>"
```

### Step 4: Deploy

```bash
npx supabase functions deploy server
```

Wait 1-2 minutes, then test!

---

## Option 2: Outlook/Hotmail

### Configuration

```bash
npx supabase secrets set EMAIL_HOST=smtp-mail.outlook.com
npx supabase secrets set EMAIL_PORT=587
npx supabase secrets set EMAIL_USER=your-email@outlook.com
npx supabase secrets set EMAIL_PASSWORD=your-password
npx supabase secrets set EMAIL_FROM="BilltUp <your-email@outlook.com>"
```

**Note:** May require enabling "less secure app access" or using app-specific password.

---

## Option 3: Custom SMTP

### Common Providers

#### SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM="BilltUp <noreply@yourdomain.com>"
```

#### Mailgun
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASSWORD=your-mailgun-password
EMAIL_FROM="BilltUp <noreply@yourdomain.com>"
```

#### Amazon SES
```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
EMAIL_FROM="BilltUp <noreply@yourdomain.com>"
```

#### Your Own Domain
```bash
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587  # or 465 for SSL
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=your-smtp-password
EMAIL_FROM="BilltUp <noreply@yourdomain.com>"
```

---

## Testing Email

### 1. Create an Invoice

1. Log in to BilltUp
2. Go to Dashboard → Create Invoice
3. Fill in customer email
4. Save invoice

### 2. Process Payment

1. Open the invoice
2. Click "Process Payment"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment

### 3. Check Email

- Customer receives invoice email with PDF
- Check spam folder if not in inbox
- Allow 1-2 minutes for delivery

---

## Email Templates

### Invoice Email

**Subject:** Invoice [INV-001] from [Business Name]

**Body:**
```
Hello [Customer Name],

Thank you for your business! Please find your invoice attached.

Invoice Details:
- Invoice Number: INV-001
- Date: Nov 11, 2025
- Amount Due: $108.50

You can pay this invoice online at: [Payment Link]

Best regards,
[Business Name]
```

**Attachment:** Invoice PDF (generated automatically)

### Receipt Email

**Subject:** Payment Receipt for Invoice [INV-001]

**Body:**
```
Hello [Customer Name],

Thank you for your payment!

Payment Details:
- Invoice: INV-001
- Amount Paid: $108.50
- Payment Method: Card ending in 4242
- Date: Nov 11, 2025

A copy of your invoice is attached for your records.

Best regards,
[Business Name]
```

---

## Troubleshooting

### Email Not Sending

**1. Check Supabase Secrets:**
```bash
# List all secrets (values hidden)
npx supabase secrets list

# Should show: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, EMAIL_FROM
```

**2. Check Backend Logs:**
```bash
npx supabase functions logs server
```

Look for email-related errors.

**3. Verify SMTP Credentials:**
- Try logging into email provider's website
- Verify app password is correct
- Check if 2FA is enabled (required for Gmail)

### Gmail "Less Secure App" Error

**Solution:** Use App Password (see Gmail setup above)
- Regular Gmail password won't work
- Must create App Password via Google Account settings

### Emails Going to Spam

**Solutions:**
1. **Use authenticated domain:**
   - Set up SPF/DKIM records
   - Use professional email service

2. **Avoid spam triggers:**
   - Don't use all caps
   - Include unsubscribe link (for marketing)
   - Use professional sender name

3. **Warm up email:**
   - Start with low volume
   - Gradually increase sending

### Port Blocked

**Try different ports:**

- Port 587 (TLS) - recommended
- Port 465 (SSL)
- Port 25 (often blocked)

```bash
npx supabase secrets set EMAIL_PORT=465
npx supabase functions deploy server
```

---

## Migration Notes

### From Resend to Nodemailer

BilltUp previously used Resend but migrated to Nodemailer for:
- ✅ More provider options
- ✅ No API key required
- ✅ Use existing email accounts
- ✅ Better control and flexibility

**Migration completed:** November 2025

---

## Security Best Practices

### Never Commit Credentials

❌ **DON'T:**
```javascript
// Never hardcode credentials!
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    user: 'myemail@gmail.com',  // ❌ NO!
    pass: 'mypassword123'        // ❌ NO!
  }
});
```

✅ **DO:**
```javascript
// Use environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

### Use App Passwords

- ✅ Create app-specific passwords
- ✅ Never use main account password
- ✅ Revoke access if compromised
- ✅ Rotate passwords periodically

### Monitor Sending

- Track email delivery rates
- Watch for bounces
- Monitor spam complaints
- Set up alerts for failures

---

## Advanced Configuration

### Custom Templates

Email templates are in:
- `/supabase/functions/server/index.tsx`

Look for `sendInvoiceEmail` and `sendReceiptEmail` functions.

### Add CC/BCC

Modify email sending code:

```typescript
await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: customerEmail,
  cc: 'sales@yourbusiness.com',      // Copy
  bcc: 'accounting@yourbusiness.com', // Blind copy
  subject: `Invoice ${invoiceNumber}`,
  html: emailHTML,
  attachments: [pdfAttachment]
});
```

### Custom From Name

```bash
EMAIL_FROM="My Business Name <noreply@mybusiness.com>"
```

---

## Email Providers Comparison

| Provider | Free Tier | Cost | Setup Difficulty |
|----------|-----------|------|------------------|
| **Gmail** | 500/day | Free | Easy ⭐ |
| **Outlook** | 300/day | Free | Easy ⭐ |
| **SendGrid** | 100/day | Free, then $15/mo | Medium ⭐⭐ |
| **Mailgun** | 5,000/mo | Free, then $35/mo | Medium ⭐⭐ |
| **Amazon SES** | 62,000/mo | $0.10/1000 | Hard ⭐⭐⭐ |
| **Custom SMTP** | Varies | Varies | Medium ⭐⭐ |

**Recommendation:**
- **Testing:** Gmail (easiest)
- **Production (low volume):** Gmail or Outlook
- **Production (high volume):** SendGrid or Mailgun
- **Enterprise:** Amazon SES

---

## Monitoring

### Check Email Delivery

**1. Supabase Logs:**
```bash
npx supabase functions logs server | grep "email"
```

**2. Email Provider Dashboard:**
- Gmail: Check Sent folder
- SendGrid: Delivery dashboard
- Mailgun: Email logs

**3. Customer Confirmation:**
- Ask customers to check spam
- Provide download link as backup

---

## API Reference

See [Architecture → API](../architecture/API.md) for email endpoint documentation.

**Key Endpoints:**
- `POST /email/invoice` - Send invoice email
- `POST /email/receipt` - Send receipt email

---

**Last Updated:** November 11, 2025  
**Email System:** Nodemailer (SMTP)  
**Status:** Production Ready
