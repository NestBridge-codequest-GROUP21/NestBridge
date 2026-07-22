-- V29: Restore all five NestBridge support lines with owner labels.

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

UPDATE emergency_contacts
SET label = 'NestBridge Ops — NestBridge Support',
    phone_number = '+233 20 553 7622',
    sort_order = 7,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000007';

UPDATE emergency_contacts
SET label = 'NestBridge Desk — NestBridge Support',
    phone_number = '+233 20 334 6248',
    sort_order = 8,
    is_active = true
WHERE contact_id = 'a0000001-0000-4000-8000-000000000008';
