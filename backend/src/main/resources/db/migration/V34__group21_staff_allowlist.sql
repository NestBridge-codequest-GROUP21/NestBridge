-- V34: Full Group 21 staff allowlist — personal emails get ops access.
-- Does NOT overwrite existing passwords. Creates a bootstrap account only
-- when the email has never registered (initial password: password).

-- Promote any existing accounts to staff (keep their passwords).
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

-- Bootstrap missing team accounts (password: password) — skipped if email exists.
INSERT INTO users (
  user_id,
  full_name,
  email,
  password_hash,
  primary_intent,
  nationality,
  languages,
  is_verified,
  email_verified,
  email_verified_at,
  is_staff,
  is_suspended,
  is_active_exchange_student
)
VALUES
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'Blessing Hackman',
    'bsbhackman@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE, TRUE, NOW(), TRUE, FALSE, FALSE
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    'Abigail Adusei',
    'abigailadusei17@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE, TRUE, NOW(), TRUE, FALSE, FALSE
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'Angel Onwe',
    'angelonwe54@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE, TRUE, NOW(), TRUE, FALSE, FALSE
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5',
    'Sirina Safianu Abbas',
    'sirinaabbas2@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE, TRUE, NOW(), TRUE, FALSE, FALSE
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    'Taslima Abdul Samed',
    'abdulsamedtaslima@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE, TRUE, NOW(), TRUE, FALSE, FALSE
  )
ON CONFLICT (email) DO UPDATE
SET
  is_staff = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(users.email_verified_at, NOW()),
  is_suspended = FALSE,
  full_name = COALESCE(NULLIF(TRIM(users.full_name), ''), EXCLUDED.full_name);
