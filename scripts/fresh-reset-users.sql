-- Fresh-start reset for CodeQuest testing.
-- Keeps: Group 21 staff (5 Gmails) + seeded *@nestbridge.app demo marketplace users.
-- Removes: every other registered account and their bookings/chats/profiles (CASCADE).

BEGIN;

SELECT count(*) AS users_before FROM users;

DELETE FROM users
WHERE lower(email) NOT IN (
  'bsbhackman@gmail.com',
  'abigailadusei17@gmail.com',
  'angelonwe54@gmail.com',
  'sirinaabbas2@gmail.com',
  'abdulsamedtaslima@gmail.com'
)
AND email NOT ILIKE '%@nestbridge.app';

-- Ensure staff ops access for the five allowlisted emails.
UPDATE users
SET
  is_staff = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(email_verified_at, NOW()),
  is_suspended = FALSE
WHERE lower(email) IN (
  'bsbhackman@gmail.com',
  'abigailadusei17@gmail.com',
  'angelonwe54@gmail.com',
  'sirinaabbas2@gmail.com',
  'abdulsamedtaslima@gmail.com'
);

-- Keep seeded demo marketplace actors verified + identity-ready for judge demos.
UPDATE users
SET
  is_verified = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(email_verified_at, NOW()),
  bio = COALESCE(NULLIF(TRIM(bio), ''), 'NestBridge demo account for CodeQuest.'),
  about = COALESCE(
    NULLIF(TRIM(about), ''),
    'Seeded NestBridge demo profile. Identity is locked for realistic host/guide/student flows.'
  ),
  identity_locked = TRUE
WHERE email ILIKE '%@nestbridge.app';

SELECT count(*) AS users_after FROM users;
SELECT email, is_staff, email_verified
FROM users
WHERE lower(email) IN (
  'bsbhackman@gmail.com',
  'abigailadusei17@gmail.com',
  'angelonwe54@gmail.com',
  'sirinaabbas2@gmail.com',
  'abdulsamedtaslima@gmail.com'
)
ORDER BY email;

COMMIT;
