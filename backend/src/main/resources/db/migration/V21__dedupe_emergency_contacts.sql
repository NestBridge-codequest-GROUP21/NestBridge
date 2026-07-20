-- V21: Keep one NestBridge support line; drop redundant support lines 2–5.
-- Align labels with the mobile SOS list. National 112 stays a client-side CTA.

UPDATE emergency_contacts
SET label = 'Ghana Police',
    sort_order = 1
WHERE contact_id = 'a0000001-0000-4000-8000-000000000002';

UPDATE emergency_contacts
SET sort_order = 2
WHERE contact_id = 'a0000001-0000-4000-8000-000000000001';

UPDATE emergency_contacts
SET sort_order = 3
WHERE contact_id = 'a0000001-0000-4000-8000-000000000003';

UPDATE emergency_contacts
SET label = 'NestBridge 24/7 support',
    phone_number = '+233 59 556 2101',
    sort_order = 4,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000004';

UPDATE emergency_contacts
SET is_active = false
WHERE contact_id IN (
  'a0000001-0000-4000-8000-000000000005',
  'a0000001-0000-4000-8000-000000000006',
  'a0000001-0000-4000-8000-000000000007',
  'a0000001-0000-4000-8000-000000000008'
);

-- Deactivate any leftover rows that share a phone number with an active contact
-- (keeps the lowest sort_order / earliest contact_id active).
UPDATE emergency_contacts AS dup
SET is_active = false
WHERE dup.is_active = true
  AND EXISTS (
    SELECT 1
    FROM emergency_contacts AS keep
    WHERE keep.is_active = true
      AND regexp_replace(keep.phone_number, '[^0-9+]', '', 'g')
        = regexp_replace(dup.phone_number, '[^0-9+]', '', 'g')
      AND (
        keep.sort_order < dup.sort_order
        OR (keep.sort_order = dup.sort_order AND keep.contact_id < dup.contact_id)
      )
  );
