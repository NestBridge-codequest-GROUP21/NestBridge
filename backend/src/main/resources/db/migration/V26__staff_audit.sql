-- Staff ops audit trail (preview enter/exit, moderation, etc.)

CREATE TABLE IF NOT EXISTS staff_audit_events (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(user_id),
  action VARCHAR(64) NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_audit_actor_created
  ON staff_audit_events(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_staff_audit_action_created
  ON staff_audit_events(action, created_at DESC);
