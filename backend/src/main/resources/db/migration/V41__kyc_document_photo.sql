-- Manual KYC identity document photo (selfie / ID) for staff review
ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS document_photo_url TEXT;

ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS document_photo_content_type VARCHAR(64);

ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS document_photo_bytes BYTEA;

ALTER TABLE kyc_verification_jobs
  ADD COLUMN IF NOT EXISTS has_document_photo BOOLEAN NOT NULL DEFAULT FALSE;
