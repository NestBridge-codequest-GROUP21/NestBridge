-- Staff / ops flags + demo staff account

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_staff BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_is_staff ON users(is_staff) WHERE is_staff = TRUE;

-- Demo staff account (password: password — same bcrypt as other @nestbridge.app seeds)
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
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  'NestBridge Staff',
  'admin@nestbridge.app',
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
  primary_intent = COALESCE(users.primary_intent, 'TOURIST'),
  email_verified = TRUE,
  email_verified_at = COALESCE(users.email_verified_at, NOW()),
  is_suspended = FALSE;
