-- Align Kakum with Cape Coast destination filtering and rename legacy site-1 key.
UPDATE tourist_sites
SET city = 'Cape Coast'
WHERE site_key = 'site-kakum';

UPDATE tourist_sites
SET site_key = 'site-nkrumah'
WHERE site_key = 'site-1';
