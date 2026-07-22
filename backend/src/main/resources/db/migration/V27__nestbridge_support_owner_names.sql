-- V27: NestBridge support lines named by the team member who owns each number.

UPDATE emergency_contacts
SET label = 'Blessing Hackman — NestBridge Support',
    phone_number = '+233 59 556 2101',
    sort_order = 4,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000004';

UPDATE emergency_contacts
SET label = 'Abdulsamed Taslima — NestBridge Support',
    phone_number = '+233 24 300 8368',
    sort_order = 5,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000005';

UPDATE emergency_contacts
SET label = 'Angelo Onwe — NestBridge Support',
    phone_number = '+233 59 661 4273',
    sort_order = 6,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000006';

-- Keep extra demo lines inactive (no named owner).
UPDATE emergency_contacts
SET is_active = false
WHERE contact_id IN (
  'a0000001-0000-4000-8000-000000000007',
  'a0000001-0000-4000-8000-000000000008'
);
