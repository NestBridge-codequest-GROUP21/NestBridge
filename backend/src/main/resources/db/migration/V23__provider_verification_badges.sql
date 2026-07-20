-- Verification trust flags for marketplace badges (hosts & guides).
-- Identity remains users.is_verified; these extend phone / location / experience.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE host_profiles
  ADD COLUMN IF NOT EXISTS location_verified BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE guide_profiles
  ADD COLUMN IF NOT EXISTS experience_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Seed realistic trust for existing verified demo providers.
UPDATE users u
SET phone_verified = TRUE
WHERE u.is_verified = TRUE
  AND (
    EXISTS (SELECT 1 FROM host_profiles h WHERE h.user_id = u.user_id)
    OR EXISTS (SELECT 1 FROM guide_profiles g WHERE g.user_id = u.user_id)
  );

UPDATE host_profiles
SET location_verified = TRUE
WHERE city IS NOT NULL
  AND TRIM(city) <> ''
  AND lat IS NOT NULL
  AND lng IS NOT NULL;

UPDATE guide_profiles
SET experience_verified = TRUE
WHERE review_count >= 3
   OR (average_rating IS NOT NULL AND average_rating >= 4.0);
