# Complete Invoice Templates Styling Guide - EXACT FROM APP

This document contains the **EXACT HTML/CSS** extracted from the BilltUp mobile app code for all 15 invoice templates, converted from Tailwind CSS to pure CSS for website implementation.

**Source Files:**

- `/components/InvoiceTemplateBrowser.tsx` - Templates 1-5
- `/components/InvoiceTemplates.tsx` - Templates 6-10
- `/components/InvoiceTemplates2.tsx` - Templates 11-15

**Color Variables:**

```javascript
const primaryColor = businessData.brandColor || '#1E3A8A';
const accentColor = businessData.accentColor || '#14B8A6';
const businessName = businessData.businessName || "Your Business Name";
const businessEmail = businessData.email || "hello@yourbusiness.com";
const businessPhone = businessData.phone || "(555) 123-4567";
const businessAddress = businessData.address || "123 Business Ave\\nYour City, ST 12345";
```

---

## 1. Modern Template (Professional)

**ID:** `modern`  
**Description:** Clean lines with a side accent bar

**EXACT HTML/CSS:**

```html
<div style="padding: 24px 32px;">
  <div style="display: flex; gap: 12px;">
    <!-- Accent Bar -->
    <div style="width: 4px; border-radius: 2px; flex-shrink: 0; background-color: {accentColor};"></div>

    <div style="flex: 1; min-width: 0;">
      <!-- Header -->
      <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px;">
        <div style="min-width: 0; display: flex; gap: 12px; align-items: flex-start;">
          <!-- Logo (48px circle) -->
          <div style="width: 48px; height: 48px; border-radius: 50%; background-color: {primaryColor}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-weight: 700; font-size: 18px;">{initials}</span>
          </div>

          <div>
            <h1 style="font-size: 20px; margin: 0 0 8px 0; color: #111827;">{businessName}</h1>
            <p style="font-size: 12px; margin: 0 0 2px 0; color: #4b5563;">{businessEmail}</p>
            <p style="font-size: 12px; margin: 0; color: #4b5563;">{businessPhone}</p>
          </div>
        </div>

        <div style="flex-shrink: 0;">
          <div style="font-size: 18px; margin-bottom: 4px; color: #111827;">INVOICE</div>
          <div style="font-size: 12px; color: #4b5563;">#{invoiceNumber}</div>
        </div>
      </div>

      <!-- Bill To & Invoice Details -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">Bill To</div>
          <div style="font-weight: 500; margin-bottom: 4px; color: #111827;">{customerName}</div>
          <div style="font-size: 12px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
          <div style="font-size: 12px; color: #4b5563;">{customerEmail}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">Invoice Details</div>
          <div style="font-size: 12px; margin-bottom: 4px; color: #111827;">
            <span style="color: #4b5563;">Date:</span> {invoiceDate}
          </div>
          <div style="font-size: 12px; color: #111827;">
            <span style="color: #4b5563;">Due Date:</span> {dueDate}
          </div>
        </div>
      </div>

      <!-- Line Items Table -->
      <div style="overflow-x: auto;">
        <table style="width: 100%; margin-bottom: 24px; font-size: 14px; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid {accentColor};">
              <th style="text-align: left; padding: 8px 0; font-size: 12px; color: #111827;">Description</th>
              <th style="text-align: center; padding: 8px; font-size: 12px; color: #111827;">Qty</th>
              <th style="text-align: right; padding: 8px; font-size: 12px; color: #111827;">Rate</th>
              <th style="text-align: right; padding: 8px 0; font-size: 12px; color: #111827;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 12px 0;">
                <div style="font-weight: 500; color: #111827; font-size: 12px;">{itemName}</div>
                <div style="font-size: 12px; color: #4b5563;">{itemDescription}</div>
              </td>
              <td style="text-align: center; color: #111827; font-size: 12px;">{quantity}</td>
              <td style="text-align: right; color: #111827; font-size: 12px;">${rate}</td>
              <td style="text-align: right; font-weight: 500; color: #111827; font-size: 12px;">${total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 24px;">
        <div style="width: 100%; max-width: 288px;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #4b5563;">Subtotal</span>
            <span style="color: #111827;">${subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #4b5563;">Tax (10%)</span>
            <span style="color: #111827;">${tax}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 18px; color: #111827;">
            <span style="font-weight: 500;">Total Due</span>
            <span style="font-weight: 500;">${total}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 8px;">Notes</div>
        <p style="font-size: 12px; color: #4b5563; margin: 0;">{notes}</p>
      </div>
    </div>
  </div>
</div>
```

---

## 2. Classic Template (Professional)

**ID:** `classic`  
**Description:** Traditional business invoice layout

**EXACT HTML/CSS:**

```html
<div style="padding: 32px 48px;">
  <!-- Colored Header -->
  <div style="margin-bottom: 32px; padding: 24px; border-radius: 8px; background-color: {primaryColor}; color: white;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 12px; align-items: center;">
        <!-- Logo with white border (56px circle) -->
        <div style="width: 56px; height: 56px; border-radius: 50%; background-color: white; color: {primaryColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span style="font-weight: 700; font-size: 21px;">{initials}</span>
        </div>

        <div>
          <h1 style="font-size: 28px; margin: 0 0 8px 0;">{businessName}</h1>
          <p style="font-size: 14px; margin: 0; opacity: 0.9;">{businessEmail} • {businessPhone}</p>
        </div>
      </div>

      <div style="text-align: right;">
        <div style="font-size: 36px; margin-bottom: 4px;">INVOICE</div>
        <div style="font-size: 14px;">#{invoiceNumber}</div>
      </div>
    </div>
  </div>

  <div style="padding: 0 24px;">
    <!-- Bill To & Invoice Details -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;">
      <div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Bill To</div>
        <div style="font-weight: 500; margin-bottom: 4px; color: #000000;">{customerName}</div>
        <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Invoice Date</div>
        <div style="font-size: 14px; margin-bottom: 12px; color: #000000;">{invoiceDate}</div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Due Date</div>
        <div style="font-size: 14px; color: #000000;">{dueDate}</div>
      </div>
    </div>

    <!-- Line Items -->
    <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="text-align: left; padding: 12px; font-size: 14px; color: #000000;">Item Description</th>
          <th style="text-align: center; padding: 12px; font-size: 14px; color: #000000;">Qty</th>
          <th style="text-align: right; padding: 12px; font-size: 14px; color: #000000;">Rate</th>
          <th style="text-align: right; padding: 12px; font-size: 14px; color: #000000;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px;">
            <div style="font-weight: 500; color: #000000;">{itemName}</div>
            <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
          </td>
          <td style="text-align: center; padding: 12px; color: #000000;">{quantity}</td>
          <td style="text-align: right; padding: 12px; color: #000000;">${rate}</td>
          <td style="text-align: right; padding: 12px; font-weight: 500; color: #000000;">${total}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
      <div style="width: 288px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #4b5563;">
          <span>Subtotal</span>
          <span style="color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #4b5563;">
          <span>Tax</span>
          <span style="color: #000000;">${tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 20px; border-top: 2px solid #d1d5db; color: {primaryColor};">
          <span>Total Due</span>
          <span>${total}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div style="padding-top: 24px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Payment Terms</div>
      <p style="font-size: 14px; color: #4b5563; margin: 0;">{notes}</p>
    </div>
  </div>
</div>
```

---

## 3. Minimal Template (Professional)

**ID:** `minimal`  
**Description:** Simple and elegant design

**EXACT HTML/CSS:**

```html
<div style="padding: 48px; font-family: system-ui, -apple-system, sans-serif;">
  <!-- Header with Logo -->
  <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 48px;">
    <!-- Logo (56px circle) -->
    <div style="width: 56px; height: 56px; border-radius: 50%; background-color: {primaryColor}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      <span style="font-weight: 700; font-size: 21px;">{initials}</span>
    </div>
    <h1 style="font-size: 36px; margin: 0; color: #111827;">{businessName}</h1>
  </div>

  <!-- From/To Section -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 48px;">
    <div>
      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; margin-bottom: 12px; letter-spacing: 0.05em;">From</div>
      <div style="font-size: 14px; color: #374151;">
        <div>{businessEmail}</div>
        <div>{businessPhone}</div>
        <div style="white-space: pre-line;">{businessAddress}</div>
      </div>
    </div>
    <div>
      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; margin-bottom: 12px; letter-spacing: 0.05em;">To</div>
      <div style="font-size: 14px; color: #374151;">
        <div style="font-weight: 500; color: #111827;">{customerName}</div>
        <div style="white-space: pre-line;">{customerAddress}</div>
        <div>{customerEmail}</div>
      </div>
    </div>
  </div>

  <!-- Invoice Info -->
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid #d1d5db;">
    <div>
      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; letter-spacing: 0.05em;">Invoice Number</div>
      <div style="font-size: 18px; color: #111827;">{invoiceNumber}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; letter-spacing: 0.05em;">Date</div>
      <div style="font-size: 18px; color: #111827;">{invoiceDate}</div>
    </div>
  </div>

  <!-- Line Items -->
  <table style="width: 100%; margin-bottom: 48px; border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 1px solid #d1d5db;">
        <th style="text-align: left; padding-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 400; letter-spacing: 0.05em;">Item</th>
        <th style="text-align: center; padding-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 400; letter-spacing: 0.05em;">Qty</th>
        <th style="text-align: right; padding-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 400; letter-spacing: 0.05em;">Rate</th>
        <th style="text-align: right; padding-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 400; letter-spacing: 0.05em;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px 0;">
          <div style="color: #111827;">{itemName}</div>
          <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #374151;">{quantity}</td>
        <td style="text-align: right; color: #374151;">${rate}</td>
        <td style="text-align: right; color: #111827;">${total}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 320px;">
      <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; color: #374151; border-bottom: 1px solid #e5e7eb;">
        <span>Tax</span>
        <span>${tax}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 24px; color: #111827;">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  </div>

  <!-- Notes -->
  <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 14px; color: #4b5563; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 4. Bold Template (Creative)

**ID:** `bold`  
**Description:** Strong header with gradient accents

**EXACT HTML/CSS:**

```html
<div>
  <!-- Gradient Header -->
  <div style="height: 96px; background: linear-gradient(135deg, {primaryColor} 0%, {accentColor} 100%); display: flex; align-items: center; justify-content: space-between; padding: 0 48px; color: white;">
    <h1 style="font-size: 28px; margin: 0;">{businessName}</h1>
    <div style="text-align: right;">
      <div style="font-size: 24px; margin-bottom: 4px;">INVOICE</div>
      <div style="font-size: 14px; opacity: 0.9;">#{invoiceNumber}</div>
    </div>
  </div>

  <div style="padding: 48px;">
    <!-- Bill To & Invoice Details -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px;">
      <div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; color: {primaryColor};">Billed To</div>
        <div style="font-weight: 500; font-size: 18px; margin-bottom: 8px; color: #111827;">{customerName}</div>
        <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">Invoice Date</div>
          <div style="font-weight: 500; color: #111827;">{invoiceDate}</div>
        </div>
        <div>
          <div style="font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">Payment Due</div>
          <div style="font-weight: 500; color: #111827;">{dueDate}</div>
        </div>
      </div>
    </div>

    <!-- Line Items -->
    <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid {accentColor};">
          <th style="text-align: left; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">Service</th>
          <th style="text-align: center; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">Qty</th>
          <th style="text-align: right; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">Price</th>
          <th style="text-align: right; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #000000;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 16px 0;">
            <div style="font-weight: 500; color: #111827;">{itemName}</div>
            <div style="font-size: 14px; color: #4b5563; margin-top: 4px;">{itemDescription}</div>
          </td>
          <td style="text-align: center; color: #000000;">{quantity}</td>
          <td style="text-align: right; color: #000000;">${rate}</td>
          <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals Box -->
    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 320px; padding: 24px; border-radius: 8px; background-color: rgba({accentColorRGB}, 0.08);">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #374151;">
          <span>Subtotal</span>
          <span style="font-weight: 500; color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #374151;">
          <span>Tax (10%)</span>
          <span style="font-weight: 500; color: #000000;">${tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 8px; font-size: 24px; border-top: 2px solid {accentColor}; color: {primaryColor};">
          <span>Amount Due</span>
          <span>${total}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div style="margin-top: 40px; padding: 16px; border-radius: 4px; border-left: 4px solid {accentColor}; background-color: #f9fafb;">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Payment Instructions</div>
      <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
    </div>
  </div>
</div>
```

---

## 5. Elegant Template (Premium)

**ID:** `elegant`  
**Description:** Sophisticated serif typography

**EXACT HTML/CSS:**

```html
<div style="padding: 48px; font-family: Georgia, serif;">
  <!-- Centered Header -->
  <div style="text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #d1d5db;">
    <h1 style="font-size: 48px; margin: 0 0 16px 0; color: #111827;">{businessName}</h1>
    <p style="color: #4b5563; margin: 0;">{businessEmail} | {businessPhone}</p>
    <p style="font-size: 14px; color: #6b7280; margin: 8px 0 0 0; white-space: pre-line;">{businessAddress}</p>
  </div>

  <!-- Invoice To & Info -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
    <div>
      <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: #6b7280; margin-bottom: 8px;">Invoice To</div>
      <div style="font-size: 20px; margin-bottom: 8px; color: #111827;">{customerName}</div>
      <div style="font-size: 14px; color: #6b7280; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #6b7280;">{customerEmail}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 28px; margin-bottom: 8px; letter-spacing: 0.05em; color: {primaryColor};">INVOICE</div>
      <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Number: {invoiceNumber}</div>
      <div style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Date: {invoiceDate}</div>
      <div style="font-size: 14px; color: #6b7280;">Due: {dueDate}</div>
    </div>
  </div>

  <!-- Line Items -->
  <table style="width: 100%; margin-bottom: 40px; border-collapse: collapse;">
    <thead>
      <tr style="border-top: 2px solid #9ca3af; border-bottom: 2px solid #9ca3af;">
        <th style="text-align: left; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: #111827;">Description</th>
        <th style="text-align: center; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: #111827;">Quantity</th>
        <th style="text-align: right; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: #111827;">Rate</th>
        <th style="text-align: right; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: #111827;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #d1d5db;">
        <td style="padding: 16px 0;">
          <div style="font-weight: 500;">{itemName}</div>
          <div style="font-size: 14px; color: #6b7280; font-style: italic; margin-top: 4px;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #000000;">{quantity}</td>
        <td style="text-align: right; color: #000000;">${rate}</td>
        <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 384px; border-top: 2px solid #9ca3af; padding-top: 16px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #6b7280;">
        <span>Subtotal</span>
        <span style="color: #000000;">${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; color: #6b7280;">
        <span>Tax</span>
        <span style="color: #000000;">${tax}</span>
      </div>
      <div style="display: flex; justify-between; padding: 16px 0; margin-top: 8px; font-size: 24px; border-top: 2px solid #9ca3af; color: {primaryColor};">
        <span>Total Due</span>
        <span>${total}</span>
      </div>
    </div>
  </div>

  <!-- Notes -->
  <div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #d1d5db; text-align: center;">
    <p style="font-size: 14px; color: #6b7280; font-style: italic; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 6. Creative Template (Creative)

**ID:** `creative`  
**Description:** Colorful and modern with unique layout

**EXACT HTML/CSS:**

```html
<div style="padding: 40px;">
  <div style="margin-bottom: 40px; display: flex; align-items: flex-start; justify-content: space-between;">
    <div style="flex: 1;">
      <!-- Business Name Pill -->
      <div style="display: inline-block; padding: 12px 24px; border-radius: 9999px; background-color: {accentColor}; margin-bottom: 16px;">
        <h1 style="font-size: 24px; color: white; margin: 0;">{businessName}</h1>
      </div>
      <div style="font-size: 14px; color: #4b5563;">
        <div>{businessEmail}</div>
        <div>{businessPhone}</div>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 48px; margin-bottom: 8px; color: {primaryColor};">INVOICE</div>
      <div style="padding: 8px 16px; border-radius: 4px; display: inline-block; background-color: {accentColor}; color: white; font-size: 14px;">
        #{invoiceNumber}
      </div>
    </div>
  </div>

  <!-- Bill To & Details Cards -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
    <!-- Bill To Card -->
    <div style="padding: 24px; border-radius: 12px; background-color: rgba({primaryColorRGB}, 0.06);">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: {primaryColor};">Bill To</div>
      <div style="font-weight: 500; font-size: 18px; margin-bottom: 4px; color: #111827;">{customerName}</div>
      <div style="font-size: 14px; color: #1f2937; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #1f2937;">{customerEmail}</div>
    </div>
    <!-- Invoice Details Card -->
    <div style="padding: 24px; border-radius: 12px; background-color: rgba({accentColorRGB}, 0.06); text-align: right;">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: {accentColor};">Invoice Details</div>
      <div style="font-size: 14px; margin-bottom: 8px; color: #111827;">
        <span style="color: #374151;">Date:</span> {invoiceDate}
      </div>
      <div style="font-size: 14px; color: #111827;">
        <span style="color: #374151;">Due Date:</span> {dueDate}
      </div>
    </div>
  </div>

  <!-- Line Items Table -->
  <div style="border-radius: 12px; overflow: hidden; margin-bottom: 32px;">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: {primaryColor}; color: white;">
          <th style="text-align: left; padding: 16px;">Item</th>
          <th style="text-align: center; padding: 16px;">Qty</th>
          <th style="text-align: right; padding: 16px;">Rate</th>
          <th style="text-align: right; padding: 16px;">Total</th>
        </tr>
      </thead>
      <tbody>
        <!-- Alternating rows - even white, odd gray -->
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: white;">
          <td style="padding: 16px;">
            <div style="font-weight: 500;">{itemName}</div>
            <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
          </td>
          <td style="text-align: center; color: #000000;">{quantity}</td>
          <td style="text-align: right; color: #000000;">${rate}</td>
          <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: #f9fafb;">
          <td style="padding: 16px;">
            <div style="font-weight: 500;">{itemName}</div>
            <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
          </td>
          <td style="text-align: center; color: #000000;">{quantity}</td>
          <td style="text-align: right; color: #000000;">${rate}</td>
          <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 320px; padding: 24px; border-radius: 12px; background-color: rgba({accentColorRGB}, 0.08);">
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span>Subtotal</span>
        <span>${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <span>Tax</span>
        <span>${tax}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; margin-top: 8px; font-size: 20px; border-top: 2px solid {accentColor}; color: {primaryColor};">
        <span style="font-weight: 500;">Total Due</span>
        <span style="font-weight: 500;">${total}</span>
      </div>
    </div>
  </div>

  <!-- Notes -->
  <div style="margin-top: 40px; padding: 24px; border-radius: 12px; border: 2px solid {accentColor};">
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 7. Corporate Template (Professional)

**ID:** `corporate`  
**Description:** Professional with structured sections

**EXACT HTML/CSS:**

```html
<div style="padding: 40px;">
  <!-- Header with 3-column grid -->
  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid {primaryColor};">
    <div style="grid-column: span 2 / span 2; display: flex; gap: 16px;">
      <!-- Logo (64px circle) -->
      <div style="width: 64px; height: 64px; border-radius: 50%; background-color: {primaryColor}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <span style="font-size: 20px; font-weight: 700;">{initials}</span>
      </div>
      <!-- Business Info -->
      <div>
        <h1 style="font-size: 28px; margin: 0 0 16px 0; color: {primaryColor};">{businessName}</h1>
        <div style="font-size: 14px; color: #1f2937;">
          <div>{businessAddressLine1}</div>
          <div>{businessAddressLine2}</div>
          <div style="margin-top: 8px;">{businessEmail} | {businessPhone}</div>
        </div>
      </div>
    </div>
    <!-- Invoice Box -->
    <div style="text-align: right;">
      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 4px;">
        <div style="font-size: 24px; margin-bottom: 8px; color: {primaryColor};">INVOICE</div>
        <div style="font-size: 14px; color: #1f2937;">
          <div style="margin-bottom: 4px;"><strong>No:</strong> {invoiceNumber}</div>
          <div style="margin-bottom: 4px;"><strong>Date:</strong> {invoiceDate}</div>
          <div><strong>Due:</strong> {dueDate}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Invoice To -->
  <div style="margin-bottom: 32px;">
    <div style="background-color: #f9fafb; padding: 24px; border-radius: 4px;">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; color: {primaryColor};">Invoice To</div>
      <div style="font-weight: 500; font-size: 18px; margin-bottom: 4px; color: #111827;">{customerName}</div>
      <div style="font-size: 14px; color: #1f2937; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #1f2937;">{customerEmail}</div>
    </div>
  </div>

  <!-- Line Items -->
  <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f3f4f6;">
        <th style="text-align: left; padding: 16px; font-size: 14px; color: #111827;">Description</th>
        <th style="text-align: center; padding: 16px; font-size: 14px; color: #111827;">Qty</th>
        <th style="text-align: right; padding: 16px; font-size: 14px; color: #111827;">Unit Price</th>
        <th style="text-align: right; padding: 16px; font-size: 14px; color: #111827;">Line Total</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px;">
          <div style="font-weight: 500;">{itemName}</div>
          <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #000000;">{quantity}</td>
        <td style="text-align: right; color: #000000;">${rate}</td>
        <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 320px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span>Subtotal</span>
        <span style="color: #000000;">${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span>Tax (10%)</span>
        <span style="color: #000000;">${tax}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 16px; background-color: {primaryColor}; color: white; font-size: 20px;">
        <span>Total Due</span>
        <span>${total}</span>
      </div>
    </div>
  </div>

  <!-- Notes -->
  <div style="margin-top: 40px; padding: 24px; background-color: #f9fafb; border-radius: 4px;">
    <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; color: {primaryColor};">Terms & Conditions</div>
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 8. Compact Template (Professional)

**ID:** `compact`  
**Description:** Space-efficient design

**EXACT HTML/CSS:**

```html
<div style="padding: 24px;">
  <!-- Header with accent border -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid {accentColor};">
    <div>
      <h1 style="font-size: 24px; margin: 0 0 4px 0; color: #111827;">{businessName}</h1>
      <div style="font-size: 12px; color: #1f2937;">{businessEmail} • {businessPhone}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; margin-bottom: 4px; color: {primaryColor};">INVOICE</div>
      <div style="font-size: 12px; color: #1f2937;">#{invoiceNumber}</div>
    </div>
  </div>

  <!-- Bill To & Details (2 columns) -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 12px;">
    <div>
      <div style="text-transform: uppercase; color: #374151; margin-bottom: 4px;">To</div>
      <div style="font-weight: 500; margin-bottom: 4px; color: #111827;">{customerName}</div>
      <div style="color: #1f2937; white-space: pre-line;">{customerAddress}</div>
      <div style="color: #1f2937;">{customerEmail}</div>
    </div>
    <div style="text-align: right;">
      <div style="text-transform: uppercase; color: #374151; margin-bottom: 4px;">Details</div>
      <div style="margin-bottom: 4px; color: #111827;">Date: {invoiceDate}</div>
      <div style="color: #111827;">Due: {dueDate}</div>
    </div>
  </div>

  <!-- Line Items (compact table) -->
  <table style="width: 100%; margin-bottom: 24px; font-size: 12px; border-collapse: collapse;">
    <thead>
      <tr style="background-color: #f3f4f6;">
        <th style="text-align: left; padding: 8px; color: #000000;">Item</th>
        <th style="text-align: center; padding: 8px; color: #000000;">Qty</th>
        <th style="text-align: right; padding: 8px; color: #000000;">Rate</th>
        <th style="text-align: right; padding: 8px; color: #000000;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px;">
          <div style="font-weight: 500;">{itemName}</div>
          <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #000000;">{quantity}</td>
        <td style="text-align: right; color: #000000;">${rate}</td>
        <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 320px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span>Subtotal</span>
        <span style="color: #000000;">${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
        <span>Tax (10%)</span>
        <span style="color: #000000;">${tax}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; font-size: 20px; color: {primaryColor};">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  </div>

  <!-- Notes -->
  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
    <p style="font-size: 12px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 9. Sleek Template (Creative)

**ID:** `sleek`  
**Description:** Ultra-modern with subtle gradients

**EXACT HTML/CSS:**

```html
<div>
  <!-- Gradient Header with overlay -->
  <div style="height: 128px; position: relative; overflow: hidden;">
    <div style="position: absolute; inset: 0; background: linear-gradient(135deg, rgba({primaryColorRGB}, 0.87) 0%, rgba({accentColorRGB}, 0.87) 100%);"></div>
    <div style="position: relative; z-index: 10; height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; color: white;">
      <h1 style="font-size: 36px; margin: 0;">{businessName}</h1>
      <div style="text-align: right;">
        <div style="font-size: 28px; margin-bottom: 4px;">INVOICE</div>
        <div style="font-size: 14px; opacity: 0.9;">#{invoiceNumber}</div>
      </div>
    </div>
  </div>

  <div style="padding: 48px;">
    <!-- Client Details & Invoice Info -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
      <div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: #6b7280;">Client Details</div>
        <div style="font-weight: 500; font-size: 18px; margin-bottom: 8px; color: #111827;">{customerName}</div>
        <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: #6b7280;">Invoice Information</div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #4b5563;">Invoice Date:</span>
            <span style="font-weight: 500; color: #111827;">{invoiceDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #4b5563;">Due Date:</span>
            <span style="font-weight: 500; color: #111827;">{dueDate}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Line Items with gradient header -->
    <div style="border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: linear-gradient(135deg, rgba({primaryColorRGB}, 0.08) 0%, rgba({accentColorRGB}, 0.08) 100%);">
            <th style="text-align: left; padding: 16px; font-size: 14px; color: #111827;">Description</th>
            <th style="text-align: center; padding: 16px; font-size: 14px; color: #111827;">Qty</th>
            <th style="text-align: right; padding: 16px; font-size: 14px; color: #111827;">Rate</th>
            <th style="text-align: right; padding: 16px; font-size: 14px; color: #111827;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 16px;">
              <div style="font-weight: 500;">{itemName}</div>
              <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
            </td>
            <td style="text-align: center; color: #000000;">{quantity}</td>
            <td style="text-align: right; color: #000000;">${rate}</td>
            <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals with gradient background -->
    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 384px; border-radius: 8px; padding: 24px; background: linear-gradient(135deg, rgba({primaryColorRGB}, 0.06) 0%, rgba({accentColorRGB}, 0.06) 100%);">
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #374151;">Subtotal</span>
          <span style="font-weight: 500; color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #374151;">Tax (10%)</span>
          <span style="font-weight: 500; color: #000000;">${tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 16px 0; margin-top: 8px; font-size: 24px; border-top: 2px solid {accentColor}; color: {primaryColor};">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div style="margin-top: 40px; padding: 20px; border-radius: 8px; background-color: rgba({accentColorRGB}, 0.06);">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; color: {accentColor};">Notes</div>
      <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
    </div>
  </div>
</div>
```

---

## 10. Technical Template (Tech)

**ID:** `technical`  
**Description:** Grid-based tech-focused design

**EXACT HTML/CSS:**

```html
<div style="padding: 40px; font-family: 'Roboto Mono', 'Courier New', monospace;">
  <div style="border: 2px solid #d1d5db; padding: 4px; margin-bottom: 32px;">
    <div style="border: 1px solid #d1d5db; padding: 24px; background-color: {primaryColor}; color: white;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-size: 14px; margin-bottom: 4px; opacity: 0.8;">SYSTEM: {businessName}</div>
          <h1 style="font-size: 28px; margin: 0; letter-spacing: 0.05em;">INVOICE_DOCUMENT</h1>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; margin-bottom: 4px;">#{invoiceNumber}</div>
          <div style="font-size: 12px; opacity: 0.8;">STATUS: PENDING_PAYMENT</div>
        </div>
      </div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
    <div style="border: 2px solid #d1d5db; padding: 16px;">
      <div style="font-size: 12px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: {primaryColor};">CLIENT_DATA</div>
      <div style="font-weight: 500; margin-bottom: 8px; color: #111827;">{customerName}</div>
      <div style="font-size: 14px; color: #1f2937; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #1f2937;">{customerEmail}</div>
    </div>
    <div style="border: 2px solid #d1d5db; padding: 16px;">
      <div style="font-size: 12px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: {accentColor};">TEMPORAL_INFO</div>
      <div style="font-size: 14px; margin-bottom: 8px; color: #111827;">
        <span style="color: #374151;">ISSUED:</span> {invoiceDate}
      </div>
      <div style="font-size: 14px; color: #111827;">
        <span style="color: #374151;">DUE_BY:</span> {dueDate}
      </div>
    </div>
  </div>

  <div style="border: 2px solid #d1d5db; margin-bottom: 32px;">
    <div style="background-color: #f3f4f6; padding: 12px; border-bottom: 2px solid #d1d5db;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #111827;">LINE_ITEMS</div>
    </div>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid #d1d5db; background-color: #f9fafb;">
          <th style="text-align: left; padding: 12px; color: #111827;">DESCRIPTION</th>
          <th style="text-align: center; padding: 12px; color: #111827;">QTY</th>
          <th style="text-align: right; padding: 12px; color: #111827;">RATE</th>
          <th style="text-align: right; padding: 12px; color: #111827;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #d1d5db;">
          <td style="padding: 12px;">
            <div style="font-weight: 500; color: #111827;">{itemName}</div>
            <div style="font-size: 12px; color: #374151;">{itemDescription}</div>
          </td>
          <td style="text-align: center; color: #000000;">{quantity}</td>
          <td style="text-align: right; color: #000000;">${rate}</td>
          <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 384px; border: 2px solid #d1d5db;">
      <div style="padding: 16px; border-bottom: 1px solid #d1d5db;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
          <span>SUBTOTAL:</span>
          <span style="color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <span>TAX_AMOUNT:</span>
          <span style="color: #000000;">${tax}</span>
        </div>
      </div>
      <div style="padding: 16px; font-size: 20px; background-color: {primaryColor}; color: white;">
        <div style="display: flex; justify-content: space-between;">
          <span>TOTAL_DUE:</span>
          <span style="letter-spacing: 0.05em;">${total}</span>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 32px; border: 2px solid #d1d5db; padding: 16px;">
    <div style="font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em; color: {primaryColor};">ADDITIONAL_INFO</div>
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 11. Startup Template (Tech)

**ID:** `startup`  
**Description:** Fresh and energetic style

**EXACT HTML/CSS:**

```html
<div style="padding: 40px;">
  <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 40px;">
    <div style="display: flex; align-items: center; gap: 16px;">
      <!-- Logo (64px circle) -->
      <div style="width: 64px; height: 64px; border-radius: 50%; background-color: {accentColor}; color: white; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 20px; font-weight: 700;">{initials}</span>
      </div>
      <div>
        <h1 style="font-size: 36px; margin: 0 0 8px 0; color: {primaryColor};">{businessName}</h1>
        <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: #4b5563;">
          <span>{businessEmail}</span>
          <span>•</span>
          <span>{businessPhone}</span>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <div style="display: inline-block; padding: 8px 24px; border-radius: 9999px; margin-bottom: 8px; background-color: {accentColor}; color: white;">
        <div style="font-size: 24px;">INVOICE</div>
      </div>
      <div style="font-size: 14px; color: #4b5563;">#{invoiceNumber}</div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 40px;">
    <div style="border-radius: 16px; padding: 24px; background-color: rgba({primaryColorRGB}, 0.03); border-left: 4px solid {primaryColor};">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: {primaryColor};">Billing To</div>
      <div style="font-weight: 500; font-size: 18px; margin-bottom: 8px; color: #111827;">{customerName}</div>
      <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
    </div>
    <div style="border-radius: 16px; padding: 24px; background-color: rgba({accentColorRGB}, 0.03); border-left: 4px solid {accentColor};">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: {accentColor};">Invoice Info</div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #4b5563;">Issue Date:</span>
          <span style="font-weight: 500; color: #111827;">{invoiceDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #4b5563;">Due Date:</span>
          <span style="font-weight: 500; color: #111827;">{dueDate}</span>
        </div>
      </div>
    </div>
  </div>

  <div style="border-radius: 16px; overflow: hidden; margin-bottom: 32px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: {primaryColor}; color: white;">
          <th style="text-align: left; padding: 16px;">Service</th>
          <th style="text-align: center; padding: 16px;">Qty</th>
          <th style="text-align: right; padding: 16px;">Rate</th>
          <th style="text-align: right; padding: 16px;">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e5e7eb; background-color: white;">
          <td style="padding: 16px;">
            <div style="font-weight: 500;">{itemName}</div>
            <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
          </td>
          <td style="text-align: center; color: #000000;">{quantity}</td>
          <td style="text-align: right; color: #000000;">${rate}</td>
          <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 384px; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
      <div style="padding: 24px; background-color: white;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #4b5563;">Subtotal</span>
          <span style="color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #4b5563;">Tax</span>
          <span style="color: #000000;">${tax}</span>
        </div>
      </div>
      <div style="padding: 24px; font-size: 24px; background-color: {accentColor}; color: white;">
        <div style="display: flex; justify-content: space-between;">
          <span>Amount Due</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; padding: 24px; border-radius: 16px; background-color: rgba({accentColorRGB}, 0.03);">
    <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; color: {accentColor};">Payment Terms</div>
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 12. Luxury Template (Premium)

**ID:** `luxury`  
**Description:** Premium gold accents

**EXACT HTML/CSS:**

```html
<div style="padding: 48px; font-family: Georgia, serif; background-color: #fafaf8;">
  <div style="text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 2px solid {accentColor};">
    <div style="margin-bottom: 16px;">
      <!-- Logo (80px circle) -->
      <div style="width: 80px; height: 80px; margin: 0 auto 12px; border-radius: 50%; background-color: {accentColor}; display: flex; align-items: center; justify-content: center;">
        <div style="font-size: 28px; color: white;">{businessInitial}</div>
      </div>
    </div>
    <h1 style="font-size: 36px; margin: 0 0 12px 0; letter-spacing: 0.05em; color: {primaryColor};">{businessName}</h1>
    <div style="font-size: 14px; color: {accentColor};">{businessEmail} • {businessPhone}</div>
  </div>

  <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
    <div>
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; color: {accentColor};">Client</div>
      <div style="font-size: 20px; margin-bottom: 8px; color: #000000;">{customerName}</div>
      <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
      <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 36px; margin-bottom: 12px; letter-spacing: 0.05em; color: {accentColor};">INVOICE</div>
      <div style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">Number: {invoiceNumber}</div>
      <div style="font-size: 14px; color: #4b5563; margin-bottom: 4px;">Date: {invoiceDate}</div>
      <div style="font-size: 14px; color: #4b5563;">Due: {dueDate}</div>
    </div>
  </div>

  <table style="width: 100%; margin-bottom: 40px; border-collapse: collapse;">
    <thead>
      <tr style="border-top: 2px solid {accentColor}; border-bottom: 2px solid {accentColor};">
        <th style="text-align: left; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: {accentColor};">Description</th>
        <th style="text-align: center; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: {accentColor};">Qty</th>
        <th style="text-align: right; padding: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: {accentColor};">Rate</th>
        <th style="text-align: right; padding: 16px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em; color: {accentColor};">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e5e0;">
        <td style="padding: 16px 0;">
          <div style="font-weight: 500;">{itemName}</div>
          <div style="font-size: 14px; color: #4b5563; font-style: italic;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #000000;">{quantity}</td>
        <td style="text-align: right; color: #000000;">${rate}</td>
        <td style="text-align: right; font-weight: 500; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 384px;">
      <div style="border-top: 2px solid {accentColor}; border-bottom: 2px solid {accentColor}; padding: 16px 0;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #374151;">Subtotal</span>
          <span style="color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #374151;">Tax</span>
          <span style="color: #000000;">${tax}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 20px 0; font-size: 28px; color: {accentColor};">
        <span>Total</span>
        <span>${total}</span>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid {accentColor}; text-align: center;">
    <p style="font-size: 14px; color: #4b5563; font-style: italic; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 13. Contemporary Template (Creative)

**ID:** `contemporary`  
**Description:** Modern with asymmetric elements

**EXACT HTML/CSS:**

```html
<div style="padding: 40px;">
  <div style="margin-bottom: 40px;">
    <div style="display: flex; align-items: flex-start; gap: 32px;">
      <div style="flex: 1;">
        <h1 style="font-size: 48px; margin: 0 0 8px 0; color: {primaryColor};">{businessName}</h1>
        <div style="font-size: 14px; color: #4b5563;">{businessEmail} • {businessPhone}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 28px; line-height: 1; margin-bottom: 8px; color: #4b5563;">INVOICE</div>
        <div style="font-size: 14px; color: #4b5563;">#{invoiceNumber}</div>
      </div>
    </div>
  </div>

  <div style="position: relative; margin-bottom: 40px;">
    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: {accentColor};"></div>
    <div style="padding-left: 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
      <div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: #6b7280;">Client Information</div>
        <div style="font-weight: 500; font-size: 20px; margin-bottom: 8px; color: #111827;">{customerName}</div>
        <div style="font-size: 14px; color: #4b5563; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #4b5563;">{customerEmail}</div>
      </div>
      <div>
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: #6b7280;">Invoice Details</div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #4b5563;">Date Issued:</span>
            <span style="font-weight: 500; color: #111827;">{invoiceDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #4b5563;">Payment Due:</span>
            <span style="font-weight: 500; color: #111827;">{dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <table style="width: 100%; margin-bottom: 40px; border-collapse: collapse;">
    <thead>
      <tr style="border-bottom: 2px solid {primaryColor};">
        <th style="text-align: left; padding: 16px 0; color: #111827;">Item Description</th>
        <th style="text-align: center; padding: 16px; color: #111827;">Quantity</th>
        <th style="text-align: right; padding: 16px; color: #111827;">Unit Price</th>
        <th style="text-align: right; padding: 16px 0; color: #111827;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 16px 0;">
          <div style="font-weight: 500; font-size: 18px;">{itemName}</div>
          <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
        </td>
        <td style="text-align: center; color: #000000;">{quantity}</td>
        <td style="text-align: right; color: #000000;">${rate}</td>
        <td style="text-align: right; font-weight: 500; font-size: 18px; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <div style="display: flex; justify-content: flex-end;">
    <div style="width: 384px; position: relative;">
      <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 4px; background-color: {accentColor};"></div>
      <div style="padding-right: 24px;">
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #4b5563;">Subtotal</span>
          <span style="font-size: 18px; color: #000000;">${subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
          <span style="color: #4b5563;">Tax (10%)</span>
          <span style="font-size: 18px; color: #000000;">${tax}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 16px 0; font-size: 28px; color: {primaryColor};">
          <span>Total Due</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; padding: 24px; border-left: 4px solid {accentColor}; background-color: rgba({accentColorRGB}, 0.03);">
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 14. Traditional Template (Professional)

**ID:** `traditional`  
**Description:** Formal business document style

**EXACT HTML/CSS:**

```html
<div style="padding: 48px;">
  <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #9ca3af;">
    <!-- Logo (80px circle) -->
    <div style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; overflow: hidden;">
      <div style="width: 100%; height: 100%; background-color: {primaryColor}; color: white; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: 700;">
        {initials}
      </div>
    </div>
    <h1 style="font-size: 36px; margin: 0 0 12px 0; color: {primaryColor};">{businessName}</h1>
    <div style="font-size: 14px; color: #1f2937;">
      <div>{businessAddressLine1}, {businessAddressLine2}</div>
      <div style="margin-top: 4px;">Tel: {businessPhone} | Email: {businessEmail}</div>
    </div>
  </div>

  <div style="text-align: center; margin-bottom: 32px;">
    <h2 style="font-size: 28px; margin: 0; color: {primaryColor};">INVOICE</h2>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
    <div>
      <div style="background-color: #f3f4f6; padding: 16px;">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Invoice To:</div>
        <div style="font-weight: 500; font-size: 18px; margin-bottom: 4px; color: #111827;">{customerName}</div>
        <div style="font-size: 14px; color: #1f2937; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #1f2937;">{customerEmail}</div>
      </div>
    </div>
    <div>
      <div style="background-color: #f3f4f6; padding: 16px;">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; color: {primaryColor};">Invoice Details:</div>
        <div style="font-size: 14px; color: #111827;">
          <div style="margin-bottom: 4px;"><strong>Invoice Number:</strong> {invoiceNumber}</div>
          <div style="margin-bottom: 4px;"><strong>Invoice Date:</strong> {invoiceDate}</div>
          <div><strong>Due Date:</strong> {dueDate}</div>
        </div>
      </div>
    </div>
  </div>

  <table style="width: 100%; margin-bottom: 32px; border-collapse: collapse; border: 1px solid #9ca3af;">
    <thead>
      <tr style="background-color: rgba({primaryColorRGB}, 0.08);">
        <th style="border: 1px solid #9ca3af; padding: 12px; text-align: left; color: #1f2937;">Description of Services</th>
        <th style="border: 1px solid #9ca3af; padding: 12px; text-align: center; color: #1f2937;">Qty</th>
        <th style="border: 1px solid #9ca3af; padding: 12px; text-align: right; color: #1f2937;">Unit Price</th>
        <th style="border: 1px solid #9ca3af; padding: 12px; text-align: right; color: #1f2937;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #9ca3af; padding: 12px;">
          <div style="font-weight: 500;">{itemName}</div>
          <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
        </td>
        <td style="border: 1px solid #9ca3af; padding: 12px; text-align: center; color: #000000;">{quantity}</td>
        <td style="border: 1px solid #9ca3af; padding: 12px; text-align: right; color: #000000;">${rate}</td>
        <td style="border: 1px solid #9ca3af; padding: 12px; text-align: right; font-weight: 500; color: #000000;">${total}</td>
      </tr>
    </tbody>
  </table>

  <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
    <div style="width: 320px; border: 1px solid #9ca3af;">
      <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #9ca3af;">
        <span style="font-weight: 500; color: #1f2937;">Subtotal:</span>
        <span style="color: #000000;">${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #9ca3af;">
        <span style="font-weight: 500; color: #1f2937;">Tax (10%):</span>
        <span style="color: #000000;">${tax}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px; font-size: 20px; background-color: rgba({primaryColorRGB}, 0.08);">
        <span style="font-weight: 500;">Total Amount Due:</span>
        <span style="color: {primaryColor};">${total}</span>
      </div>
    </div>
  </div>

  <div style="border: 1px solid #9ca3af; padding: 16px;">
    <div style="font-weight: 500; margin-bottom: 8px; color: {primaryColor};">Terms and Conditions:</div>
    <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
  </div>
</div>
```

---

## 15. Vibrant Template (Creative)

**ID:** `vibrant`  
**Description:** Colorful and eye-catching

**EXACT HTML/CSS:**

```html
<div>
  <div style="position: relative; height: 160px; overflow: hidden; background: linear-gradient(135deg, {primaryColor} 0%, {accentColor} 50%, #F59E0B 100%);">
    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; color: white;">
      <div>
        <h1 style="font-size: 36px; margin: 0 0 8px 0;">{businessName}</h1>
        <div style="font-size: 14px; opacity: 0.9;">{businessEmail} • {businessPhone}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 48px; margin-bottom: 8px;">INVOICE</div>
        <div style="padding: 4px 16px; background-color: rgba(255, 255, 255, 0.2); border-radius: 9999px; display: inline-block;">#{invoiceNumber}</div>
      </div>
    </div>
  </div>

  <div style="padding: 48px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px;">
      <div style="padding: 24px; border-radius: 16px; background: linear-gradient(135deg, rgba({primaryColorRGB}, 0.08) 0%, rgba({accentColorRGB}, 0.08) 100%);">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: {primaryColor};">Bill To</div>
        <div style="font-weight: 500; font-size: 20px; margin-bottom: 8px;">{customerName}</div>
        <div style="font-size: 14px; color: #374151; white-space: pre-line;">{customerAddress}</div>
        <div style="font-size: 14px; color: #374151;">{customerEmail}</div>
      </div>
      <div style="padding: 24px; border-radius: 16px; background-color: #FEF3C7;">
        <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; color: #92400e;">Invoice Information</div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #374151;">Date:</span>
            <span style="font-weight: 500;">{invoiceDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #374151;">Due Date:</span>
            <span style="font-weight: 500;">{dueDate}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px rgba(0,0,0,0.1); margin-bottom: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: linear-gradient(135deg, {primaryColor} 0%, {accentColor} 100%); color: white;">
            <th style="text-align: left; padding: 16px;">Description</th>
            <th style="text-align: center; padding: 16px;">Qty</th>
            <th style="text-align: right; padding: 16px;">Rate</th>
            <th style="text-align: right; padding: 16px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: white;">
            <td style="padding: 16px;">
              <div style="font-weight: 500; font-size: 18px;">{itemName}</div>
              <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
            </td>
            <td style="text-align: center; color: #000000;">{quantity}</td>
            <td style="text-align: right; color: #000000;">${rate}</td>
            <td style="text-align: right; font-weight: 500; font-size: 18px; color: #000000;">${total}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb; background-color: #fafafa;">
            <td style="padding: 16px;">
              <div style="font-weight: 500; font-size: 18px;">{itemName}</div>
              <div style="font-size: 14px; color: #4b5563;">{itemDescription}</div>
            </td>
            <td style="text-align: center; color: #000000;">{quantity}</td>
            <td style="text-align: right; color: #000000;">${rate}</td>
            <td style="text-align: right; font-weight: 500; font-size: 18px; color: #000000;">${total}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: flex-end;">
      <div style="width: 384px; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px rgba(0,0,0,0.1);">
        <div style="padding: 24px; background-color: white;">
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 18px;">
            <span style="color: #374151;">Subtotal</span>
            <span style="font-weight: 500; color: #000000;">${subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 18px;">
            <span style="color: #374151;">Tax (10%)</span>
            <span style="font-weight: 500; color: #000000;">${tax}</span>
          </div>
        </div>
        <div style="padding: 24px; font-size: 28px; color: white; background: linear-gradient(135deg, {primaryColor} 0%, {accentColor} 100%);">
          <div style="display: flex; justify-content: space-between;">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 40px; padding: 24px; border-radius: 16px; background: linear-gradient(135deg, rgba({accentColorRGB}, 0.06) 0%, #FEF3C7 100%);">
      <div style="font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; color: {accentColor};">Payment Notes</div>
      <p style="font-size: 14px; color: #374151; margin: 0;">{notes}</p>
    </div>
  </div>
</div>
```

---

## Implementation Notes

### Converting Color Variables to rgba()

For templates using rgba colors (like `rgba({primaryColorRGB}, 0.08)`), convert hex to RGB:

**Example:**

- Input: `#1E3A8A` (hex)
- RGB: `30, 58, 138`
- Usage: `rgba(30, 58, 138, 0.08)`

**Common Opacity Values:**

- `0.03` = 3% opacity
- `0.06` = 6% opacity
- `0.08` = 8% opacity
- `0.87` = 87% opacity (used in Sleek template)

### Preview Rendering

1. **Container Setup:**

   ```css
   .preview-container {
     width: 100%;
     max-width: 816px; /* A4 at 96 DPI */
     aspect-ratio: 1 / 1.414; /* A4 aspect ratio */
   }
   ```

2. **Responsive Scaling:**

   ```css
   .preview-content {
     transform-origin: top left;
     transform: scale(var(--scale));
     width: 816px;
   }
   ```

3. **Color Application:**
   - Replace `{primaryColor}` with user's brand color
   - Replace `{accentColor}` with user's accent color
   - Handle rgba conversions as described above

---

**Document Version:** 2.0  
**Last Updated:** November 22, 2025  
**Source:** Extracted from BilltUp mobile app React components  
**For:** Website Implementation Team