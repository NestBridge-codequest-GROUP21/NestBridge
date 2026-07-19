-- V11: Richer demo conversations, messages, and booking flows (Ghana / NestBridge cast)

-- Conversations (Akosua student ↔ Abena host, Akosua ↔ Kofi guide)
INSERT INTO conversations (conversation_id, participant_a, participant_b, firebase_path, created_at)
VALUES
  ('88888888-8888-8888-8888-888888888801',
   '11111111-1111-1111-1111-111111111101',
   '22222222-2222-2222-2222-222222222201',
   'demo/akosua-abena', NOW() - INTERVAL '3 days'),
  ('88888888-8888-8888-8888-888888888802',
   '11111111-1111-1111-1111-111111111101',
   '66666666-6666-6666-6666-666666666601',
   'demo/akosua-kofi', NOW() - INTERVAL '2 days'),
  ('88888888-8888-8888-8888-888888888803',
   '22222222-2222-2222-2222-222222222201',
   '11111111-1111-1111-1111-111111111102',
   'demo/abena-james', NOW() - INTERVAL '4 days');

INSERT INTO chat_messages (conversation_id, sender_id, body, sent_at)
VALUES
  ('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222201',
   'Hi! We saw your booking request and would love to host you.', NOW() - INTERVAL '2 days 1 hour'),
  ('88888888-8888-8888-8888-888888888801', '11111111-1111-1111-1111-111111111101',
   'Thank you! I am excited about the weekly meal plan you mentioned.', NOW() - INTERVAL '2 days'),
  ('88888888-8888-8888-8888-888888888801', '22222222-2222-2222-2222-222222222201',
   'Looking forward to welcoming you in September!', NOW() - INTERVAL '1 day 23 hours'),
  ('88888888-8888-8888-8888-888888888802', '11111111-1111-1111-1111-111111111101',
   'Is the Osu food tour still available on Sep 5?', NOW() - INTERVAL '1 day 8 hours'),
  ('88888888-8888-8888-8888-888888888802', '66666666-6666-6666-6666-666666666601',
   'I can meet you at Osu Castle entrance at 10am.', NOW() - INTERVAL '1 day 7 hours'),
  ('88888888-8888-8888-8888-888888888803', '11111111-1111-1111-1111-111111111102',
   'Thanks for reviewing my homestay request.', NOW() - INTERVAL '3 days');

-- Upgrade existing pending stay to accepted (ready to pay)
UPDATE bookings
SET status = 'ACCEPTED', updated_at = NOW()
WHERE booking_id = '44444444-4444-4444-4444-444444444401';

-- Second pending request (Kwame & Grace)
INSERT INTO bookings (booking_id, guest_id, host_or_guide_id, booking_type, check_in, check_out, guest_message, total_price, platform_fee, host_payout, status)
VALUES
  ('44444444-4444-4444-4444-444444444402', '11111111-1111-1111-1111-111111111101',
   '33333333-3333-3333-3333-333333333302', 'HOST',
   '2026-09-01', '2026-11-30',
   'Looking for a social family near Cantonments with halal-friendly meals.', 20790.00, 990.00, 19800.00, 'PENDING_HOST');

-- Past confirmed stay (Efua Boateng)
INSERT INTO bookings (booking_id, guest_id, host_or_guide_id, booking_type, check_in, check_out, guest_message, total_price, platform_fee, host_payout, status, payment_status)
VALUES
  ('44444444-4444-4444-4444-444444444403', '11111111-1111-1111-1111-111111111101',
   '33333333-3333-3333-3333-333333333303', 'HOST',
   '2025-09-01', '2025-12-01',
   'Short orientation stay before semester housing opened.', 15766.00, 751.00, 15015.00, 'CONFIRMED', 'PAID');

-- Guide session request (Kofi Asante)
INSERT INTO bookings (booking_id, guest_id, host_or_guide_id, booking_type, session_date, session_start_time, session_duration_hours, guest_message, total_price, platform_fee, host_payout, status)
VALUES
  ('44444444-4444-4444-4444-444444444404', '11111111-1111-1111-1111-111111111101',
   '77777777-7777-7777-7777-777777777701', 'GUIDE',
   '2026-09-05', '10:00', 3.0,
   'City orientation walk around Osu and Labadi.', 126.00, 6.00, 120.00, 'PENDING_HOST');

-- James Osei → Abena Mensah (incoming for host dashboard)
INSERT INTO bookings (booking_id, guest_id, host_or_guide_id, booking_type, check_in, check_out, guest_message, total_price, platform_fee, host_payout, status)
VALUES
  ('44444444-4444-4444-4444-444444444405', '11111111-1111-1111-1111-111111111102',
   '33333333-3333-3333-3333-333333333301', 'HOST',
   '2026-09-10', '2026-11-20',
   'Looking for a warm family environment close to campus.', 13419.00, 639.00, 12780.00, 'PENDING_HOST');
