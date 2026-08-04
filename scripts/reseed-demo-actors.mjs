/**
 * Restore NestBridge @nestbridge.app demo actors (password: password)
 * without touching Group 21 staff Gmails.
 *
 * Usage: node scripts/reseed-demo-actors.mjs
 */
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pg = require(path.join(scriptDir, 'node_modules', 'pg'));

/** bcrypt hash for "password" (Spring BCryptPasswordEncoder — see V4 migration). */
const PASSWORD_HASH =
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

function railwayJson(service) {
  const raw = execSync(`railway variables --service ${service} --json`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(raw);
}

async function main() {
  const vars = railwayJson('Postgres');
  const url = vars.DATABASE_PUBLIC_URL || vars.DATABASE_URL;
  if (!url) {
    throw new Error('No DATABASE_PUBLIC_URL / DATABASE_URL on Postgres service');
  }

  const client = new pg.Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    await client.query('BEGIN');

    // Student — Akosua
    await client.query(
      `INSERT INTO users (
         user_id, full_name, email, password_hash, primary_intent, nationality,
         languages, is_verified, email_verified, email_verified_at,
         is_active_exchange_student, bio, about, identity_locked
       ) VALUES (
         '11111111-1111-1111-1111-111111111101', 'Akosua Darko', 'akosua.demo@nestbridge.app',
         $1, 'STUDENT', 'Nigeria', ARRAY['English','Twi'], TRUE, TRUE, NOW(), TRUE,
         'Exchange student exploring homestays and cultural experiences in Ghana.',
         'I am here for a semester exchange and want a respectful homestay in Ghana.',
         TRUE
       )
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email_verified = TRUE,
         email_verified_at = NOW(),
         is_verified = TRUE,
         primary_intent = EXCLUDED.primary_intent,
         bio = EXCLUDED.bio,
         about = EXCLUDED.about,
         identity_locked = TRUE`,
      [PASSWORD_HASH],
    );

    await client.query(
      `INSERT INTO seeker_profiles (user_id, status, steps_completed, profile_data, completed_at)
       VALUES (
         '11111111-1111-1111-1111-111111111101', 'COMPLETE',
         ARRAY['destination','quiz','profile','ready'],
         '{"city":"Accra","university":"University of Ghana","arrivalDate":"2026-09-01","departureDate":"2026-12-15","displayName":"Akosua Darko","bio":"Exchange student exploring homestays and cultural experiences in Ghana.","about":"I am here for a semester exchange and want a respectful homestay in Ghana.","identityLocked":true}'::jsonb,
         NOW()
       )
       ON CONFLICT (user_id) DO UPDATE SET
         status = 'COMPLETE',
         profile_data = EXCLUDED.profile_data,
         completed_at = NOW()`,
    );

    // Tourist — Zara (same UUID as V8 seed)
    await client.query(
      `INSERT INTO users (
         user_id, full_name, email, password_hash, primary_intent, nationality,
         languages, is_verified, email_verified, email_verified_at,
         bio, about, identity_locked
       ) VALUES (
         '99999999-9999-9999-9999-999999999901', 'Zara Okonkwo', 'zara.tourist@nestbridge.app',
         $1, 'TOURIST', 'Nigeria', ARRAY['English'], TRUE, TRUE, NOW(),
         'Visiting Ghana for cultural tourism.',
         'Short-stay traveler looking for guides and lodging across Accra.',
         TRUE
       )
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email_verified = TRUE,
         email_verified_at = NOW(),
         is_verified = TRUE,
         primary_intent = EXCLUDED.primary_intent,
         bio = EXCLUDED.bio,
         about = EXCLUDED.about,
         identity_locked = TRUE`,
      [PASSWORD_HASH],
    );

    await client.query(
      `INSERT INTO seeker_profiles (user_id, status, steps_completed, profile_data, completed_at)
       VALUES (
         '99999999-9999-9999-9999-999999999901', 'COMPLETE',
         ARRAY['destination','quiz','profile','ready'],
         '{"city":"Accra","arrivalDate":"2026-08-01","departureDate":"2026-08-14","displayName":"Zara Okonkwo","bio":"Visiting Ghana for cultural tourism.","about":"Short-stay traveler looking for guides and lodging across Accra.","identityLocked":true}'::jsonb,
         NOW()
       )
       ON CONFLICT (user_id) DO UPDATE SET
         status = 'COMPLETE',
         profile_data = EXCLUDED.profile_data,
         completed_at = NOW()`,
    );

    // Host — Abena
    await client.query(
      `INSERT INTO users (
         user_id, full_name, email, password_hash, primary_intent, nationality,
         languages, is_verified, email_verified, email_verified_at,
         bio, about, identity_locked
       ) VALUES (
         '22222222-2222-2222-2222-222222222201', 'Abena Mensah', 'abena.host@nestbridge.app',
         $1, 'HOST', 'Ghana', ARRAY['English','Twi'], TRUE, TRUE, NOW(),
         'NestBridge demo host sharing a welcoming home in Ghana.',
         'Seeded NestBridge demo host account for CodeQuest demos.',
         TRUE
       )
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email_verified = TRUE,
         email_verified_at = NOW(),
         is_verified = TRUE,
         primary_intent = EXCLUDED.primary_intent,
         bio = EXCLUDED.bio,
         about = EXCLUDED.about,
         identity_locked = TRUE`,
      [PASSWORD_HASH],
    );

    await client.query(
      `INSERT INTO provider_setup (user_id, track, status, steps_completed, profile_data, completed_at)
       VALUES (
         '22222222-2222-2222-2222-222222222201', 'HOST', 'COMPLETE',
         ARRAY['quiz','profile','ready'],
         '{"displayName":"Abena Mensah","bio":"NestBridge demo host sharing a welcoming home in Ghana.","about":"Seeded NestBridge demo host account for CodeQuest demos.","identityLocked":true}'::jsonb,
         NOW()
       )
       ON CONFLICT (user_id, track) DO UPDATE SET
         status = 'COMPLETE',
         profile_data = EXCLUDED.profile_data,
         completed_at = NOW()`,
    );

    await client.query(
      `INSERT INTO host_profiles (
         host_id, user_id, address, city, country, lat, lng, room_type, max_guests,
         price_per_night, amenities, house_rules, diet_offered, cancellation_policy,
         is_active, review_count, average_rating
       ) VALUES (
         '33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201',
         'East Legon', 'Accra', 'Ghana', 5.650000, -0.170000, 'Private room', 2,
         180.00, ARRAY['WiFi','Meals','Laundry'],
         'Quiet study hours after 9pm. Family-friendly home.',
         ARRAY['halal','vegetarian'], 'FLEXIBLE', TRUE, 12, 4.80
       )
       ON CONFLICT (host_id) DO UPDATE SET
         is_active = TRUE,
         city = EXCLUDED.city,
         price_per_night = EXCLUDED.price_per_night`,
    );

    // Guide — Kofi
    await client.query(
      `INSERT INTO users (
         user_id, full_name, email, password_hash, primary_intent, nationality,
         languages, is_verified, email_verified, email_verified_at,
         bio, about, identity_locked
       ) VALUES (
         '66666666-6666-6666-6666-666666666601', 'Kofi Asante', 'kofi.guide@nestbridge.app',
         $1, 'GUIDE', 'Ghana', ARRAY['English','Twi'], TRUE, TRUE, NOW(),
         'NestBridge demo guide offering cultural tours in Ghana.',
         'Seeded NestBridge demo guide account for CodeQuest demos.',
         TRUE
       )
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email_verified = TRUE,
         email_verified_at = NOW(),
         is_verified = TRUE,
         primary_intent = EXCLUDED.primary_intent,
         bio = EXCLUDED.bio,
         about = EXCLUDED.about,
         identity_locked = TRUE`,
      [PASSWORD_HASH],
    );

    await client.query(
      `INSERT INTO provider_setup (user_id, track, status, steps_completed, profile_data, completed_at)
       VALUES (
         '66666666-6666-6666-6666-666666666601', 'GUIDE', 'COMPLETE',
         ARRAY['quiz','profile','ready'],
         '{"displayName":"Kofi Asante","bio":"NestBridge demo guide offering cultural tours in Ghana.","about":"Seeded NestBridge demo guide account for CodeQuest demos.","identityLocked":true}'::jsonb,
         NOW()
       )
       ON CONFLICT (user_id, track) DO UPDATE SET
         status = 'COMPLETE',
         profile_data = EXCLUDED.profile_data,
         completed_at = NOW()`,
    );

    await client.query(
      `INSERT INTO guide_profiles (
         guide_id, user_id, city, country, service_types, languages_offered,
         price_per_session, session_duration_hours, bio_extended, is_active,
         review_count, average_rating, lat, lng
       ) VALUES (
         '77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601',
         'Accra', 'Ghana', ARRAY['history','food','orientation'], ARRAY['English','Twi'],
         250.00, 3.0, 'Local cultural tours and campus orientation.', TRUE,
         18, 4.85, 5.603700, -0.187000
       )
       ON CONFLICT (guide_id) DO UPDATE SET
         is_active = TRUE,
         city = EXCLUDED.city,
         price_per_session = EXCLUDED.price_per_session`,
    );

    // Shared demo staff login is retired — Group 21 personal Gmails only for ops.
    await client.query(
      `UPDATE users
       SET is_staff = FALSE, is_suspended = TRUE, email_verified = FALSE
       WHERE email = 'admin@nestbridge.app'`,
    );

    await client.query('COMMIT');

    const rows = await client.query(
      `SELECT email, primary_intent, is_staff, email_verified, is_verified
       FROM users
       WHERE email ILIKE '%@nestbridge.app'
       ORDER BY email`,
    );
    console.log('demo_accounts=', JSON.stringify(rows.rows, null, 2));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
