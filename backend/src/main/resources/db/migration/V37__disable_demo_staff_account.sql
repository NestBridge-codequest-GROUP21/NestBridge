-- Retire shared demo staff login. Ops access is Group 21 personal Gmails only.
UPDATE users
SET
  is_staff = FALSE,
  is_suspended = TRUE,
  email_verified = FALSE
WHERE email = 'admin@nestbridge.app';
