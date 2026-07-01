-- NestBridge core schema (V1)

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  primary_intent VARCHAR(30),
  nationality VARCHAR(100),
  languages TEXT[],
  profile_photo_url TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  trust_score DECIMAL(3,2) DEFAULT 0,
  preferred_language VARCHAR(10) DEFAULT 'en',
  date_of_birth DATE,
  is_minor BOOLEAN DEFAULT FALSE,
  is_active_exchange_student BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seeker_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
  steps_completed TEXT[] DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  completed_at TIMESTAMP
);

CREATE TABLE provider_setup (
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  track VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
  steps_completed TEXT[] DEFAULT '{}',
  profile_data JSONB DEFAULT '{}',
  completed_at TIMESTAMP,
  PRIMARY KEY (user_id, track)
);

CREATE TABLE host_profiles (
  host_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Ghana',
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  room_type VARCHAR(50),
  max_guests INT DEFAULT 1,
  price_per_night DECIMAL(10,2),
  amenities TEXT[],
  house_rules TEXT,
  diet_offered TEXT[],
  religion_friendly TEXT[],
  cancellation_policy VARCHAR(20) DEFAULT 'FLEXIBLE',
  availability_calendar JSONB DEFAULT '{}',
  photos TEXT[],
  accepts_minors BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT FALSE,
  review_count INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE guide_profiles (
  guide_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Ghana',
  service_types TEXT[],
  languages_offered TEXT[],
  price_per_session DECIMAL(10,2),
  session_duration_hours DECIMAL(3,1) DEFAULT 3,
  bio_extended TEXT,
  photos TEXT[],
  availability_schedule JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT FALSE,
  review_count INT DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE matches (
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type VARCHAR(10) NOT NULL,
  compatibility_score DECIMAL(5,2),
  score_breakdown JSONB,
  match_reasons TEXT[],
  status VARCHAR(20) DEFAULT 'PENDING',
  initiated_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

CREATE TABLE bookings (
  booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(match_id),
  guest_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  host_or_guide_id UUID NOT NULL,
  booking_type VARCHAR(10) NOT NULL,
  check_in DATE,
  check_out DATE,
  session_date DATE,
  session_start_time VARCHAR(10),
  session_duration_hours DECIMAL(3,1),
  guest_message TEXT,
  total_price DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  host_payout DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'PENDING',
  status VARCHAR(20) DEFAULT 'PENDING_HOST',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE welfare_check_ins (
  checkin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(booking_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  responses JSONB,
  flagged BOOLEAN DEFAULT FALSE,
  escalated BOOLEAN DEFAULT FALSE,
  escalation_notes TEXT
);

CREATE TABLE sos_events (
  sos_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  triggered_at TIMESTAMP DEFAULT NOW(),
  location_lat DECIMAL(9,6),
  location_lng DECIMAL(9,6),
  contacted_emergency BOOLEAN DEFAULT FALSE,
  contacted_support BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolution_notes TEXT
);

CREATE TABLE conversations (
  conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_a UUID REFERENCES users(user_id) ON DELETE CASCADE,
  participant_b UUID REFERENCES users(user_id) ON DELETE CASCADE,
  firebase_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lodging_partners (
  partner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website_url TEXT,
  booking_url TEXT,
  price_from DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'GHS',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_host_profiles_city ON host_profiles(city);
CREATE INDEX idx_host_profiles_active ON host_profiles(is_active);
CREATE INDEX idx_guide_profiles_city ON guide_profiles(city);
CREATE INDEX idx_guide_profiles_active ON guide_profiles(is_active);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_provider ON bookings(host_or_guide_id);
CREATE INDEX idx_bookings_status ON bookings(status);
