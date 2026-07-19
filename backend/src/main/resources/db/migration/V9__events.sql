-- V9: Student events + attendees (RSVPs)

CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'MEETUP',
  organizer_kind VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
  event_date_label VARCHAR(120),
  location VARCHAR(200),
  description TEXT,
  capacity INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_attendees (
  attendee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX idx_events_created_at ON events (created_at DESC);
CREATE INDEX idx_event_attendees_event ON event_attendees (event_id);
CREATE INDEX idx_event_attendees_user ON event_attendees (user_id);
