-- KYC rejection reason, optimistic locking, status check, lookup indexes
ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE kyc_verification_jobs
  DROP CONSTRAINT IF EXISTS chk_kyc_jobs_status;

ALTER TABLE kyc_verification_jobs
  ADD CONSTRAINT chk_kyc_jobs_status
  CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'));

CREATE INDEX IF NOT EXISTS idx_kyc_jobs_user_created
  ON kyc_verification_jobs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kyc_jobs_external
  ON kyc_verification_jobs (external_job_id)
  WHERE external_job_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_kyc_jobs_pending_status
  ON kyc_verification_jobs (status, created_at DESC)
  WHERE status = 'PENDING';
