-- V6: Content library tables

CREATE TABLE cultural_phrases (
  phrase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  emoji VARCHAR(10),
  phrase VARCHAR(200) NOT NULL,
  translation VARCHAR(200) NOT NULL,
  audio_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE cultural_topics (
  topic_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  emoji VARCHAR(10),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE transport_tabs (
  tab_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  tab_key VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE transport_routes (
  route_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_id UUID NOT NULL REFERENCES transport_tabs(tab_id) ON DELETE CASCADE,
  route_key VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  fare_label VARCHAR(50) NOT NULL,
  estimated_price VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE tourist_sites (
  site_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_key VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  opening_hours VARCHAR(200),
  admission VARCHAR(200),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE prep_checklist_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  item_key VARCHAR(50) NOT NULL,
  label VARCHAR(300) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE emergency_contacts (
  contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(200) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE offline_map_landmarks (
  landmark_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  landmark_key VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  top_percent DECIMAL(5,2),
  left_percent DECIMAL(5,2),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE video_resources (
  video_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_key VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  youtube_id VARCHAR(20) NOT NULL,
  thumbnail_url TEXT,
  city VARCHAR(100) NOT NULL DEFAULT 'Accra',
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_cultural_phrases_city ON cultural_phrases(city, is_active);
CREATE INDEX idx_cultural_topics_city ON cultural_topics(city, is_active);
CREATE INDEX idx_transport_tabs_city ON transport_tabs(city, is_active);
CREATE INDEX idx_tourist_sites_city ON tourist_sites(city, is_active);
CREATE INDEX idx_prep_checklist_city ON prep_checklist_items(city, is_active);
CREATE INDEX idx_offline_landmarks_city ON offline_map_landmarks(city, is_active);
CREATE INDEX idx_video_resources_city ON video_resources(city, is_active);
