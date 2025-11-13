# 📱 BilltUp User Guide

**Complete step-by-step instructions for using BilltUp**

Version 1.4.0 | Last Updated: November 11, 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Understanding the Dashboard](#understanding-the-dashboard)
3. [Creating Your First Invoice](#creating-your-first-invoice)
4. [Managing Customers](#managing-customers)
5. [Sending Invoices & Collecting Payments](#sending-invoices--collecting-payments)
6. [Viewing Invoice Details](#viewing-invoice-details)
7. [Configuring Settings](#configuring-settings)
8. [Setting Up Stripe Connect](#setting-up-stripe-connect)
9. [Managing Your Business Profile](#managing-your-business-profile)
10. [Advanced Features](#advanced-features)
11. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Time Setup

#### Step 1: Create Your Account

1. **Open BilltUp** in your web browser or mobile app
2. **Click "Sign Up"** on the login screen
3. **Enter your details:**
   - Email address
   - Password (minimum 8 characters)
   - Confirm password
4. **Click "Create Account"**
5. **Check your email** for a verification link (if enabled)

#### Step 2: Sign In

1. **Enter your email** and password
2. **Click "Sign In"**
3. You'll be taken to the **Onboarding Screen**

#### Step 3: Complete Onboarding

The onboarding screen will guide you through initial setup:

1. **Welcome message** - Brief introduction to BilltUp
2. **Business setup** - Enter your business name (you can add more details later)
3. **Quick tour** - Overview of main features
4. **Click "Get Started"** to enter the app

> 💡 **Tip:** You can skip onboarding and complete these steps later in Settings

---

## Understanding the Dashboard

The Dashboard is your home base in BilltUp. Here's what you'll see:

![Dashboard - BilltUp](../components/mockups/DashboardMockup.tsx)

### Top App Bar

- **Business Logo** (left side) - Your uploaded logo appears here
- **"Invoices" Title** - Current screen indicator
- **Deep blue background** - Consistent BilltUp branding

### Stats Cards (4 Metrics)

The dashboard shows four key business metrics:

#### 1. November Sales (or current month)

- **Icon:** 📅 Calendar (deep blue)
- **Shows:** Total paid invoices for the current calendar month
- **Color:** Deep Blue (#1E3A8A)
- **Example:** $5,432.50

#### 2. Year-to-Date

- **Icon:** 📈 Trending Up (teal)
- **Shows:** Total paid invoices for the current year
- **Color:** Teal (#14B8A6)
- **Example:** $42,890.75

#### 3. Pending Payment

- **Icon:** 💵 Dollar Sign (amber)
- **Shows:** Total amount of unpaid invoices
- **Color:** Amber (#F59E0B)
- **Example:** $1,250.00

#### 4. Invoices This Cycle

- **Icon:** 📄 File Text (purple)
- **Shows:** Number of invoices created this billing cycle
- **Color:** Purple (#8B5CF6)
- **Example:** 12 invoices
- **Additional info:** "15 days left" in cycle

> 📊 **Note:** The billing cycle is based on your account creation date, not calendar months. For example, if you signed up on the 15th, your cycle runs from the 15th of each month.

### Search & Filter

**Search Bar:**

- Type customer names or invoice numbers to filter
- Real-time search as you type
- Located below the stats cards

**Status Filter Tabs:**

- **All** - Shows all invoices (with count)
- **Pending** - Shows only unpaid invoices (⏰ icon)
- **Paid** - Shows only paid invoices (✅ icon)

### Invoice List

Each invoice card displays:

- **Invoice Number** (e.g., INV-001) in blue
- **Status Badge:**
  - 🟢 **Green "Paid"** with checkmark
  - 🟡 **Amber "Pending"** with clock icon
  - 🔴 **Red "Refunded"**
  - 🟠 **Orange "Partial Refund"**
- **Customer Name** in bold
- **Invoice Date** (e.g., "Nov 5, 2025")
- **Total Amount** in large font on right side
- **Color-coded left border** matching status

**Tap any invoice** to view full details

### Bottom Navigation

Three main tabs:

1. **📄 Invoices** - Main dashboard (you are here)
2. **👥 Customers** - Manage customer list
3. **⚙️ Settings** - App configuration

### Floating Action Button

- **Blue circular button** with + icon
- **Fixed position** in bottom-right corner
- **Click to create** a new invoice instantly
- Available on all screens

---

## Creating Your First Invoice

### Step 1: Open Invoice Builder

**Three ways to start:**

1. Click the **blue + button** (bottom-right)
2. Click **"Create Your First Invoice"** (if no invoices exist)
3. Navigate to Invoices tab and click **+ button**

### Step 2: Select or Add Customer

**Option A: Select Existing Customer**

1. Tap the **"Select Customer"** dropdown
2. Browse the list of customers
3. Click on a customer name
4. Their info auto-fills into the invoice

**Option B: Add New Customer**

1. Click **"+ Add New Customer"** button
2. Enter customer details:
   - **Name** (required)
   - **Email** (required for payment emails)
   - **Phone** (optional)
   - **Address** (optional)
3. Click **"Save Customer"**
4. They're now selected for this invoice

> 💡 **Tip:** Always include email addresses so customers can receive payment links and receipts

### Step 3: Set Invoice Details

**Invoice Number:**

- Auto-generated (e.g., INV-001, INV-002)
- Increments automatically
- Can be edited if needed

**Invoice Date:**

- Defaults to today's date
- Click to open date picker
- Select any date from calendar

**Due Date (Optional):**

- Set payment deadline
- Helps track overdue invoices
- Displayed on invoice PDF

### Step 4: Add Line Items

This is where you detail what you're charging for:

**For Each Item:**

1. **Click "+ Add Item"** button

2. **Description**
   - What are you charging for?
   - Examples: "Web Design Services", "Logo Design", "Consulting - 5 hours"
   - Be clear and specific

3. **Quantity**
   - How many units?
   - Can be decimal (e.g., 2.5 hours)
   - Defaults to 1

4. **Rate**
   - Price per unit
   - Enter numbers only ($ added automatically)
   - Can include cents (e.g., 150.50)

5. **Amount** (Auto-calculated)
   - Quantity × Rate
   - Updates in real-time
   - Cannot be edited directly

**To Remove an Item:**

- Click the **🗑️ trash icon** next to the item

**To Add More Items:**

- Click **"+ Add Item"** again
- Build as many line items as needed

### Step 5: Review Totals

The invoice automatically calculates:

- **Subtotal** - Sum of all line items
- **Tax** (if applicable) - Calculated percentage
- **Total** - Final amount due

**To Add Tax:**

1. Look for **"Add Tax"** option
2. Enter tax percentage (e.g., 8.5 for 8.5%)
3. Tax amount calculates automatically

### Step 6: Add Notes (Optional)

**Notes Section:**

- Add payment terms (e.g., "Net 30")
- Include thank you message
- Specify payment methods accepted
- Add any special instructions

**Example Notes:**

```
Payment due within 30 days.
Thank you for your business!

Accepted payment methods: Credit card, bank transfer
```

### Step 7: Add Signature (Optional)

**Enable Signature:**

1. Toggle **"Include Signature"** switch to ON
2. **Draw your signature** in the signature pad
3. Use finger (mobile) or mouse (desktop)
4. Click **"Clear"** to start over if needed

**Why add a signature?**

- Adds professionalism
- Shows authenticity
- Some industries require it

### Step 8: Preview Invoice

Before saving:

1. **Click "Preview PDF"** button
2. **Review the full invoice** as your customer will see it
3. **Check for errors:**
   - Customer information correct?
   - Line items accurate?
   - Totals calculated correctly?
   - Notes and signature look good?

**In Preview Mode:**

- See exact PDF layout
- Scroll through entire document
- Close with **X button** or **back button**
- Return to editor to make changes

### Step 9: Save Invoice

When everything looks perfect:

1. **Click "Save Invoice"** button
2. Invoice is saved to your account
3. **Automatically redirected** to invoice detail screen
4. Status initially set to **"Pending"**

> ✅ **Success!** Your invoice is now created and ready to send

---

## Managing Customers

### Viewing Customer List

1. **Tap "Customers"** tab in bottom navigation
2. See all customers listed alphabetically
3. Each card shows:
   - Customer name
   - Email address
   - Phone number (if provided)
   - Number of invoices for this customer

### Adding a New Customer

**Method 1: From Customers Screen**

1. Go to **Customers** tab
2. Click **"+ Add Customer"** button
3. Fill in customer form:
   ```
   Name: John Smith
   Email: john@example.com
   Phone: (555) 123-4567
   Address: 123 Main St, City, ST 12345
   ```
4. Click **"Save"**

**Method 2: During Invoice Creation**

1. While creating invoice
2. Click **"+ Add New Customer"**
3. Fill in details
4. Automatically selected for current invoice

### Editing Customer Information

1. **Tap on customer card** in customer list
2. **Click "Edit"** button
3. **Update information** as needed
4. **Click "Save Changes"**

### Viewing Customer Details

**Customer Detail Screen shows:**

- Full contact information
- Complete address
- All invoices for this customer
- Total amount invoiced
- Amount paid vs. pending

**From this screen you can:**

- Edit customer information
- View individual invoices
- Create new invoice for this customer

### Searching Customers

1. Use **search bar** at top of Customers screen
2. Type customer name or email
3. Results filter in real-time

---

## Sending Invoices & Collecting Payments

![Payment Screen - BilltUp](../components/mockups/PaymentScreenMockup.tsx)

### How Payment Works in BilltUp

BilltUp uses **Stripe** for secure payment processing:

- **Bank-level encryption** protects all payment data
- **PCI compliant** - payment info never stored on BilltUp servers
- **Instant notifications** when payments are received
- **Automatic email receipts** sent to customers

### Sending an Invoice

**From Invoice Detail Screen:**

1. **Open the invoice** you want to send
2. **Click "Send Invoice"** button
3. **Email is automatically sent** to customer with:
   - Invoice PDF attachment
   - Payment link (if Stripe Connect enabled)
   - Your business information
   - Professional email template

**What the customer receives:**

```
Subject: Invoice INV-001 from [Your Business Name]

Hi [Customer Name],

Thank you for your business! Please find your invoice attached.

Invoice: INV-001
Amount Due: $XXX.XX
Due Date: [Date]

[View Invoice] [Pay Now]

Best regards,
[Your Business Name]
```

### Collecting Payment via Link

**If Stripe Connect is enabled:**

1. **Customer clicks "Pay Now"** in email
2. **Redirected to secure payment page**
3. **Enter credit card details:**
   - Card number
   - Expiration date
   - CVC code
   - Billing zip code
4. **Click "Pay"**
5. **Payment processed immediately**
6. **Both parties receive confirmation:**
   - Customer gets receipt email
   - You get payment notification
7. **Invoice status** automatically updates to "Paid"

### Transaction Fees

**BilltUp + Stripe Fees:**

- **Platform fee:** 0.6% + $0.20 per transaction
- **Stripe fee:** 2.9% + $0.30 per transaction
- **Total:** 3.5% + $0.50 per transaction

**Example on $100 invoice:**

- Stripe fee: $3.20 ($100 × 2.9% + $0.30)
- Platform fee: $0.80 ($100 × 0.6% + $0.20)
- Total fees: $4.00
- You receive: $96.00

> 💰 **Note:** Funds go directly to your Stripe account, not through BilltUp

### Manual Payment Recording

**If customer pays via check, cash, or wire transfer:**

1. **Open the invoice**
2. **Click "Mark as Paid"** button
3. **Optionally add note** about payment method
4. **Invoice status** changes to "Paid"
5. **Stats update** automatically

> ⚠️ **Important:** This doesn't process actual payment - it just records that payment was received externally

### Handling Refunds

**Full Refund:**

1. **Open the paid invoice**
2. **Click "Issue Refund"** button
3. **Confirm refund amount** (full amount)
4. **Add reason** (optional but recommended)
5. **Click "Process Refund"**
6. **Stripe processes refund** (3-10 business days)
7. **Invoice status** changes to "Refunded"

**Partial Refund:**

1. **Open the paid invoice**
2. **Click "Issue Refund"**
3. **Enter partial amount** (less than total)
4. **Add reason**
5. **Click "Process Refund"**
6. **Status** changes to "Partially Refunded"
7. **Net amount** displayed on invoice

---

## Viewing Invoice Details

### Opening an Invoice

**Three ways:**

1. **Tap invoice card** on Dashboard
2. **Click invoice** from Customer detail screen
3. **Use search** to find specific invoice

### Invoice Detail Screen

**Top Section:**

- Invoice number (large, bold)
- Status badge (Paid/Pending/Refunded)
- Total amount (prominent display)
- Creation date

**Customer Information:**

- Name
- Email
- Phone
- Full address

**Line Items:**

- Complete itemized list
- Description, quantity, rate, amount
- Subtotal
- Tax (if applicable)
- **Total in large font**

**Action Buttons:**

- **📄 Download PDF** - Save invoice as PDF file
- **👁️ Preview PDF** - View invoice in browser
- **✉️ Send Invoice** - Email to customer
- **💳 Get Payment Link** - Copy shareable payment URL
- **✏️ Edit** - Modify invoice (if pending)
- **🗑️ Delete** - Remove invoice (with confirmation)
- **💰 Mark as Paid** - Record external payment
- **↩️ Issue Refund** - Process refund (if paid)

### Downloading Invoice PDF

1. **Click "Download PDF"** button
2. **PDF generates** automatically
3. **File downloads** to your device
4. **Filename:** `Invoice-INV-001.pdf`

**PDF includes:**

- Your business logo and information
- Customer billing information
- Itemized line items
- Totals and tax
- Payment terms/notes
- Signature (if added)
- Professional formatting

### Sharing Payment Link

**If Stripe Connect is enabled:**

1. **Click "Get Payment Link"** button
2. **Link is copied** to clipboard
3. **Share link** via:
   - Text message
   - WhatsApp
   - Social media
   - Any messaging platform

**Customer can:**

- Click link to open payment page
- Pay immediately with credit card
- Receive instant receipt

---

## Configuring Settings

![Settings Screen - BilltUp](../components/mockups/SettingsMockup.tsx)

### Accessing Settings

1. **Tap "Settings"** in bottom navigation
2. Settings screen displays all configuration options

### Settings Sections

#### Account Information

**Your Email:**

- Displays current email address
- Used for login
- Receives payment notifications

**Change Email:**

1. Click **"Change Email"**
2. Enter new email address
3. Verify via confirmation email
4. Re-login with new email

**Change Password:**

1. Click **"Change Password"**
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click **"Update Password"**

**Password Requirements:**

- Minimum 8 characters
- At least one number recommended
- Mix of uppercase/lowercase recommended

#### Business Profile

**Business Name:**

- Appears on invoices
- Shown in emails
- Displayed in app header

**Business Email:**

- Contact email for customers
- Reply-to address for invoice emails
- Can differ from your account email

**Business Phone:**

- Displayed on invoices
- Optional but recommended
- Format: (555) 123-4567

**Business Address:**

- Complete street address
- City, State, ZIP
- Country (if international)
- Appears on invoice PDFs

**Tax ID / ABN:**

- Business tax identification number
- Optional
- Displayed on invoices if provided

#### Business Branding

**Upload Logo:**

1. Click **"Upload Logo"** button
2. **Select image** from your device
3. **Supported formats:** JPG, PNG, GIF
4. **Recommended size:** 500×500 pixels or larger
5. **Image uploads** and displays in preview
6. **Appears on:**
   - App header
   - Invoice PDFs
   - Email headers

**Remove Logo:**

- Click **"Remove Logo"** button
- Default icon shows instead

**Logo Tips:**

- Use square or circular logos for best results
- High resolution looks more professional
- PNG with transparent background works best
- Keep file size under 2MB

#### Invoice Settings

**Invoice Number Prefix:**

- Default: "INV-"
- Customize to your preference
- Examples: "INVOICE-", "Bill-", "2025-"

**Starting Invoice Number:**

- Default: 1
- Increments automatically
- Change if continuing from another system

**Default Tax Rate:**

- Enter percentage (e.g., 8.5)
- Auto-applies to new invoices
- Can be changed per invoice

**Payment Terms:**

- Default note on all invoices
- Examples: "Net 30", "Due upon receipt"
- Can be edited per invoice

**Currency:**

- Default: USD ($)
- Change to match your region
- Affects all invoices

#### Notification Settings

**Email Notifications:**

**Toggle ON/OFF for:**

- ✅ Payment received
- ✅ Invoice sent confirmation
- ✅ Refund processed
- ✅ New customer added
- ✅ Weekly summary

**Push Notifications (Mobile App):**

- ✅ Instant payment alerts
- ✅ Invoice status updates
- ✅ Customer activity

---

## Setting Up Stripe Connect

### Why Connect Stripe?

**Benefits:**

- Accept credit card payments online
- Instant payment processing
- Automatic invoice status updates
- Professional payment pages
- Secure, PCI-compliant transactions
- Direct deposit to your bank account

### Step-by-Step Stripe Setup

#### Step 1: Navigate to Stripe Settings

1. Go to **Settings** tab
2. Scroll to **"Payment Methods"** section
3. Click **"Connect Stripe Account"** button

#### Step 2: Create or Connect Stripe Account

**Option A: Create New Stripe Account**

1. Click **"Create a Stripe account"**
2. Fill in business information:
   - Business name
   - Business type (Individual/Company)
   - Country
   - Email address
   - Password
3. Click **"Create account"**

**Option B: Connect Existing Stripe Account**

1. Click **"Sign in to Stripe"**
2. Enter Stripe email and password
3. Click **"Sign in"**

#### Step 3: Authorize BilltUp

1. **Review permissions** BilltUp requests:
   - Process payments
   - Create invoices
   - Issue refunds
   - View transaction history
2. **Click "Connect"** to authorize

#### Step 4: Complete Stripe Onboarding

Stripe requires additional information:

**Business Details:**

- Legal business name
- Business description
- Industry category
- Website (if applicable)

**Personal Details (for verification):**

- Full legal name
- Date of birth
- Home address
- Last 4 digits of SSN (US) or equivalent

**Bank Account:**

- Bank name
- Account number
- Routing number
- Account holder name

**Verification Documents:**

- Government ID (if requested)
- Business documents (if applicable)

> 🔒 **Security:** All information is encrypted and handled directly by Stripe, not BilltUp

#### Step 5: Verify Connection

1. **Return to BilltUp** after Stripe setup
2. **Settings should show:**
   - ✅ **"Stripe Connected"**
   - Your Stripe account email
   - Connection status: Active
3. **Test mode toggle** for testing payments

### Testing Payment Flow

**Before going live:**

1. **Enable "Test Mode"** in Stripe settings
2. **Create a test invoice**
3. **Send to yourself**
4. **Use Stripe test card:**
   ```
   Card Number: 4242 4242 4242 4242
   Expiration: Any future date
   CVC: Any 3 digits
   ZIP: Any 5 digits
   ```
5. **Complete payment**
6. **Verify invoice status** updates to "Paid"

**Test Cards for Different Scenarios:**

- `4242 4242 4242 4242` - Successful payment
- `4000 0000 0000 0002` - Declined card
- `4000 0000 0000 9995` - Insufficient funds
- `4000 0000 0000 0069` - Expired card

### Going Live

1. **Disable "Test Mode"** in settings
2. **Stripe automatically activates** live mode
3. **Start accepting real payments**
4. **Funds deposit** to your bank account within 2-7 business days

### Managing Stripe Account

**View Transactions:**

1. Click **"View in Stripe Dashboard"** in BilltUp settings
2. Opens Stripe dashboard in new tab
3. See all transactions, customers, analytics

**Update Bank Account:**

- Must be done in Stripe dashboard
- Settings → Bank accounts and scheduling
- Add or change payout account

**Dispute Management:**

- Handled in Stripe dashboard
- Automatic notifications if dispute occurs
- Upload evidence through Stripe

---

## Managing Your Business Profile

### Why Complete Your Profile?

A complete business profile:

- Looks more professional on invoices
- Builds customer trust
- Required for some payment methods
- Helps with tax compliance

### Essential Information

**Must Have:**

- ✅ Business name
- ✅ Business email
- ✅ Business address (for invoices)

**Recommended:**

- ✅ Phone number
- ✅ Logo
- ✅ Tax ID/ABN
- ✅ Website (if you have one)

### Updating Your Profile

1. Go to **Settings** → **Business Profile**
2. Click **"Edit Profile"** button
3. Update any fields
4. Click **"Save Changes"**
5. **Changes apply immediately** to new invoices

> 📝 **Note:** Existing invoices keep their original information

### Profile Best Practices

**Business Name:**

- Use official registered name
- Or "doing business as" (DBA) name
- Consistent with legal documents

**Business Email:**

- Use professional domain email (you@yourbusiness.com)
- Avoid generic emails (gmail, yahoo) for professional image
- Check this email regularly for customer responses

**Business Address:**

- Use complete, formatted address
- Include unit/suite numbers if applicable
- Match address on legal documents

**Logo:**

- Professional quality
- Represents your brand
- Clear and recognizable at small sizes

---

## Advanced Features

### Bulk Actions

**Exporting Invoices:**

1. Go to Settings → **Data Export**
2. Select date range
3. Choose format (CSV or PDF)
4. Click **"Export"**
5. Download file

**Importing Customers:**

1. Settings → **Import Data**
2. Download CSV template
3. Fill in customer information
4. Upload completed CSV
5. Review and confirm import

### Recurring Invoices (Coming Soon)

**Setup recurring invoices for:**

- Monthly retainer clients
- Subscription services
- Recurring billing

**Features:**

- Auto-generate invoices
- Auto-send to customers
- Customizable schedules

### Invoice Templates (Coming Soon)

**Create custom templates:**

- Different layouts
- Industry-specific formats
- Multi-language support

### Reports & Analytics

**Available Reports:**

**Sales Report:**

- Revenue by month
- Revenue by customer
- Revenue by service/product
- Year-over-year comparison

**Payment Report:**

- Paid vs. pending
- Average payment time
- Collection rate
- Outstanding balances

**Customer Report:**

- Top customers by revenue
- Customer lifetime value
- New vs. returning customers
- Customer activity

**Tax Report:**

- Total tax collected
- Tax by period
- Itemized tax breakdown
- Export for accounting

### Multi-Currency Support

**Enable in Settings:**

1. Settings → **Invoice Settings**
2. Select **"Enable Multi-Currency"**
3. Choose supported currencies
4. Set default currency

**Per-invoice currency:**

- Override default for specific invoices
- Exchange rates update automatically
- Display in customer's currency

---

## Troubleshooting

### Common Issues

#### Can't Log In

**Issue:** "Invalid email or password" error

**Solutions:**

1. **Check email spelling** - no spaces before/after
2. **Verify password** - case-sensitive
3. **Clear browser cache** - Ctrl+F5 (Windows) or Cmd+R (Mac)
4. **Try "Forgot Password"** to reset
5. **Check caps lock** is off

**If still having issues:**

- Try different browser
- Check internet connection
- Contact support

#### Invoice Not Sending

**Issue:** Customer didn't receive invoice email

**Check:**

1. ✅ Customer email address correct?
2. ✅ Email in their spam folder?
3. ✅ Email service configured in Settings?
4. ✅ Internet connection active?

**Solutions:**

- Verify customer email address
- Ask customer to check spam/junk folder
- Add your business email to their contacts
- Resend the invoice
- Download PDF and send manually as backup

#### Payment Link Not Working

**Issue:** Customer can't complete payment

**Check:**

1. ✅ Stripe Connect enabled?
2. ✅ Stripe account fully verified?
3. ✅ Test mode disabled for live payments?
4. ✅ Invoice still marked as "Pending"?

**Solutions:**

- Verify Stripe connection in Settings
- Complete Stripe onboarding if incomplete
- Toggle test mode off
- Generate new payment link

#### PDF Not Downloading

**Issue:** PDF download fails or shows blank

**Solutions:**

1. **Allow pop-ups** in browser settings
2. **Try different browser** (Chrome, Firefox, Safari)
3. **Check download folder** - may have downloaded
4. **Clear browser cache**
5. **Use "Preview PDF"** then print to PDF

#### Stripe Connection Issues

**Issue:** "Failed to connect Stripe account"

**Solutions:**

1. **Verify Stripe email/password** is correct
2. **Complete Stripe onboarding** fully
3. **Check Stripe account status** - must be active
4. **Disconnect and reconnect:**
   - Settings → Disconnect Stripe
   - Wait 30 seconds
   - Connect again
5. **Contact Stripe support** if account issues

### Getting Help

**In-App Support:**

1. Go to Settings → **Help & Support**
2. Click **"Contact Support"**
3. Describe your issue
4. Include screenshots if helpful
5. Submit ticket

**Response Times:**

- Email support: 24-48 hours
- Priority support: 4-8 hours (paid plans)
- Emergency: Contact through Stripe dashboard

**Before Contacting Support:**

- [ ] Check this user guide
- [ ] Try troubleshooting steps above
- [ ] Test in different browser
- [ ] Check internet connection
- [ ] Gather error messages/screenshots

**Include in Support Request:**

- Your account email
- Description of issue
- Steps to reproduce
- Screenshots or error messages
- Browser and device info
- When issue started

---

## Quick Reference

### Common Tasks

| Task                | Steps                                                     |
| ------------------- | --------------------------------------------------------- |
| **Create Invoice**  | Click + button → Select customer → Add items → Save       |
| **Send Invoice**    | Open invoice → Send Invoice button → Confirm              |
| **Mark as Paid**    | Open invoice → Mark as Paid → Confirm                     |
| **Download PDF**    | Open invoice → Download PDF                               |
| **Add Customer**    | Customers tab → + Add Customer → Fill form → Save         |
| **Change Settings** | Settings tab → Select section → Make changes → Save       |
| **Connect Stripe**  | Settings → Connect Stripe Account → Authorize             |
| **Upload Logo**     | Settings → Upload Logo → Select file                      |
| **Issue Refund**    | Open paid invoice → Issue Refund → Enter amount → Confirm |
| **View Reports**    | Settings → Reports → Select report type                   |

### Keyboard Shortcuts (Desktop)

| Shortcut       | Action             |
| -------------- | ------------------ |
| `Ctrl/Cmd + N` | New invoice        |
| `Ctrl/Cmd + F` | Focus search       |
| `Ctrl/Cmd + S` | Save invoice       |
| `Esc`          | Close modal/cancel |
| `Tab`          | Next field         |
| `Shift + Tab`  | Previous field     |

### Status Guide

| Status             | Meaning                                | Color     |
| ------------------ | -------------------------------------- | --------- |
| **Pending**        | Invoice sent, awaiting payment         | 🟡 Amber  |
| **Paid**           | Payment received, transaction complete | 🟢 Teal   |
| **Refunded**       | Full refund issued to customer         | 🔴 Red    |
| **Partial Refund** | Partial amount refunded                | 🟠 Orange |
| **Draft**          | Invoice saved but not sent             | ⚪ Gray   |

### Payment Methods

**Accepted by Stripe:**

- ✅ Visa
- ✅ Mastercard
- ✅ American Express
- ✅ Discover
- ✅ Diners Club
- ✅ JCB
- ✅ Google Pay
- ✅ Apple Pay

**Manual Methods (Mark as Paid):**

- Cash
- Check
- Bank transfer
- Wire transfer
- Other methods

---

## Tips for Success

### Best Practices

**🎯 Invoice Creation:**

- ✅ Always include detailed descriptions
- ✅ Set clear payment terms
- ✅ Add tax where applicable
- ✅ Include your contact information
- ✅ Use consistent invoice numbering

**💼 Professional Image:**

- ✅ Upload a professional logo
- ✅ Complete all business profile fields
- ✅ Use business email domain
- ✅ Respond to customer inquiries promptly
- ✅ Send invoices immediately after work completion

**💰 Payment Collection:**

- ✅ Send invoices promptly
- ✅ Set realistic due dates
- ✅ Follow up on overdue invoices
- ✅ Offer multiple payment methods
- ✅ Thank customers for prompt payment

**📊 Record Keeping:**

- ✅ Save copies of all invoices
- ✅ Track paid vs. pending regularly
- ✅ Export data monthly for accounting
- ✅ Monitor your sales trends
- ✅ Keep customer information updated

### Time-Saving Tips

**⚡ Speed up invoicing:**

1. **Save common line items** as templates
2. **Use customer information** from previous invoices
3. **Set default tax rates** in settings
4. **Enable auto-incrementing** invoice numbers
5. **Create invoices immediately** after completing work

**📱 Mobile efficiency:**

1. **Use floating + button** for quick access
2. **Search instead of scrolling** for customers
3. **Use voice-to-text** for descriptions (mobile)
4. **Enable push notifications** for instant alerts
5. **Keep app open** for easy reference

### Security Tips

**🔒 Protect your account:**

- ✅ Use strong, unique password
- ✅ Don't share login credentials
- ✅ Log out on shared devices
- ✅ Enable two-factor authentication (if available)
- ✅ Review login activity regularly

**💳 Payment security:**

- ✅ Never store customer card numbers
- ✅ Only process payments through Stripe
- ✅ Verify refund requests carefully
- ✅ Monitor for fraudulent activity
- ✅ Report suspicious transactions immediately

---

## Frequently Asked Questions

**Q: How much does BilltUp cost?**  
A: BilltUp has a free tier and paid plans. Transaction fees apply when using Stripe (3.5% + $0.50).

**Q: Can I use BilltUp offline?**  
A: You need internet connection to send invoices and process payments. You can view saved invoices offline.

**Q: How long does it take to receive payments?**  
A: Stripe deposits funds within 2-7 business days after payment. First payout may take longer.

**Q: Can I customize invoice templates?**  
A: Basic customization available now (logo, colors). Advanced templates coming soon.

**Q: Is my data secure?**  
A: Yes. Bank-level encryption, PCI compliance, and Stripe handles all payment data securely.

**Q: Can I export my data?**  
A: Yes. Export invoices, customers, and reports as CSV or PDF from Settings.

**Q: Do you support multiple currencies?**  
A: Yes. Enable multi-currency in Settings and select per invoice.

**Q: Can customers pay without Stripe?**  
A: Yes, but they'll need to pay manually (check, cash, wire). You can mark invoices as paid.

**Q: What happens if a customer disputes a payment?**  
A: Stripe handles disputes. You'll be notified and can respond through Stripe dashboard.

**Q: Can I have multiple users on one account?**  
A: Team features coming soon. Currently one user per account.

---

## Getting More Help

### Resources

**📚 Documentation:**

- Complete API documentation: `/docs/architecture/API.md`
- Database schema: `/docs/architecture/DATABASE.md`
- Security guide: `/docs/guides/SECURITY.md`
- Testing guide: `/docs/guides/TESTING.md`

**🎥 Video Tutorials:**

- Coming soon to BilltUp YouTube channel

**💬 Community:**

- User forums: [community.billtup.com](#)
- Facebook group: [BilltUp Users](#)
- Discord server: [Join here](#)

**📧 Contact Support:**

- Email: support@billtup.com
- Response time: 24-48 hours
- Priority support available for paid plans

**🐛 Report a Bug:**

- GitHub issues: [github.com/billtup/issues](#)
- Include steps to reproduce
- Attach screenshots if possible

---

## Changelog

**Version 1.4.0** (Current)

- ✅ Compact dashboard stats
- ✅ Billing cycle tracking
- ✅ Improved mobile responsiveness
- ✅ Enhanced PDF generation

**Version 1.3.0**

- Monthly invoice tracking
- Billing cycle counter
- Days remaining display

**Version 1.2.0**

- Customer phone display
- Mobile invoice preview optimization
- Search improvements

**Version 1.1.0**

- Stripe Connect integration
- Email notifications
- PDF enhancements

**Version 1.0.0**

- Initial release
- Basic invoice creation
- Customer management
- Payment processing

---

## Final Notes

**🎉 You're Ready to Go!**

You now have everything you need to:

- Create professional invoices
- Manage customers effectively
- Collect payments securely
- Grow your business with BilltUp

**Need help?** Refer back to this guide anytime or contact support.

**Happy invoicing! 🚀**

---

_BilltUp User Guide v1.4.0_  
_Last Updated: November 11, 2025_  
_© 2025 BilltUp. All rights reserved._