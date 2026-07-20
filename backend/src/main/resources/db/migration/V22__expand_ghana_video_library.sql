-- V22: Expand Ghana video library with unique playable YouTube IDs.
-- Deactivate duplicate youtube_id rows; refresh existing keys; insert new topics.

UPDATE video_resources SET
  title = 'Arriving in Ghana — Visa, Money & Essentials',
  description = 'Visa basics, SIM cards, Ghana cedis & ATMs, safety, plugs, and hotels — practical briefing for students, tourists, volunteers, and expats landing at Kotoka.',
  category = 'Orientation',
  youtube_id = 'ejJcat0HzQQ',
  thumbnail_url = 'https://img.youtube.com/vi/ejJcat0HzQQ/hqdefault.jpg',
  sort_order = 1,
  is_active = true
WHERE video_key = 'arrival-tips';

UPDATE video_resources SET
  title = 'How to Take a Trotro in Ghana',
  description = 'Beginner-friendly guide to Accra''s shared minibuses: spotting routes, paying the mate, signaling your stop, and riding confidently as a newcomer.',
  category = 'Transport',
  youtube_id = 'CiA_beyAAGg',
  thumbnail_url = 'https://img.youtube.com/vi/CiA_beyAAGg/hqdefault.jpg',
  sort_order = 4,
  is_active = true
WHERE video_key = 'trotro-safety';

UPDATE video_resources SET
  title = 'Accra Culture, Food & Etiquette Tips',
  description = 'First-trip culture notes, greetings, food moments, and respectful behavior for hosts, markets, and everyday Accra life.',
  category = 'Etiquette',
  youtube_id = 'Gjd_rKh5o64',
  thumbnail_url = 'https://img.youtube.com/vi/Gjd_rKh5o64/hqdefault.jpg',
  sort_order = 6,
  is_active = true
WHERE video_key = 'homestay-etiquette';

UPDATE video_resources SET
  title = 'Accra Neighborhood Guide',
  description = 'Where to base yourself in Accra — areas near campus life (Legon), visitor hubs, and landmarks useful when choosing a homestay, hostel, or hotel.',
  category = 'Accommodation',
  youtube_id = '8JLOminF2Do',
  thumbnail_url = 'https://img.youtube.com/vi/8JLOminF2Do/hqdefault.jpg',
  sort_order = 3,
  is_active = true
WHERE video_key = 'accra-orientation';

UPDATE video_resources SET
  title = 'Street Food & Markets in Accra',
  description = 'Chop-bar lunch and West African food markets — practical for tourists, volunteers, and students exploring Accra with local hosts.',
  category = 'Food',
  youtube_id = 'YvlYjLPgrCE',
  thumbnail_url = 'https://img.youtube.com/vi/YvlYjLPgrCE/hqdefault.jpg',
  sort_order = 7,
  is_active = true
WHERE video_key = 'market-tips';

UPDATE video_resources SET
  title = 'Must-Try Ghanaian Food in Accra',
  description = 'Jollof, banku, waakye, and other Accra favorites — a food primer for international students and short-stay visitors.',
  category = 'Food',
  youtube_id = 'Yk4cpG1BOHg',
  thumbnail_url = 'https://img.youtube.com/vi/Yk4cpG1BOHg/hqdefault.jpg',
  sort_order = 8,
  is_active = true
WHERE video_key = 'food-intro';

INSERT INTO video_resources (
  video_id, video_key, title, description, category, youtube_id, thumbnail_url, city, sort_order, is_active
) VALUES
  (
    'c0000001-0000-4000-8000-000000000010',
    'evisa-guide',
    'Ghana eVisa Portal — How to Apply',
    'Walkthrough of Ghana''s official eVisa platform: eligibility checks, tourist and student options, and how to track your application online.',
    'Visas',
    'sPXAY_ADui4',
    'https://img.youtube.com/vi/sPXAY_ADui4/hqdefault.jpg',
    'Accra',
    2,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000011',
    'accra-getting-around',
    'Getting Around Accra',
    'Neighborhood landmarks and how visitors move through the capital — Independence Square, Jamestown, and everyday Accra navigation.',
    'Transport',
    '7-VI47c0Q4A',
    'https://img.youtube.com/vi/7-VI47c0Q4A/hqdefault.jpg',
    'Accra',
    5,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000012',
    'twi-basics',
    'Learn Basic Twi in 10 Minutes',
    'Essential Twi phrases for greetings and everyday conversation — ideal for tourists, exchange students, and newcomers settling in.',
    'Language',
    'QI3cVpxmXmI',
    'https://img.youtube.com/vi/QI3cVpxmXmI/hqdefault.jpg',
    'Accra',
    9,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000013',
    'momo-app',
    'MTN Mobile Money (MoMo) Tutorial',
    'How to use Ghana''s most common mobile wallet for transfers, payments, and everyday purchases once you have a local SIM.',
    'Mobile Money',
    '5UWu7pNuUNE',
    'https://img.youtube.com/vi/5UWu7pNuUNE/hqdefault.jpg',
    'Accra',
    10,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000014',
    'ghana-safety',
    'Is Ghana Safe? An Honest Traveler Take',
    'Practical safety context for Accra and beyond — what advisories mean, everyday precautions, and when to use NestBridge SOS / dial 112.',
    'Safety',
    'Ws3iD0aF9ok',
    'https://img.youtube.com/vi/Ws3iD0aF9ok/hqdefault.jpg',
    'Accra',
    11,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000015',
    'cape-coast-heritage',
    'Cape Coast Castle — History & Visit',
    'Guided look at Cape Coast Castle and the Door of No Return — essential heritage context for diaspora travelers, students, and culture-focused trips.',
    'Culture',
    'icherdbJIWA',
    'https://img.youtube.com/vi/icherdbJIWA/hqdefault.jpg',
    'Accra',
    12,
    true
  ),
  (
    'c0000001-0000-4000-8000-000000000016',
    'homowo-festival',
    'Ga Mashie Homowo Festival',
    'Scenes from Homowo in Accra — Ghana''s Ga harvest festival with kpokpoi, drumming, and community processions visitors may encounter in August.',
    'Festivals',
    'PBDPQtR741Y',
    'https://img.youtube.com/vi/PBDPQtR741Y/hqdefault.jpg',
    'Accra',
    13,
    true
  )
ON CONFLICT (video_key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  youtube_id = EXCLUDED.youtube_id,
  thumbnail_url = EXCLUDED.thumbnail_url,
  city = EXCLUDED.city,
  sort_order = EXCLUDED.sort_order,
  is_active = true;

-- Deactivate duplicate YouTube IDs (keep lowest sort_order / earliest video_id).
UPDATE video_resources AS dup
SET is_active = false
WHERE dup.is_active = true
  AND EXISTS (
    SELECT 1
    FROM video_resources AS keep
    WHERE keep.is_active = true
      AND keep.youtube_id = dup.youtube_id
      AND keep.youtube_id IS NOT NULL
      AND keep.youtube_id <> 'pending'
      AND (
        keep.sort_order < dup.sort_order
        OR (keep.sort_order = dup.sort_order AND keep.video_id < dup.video_id)
      )
  );
