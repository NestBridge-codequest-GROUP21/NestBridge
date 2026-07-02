-- V2: Demo users, 8 hosts, lodging partners
-- Demo login password for all seeded accounts: password

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- bcrypt hash for "password"
-- $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Demo students
INSERT INTO users (user_id, full_name, email, password_hash, primary_intent, nationality, languages, is_verified, is_active_exchange_student)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Akosua Darko', 'akosua.demo@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'Nigeria', ARRAY['English','Twi'], true, true),
  ('11111111-1111-1111-1111-111111111102', 'James Osei', 'james.demo@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 'Ghana', ARRAY['English'], true, false);

INSERT INTO seeker_profiles (user_id, status, steps_completed, profile_data, completed_at)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'COMPLETE', ARRAY['intent','destination','quiz','profile','ready'],
    '{"city":"Accra","university":"University of Ghana","arrivalDate":"2026-09-01","departureDate":"2026-12-15","displayName":"Akosua Darko","bio":"Exchange student from Lagos"}'::jsonb, NOW()),
  ('11111111-1111-1111-1111-111111111102', 'COMPLETE', ARRAY['intent','destination','quiz','profile','ready'],
    '{"city":"Accra","university":"Ashesi University","arrivalDate":"2026-09-10","departureDate":"2026-11-20","displayName":"James Osei"}'::jsonb, NOW());

-- Host users (8)
INSERT INTO users (user_id, full_name, email, password_hash, primary_intent, nationality, languages, is_verified)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Abena Mensah', 'abena.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Twi'], true),
  ('22222222-2222-2222-2222-222222222202', 'Kwame & Grace Asante', 'kwame.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Twi'], true),
  ('22222222-2222-2222-2222-222222222203', 'Efua Boateng', 'efua.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Ga'], true),
  ('22222222-2222-2222-2222-222222222204', 'Samuel Adjei', 'samuel.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','French'], true),
  ('22222222-2222-2222-2222-222222222205', 'Ama Serwaa Osei', 'ama.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Twi'], true),
  ('22222222-2222-2222-2222-222222222206', 'Kofi Mensah', 'kofi.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Hausa'], true),
  ('22222222-2222-2222-2222-222222222207', 'Yaa Asantewaa', 'yaa.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Twi'], true),
  ('22222222-2222-2222-2222-222222222208', 'Nana Kwame', 'nana.host@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'HOST', 'Ghana', ARRAY['English','Twi'], true);

INSERT INTO provider_setup (user_id, track, status, steps_completed, profile_data, completed_at)
SELECT user_id, 'HOST', 'COMPLETE', ARRAY['listing','pricing','rules','photos','ready'], '{}'::jsonb, NOW()
FROM users WHERE user_id::text LIKE '22222222-%';

INSERT INTO host_profiles (host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night, amenities, house_rules, diet_offered, cancellation_policy, is_active, review_count, average_rating)
VALUES
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'East Legon', 'Accra', 'Ghana', 5.650000, -0.170000, 'Private room', 2, 180.00,
    ARRAY['WiFi','Meals','Laundry'], 'Quiet study hours after 9pm. Family-friendly home.', ARRAY['halal','vegetarian'], 'FLEXIBLE', true, 12, 4.80),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 'Cantonments', 'Accra', 'Ghana', 5.575000, -0.175000, 'Ensuite', 2, 220.00,
    ARRAY['WiFi','AC','Parking'], 'Social family dinners on weekends.', ARRAY['halal','vegan'], 'FLEXIBLE', true, 8, 4.60),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', 'Osu', 'Accra', 'Ghana', 5.556000, -0.182000, 'Private room', 1, 165.00,
    ARRAY['WiFi','Meals'], 'Flexible schedule for students.', ARRAY['vegetarian'], 'FLEXIBLE', true, 15, 4.90),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222204', 'Labone', 'Accra', 'Ghana', 5.568000, -0.168000, 'Shared room', 3, 140.00,
    ARRAY['WiFi'], 'Quiet home near embassies.', ARRAY['halal'], 'MODERATE', true, 5, 4.40),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222205', 'Adum', 'Kumasi', 'Ghana', 6.688000, -1.624000, 'Private room', 2, 150.00,
    ARRAY['WiFi','Meals'], 'Warm Ashanti hospitality.', ARRAY['halal','vegetarian'], 'FLEXIBLE', true, 10, 4.70),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222206', 'Ayeduase', 'Kumasi', 'Ghana', 6.674000, -1.565000, 'Private room', 2, 130.00,
    ARRAY['WiFi','Meals','Study desk'], 'Close to KNUST campus.', ARRAY['vegetarian'], 'FLEXIBLE', true, 7, 4.50),
  ('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222207', 'Tema', 'Accra', 'Ghana', 5.669000, -0.017000, 'Ensuite', 2, 175.00,
    ARRAY['WiFi','AC','Meals'], 'Quiet suburban home.', ARRAY['halal'], 'FLEXIBLE', true, 9, 4.65),
  ('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222208', 'Madina', 'Accra', 'Ghana', 5.683000, -0.168000, 'Private room', 2, 155.00,
    ARRAY['WiFi','Meals'], 'Flexible and social household.', ARRAY['vegetarian','halal'], 'FLEXIBLE', true, 6, 4.55);

-- Sample pending booking for Abena (host 1) from Akosua
INSERT INTO bookings (booking_id, guest_id, host_or_guide_id, booking_type, check_in, check_out, guest_message, total_price, platform_fee, host_payout, status)
VALUES
  ('44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '33333333-3333-3333-3333-333333333301', 'HOST',
   '2026-09-01', '2026-12-15', 'Hi! We discussed the weekly meal plan and quiet study hours.', 19845.00, 945.00, 18900.00, 'PENDING_HOST');

INSERT INTO lodging_partners (partner_id, name, city, category, address, phone, booking_url, price_from, currency, description, is_active)
VALUES
  ('55555555-5555-5555-5555-555555555501', 'Accra City Hotel', 'Accra', 'Hotel', 'Independence Ave, Accra', '+233 30 123 4567', 'https://example.com/accra-city', 350.00, 'GHS', 'Central hotel for short stays.', true),
  ('55555555-5555-5555-5555-555555555502', 'Kumasi Guest Lodge', 'Kumasi', 'Guesthouse', 'Adum, Kumasi', '+233 32 234 5678', 'https://example.com/kumasi-lodge', 200.00, 'GHS', 'Affordable guest lodge near cultural sites.', true);

INSERT INTO users (user_id, full_name, email, password_hash, primary_role)
VALUES (gen_random_uuid(), 'Kwame Asante-Boateng', 'kwame.asante@nestbridge.app', '$2a$10$N9qo8uLoickgx2ZMRZoMyeIjZAgcfL7p92LdGxad68LJZdL17LhWy', 'HOST');

INSERT INTO host_profiles (
  host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night,
  amenities, house_rules, diet_offered, religion_friendly, cancellation_policy, availability_calendar, photos, accepts_minors, is_active
) VALUES (
  gen_random_uuid(), (SELECT user_id FROM users WHERE email = 'kwame.asante@nestbridge.app'),
  'Adum, Kumasi, Ghana', 'Kumasi', 'Ghana', 6.6885, -1.6244, 'PRIVATE_ROOM', 1, 120.00,
  ARRAY['WiFi', 'Breakfast included', 'Fan'], 'No smoking. Quiet hours after 9pm.',
  ARRAY['Standard', 'Vegetarian'], ARRAY['No specific accommodation'], 'FLEXIBLE', '{}'::jsonb, ARRAY[]::text[], false, true
);

INSERT INTO users (user_id, full_name, email, password_hash, primary_role)
VALUES (gen_random_uuid(), 'Fatima Al-Hassan', 'fatima.alhassan@nestbridge.app', '$2a$10$N9qo8uLoickgx2ZMRZoMyeIjZAgcfL7p92LdGxad68LJZdL17LhWy', 'HOST');

INSERT INTO host_profiles (
  host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night,
  amenities, house_rules, diet_offered, religion_friendly, cancellation_policy, availability_calendar, photos, accepts_minors, is_active
) VALUES (
  gen_random_uuid(), (SELECT user_id FROM users WHERE email = 'fatima.alhassan@nestbridge.app'),
  'Madina, Accra, Ghana', 'Accra', 'Ghana', 5.6800, -0.1667, 'PRIVATE_ROOM', 2, 200.00,
  ARRAY['WiFi', 'Halal meals', 'AC', 'Prayer mat provided'], 'Halal household. No alcohol on premises.',
  ARRAY['Halal'], ARRAY['Prayer space available', 'Halal kitchen'], 'FLEXIBLE', '{}'::jsonb, ARRAY[]::text[], false, true
);

INSERT INTO users (user_id, full_name, email, password_hash, primary_role)
VALUES (gen_random_uuid(), 'Abena Mensah-Quaye', 'abena.mensah@nestbridge.app', '$2a$10$N9qo8uLoickgx2ZMRZoMyeIjZAgcfL7p92LdGxad68LJZdL17LhWy', 'HOST');

INSERT INTO host_profiles (
  host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night,
  amenities, house_rules, diet_offered, religion_friendly, cancellation_policy, availability_calendar, photos, accepts_minors, is_active
) VALUES (
  gen_random_uuid(), (SELECT user_id FROM users WHERE email = 'abena.mensah@nestbridge.app'),
  'Pedu, Cape Coast, Ghana', 'Cape Coast', 'Ghana', 5.1053, -1.2466, 'SHARED_ROOM', 2, 95.00,
  ARRAY['WiFi', 'Vegan meals', 'Garden', 'Bicycle rental'], 'Eco-friendly household. No single-use plastics.',
  ARRAY['Vegan', 'Vegetarian', 'Gluten-free'], ARRAY['No specific accommodation'], 'FLEXIBLE', '{}'::jsonb, ARRAY[]::text[], true, true
);

INSERT INTO users (user_id, full_name, email, password_hash, primary_role)
VALUES (gen_random_uuid(), 'Ibrahim Mahama', 'ibrahim.mahama@nestbridge.app', '$2a$10$N9qo8uLoickgx2ZMRZoMyeIjZAgcfL7p92LdGxad68LJZdL17LhWy', 'HOST');

INSERT INTO host_profiles (
  host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night,
  amenities, house_rules, diet_offered, religion_friendly, cancellation_policy, availability_calendar, photos, accepts_minors, is_active
) VALUES (
  gen_random_uuid(), (SELECT user_id FROM users WHERE email = 'ibrahim.mahama@nestbridge.app'),
  'Kalpohin, Tamale, Ghana', 'Tamale', 'Ghana', 9.4008, -0.8393, 'PRIVATE_ROOM', 2, 85.00,
  ARRAY['WiFi', 'Meals included', 'Motorbike rental'], 'Respectful household. Prayer times observed.',
  ARRAY['Halal', 'Standard'], ARRAY['Prayer space available', 'Separate prayer room'], 'FLEXIBLE', '{}'::jsonb, ARRAY[]::text[], false, true
);

INSERT INTO users (user_id, full_name, email, password_hash, primary_role)
VALUES (gen_random_uuid(), 'Celine Adjei-Mensah', 'celine.adjei@nestbridge.app', '$2a$10$N9qo8uLoickgx2ZMRZoMyeIjZAgcfL7p92LdGxad68LJZdL17LhWy', 'HOST');

INSERT INTO host_profiles (
  host_id, user_id, address, city, country, lat, lng, room_type, max_guests, price_per_night,
  amenities, house_rules, diet_offered, religion_friendly, cancellation_policy, availability_calendar, photos, accepts_minors, is_active
) VALUES (
  gen_random_uuid(), (SELECT user_id FROM users WHERE email = 'celine.adjei@nestbridge.app'),
  'Cantonments, Accra, Ghana', 'Accra', 'Ghana', 5.5913, -0.1886, 'PRIVATE_ROOM', 1, 280.00,
  ARRAY['WiFi', 'AC', 'Private bathroom', 'Meals included', 'Laundry'], 'Quiet professional household. No smoking.',
  ARRAY['Kosher', 'Standard', 'Vegetarian'], ARRAY['Kosher kitchen available'], 'FLEXIBLE', '{}'::jsonb, ARRAY[]::text[], false, true
);