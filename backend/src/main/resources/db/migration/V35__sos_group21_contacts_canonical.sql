-- V35: Canonical Group 21 SOS contacts (ASCII hyphens, unique phones).
-- Fixes mangled em-dashes and any leftover duplicate NestBridge lines.

UPDATE emergency_contacts
SET label = 'Blessing Baffoa Hackman - NestBridge Support',
    phone_number = '+233 59 556 2101',
    sort_order = 4,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000004';

UPDATE emergency_contacts
SET label = 'Taslimah Abdul Samed - NestBridge Support',
    phone_number = '+233 24 300 8368',
    sort_order = 5,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000005';

UPDATE emergency_contacts
SET label = 'Sirina Safianu Abbas - NestBridge Support',
    phone_number = '+233 59 661 4273',
    sort_order = 6,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000006';

UPDATE emergency_contacts
SET label = 'Abigail Adusei - NestBridge Support',
    phone_number = '+233 20 553 7622',
    sort_order = 7,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000007';

UPDATE emergency_contacts
SET label = 'Angel Onwe - NestBridge Support',
    phone_number = '+233 20 334 6248',
    sort_order = 8,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000008';

-- Deactivate any other NestBridge support rows that collide on phone digits.
UPDATE emergency_contacts AS dup
SET is_active = false
WHERE dup.is_active = true
  AND dup.label ILIKE '%NestBridge%'
  AND dup.contact_id NOT IN (
    'a0000001-0000-4000-8000-000000000004',
    'a0000001-0000-4000-8000-000000000005',
    'a0000001-0000-4000-8000-000000000006',
    'a0000001-0000-4000-8000-000000000007',
    'a0000001-0000-4000-8000-000000000008'
  )
  AND EXISTS (
    SELECT 1
    FROM emergency_contacts AS keep
    WHERE keep.is_active = true
      AND keep.contact_id IN (
        'a0000001-0000-4000-8000-000000000004',
        'a0000001-0000-4000-8000-000000000005',
        'a0000001-0000-4000-8000-000000000006',
        'a0000001-0000-4000-8000-000000000007',
        'a0000001-0000-4000-8000-000000000008'
      )
      AND regexp_replace(keep.phone_number, '[^0-9]', '', 'g')
        = regexp_replace(dup.phone_number, '[^0-9]', '', 'g')
  );
