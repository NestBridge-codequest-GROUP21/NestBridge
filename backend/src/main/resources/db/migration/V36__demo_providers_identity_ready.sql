-- Keep seeded NestBridge demo hosts/guides marketplace-ready after integrity gates:
-- staff KYC flag (is_verified) + locked bio/about on users and provider_setup.

UPDATE users
SET
  is_verified = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(email_verified_at, NOW()),
  bio = COALESCE(
    NULLIF(TRIM(bio), ''),
    'NestBridge demo host sharing a welcoming home in Ghana.'
  ),
  about = COALESCE(
    NULLIF(TRIM(about), ''),
    'This is a seeded NestBridge demo account used for CodeQuest demos. Bio and about stay locked so students know who they are booking with.'
  ),
  identity_locked = TRUE
WHERE email ILIKE '%@nestbridge.app'
  AND primary_intent IN ('HOST', 'GUIDE');

UPDATE users
SET
  is_verified = TRUE,
  email_verified = TRUE,
  email_verified_at = COALESCE(email_verified_at, NOW()),
  bio = COALESCE(
    NULLIF(TRIM(bio), ''),
    'NestBridge demo traveler exploring homestays and culture in Ghana.'
  ),
  about = COALESCE(
    NULLIF(TRIM(about), ''),
    'This is a seeded NestBridge demo seeker account for CodeQuest demos. Profile identity is locked for realistic booking and messaging flows.'
  ),
  identity_locked = TRUE
WHERE email ILIKE '%@nestbridge.app'
  AND primary_intent IN ('STUDENT', 'TOURIST');

UPDATE provider_setup ps
SET
  status = 'COMPLETE',
  completed_at = COALESCE(ps.completed_at, NOW()),
  profile_data = COALESCE(ps.profile_data, '{}'::jsonb)
    || jsonb_build_object(
      'bio', COALESCE(NULLIF(TRIM(u.bio), ''), 'NestBridge demo provider bio for marketplace demos.'),
      'about', COALESCE(NULLIF(TRIM(u.about), ''), 'Seeded NestBridge demo provider about section for CodeQuest.'),
      'identityLocked', TRUE,
      'displayName', COALESCE(u.full_name, 'NestBridge demo')
    )
FROM users u
WHERE ps.user_id = u.user_id
  AND u.email ILIKE '%@nestbridge.app'
  AND ps.track IN ('HOST', 'GUIDE');
