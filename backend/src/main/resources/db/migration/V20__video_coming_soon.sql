-- Replace unrelated placeholder YouTube IDs with Ghana-relevant public videos.
UPDATE video_resources SET
  youtube_id = 'ejJcat0HzQQ',
  thumbnail_url = 'https://img.youtube.com/vi/ejJcat0HzQQ/hqdefault.jpg',
  title = 'Arriving in Ghana — What to Expect',
  description = 'Visa, SIM cards, money, safety, and practical tips before you land at Kotoka.'
WHERE video_key = 'arrival-tips';

UPDATE video_resources SET
  youtube_id = '7-VI47c0Q4A',
  thumbnail_url = 'https://img.youtube.com/vi/7-VI47c0Q4A/hqdefault.jpg',
  title = 'Getting Around Accra',
  description = 'Neighborhoods, landmarks, and how visitors move through Ghana''s capital.',
  category = 'Transport'
WHERE video_key = 'trotro-safety';

UPDATE video_resources SET
  youtube_id = 'Gjd_rKh5o64',
  thumbnail_url = 'https://img.youtube.com/vi/Gjd_rKh5o64/hqdefault.jpg',
  title = 'Accra Culture, Food & Safety Tips',
  description = 'First-trip culture notes, food moments, and safety awareness for visitors.'
WHERE video_key = 'homestay-etiquette';

UPDATE video_resources SET
  youtube_id = '8JLOminF2Do',
  thumbnail_url = 'https://img.youtube.com/vi/8JLOminF2Do/hqdefault.jpg',
  title = 'Accra Neighborhood Guide',
  description = 'Black Star Square, Jamestown, and getting oriented in the capital.'
WHERE video_key = 'accra-orientation';

UPDATE video_resources SET
  youtube_id = 'YvlYjLPgrCE',
  thumbnail_url = 'https://img.youtube.com/vi/YvlYjLPgrCE/hqdefault.jpg',
  title = 'Street Food & Markets in Accra',
  description = 'Chop-bar lunch and West African food markets — useful before you explore with hosts.'
WHERE video_key = 'market-tips';

UPDATE video_resources SET
  youtube_id = 'Yk4cpG1BOHg',
  thumbnail_url = 'https://img.youtube.com/vi/Yk4cpG1BOHg/hqdefault.jpg',
  title = 'Introduction to Ghanaian Food',
  description = 'Must-try Accra dishes — jollof, banku, and local favorites.'
WHERE video_key = 'food-intro';
