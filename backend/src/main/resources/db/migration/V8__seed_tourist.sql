-- V8: Optional tourist demo account

INSERT INTO users (user_id, full_name, email, password_hash, primary_intent, nationality, languages, is_verified)
VALUES
  ('99999999-9999-9999-9999-999999999901', 'Zara Okonkwo', 'zara.tourist@nestbridge.app', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TOURIST', 'Nigeria', ARRAY['English'], true);

INSERT INTO seeker_profiles (user_id, status, steps_completed, profile_data, completed_at)
VALUES
  ('99999999-9999-9999-9999-999999999901', 'COMPLETE', ARRAY['intent','destination','quiz','profile','ready'],
    '{"city":"Accra","arrivalDate":"2026-08-01","departureDate":"2026-08-14","displayName":"Zara Okonkwo","bio":"Visiting Ghana for cultural tourism"}'::jsonb, NOW());
