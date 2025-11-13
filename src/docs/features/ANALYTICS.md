# Analytics & Sales Tracking

Dashboard analytics and reporting features in BilltUp.

---

## Overview

BilltUp provides real-time sales analytics to help you track business performance:

- ✅ Month-to-Date (MTD) revenue
- ✅ Year-to-Date (YTD) revenue
- ✅ Pending payments tracking
- ✅ Monthly invoice counter (anniversary billing)
- ✅ Revenue charts
- ✅ Invoice statistics

---

## Dashboard Statistics

### 1. Monthly Sales 📅

**Shows:** Total revenue from paid invoices in current calendar month

**Color:** Deep Blue (#1E3A8A)

**Calculation:**
```typescript
// All paid invoices where:
// invoice.date.month === currentMonth
// AND invoice.date.year === currentYear
// Sum up invoice.total
```

**Example:**  
If today is November 15, 2025, this shows all paid invoices from November 1-15, 2025.

---

### 2. Year-to-Date Sales 📈

**Shows:** Total revenue from all paid invoices in current calendar year

**Color:** Teal (#14B8A6)

**Calculation:**
```typescript
// All paid invoices where:
// invoice.date.year === currentYear
// Sum up invoice.total
```

**Example:**  
If today is November 15, 2025, this shows all paid invoices from January 1 - November 15, 2025.

---

### 3. Pending Payments 💰

**Shows:** Total value of all unpaid/pending invoices

**Color:** Amber (#F59E0B)

**Purpose:** Track outstanding payments owed to your business

**Calculation:**
```typescript
// All invoices where:
// invoice.status === "pending"
// Sum up invoice.total
```

---

### 4. Monthly Invoice Counter 📄 **NEW**

**Shows:** Number of invoices created in current billing month

**Color:** Purple/Primary

**Billing Cycle:** Anniversary-based (not calendar month)

**Displays:**
- Invoice count for current billing month
- Billing period dates
- Days remaining in billing period

**Example:**
```
This Billing Month
15 invoices
18 days left

Billing period: Nov 1 - Nov 30, 2025
```

---

## Monthly Invoice Tracking

### Anniversary Billing

Unlike MTD/YTD which use calendar months, the monthly invoice counter uses **anniversary billing** based on account creation date.

**Example:**
```
Account created: January 15, 2025

Month 1: Jan 15 – Feb 14  (31 days)
Month 2: Feb 15 – Mar 14  (28 days)
Month 3: Mar 15 – Apr 14  (31 days)
...
```

### How It Works

1. **Backend tracks:**
   - Account creation date
   - Invoices created within current billing period
   - Auto-resets counter on monthly anniversary

2. **Frontend displays:**
   - Current month's invoice count
   - Billing period dates (start → end)
   - Days remaining in billing period

### Enabling the Feature

The monthly invoice tracking feature is **currently disabled** in the frontend to avoid 404 errors until backend is deployed.

**To enable after backend deployment:**

Edit `/components/Dashboard.tsx` and uncomment this code (around line 43):

```typescript
// Fetch monthly invoice count on mount
useEffect(() => {
  const fetchMonthlyCount = async () => {
    try {
      const response: any = await analyticsApi.getMonthlyInvoiceCount();
      if (response?.success && response?.invoiceCount !== undefined) {
        setMonthlyInvoiceCount({
          invoiceCount: response.invoiceCount,
          billingPeriod: response.billingPeriod
        });
      }
    } catch (error) {
      console.log('Failed to fetch monthly invoice count:', error);
    }
  };
  
  fetchMonthlyCount();
}, [invoices.length]);
```

**See:** `/ENABLE_MONTHLY_TRACKING.md` for detailed instructions.

---

## Real-Time Updates

Statistics update automatically when:
- ✅ New invoice created and saved
- ✅ Invoice status changes (pending → paid)
- ✅ Dashboard is loaded or refreshed
- ✅ User navigates between tabs

**Implementation:**
- Uses React's `useMemo` hook for efficient calculation
- Recalculates only when `invoices` array changes
- Avoids unnecessary re-renders

---

## Revenue Charts

### Monthly Revenue Chart

Shows revenue by month for the current year.

**Data Points:**
```json
[
  { "name": "Jan", "revenue": 3250.00 },
  { "name": "Feb", "revenue": 4180.50 },
  { "name": "Mar", "revenue": 2890.00 },
  ...
]
```

**API Endpoint:**
```typescript
GET /analytics/revenue-chart?period=monthly&year=2025
```

---

### Yearly Revenue Chart

Shows revenue by year for historical comparison.

**Data Points:**
```json
[
  { "name": "2023", "revenue": 45000.00 },
  { "name": "2024", "revenue": 58000.00 },
  { "name": "2025", "revenue": 62000.00 }
]
```

**API Endpoint:**
```typescript
GET /analytics/revenue-chart?period=yearly
```

---

## Sales Summary API

### Endpoint

**GET** `/analytics/sales-summary`

### Response

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

---

## Business Logic

### Monthly Calculation

```typescript
const monthlyTotal = invoices
  .filter(inv => {
    const invDate = parseDate(inv.date);
    return inv.status === 'paid' &&
           invDate.getMonth() === currentMonth &&
           invDate.getFullYear() === currentYear;
  })
  .reduce((sum, inv) => sum + inv.total, 0);
```

### YTD Calculation

```typescript
const ytdTotal = invoices
  .filter(inv => {
    const invDate = parseDate(inv.date);
    return inv.status === 'paid' &&
           invDate.getFullYear() === currentYear;
  })
  .reduce((sum, inv) => sum + inv.total, 0);
```

### Pending Calculation

```typescript
const pendingTotal = invoices
  .filter(inv => inv.status === 'pending')
  .reduce((sum, inv) => sum + inv.total, 0);
```

---

## Visual Design

Each statistics card features:
- **Gradient background** matching the metric's color theme
- **Icon badge** with metric icon in white on colored background
- **Label** describing the metric
- **Large amount** displayed in monospace font
- **Responsive layout** - stacks on mobile, row on desktop/tablet

**CSS Classes:**
```tsx
<div className="rounded-xl bg-gradient-to-br from-deep-blue to-primary p-6">
  <div className="flex items-center gap-4">
    <div className="rounded-lg bg-white/20 p-3">
      <CalendarIcon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-white/90">Monthly Sales</p>
      <p className="font-mono text-white">${monthlyTotal.toFixed(2)}</p>
    </div>
  </div>
</div>
```

---

## Use Cases

### 1. Monthly Performance Tracking

Monitor current month progress:
- Set monthly revenue targets
- Track toward goals
- Identify slow periods needing marketing

### 2. Year-to-Date Growth

View cumulative annual performance:
- Compare to previous years
- Track toward annual goals
- Show investors/stakeholders growth

### 3. Cash Flow Management

Use Pending Payment metric to:
- Identify outstanding invoices
- Forecast upcoming cash inflows
- Prioritize collection efforts

### 4. Usage Tracking

Monthly invoice counter helps:
- Track app usage
- Plan for tier-based pricing
- Monitor business activity

---

## Future Enhancements

Consider adding:
- [ ] Monthly comparison (% change vs. last month)
- [ ] Goal tracking with progress bars
- [ ] Charts/graphs for visual trends
- [ ] Export reports (PDF/CSV)
- [ ] Custom date ranges
- [ ] Tax breakdown reports
- [ ] Average invoice value
- [ ] Customer lifetime value

---

## Technical Details

### Component Location

**File:** `/components/Dashboard.tsx`

**Section:** Sales Statistics Cards (rendered before search bar)

### State Management

```typescript
// Calculate statistics using useMemo
const { monthlyTotal, ytdTotal, pendingTotal } = useMemo(() => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate MTD
  const monthly = invoices
    .filter(/* month filter */)
    .reduce(/* sum */, 0);

  // Calculate YTD
  const ytd = invoices
    .filter(/* year filter */)
    .reduce(/* sum */, 0);

  // Calculate Pending
  const pending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce(/* sum */, 0);

  return { monthlyTotal: monthly, ytdTotal: ytd, pendingTotal: pending };
}, [invoices]);
```

### Responsive Design

```css
/* Mobile (< 768px): Stack vertically */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet/Desktop (≥ 768px): 3-column grid */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## API Reference

See [Architecture → API](../architecture/API.md) for complete analytics endpoint documentation.

**Key Endpoints:**
- `GET /analytics/sales-summary` - Get MTD/YTD statistics
- `GET /analytics/revenue-chart` - Get chart data
- `GET /analytics/monthly-invoice-count` - Get billing period count

---

## Benefits

✅ **Instant insights** - See business performance at a glance  
✅ **No manual calculation** - Automatically computed from invoice data  
✅ **Real-time updates** - Always shows current accurate totals  
✅ **Professional appearance** - Polished, modern dashboard  
✅ **Mobile-friendly** - Works perfectly on phones and tablets  
✅ **Motivational** - Visual feedback encourages continued use  
✅ **Business intelligence** - Make data-driven decisions  

---

**Last Updated:** November 11, 2025  
**Version:** 1.5.0  
**Status:** Production Ready (Monthly tracking pending backend deployment)
