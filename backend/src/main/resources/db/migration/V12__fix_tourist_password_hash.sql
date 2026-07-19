-- The tourist demo account (zara.tourist@nestbridge.app) is seeded in V8, which
-- runs AFTER the V4 password-hash fix. As a result its hash was never corrected
-- and demo sign-in returns HTTP 400. Re-apply the correct bcrypt hash for the
-- shared demo password ("password") to any demo account still on the old hash.
UPDATE users
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email LIKE '%@nestbridge.app'
  AND password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
