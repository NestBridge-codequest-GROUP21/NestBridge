-- Permanently remove the shared demo staff account (password was publicly known).
-- Real staff access is via individual allowlisted registrations only.
DELETE FROM users WHERE email = 'admin@nestbridge.app';
