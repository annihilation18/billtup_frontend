# Account Deletion Feature

## Overview

BilltUp now supports complete account deletion, allowing users to permanently remove their account and all associated data. The system includes proper data retention for BilltUp's internal records while ensuring user privacy through anonymization.

## User-Facing Features

### How to Delete Account

1. Navigate to **Settings** screen
2. Scroll down to the **Danger Zone** section
3. Click **Delete Account** button
4. Review the warning dialog explaining what will be deleted
5. Click **Yes, Delete My Account** to confirm

### What Gets Deleted

When a user deletes their account, the following data is **permanently removed**:

- ✅ User account and authentication credentials
- ✅ All business profile information
- ✅ All invoices and invoice data
- ✅ All customer records
- ✅ Subscription and billing data
- ✅ Stripe Connect account (disconnected)
- ✅ Custom branding settings
- ✅ Email configuration
- ✅ All uploaded logos and documents

### Data Retention for BilltUp

BilltUp retains an **anonymized copy** of account data for:

- 📊 Analytics and business metrics
- 📋 Compliance and audit requirements
- 📈 Product improvement insights

**What's retained (anonymized)**:
- Total number of invoices created
- Total number of customers
- Industry type
- Subscription plan type
- Account creation date

**What's NOT retained**:
- ❌ Email addresses
- ❌ Names (business or personal)
- ❌ Phone numbers
- ❌ Addresses
- ❌ Payment information
- ❌ Customer details
- ❌ Invoice content
- ❌ Any other personally identifiable information (PII)

### After Deletion

- Users can create a **new account** with the same email address
- All data from the deleted account is unrecoverable
- Stripe subscriptions are cancelled immediately
- No charges will occur after deletion

## Technical Implementation

### Backend Endpoint

**Route**: `POST /account/delete`

**Process**:
1. Authenticate user
2. Fetch all user data
3. Create anonymized archive record
4. Cancel Stripe subscription
5. Disconnect Stripe Connect account
6. Delete all KV store data
7. Delete user from Supabase Auth

### Database Schema

```sql
CREATE TABLE archived_accounts (
  id UUID PRIMARY KEY,
  archive_id TEXT UNIQUE NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL,
  anonymized_user_id TEXT NOT NULL,
  stats JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
```

### API Integration

**Frontend API Call**:
```typescript
await businessApi.deleteAccount();
```

**Response**:
```json
{
  "success": true,
  "message": "Account deleted successfully. You can create a new account with the same email.",
  "archivedId": "archived_user123_1234567890"
}
```

### Security & Privacy

- ✅ **GDPR Compliant**: Right to be forgotten
- ✅ **PCI Compliant**: No payment data stored
- ✅ **Row-Level Security**: Archived data only accessible by service role
- ✅ **Anonymization**: No PII in retained records
- ✅ **Audit Trail**: Deletion timestamp and anonymized ID

### UI/UX Details

**Warning Dialog Contents**:
- ⚠️ Clear explanation of irreversible action
- 📝 Bulleted list of what will be deleted
- 💡 Note about BilltUp's anonymized data retention
- ✅ Confirmation that email can be reused

**Visual Design**:
- Red "Danger Zone" section header
- AlertTriangle icon for warnings
- Destructive button styling
- Toast notifications for feedback

## Compliance Notes

### GDPR Compliance

The account deletion feature satisfies GDPR "Right to be Forgotten" requirements:

- ✅ All personal data is deleted
- ✅ Anonymized data cannot identify users
- ✅ Clear explanation provided to users
- ✅ Process is straightforward and accessible

### Data Retention Justification

BilltUp retains anonymized aggregate statistics for:

1. **Legal Compliance**: Business record-keeping requirements
2. **Financial Audits**: Subscription and revenue tracking
3. **Product Analytics**: Understanding user patterns
4. **Security**: Fraud detection and prevention

This retention is permitted under GDPR Article 89 (processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes).

### PCI Compliance

- ❌ No payment card data is ever stored
- ✅ All payments processed through Stripe
- ✅ Stripe accounts properly disconnected on deletion
- ✅ No PCI data in archived records

## Deployment

### Database Migration

Run the migration to create the archived_accounts table:

```bash
# Apply migration
cd supabase
supabase db push

# Or manually run:
psql -f migrations/20250113_create_archived_accounts.sql
```

### Backend Deployment

The account deletion endpoint is included in the main server deployment:

```bash
./deploy-backend.sh
```

### Testing

1. Create a test account
2. Add some test data (invoices, customers)
3. Navigate to Settings > Danger Zone
4. Click Delete Account
5. Verify all data is removed
6. Verify archived record exists in database (admin only)
7. Verify you can create new account with same email

## Support & Troubleshooting

### Common Issues

**Error: "Failed to delete account"**
- Check user authentication
- Verify Supabase permissions
- Check Stripe API connectivity
- Review server logs

**Archived data visible to users**
- Should not happen - verify RLS policies
- Only service role should access archived_accounts table

**Cannot create new account with same email**
- Wait a few seconds for auth deletion to propagate
- Clear browser cache and cookies
- Try again

### Admin Access to Archives

Only BilltUp administrators with service role credentials can query archived accounts:

```sql
-- Connect with service role key
SELECT * FROM archived_accounts 
WHERE deleted_at > NOW() - INTERVAL '30 days'
ORDER BY deleted_at DESC;
```

## Future Enhancements

Potential improvements to consider:

- 📧 Email confirmation before deletion
- ⏱️ Grace period (7-30 days) before permanent deletion
- 📦 Data export before deletion
- 📊 Account deletion analytics dashboard
- 🤖 Automated cleanup of old archived records (>7 years)

---

**Version**: 1.0.0  
**Last Updated**: January 13, 2025  
**Status**: Production Ready ✅
