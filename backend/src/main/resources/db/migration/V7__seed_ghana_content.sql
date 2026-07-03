-- V7: Seed Ghana content from frontend mock datasets

INSERT INTO cultural_phrases (phrase_id, city, emoji, phrase, translation, audio_url, sort_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Accra', '👋', 'Akwaaba', 'Welcome', NULL, 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Accra', '😊', 'Eti sen?', 'How are you?', NULL, 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Accra', '🙏', 'Medaase', 'Thank you', NULL, 3),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'Accra', '👋', 'Yaa agya / Yaa ama', 'Good morning (to elder)', NULL, 4);

INSERT INTO cultural_topics (topic_id, city, emoji, title, description, sort_order) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Accra', '🤝', 'Handshake norms', 'Use your right hand for greetings and handshakes. It is polite to greet elders first.', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Accra', '📣', 'Essential phrases', 'A few Twi greetings go a long way in markets, taxis, and homestays.', 2),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Accra', '🍽️', 'Meal etiquette', 'Wait to be invited to eat. It is common to wash hands before shared meals.', 3);

INSERT INTO transport_tabs (tab_id, city, tab_key, label, sort_order) VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'Accra', 'trotros', 'Trotros', 1),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'Accra', 'shared-taxis', 'Shared Taxis', 2),
  ('cccccccc-cccc-cccc-cccc-ccccccccccc3', 'Accra', 'ride-hailing', 'Ride Hailing', 3);

INSERT INTO transport_routes (route_id, tab_id, route_key, name, description, fare_label, estimated_price, sort_order) VALUES
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'legon-accra', 'Legon → Accra Central', 'Direct trotro via Madina junction', '1 Fare', 'GHS 8–12', 1),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'osu-circle', 'Osu → Circle', 'Shared minibus via Ring Road', '1 Fare', 'GHS 6–10', 2),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'campus-shuttle', 'Campus Shuttle', 'Trotros serving University of Ghana, Legon', '1 Fare', 'GHS 5–8', 3),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'airport-city', 'Airport → City Center', 'Shared taxi pool at Kotoka arrivals', 'Per seat', 'GHS 40–60', 1),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd5', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'tema-accra', 'Tema → Accra', 'Express shared taxi route', 'Per seat', 'GHS 25–35', 2),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd6', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'bolt-city', 'Bolt — City rides', 'On-demand rides across Greater Accra', 'Est. fare', 'GHS 25–80', 1),
  ('dddddddd-dddd-dddd-dddd-ddddddddddd7', 'cccccccc-cccc-cccc-cccc-ccccccccccc3', 'yango-airport', 'Yango — Airport transfer', 'Fixed-rate airport pickup', 'Est. fare', 'GHS 60–90', 2);

INSERT INTO tourist_sites (site_id, site_key, name, city, description, opening_hours, admission, sort_order) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'site-cape-coast', 'Cape Coast Castle', 'Cape Coast', 'A UNESCO World Heritage site and powerful window into the transatlantic slave trade. Guided tours explain the castle history and significance.', 'Daily, 8:00 AM – 4:30 PM', 'GHS 60 (includes guided tour)', 1),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2', 'site-kakum', 'Kakum National Park', 'Central Region', 'Rainforest canopy walkway and guided nature trails. One of Ghana most popular eco-tourism destinations.', 'Daily, 8:00 AM – 4:00 PM', 'GHS 40 (canopy walk)', 2),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee3', 'site-labadi', 'Labadi Beach', 'Accra', 'Popular city beach with local food stalls, live music on weekends, and easy access from Osu and Airport City.', 'Daily, sunrise – sunset', 'GHS 20 entry (weekends)', 3),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee4', 'site-makola', 'Makola Market', 'Accra', 'Accra bustling central market for fabrics, produce, and everyday goods. Best visited with a local guide for navigation tips.', 'Mon–Sat, 7:00 AM – 6:00 PM', 'Free entry', 4),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee5', 'site-1', 'Kwame Nkrumah Memorial Park', 'Accra', 'A peaceful memorial and museum honoring Ghana first president, set in landscaped gardens near the coast.', 'Tue–Sun, 9:00 AM – 5:00 PM', 'GHS 20 (students GHS 10 with ID)', 5);

INSERT INTO prep_checklist_items (item_id, city, item_key, label, sort_order) VALUES
  ('ffffffff-ffff-ffff-ffff-fffffffffff1', 'Accra', 'admission', 'University admission letter', 1),
  ('ffffffff-ffff-ffff-ffff-fffffffffff2', 'Accra', 'passport', 'Passport and visa', 2),
  ('ffffffff-ffff-ffff-ffff-fffffffffff3', 'Accra', 'yellow-fever', 'Yellow fever vaccination card', 3),
  ('ffffffff-ffff-ffff-ffff-fffffffffff4', 'Accra', 'clothing', 'Pack light clothing for Ghana weather', 4),
  ('ffffffff-ffff-ffff-ffff-fffffffffff5', 'Accra', 'sim', 'Secure a local SIM card on arrival', 5);

INSERT INTO emergency_contacts (contact_id, label, phone_number, sort_order) VALUES
  ('a0000001-0000-4000-8000-000000000001', 'Ghana National Ambulance', '193', 1),
  ('a0000001-0000-4000-8000-000000000002', 'Ghana Police Emergency', '191', 2),
  ('a0000001-0000-4000-8000-000000000003', 'Ghana Fire Service', '192', 3),
  ('a0000001-0000-4000-8000-000000000004', 'NestBridge 24/7 support', '+233 30 123 4567', 4);

INSERT INTO offline_map_landmarks (landmark_id, city, landmark_key, name, lat, lng, top_percent, left_percent, sort_order) VALUES
  ('b0000001-0000-4000-8000-000000000001', 'Accra', 'cape-coast', 'Cape Coast Castle', 5.103600, -1.246600, 62.00, 28.00, 1),
  ('b0000001-0000-4000-8000-000000000002', 'Accra', 'independence', 'Independence Arch', 5.547500, -0.192400, 38.00, 52.00, 2),
  ('b0000001-0000-4000-8000-000000000003', 'Accra', 'labadi', 'Labadi Beach', 5.556000, -0.147000, 45.00, 68.00, 3),
  ('b0000001-0000-4000-8000-000000000004', 'Accra', 'legon', 'University of Ghana', 5.650000, -0.187000, 28.00, 42.00, 4);

INSERT INTO video_resources (video_id, video_key, title, description, category, youtube_id, thumbnail_url, city, sort_order) VALUES
  ('c0000001-0000-4000-8000-000000000001', 'arrival-tips', 'Arriving in Ghana — What to Expect', 'Orientation for international students and visitors landing at Kotoka International Airport.', 'Orientation', 'dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', 'Accra', 1),
  ('c0000001-0000-4000-8000-000000000002', 'trotro-safety', 'Using Trotros Safely in Accra', 'How shared minibuses work, fares, and safety tips for newcomers.', 'Transport', 'ScMzIvxBSi4', 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg', 'Accra', 2),
  ('c0000001-0000-4000-8000-000000000003', 'homestay-etiquette', 'Homestay Etiquette in Ghana', 'Cultural expectations when living with a host family.', 'Culture', 'jNQXAC9IVRw', 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg', 'Accra', 3),
  ('c0000001-0000-4000-8000-000000000004', 'accra-orientation', 'Accra Neighborhood Guide', 'East Legon, Osu, Labone, and getting oriented in the capital.', 'Orientation', 'M7lc1UVf-VE', 'https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg', 'Accra', 4),
  ('c0000001-0000-4000-8000-000000000005', 'market-tips', 'Navigating Makola Market', 'Tips for visiting Accra largest market with confidence.', 'Culture', 'kJQP7kiw5Fk', 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg', 'Accra', 5),
  ('c0000001-0000-4000-8000-000000000006', 'food-intro', 'Introduction to Ghanaian Food', 'Jollof, banku, waakye, and dining with host families.', 'Food', 'L_jWHffI5Hc', 'https://img.youtube.com/vi/L_jWHffI5Hc/hqdefault.jpg', 'Accra', 6);
