# 🚀 DEPLOY EMAIL TEMPLATE UPDATES

## The Issue
The email template updates have been made to your local code files, but **they haven't been deployed to your live Supabase server yet**. That's why the emails still look the same!

## ✅ Code Changes Made (Local Files)
1. ✅ Created `/supabase/functions/server/email-templates.ts` with all 3 templates
2. ✅ Updated `/supabase/functions/server/index.tsx` to use new templates
3. ✅ Updated frontend components (InvoicePDFPreview, CustomBrandingSection)

## 🚀 DEPLOYMENT REQUIRED

You need to deploy the updated server code to Supabase. Here's how:

### Option 1: Use the Deployment Script (Easiest)

**On Mac/Linux:**
```bash
./deploy-backend.sh
```

**On Windows:**
```bash
deploy-backend.bat
```

### Option 2: Manual Deployment

```bash
npx supabase functions deploy server
```

### First Time Setup?

If you haven't deployed before, you may need to:

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   npx supabase login
   ```

3. **Link your project** (if not already linked):
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   
   You can find your project ref in your Supabase dashboard URL:
   `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

4. **Then deploy**:
   ```bash
   npx supabase functions deploy server
   ```

## After Deployment

Once deployed (should take 30-60 seconds):

1. ✅ Refresh your BilltUp app
2. ✅ Go to Settings > Custom Branding (verify your settings are saved)
3. ✅ Create a test invoice
4. ✅ Send it to yourself via email
5. ✅ The email will now match your brand preview exactly!

## What Will Change

**Before Deployment (Current):**
- ❌ Emails use old blue table header layout
- ❌ Shows business address at top
- ❌ Doesn't use custom brand colors
- ❌ Doesn't match brand preview

**After Deployment (New):**
- ✅ Modern template: Clean teal accent bar, no address
- ✅ Uses your custom brand color and accent color
- ✅ Shows your custom logo
- ✅ Matches brand preview exactly
- ✅ Professional, branded emails

## Troubleshooting

**"Supabase CLI not found"**
→ Install it: `npm install -g supabase`

**"Not logged in"**
→ Login: `npx supabase login`

**"Project not linked"**
→ Link: `npx supabase link --project-ref YOUR_PROJECT_REF`

**"Permission denied" (Mac/Linux only)**
→ Make script executable: `chmod +x deploy-backend.sh`

## Need Help?

The deployment script will guide you through any issues. Just run it and follow the prompts!
