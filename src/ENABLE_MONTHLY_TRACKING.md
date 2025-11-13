# How to Enable Monthly Invoice Tracking

## ✅ Errors Fixed!

The 404 errors are now gone. The monthly invoice tracking feature is disabled until you deploy the backend.

---

## 🚀 To Enable the Feature (2 Steps)

### Step 1: Deploy Backend (2 minutes)

**Mac/Linux:**
```bash
chmod +x deploy-backend.sh
./deploy-backend.sh
```

**Windows:**
```bash
deploy-backend.bat
```

**Or manually:**
```bash
npx supabase functions deploy server
```

---

### Step 2: Uncomment Frontend Code (30 seconds)

**Edit `/components/Dashboard.tsx`:**

Find this section (around line 43):

```typescript
// Fetch monthly invoice count on mount
useEffect(() => {
  // TEMPORARILY DISABLED - Deploy backend first to enable
  // Run: ./deploy-backend.sh to deploy the new endpoint
  // Then uncomment this code to enable monthly invoice tracking
  
  /*
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
      // Silently fail if endpoint not available (backend not deployed yet)
      console.log('Monthly invoice count not available yet. Deploy backend to enable.');
    }
  };
  
  fetchMonthlyCount();
  */
}, [invoices.length]); // Refetch when invoices change
```

**Replace with:**

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
}, [invoices.length]); // Refetch when invoices change
```

---

## ✅ What You'll See

After enabling, the dashboard will show:

**4th Stat Card:**
```
┌─────────────────────────┐
│  📄                     │
│  This Billing Month     │
│  15                     │ ← Invoice count
│  18 days left           │ ← Days remaining
└─────────────────────────┘
```

**Billing Period Info:**
```
┌──────────────────────────────────────────────────────┐
│ Current billing period: Jan 15, 2025 – Feb 14, 2025 │
└──────────────────────────────────────────────────────┘
```

---

## 🔍 How It Works

**Billing Cycle:**
- Based on account creation date (anniversary billing)
- NOT calendar months
- Auto-resets on your monthly anniversary

**Example:**
```
Account created: January 15, 2025

Month 1: Jan 15 – Feb 14  (31 days)
Month 2: Feb 15 – Mar 14  (28 days)
Month 3: Mar 15 – Apr 14  (31 days)
```

**Features:**
- Tracks invoices created (not paid)
- Shows billing period dates
- Displays days remaining
- Auto-resets counter each month
- Works for existing and new users

---

## 📝 Current Status

✅ **Backend code:** Ready (just needs deployment)  
✅ **Frontend code:** Ready (just commented out)  
✅ **Errors:** Fixed (no more 404s)  
✅ **App:** Fully functional  

⏳ **Waiting for:** Backend deployment

---

## 🎯 Quick Deploy Checklist

- [ ] Run `./deploy-backend.sh` (or `deploy-backend.bat`)
- [ ] Wait for "Deployed successfully" message
- [ ] Uncomment the code in Dashboard.tsx (Step 2 above)
- [ ] Refresh your app
- [ ] Check dashboard for monthly count
- [ ] Create an invoice to test counter increment

**Time:** ~3 minutes total

---

## 🛠️ Troubleshooting

**Deployment fails?**
See [DEPLOY_BACKEND_NOW.md](./DEPLOY_BACKEND_NOW.md) for detailed troubleshooting.

**Counter not showing?**
Make sure you uncommented the code in Step 2.

**Still shows "—"?**
Hard refresh the page (Ctrl+F5 or Cmd+Shift+R).

---

## 📚 More Info

- **Feature docs:** [MONTHLY_INVOICE_TRACKING.md](./MONTHLY_INVOICE_TRACKING.md)
- **Deploy guide:** [DEPLOY_BACKEND_NOW.md](./DEPLOY_BACKEND_NOW.md)
- **Error fix summary:** [ERROR_FIX_SUMMARY.md](./ERROR_FIX_SUMMARY.md)

---

## ✅ Summary

**Current state:** Feature disabled, no errors  
**To enable:** Deploy backend + uncomment code  
**Time needed:** 3 minutes  
**Difficulty:** Easy  

---

*The feature is ready to go - just waiting for you to deploy!* 🚀
