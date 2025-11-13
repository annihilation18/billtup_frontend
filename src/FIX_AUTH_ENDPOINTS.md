# Quick Fix for Auth Endpoints

## Problem
All endpoints using `await requireAuth(c, async () => {});` have a bug where if auth fails, they continue executing instead of returning the error.

## Solution
Replace all instances with the `checkAuth` pattern:

### OLD (Broken):
```typescript
app.get("/endpoint", async (c) => {
  await requireAuth(c, async () => {});
  const userId = c.get('userId');
```

### NEW (Fixed):
```typescript
app.get("/endpoint", async (c) => {
  const auth = await checkAuth(c);
  if ('error' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }
  const userId = auth.userId;
```

## Endpoints to Fix

All of these need the same replacement pattern:

1. ✅ `/account/delete` - FIXED
2. ✅ `/business` GET - FIXED  
3. ✅ `/business` PATCH - FIXED
4. ✅ `/business/logo` POST - FIXED
5. ✅ `/subscription/status` GET - FIXED
6. ✅ `/subscription/cancel` POST - FIXED
7. `/stripe/oauth-url` GET
8. `/stripe/account-status` GET
9. `/stripe/refresh-onboarding` POST
10. `/stripe/disconnect` POST
11. `/invoices` POST
12. `/invoices` GET
13. `/invoices/:id` GET
14. `/invoices/:id` PATCH
15. `/invoices/:id/signature` PATCH
16. `/invoices/:id` DELETE
17. `/customers` POST
18. `/customers` GET
19. `/customers/:id` GET
20. `/customers/:id` PATCH
21. `/customers/:id` DELETE
22. `/payments/create-intent` POST
23. `/payments/confirm` POST
24. `/payments/nfc` POST
25. `/payments/refund` POST
26. `/invoices/send-email` POST
27. `/analytics/sales` GET
28. `/analytics/revenue-chart` GET
29. `/analytics/monthly-invoice-count` GET
30. `/user/export` GET
31. `/user/account` DELETE

## Batch Fix Command

You can use this sed command (Linux/Mac):

```bash
sed -i 's/await requireAuth(c, async () => {});/const auth = await checkAuth(c);\n  if ('\''error'\'' in auth) {\n    return c.json({ error: auth.error }, auth.status);\n  }/g' /supabase/functions/server/index.tsx
sed -i 's/const userId = c.get('\''userId'\'');/const userId = auth.userId;/g' /supabase/functions/server/index.tsx
```

For Windows PowerShell:
```powershell
(Get-Content /supabase/functions/server/index.tsx) -replace 'await requireAuth\(c, async \(\) => {}\);', 'const auth = await checkAuth(c);
  if (''error'' in auth) {
    return c.json({ error: auth.error }, auth.status);
  }' | Set-Content /supabase/functions/server/index.tsx

(Get-Content /supabase/functions/server/index.tsx) -replace 'const userId = c.get\(''userId''\);', 'const userId = auth.userId;' | Set-Content /supabase/functions/server/index.tsx
```

## Status
- First 6 endpoints: ✅ FIXED
- Remaining 25 endpoints: Need fixing
