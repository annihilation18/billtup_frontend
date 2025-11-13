# ⚠️ ACTION REQUIRED: Deploy Email Template Updates

## Why Your Emails Haven't Changed Yet

The email template code has been updated in your **local files**, but Supabase Edge Functions require **deployment** to go live. Think of it like pushing code to production - the changes exist locally but aren't running on the server yet.

---

## 🚀 Quick Deploy (Choose Your OS)

### **Mac/Linux:**
```bash
./deploy-backend.sh
```

### **Windows:**
```bash
deploy-backend.bat
```

### **Or Use NPX Directly:**
```bash
npx supabase functions deploy server
```

---

## ⏱️ What Happens Next

1. **Deployment takes 30-60 seconds**
2. Your app automatically uses the new server code
3. **No app restart needed** - just send a new invoice email!

---

## 📋 First Time? Quick Setup

If you haven't deployed to Supabase before:

### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

### Step 2: Login to Supabase
```bash
npx supabase login
```
This will open your browser to authenticate.

### Step 3: Link Your Project
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

**Where to find YOUR_PROJECT_REF:**
- Go to https://supabase.com/dashboard
- Click on your BilltUp project
- Look at the URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
- Copy the part after `/project/`

### Step 4: Deploy!
```bash
npx supabase functions deploy server
```

---

## ✅ Verify It Worked

After deployment:

1. **Open BilltUp** in your browser
2. Go to **Settings > Custom Branding**
3. Verify your template is set to **"Modern"** (or whichever you want)
4. Create a **test invoice**
5. **Send it to yourself** via email
6. **Check your inbox** - the email should now match your brand preview!

### What You Should See:

**Modern Template Email:**
- ✅ Teal/cyan accent bar on the left
- ✅ Clean header with just business name + logo
- ✅ No address displayed
- ✅ Your custom brand colors
- ✅ Matches the brand preview exactly

**Classic Template Email:**
- ✅ Colored header background
- ✅ Business address included
- ✅ Traditional table layout
- ✅ Your custom colors

**Minimal Template Email:**
- ✅ Ultra-clean design
- ✅ Thin borders
- ✅ Light-weight typography
- ✅ No address

---

## 🔍 Files That Were Updated

These files have been updated locally and are ready to deploy:

- ✅ `/supabase/functions/server/email-templates.ts` (NEW)
- ✅ `/supabase/functions/server/index.tsx` (UPDATED)
- ✅ `/components/InvoicePDFPreview.tsx` (ALREADY UPDATED)
- ✅ `/components/CustomBrandingSection.tsx` (ALREADY UPDATED)

---

## 🆘 Troubleshooting

### "Command not found: supabase"
Install the CLI:
```bash
npm install -g supabase
```

### "Not authenticated"
Login first:
```bash
npx supabase login
```

### "Project not linked"
Link your project:
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

### "Permission denied" (Mac/Linux)
Make the script executable:
```bash
chmod +x deploy-backend.sh
```

### Deployment script shows errors
Follow the on-screen instructions - the script will guide you!

---

## 💡 Why This Is Necessary

**Frontend changes** (like React components) take effect immediately because they run in your browser.

**Backend changes** (like email generation) require deployment because they run on Supabase's servers, not in your browser.

Your email templates are generated server-side to:
- Keep your email credentials secure
- Generate PDFs server-side
- Send emails reliably
- Work the same for all users

---

## ⚡ TL;DR

Run this one command:

**Mac/Linux:**
```bash
./deploy-backend.sh
```

**Windows:**
```bash
deploy-backend.bat
```

Wait 60 seconds, then send a test invoice email. Done! 🎉
