-- Create archived_accounts table for BilltUp record-keeping
-- This table stores anonymized data from deleted accounts for compliance and analytics
-- Only accessible by BilltUp administrators

CREATE TABLE IF NOT EXISTS archived_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archive_id TEXT UNIQUE NOT NULL,
  deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  anonymized_user_id TEXT NOT NULL,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on deleted_at for querying
CREATE INDEX IF NOT EXISTS idx_archived_accounts_deleted_at ON archived_accounts(deleted_at);

-- Create index on archive_id for lookups
CREATE INDEX IF NOT EXISTS idx_archived_accounts_archive_id ON archived_accounts(archive_id);

-- Enable Row Level Security
ALTER TABLE archived_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (BilltUp admins only)
CREATE POLICY "Service role only can access archived accounts"
  ON archived_accounts
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment explaining purpose
COMMENT ON TABLE archived_accounts IS 'Stores anonymized data from deleted user accounts for BilltUp record-keeping and compliance. Contains no PII - only aggregated statistics. Accessible only by BilltUp administrators via service role.';
