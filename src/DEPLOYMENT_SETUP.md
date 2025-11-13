# BilltUp - GitHub & Deployment Setup Guide

## Overview
This guide will help you set up your BilltUp project on GitHub with automatic deployment to Supabase using GitHub Actions.

## Prerequisites
- Git installed on your local machine
- A GitHub account
- Your Supabase project credentials

---

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., "billtup-invoice-builder")
4. Choose visibility (Private recommended for production apps)
5. Do NOT initialize with README, .gitignore, or license (we already have code)
6. Click "Create repository"

---

## Step 2: Initialize Git and Push Code

Run these commands in your project directory:

```bash
# Initialize git repository
git init

# Create .gitignore file
cat > .gitignore << EOL
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.DS_Store

# Supabase
.supabase/
supabase/.temp/
EOL

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BilltUp Invoice Builder with Supabase integration"

# Add your GitHub repository as remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Set Up GitHub Secrets

To enable automatic deployment, you need to add Supabase credentials as GitHub secrets:

### Get Your Supabase Credentials

1. **SUPABASE_ACCESS_TOKEN**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Click on your profile icon (top right)
   - Select "Account Settings"
   - Go to "Access Tokens"
   - Click "Generate New Token"
   - Give it a name (e.g., "GitHub Actions Deploy")
   - Copy the token (you won't be able to see it again!)

2. **SUPABASE_PROJECT_ID**:
   - Go to your project in Supabase Dashboard
   - Go to "Project Settings" > "General"
   - Copy the "Reference ID" (this is your project ID)

### Add Secrets to GitHub

1. Go to your GitHub repository
2. Click "Settings" tab
3. In the left sidebar, click "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add the following secrets:

   **Secret 1:**
   - Name: `SUPABASE_ACCESS_TOKEN`
   - Value: [paste your Supabase access token]
   - Click "Add secret"

   **Secret 2:**
   - Name: `SUPABASE_PROJECT_ID`
   - Value: [paste your Supabase project reference ID]
   - Click "Add secret"

---

## Step 4: Test the Deployment

The GitHub Actions workflow is configured to run automatically when you push to the `main` or `master` branch.

### Trigger Your First Deployment

```bash
# Make a small change (or just trigger deployment)
git commit --allow-empty -m "Trigger initial deployment"
git push
```

### Monitor the Deployment

1. Go to your GitHub repository
2. Click the "Actions" tab
3. You should see a workflow run titled "Deploy to Supabase"
4. Click on it to see the deployment progress
5. If successful, you'll see a green checkmark ✅

---

## Step 5: Verify Deployment

After the GitHub Action completes:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to "Edge Functions"
3. Click on the "server" function
4. Verify the deployment timestamp is recent
5. Test your authentication endpoints to ensure they're working

---

## Workflow Features

The GitHub Actions workflow (`.github/workflows/deploy-supabase.yml`) includes:

- ✅ **Automatic Deployment**: Runs on every push to main/master
- ✅ **Manual Trigger**: Can be triggered manually from GitHub Actions tab
- ✅ **Latest Supabase CLI**: Always uses the latest Supabase CLI version
- ✅ **Status Reporting**: Shows success/failure messages
- ✅ **Secure**: Uses GitHub Secrets for credentials

---

## Manual Deployment (Alternative)

If you prefer to deploy manually or need to deploy outside of GitHub Actions:

```bash
# Make sure you're logged in to Supabase
supabase login

# Link to your project (replace with your project ID)
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the server function
supabase functions deploy server
```

---

## Troubleshooting

### Deployment Fails with Authentication Error
- Verify your `SUPABASE_ACCESS_TOKEN` is correct
- Ensure the token has not expired
- Generate a new token if necessary

### Deployment Fails with Project Not Found
- Verify your `SUPABASE_PROJECT_ID` is correct
- Ensure you're using the Reference ID, not the project name

### Changes Not Reflected After Deployment
- Check the GitHub Actions log for errors
- Verify the function was actually deployed by checking timestamp in Supabase Dashboard
- Clear your browser cache or try an incognito window
- Check Supabase function logs for runtime errors

### Want to Deploy a Different Branch
Edit `.github/workflows/deploy-supabase.yml` and change the branches:
```yaml
on:
  push:
    branches:
      - main
      - develop  # Add additional branches here
```

---

## Best Practices

1. **Never commit secrets**: The `.gitignore` already excludes `.env` files
2. **Test locally first**: Always test changes locally before pushing
3. **Use meaningful commit messages**: Helps track what changed when
4. **Monitor deployments**: Check GitHub Actions tab after pushing
5. **Review function logs**: Check Supabase function logs if issues occur

---

## Next Steps

Once your repository is set up and deployment is working:

1. ✅ All code changes will automatically deploy when pushed to main
2. ✅ You can collaborate with team members via GitHub
3. ✅ You have version control and deployment history
4. ✅ You can roll back to previous versions if needed

---

## Support

If you encounter issues:
- Check GitHub Actions logs for detailed error messages
- Review Supabase Dashboard > Edge Functions > Logs
- Verify all secrets are correctly configured
- Ensure your Supabase project is active and not paused

---

**Ready to go!** 🚀

Push your code to GitHub and watch your BilltUp application automatically deploy to Supabase!
