-- Destination-aware recommendation inventory for Savannah / Damongo
-- and northern hub content so Damongo students never see Accra-only defaults.

INSERT INTO tourist_sites (site_id, site_key, name, city, description, opening_hours, admission, sort_order, is_active)
VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee20', 'site-mole', 'Mole National Park', 'Damongo',
   'Ghana’s largest wildlife park — guided savannah drives and walking safaris near Damongo.',
   'Daily, 6:00 AM – 5:00 PM', 'Park fees apply (guided)', 20, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee21', 'site-larabanga', 'Larabanga Mosque', 'Damongo',
   'One of West Africa’s oldest mosques, a short trip from Damongo — heritage architecture and local guides.',
   'Daylight hours', 'Donation suggested', 21, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee22', 'site-tamale-central', 'Tamale Central Market', 'Tamale',
   'Northern Ghana’s busiest market — textiles, spices, and local food. Useful hub for Damongo travellers.',
   'Daily, morning – evening', 'Free entry', 22, true)
ON CONFLICT (site_id) DO NOTHING;

INSERT INTO cultural_topics (topic_id, city, emoji, title, description, sort_order, is_active)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb20', 'Damongo', '🌿', 'Savannah hospitality',
   'Greet elders first, accept water when offered, and dress modestly in village settings around Damongo.',
   1, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb21', 'Damongo', '🐘', 'Visiting Mole respectfully',
   'Stay with park guides, keep noise low on drives, and never feed wildlife.',
   2, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb22', 'Tamale', '🤝', 'Northern greetings',
   'A warm handshake and asking about family goes a long way in Tamale and nearby towns.',
   1, true)
ON CONFLICT (topic_id) DO NOTHING;

INSERT INTO cultural_phrases (phrase_id, city, emoji, phrase, translation, audio_url, sort_order, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa20', 'Damongo', '👋', 'Deseba', 'Good morning (Dagbani)', NULL, 1, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa21', 'Damongo', '🙏', 'Naaa', 'Thank you (Dagbani)', NULL, 2, true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa22', 'Tamale', '👋', 'Dasiba', 'Good morning (Dagbani variant)', NULL, 1, true)
ON CONFLICT (phrase_id) DO NOTHING;

INSERT INTO transport_tabs (tab_id, city, tab_key, label, sort_order, is_active)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccc20', 'Damongo', 'intercity', 'Intercity & park access', 1, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccc21', 'Damongo', 'local', 'In and around Damongo', 2, true)
ON CONFLICT (tab_id) DO NOTHING;

INSERT INTO transport_routes (route_id, tab_id, route_key, name, description, fare_label, estimated_price, sort_order)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd20', 'cccccccc-cccc-cccc-cccc-cccccccccc20', 'tamale-damongo',
   'Tamale → Damongo', 'STC / shared vans from Tamale station toward Damongo', 'One way', 'GHS 40–70', 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddd21', 'cccccccc-cccc-cccc-cccc-cccccccccc20', 'damongo-mole',
   'Damongo → Mole Park', 'Shared taxis and park transfers arranged in town', 'Per seat', 'GHS 20–40', 2),
  ('dddddddd-dddd-dddd-dddd-dddddddddd22', 'cccccccc-cccc-cccc-cccc-cccccccccc21', 'okada-town',
   'Okada in Damongo', 'Motorbike taxis for short trips in town', 'Est. fare', 'GHS 5–15', 1)
ON CONFLICT (route_id) DO NOTHING;
