-- V10: Demo student events + attendees
-- Organizers reference existing seeded users (students 11111111-*, hosts 22222222-*).

INSERT INTO events (event_id, host_id, title, type, organizer_kind, event_date_label, location, description, capacity)
VALUES
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201',
   'Welcome dinner at the Mensah home', 'FOOD', 'FAMILY',
   'Sat, Jul 18 · 5:00 PM', 'East Legon, Accra',
   'Home-cooked Ghanaian dinner for new exchange students. Come hungry and meet other families.', 12),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222204',
   'Weekend trip to Cape Coast Castle', 'TRIP', 'ORG',
   'Sun, Jul 26 · 7:00 AM', 'Departs University of Ghana',
   'Guided day trip to Cape Coast and Kakum. Transport and entry included — opt in to reserve a seat.', 30),
  ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111102',
   'Twi language & games night', 'MEETUP', 'STUDENT',
   'Fri, Jul 24 · 6:30 PM', 'Campus common room, Block C',
   'Casual practice night — learn market phrases, play games, and make friends. All levels welcome.', 20),
  ('66666666-6666-6666-6666-666666666604', '11111111-1111-1111-1111-111111111101',
   'Independence Square photo walk', 'CULTURAL', 'STUDENT',
   'Sat, Aug 2 · 9:00 AM', 'Black Star Square, Accra',
   'Morning walk around the historic square. Bring a camera or just tag along for the views.', 15);

-- Attendees (RSVPs). Hosts count as attending their own event.
INSERT INTO event_attendees (event_id, user_id)
VALUES
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101'),
  ('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111102'),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222204'),
  ('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111101'),
  ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111102'),
  ('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111101'),
  ('66666666-6666-6666-6666-666666666604', '11111111-1111-1111-1111-111111111101');
