-- Queue for failed push deliveries so important notifications can be retried.
CREATE TABLE IF NOT EXISTS notification_delivery_failures (
  failure_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  notification_type VARCHAR(64) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  data_json JSONB,
  attempts INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 5,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notif_fail_retry
  ON notification_delivery_failures (resolved_at, next_attempt_at)
  WHERE resolved_at IS NULL;
