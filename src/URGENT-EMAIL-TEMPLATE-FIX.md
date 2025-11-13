# 🚨 URGENT: Email Template Fix Required

## Problem
The emails being sent don't match the Modern template brand preview because the server-side `generateInvoicePDF` function hasn't been updated.

## Solution
You need to manually update the function in `/supabase/functions/server/index.tsx`

### Steps:

1. **Open** `/supabase/functions/server/index.tsx`

2. **Find** the `generateInvoicePDF` function (around line 2467-2699)

3. **Replace the entire function** with the code in `/updated-generateInvoicePDF.ts`

4. **Redeploy** your Supabase Edge Function

### Quick Fix Command:
```bash
# If using Supabase CLI
supabase functions deploy server
```

## What This Fixes:
✅ Modern template will show clean layout with left accent bar (like your brand preview)
✅ Removes business address from Modern template  
✅ Uses correct brand colors and accent colors
✅ Adds support for Classic and Minimal templates
✅ Uses contactEmail for support section

## Current Issue:
- ❌ Email shows old table-based layout with blue header
- ❌ Shows business address at top
- ❌ Doesn't match Modern template brand preview

## After Fix:
- ✅ Email will match Modern template exactly
- ✅ Clean design with teal accent bar on left
- ✅ No address in Modern template
- ✅ Proper brand colors applied
