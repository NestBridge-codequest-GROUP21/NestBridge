-- Identity fields other users rely on when booking / messaging.
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS about TEXT;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS identity_locked BOOLEAN NOT NULL DEFAULT FALSE;
