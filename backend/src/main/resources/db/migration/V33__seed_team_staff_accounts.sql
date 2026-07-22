-- V33: Bootstrap CodeQuest team staff accounts so ops sign-in works
-- without a prior consumer registration.
--
-- Demo password for newly created (and Tassy reset) accounts: password
-- bcrypt: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
--
-- Bless / Angel: create if missing; do NOT overwrite an existing password.
-- Tassy (abdulsamedtaslima): create if missing OR reset password if she
-- cannot sign in / reset (forgot-password needs SendGrid).

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
    'Blessing Baffoa Hackman',
    'bsbhackman@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE,
    TRUE,
    NOW(),
    TRUE,
    FALSE,
    FALSE
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'Angel Onwe',
    'angelonwe54@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'TOURIST',
    'Ghana',
    ARRAY['English'],
    TRUE,
    TRUE,
    NOW(),
    TRUE,
    FALSE,
    FALSE
  )
ON CONFLICT (email) DO UPDATE
SET
  is_staff = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(users.email_verified_at, NOW()),
  is_suspended = FALSE;

-- Taslimah ("Tassy") — reset credentials so staff portal + password recovery work
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
VALUES (
  'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
  'Taslimah Abdul Samed',
  'abdulsamedtaslima@gmail.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'TOURIST',
  'Ghana',
  ARRAY['English'],
  TRUE,
  TRUE,
  NOW(),
  TRUE,
  FALSE,
  FALSE
)
ON CONFLICT (email) DO UPDATE
SET
  full_name = COALESCE(NULLIF(users.full_name, ''), EXCLUDED.full_name),
  password_hash = EXCLUDED.password_hash,
  is_staff = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(users.email_verified_at, NOW()),
  is_suspended = FALSE;
