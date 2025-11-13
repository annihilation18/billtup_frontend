# GitHub Actions Setup Instructions for BilltUp

## ⚠️ IMPORTANT: Rename the "github" folder to ".github"

When you download this project, **you MUST rename the "github" folder to ".github"** (with a dot at the beginning). GitHub only recognizes workflows in a folder named `.github`.

**On Windows:**
- Open Command Prompt in the project folder
- Run: `ren github .github`

**On Mac/Linux:**
- Open Terminal in the project folder  
- Run: `mv github .github`

---

## Quick Setup Guide

Once you've pushed this code to GitHub, you need to configure two secrets for automatic deployment to work.

### Step 1: Get Your Supabase Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click **"Generate New Token"**
3. Give it a name like "GitHub Actions Deploy"
4. **Copy the token** (you won't be able to see it again!)

### Step 2: Get Your Supabase Project ID

1. Go to your Supabase project dashboard
2. Click **Settings** (left sidebar)
3. Go to **General** tab
4. Find **Reference ID** (looks like: `abcdefghijklmnop`)
5. **Copy the Reference ID**

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** tab (top of repository)
3. In left sidebar: **Secrets and variables** > **Actions**
4. Click **"New repository secret"**

#### Add Secret #1:
- **Name:** `SUPABASE_ACCESS_TOKEN`
- **Value:** [paste the token from Step 1]
- Click **"Add secret"**

#### Add Secret #2:
- **Name:** `SUPABASE_PROJECT_ID`
- **Value:** [paste the Reference ID from Step 2]
- Click **"Add secret"**

### Step 4: Test the Deployment

Push any commit to the `main` or `master` branch:

```bash
git commit --allow-empty -m "Test deployment"
git push
```

Then:
1. Go to your GitHub repository
2. Click the **"Actions"** tab
3. You should see the deployment running
4. Click on it to watch the progress

### ✅ Done!

From now on, every time you push to `main` or `master`, your Supabase functions will automatically deploy!

---

## Troubleshooting

**Error: "SUPABASE_ACCESS_TOKEN not found"**
- Make sure you added the secret with the exact name: `SUPABASE_ACCESS_TOKEN`
- Check there are no extra spaces in the secret name

**Error: "Project not found"**
- Verify you're using the Reference ID, not the project name
- Check the `SUPABASE_PROJECT_ID` secret is correct

**Error: "Authentication failed"**
- Your access token may have expired
- Generate a new token and update the GitHub secret

**GitHub Actions tab shows nothing**
- Make sure the folder is named `.github` (with a dot)
- Check the file is at `.github/workflows/deploy-supabase.yml`

---

## Manual Deployment (If Needed)

If you need to deploy manually without GitHub Actions:

```bash
# Login to Supabase
supabase login

# Link to your project (replace YOUR_PROJECT_ID)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the server function
supabase functions deploy server
```
