-- Smile Identity KYC job tracking

CREATE TABLE IF NOT EXISTS kyc_verification_jobs (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL DEFAULT 'SMILE',
  external_job_id VARCHAR(200),
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  verification_url TEXT,
  result_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_kyc_jobs_user ON kyc_verification_jobs(user_id);
