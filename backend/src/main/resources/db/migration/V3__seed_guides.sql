-- V3: 3 guides aligned with frontend guideSessionMock

INSERT INTO users (user_id, full_name, email, password_hash, primary_intent, nationality, languages, is_verified)
VALUES
  ('66666666-6666-6666-6666-666666666601', 'Kofi Asante', 'kofi.guide@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GUIDE', 'Ghana', ARRAY['English','Twi'], true),
  ('66666666-6666-6666-6666-666666666602', 'Ama Serwaa', 'ama.guide@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GUIDE', 'Ghana', ARRAY['English','French'], true),
  ('66666666-6666-6666-6666-666666666603', 'Yaw Mensah', 'yaw.guide@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'GUIDE', 'Ghana', ARRAY['English','Hausa'], true);

INSERT INTO provider_setup (user_id, track, status, steps_completed, profile_data, completed_at)
SELECT user_id, 'GUIDE', 'COMPLETE', ARRAY['services','pricing','availability','photos','ready'], '{}'::jsonb, NOW()
FROM users WHERE user_id::text LIKE '66666666-%';

INSERT INTO guide_profiles (guide_id, user_id, city, country, service_types, languages_offered, price_per_session, session_duration_hours, bio_extended, is_active, review_count, average_rating, lat, lng)
VALUES
  ('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', 'Accra', 'Ghana',
    ARRAY['City tour','Food tour'], ARRAY['English','Twi'], 120.00, 3.0,
    'Osu & Labadi expert guide for newcomers.', true, 18, 4.85, 5.556000, -0.182000),
  ('77777777-7777-7777-7777-777777777702', '66666666-6666-6666-6666-666666666602', 'Kumasi', 'Ghana',
    ARRAY['Cultural orientation','University walk'], ARRAY['English','French'], 95.00, 4.0,
    'Kumasi cultural sites and university orientation.', true, 11, 4.70, 6.688000, -1.624000),
  ('77777777-7777-7777-7777-777777777703', '66666666-6666-6666-6666-666666666603', 'Accra', 'Ghana',
    ARRAY['Airport pickup','Language exchange'], ARRAY['English','Hausa'], 150.00, 2.5,
    'Airport transfers and East Legon area tours.', true, 14, 4.75, 5.650000, -0.170000);
