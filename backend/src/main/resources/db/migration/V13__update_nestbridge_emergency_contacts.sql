-- V13: NestBridge demo / support contact numbers (CodeQuest 2026)

UPDATE emergency_contacts
SET label = 'NestBridge 24/7 support',
    phone_number = '+233 59 556 2101'
WHERE label = 'NestBridge 24/7 support';

INSERT INTO emergency_contacts (contact_id, label, phone_number, sort_order)
VALUES
  ('a0000001-0000-4000-8000-000000000005', 'NestBridge support line 2', '+233 24 300 8368', 5),
  ('a0000001-0000-4000-8000-000000000006', 'NestBridge support line 3', '+233 59 661 4273', 6),
  ('a0000001-0000-4000-8000-000000000007', 'NestBridge support line 4', '+233 20 553 7622', 7),
  ('a0000001-0000-4000-8000-000000000008', 'NestBridge support line 5', '+233 20 334 6248', 8)
ON CONFLICT (contact_id) DO NOTHING;
