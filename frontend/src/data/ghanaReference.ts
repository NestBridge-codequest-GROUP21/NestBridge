/**
 * Ghana administrative regions, regional capitals, and tertiary institutions.
 * Single source of truth for onboarding, validation, matching, and demo data.
 */

export type UniversityCategory =
  | 'PUBLIC'
  | 'TECHNICAL'
  | 'PRIVATE'
  | 'SPECIALIZED';

export interface GhanaRegion {
  name: string;
  capital: string;
}

export interface GhanaUniversity {
  name: string;
  category: UniversityCategory;
  /** Primary town shown in listings (may differ from regional capital). */
  town: string;
  /** Destination cities (regional capitals) that should surface this institution. */
  matchDestinations: readonly string[];
  strengths?: string;
}

export const GHANA_REGIONS: readonly GhanaRegion[] = [
  { name: 'Ahafo', capital: 'Goaso' },
  { name: 'Ashanti', capital: 'Kumasi' },
  { name: 'Bono', capital: 'Sunyani' },
  { name: 'Bono East', capital: 'Techiman' },
  { name: 'Central', capital: 'Cape Coast' },
  { name: 'Eastern', capital: 'Koforidua' },
  { name: 'Greater Accra', capital: 'Accra' },
  { name: 'North East', capital: 'Nalerigu' },
  { name: 'Northern', capital: 'Tamale' },
  { name: 'Oti', capital: 'Dambai' },
  { name: 'Savannah', capital: 'Damongo' },
  { name: 'Upper East', capital: 'Bolgatanga' },
  { name: 'Upper West', capital: 'Wa' },
  { name: 'Volta', capital: 'Ho' },
  { name: 'Western', capital: 'Sekondi-Takoradi' },
  { name: 'Western North', capital: 'Sefwi Wiawso' },
] as const;

export const GHANA_UNIVERSITIES: readonly GhanaUniversity[] = [
  // Major public universities
  {
    name: 'University of Ghana (UG)',
    category: 'PUBLIC',
    town: 'Legon',
    matchDestinations: ['Accra'],
    strengths: 'Humanities, Law, Medicine, Business, Social Sciences',
  },
  {
    name: 'Kwame Nkrumah University of Science and Technology (KNUST)',
    category: 'PUBLIC',
    town: 'Kumasi',
    matchDestinations: ['Kumasi'],
    strengths: 'Engineering, Architecture, Pharmacy, Computer Science',
  },
  {
    name: 'University of Cape Coast (UCC)',
    category: 'PUBLIC',
    town: 'Cape Coast',
    matchDestinations: ['Cape Coast'],
    strengths: 'Education, Business, Allied Health, Social Sciences',
  },
  {
    name: 'University for Development Studies (UDS)',
    category: 'PUBLIC',
    town: 'Tamale',
    matchDestinations: ['Tamale'],
    strengths: 'Medicine, Agriculture, Development Studies, Public Health',
  },
  {
    name: 'University of Education, Winneba (UEW)',
    category: 'PUBLIC',
    town: 'Winneba',
    matchDestinations: ['Cape Coast'],
    strengths: 'Teacher Education, Educational Policy, Creative Arts',
  },
  {
    name: 'University of Mines and Technology (UMaT)',
    category: 'PUBLIC',
    town: 'Tarkwa',
    matchDestinations: ['Sekondi-Takoradi'],
    strengths: 'Mining Engineering, Geomatic Engineering, Mineral Technology',
  },
  {
    name: 'University of Health and Allied Sciences (UHAS)',
    category: 'PUBLIC',
    town: 'Ho',
    matchDestinations: ['Ho'],
    strengths: 'Nursing, Public Health, Pharmacy, Medicine',
  },
  {
    name: 'University of Energy and Natural Resources (UENR)',
    category: 'PUBLIC',
    town: 'Sunyani',
    matchDestinations: ['Sunyani'],
    strengths: 'Forestry, Renewable Energy, Environmental Sciences',
  },
  {
    name: 'University of Professional Studies, Accra (UPSA)',
    category: 'PUBLIC',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'Accounting, Banking & Finance, Marketing, Law',
  },
  {
    name: 'Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development (AAMUSTED)',
    category: 'PUBLIC',
    town: 'Kumasi',
    matchDestinations: ['Kumasi'],
    strengths: 'TVET, Entrepreneurship',
  },
  // Technical universities
  {
    name: 'Accra Technical University (ATU)',
    category: 'TECHNICAL',
    town: 'Accra',
    matchDestinations: ['Accra'],
  },
  {
    name: 'Kumasi Technical University (KsTU)',
    category: 'TECHNICAL',
    town: 'Kumasi',
    matchDestinations: ['Kumasi'],
  },
  {
    name: 'Takoradi Technical University (TTU)',
    category: 'TECHNICAL',
    town: 'Takoradi',
    matchDestinations: ['Sekondi-Takoradi'],
  },
  {
    name: 'Koforidua Technical University (KTU)',
    category: 'TECHNICAL',
    town: 'Koforidua',
    matchDestinations: ['Koforidua'],
  },
  {
    name: 'Ho Technical University (HTU)',
    category: 'TECHNICAL',
    town: 'Ho',
    matchDestinations: ['Ho'],
  },
  {
    name: 'Sunyani Technical University (STU)',
    category: 'TECHNICAL',
    town: 'Sunyani',
    matchDestinations: ['Sunyani'],
  },
  {
    name: 'Cape Coast Technical University (CCTU)',
    category: 'TECHNICAL',
    town: 'Cape Coast',
    matchDestinations: ['Cape Coast'],
  },
  {
    name: 'Bolgatanga Technical University (BTU)',
    category: 'TECHNICAL',
    town: 'Bolgatanga',
    matchDestinations: ['Bolgatanga'],
  },
  {
    name: 'Wa Technical University',
    category: 'TECHNICAL',
    town: 'Wa',
    matchDestinations: ['Wa'],
  },
  // Notable private universities
  {
    name: 'Ashesi University',
    category: 'PRIVATE',
    town: 'Berekuso',
    matchDestinations: ['Accra'],
    strengths: 'Liberal arts, Computer Science, Engineering',
  },
  {
    name: 'Central University',
    category: 'PRIVATE',
    town: 'Tema',
    matchDestinations: ['Accra'],
    strengths: 'Business, Theology, Law',
  },
  {
    name: 'Valley View University',
    category: 'PRIVATE',
    town: 'Oyibi',
    matchDestinations: ['Accra'],
    strengths: 'Computer Science, Business',
  },
  {
    name: 'Academic City University College',
    category: 'PRIVATE',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'AI, Robotics, Design Thinking',
  },
  {
    name: 'Pentecost University',
    category: 'PRIVATE',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'Business, IT, Theology',
  },
  {
    name: 'Catholic University of Ghana (CUG)',
    category: 'PRIVATE',
    town: 'Fiapre',
    matchDestinations: ['Sunyani'],
    strengths: 'Public Health, Education, Business',
  },
  {
    name: 'Presbyterian University, Ghana',
    category: 'PRIVATE',
    town: 'Abetifi',
    matchDestinations: ['Koforidua'],
    strengths: 'Healthcare, Agriculture, Business',
  },
  {
    name: 'All Nations University',
    category: 'PRIVATE',
    town: 'Koforidua',
    matchDestinations: ['Koforidua'],
    strengths: 'Space Science, Engineering, Technology',
  },
  {
    name: 'Lancaster University Ghana',
    category: 'PRIVATE',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'International Business, Law',
  },
  // Specialized institutes
  {
    name: 'Ghana Institute of Management and Public Administration (GIMPA)',
    category: 'SPECIALIZED',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'Public Administration, Executive Education, Law',
  },
  {
    name: 'University of Media, Arts and Communication (UniMAC)',
    category: 'SPECIALIZED',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'Journalism, Languages, Film & Television',
  },
  {
    name: 'Regional Maritime University (RMU)',
    category: 'SPECIALIZED',
    town: 'Accra',
    matchDestinations: ['Accra'],
    strengths: 'Maritime Education',
  },
] as const;

export const UNIVERSITY_OTHER_OPTION = 'Other / area not listed';

/** Accra neighbourhoods and common search tokens beyond regional capitals. */
export const GHANA_NEIGHBOURHOODS = [
  'Legon',
  'East Legon',
  'Cantonments',
  'Osu',
  'Labadi',
  'Madina',
  'Adenta',
  'Tema',
  'Achimota',
  'Dansoman',
  'Spintex',
  'Airport Residential',
  'North Legon',
  'Ayeduase',
  'Adum',
  'Berekuso',
  'Winneba',
  'Tarkwa',
  'Oyibi',
  'Mampong',
  'Takoradi',
  'Sekondi',
  'Pedu',
  'Kalpohin',
] as const;

/** Maps common place tokens to a regional capital used for matching. */
const CITY_ALIASES: Record<string, string> = {
  legon: 'Accra',
  'east legon': 'Accra',
  cantonments: 'Accra',
  osu: 'Accra',
  labadi: 'Accra',
  madina: 'Accra',
  adenta: 'Accra',
  tema: 'Accra',
  achimota: 'Accra',
  dansoman: 'Accra',
  spintex: 'Accra',
  'airport residential': 'Accra',
  'north legon': 'Accra',
  berekuso: 'Accra',
  oyibi: 'Accra',
  'greater accra': 'Accra',
  ayeduase: 'Kumasi',
  adum: 'Kumasi',
  mampong: 'Kumasi',
  ashanti: 'Kumasi',
  winneba: 'Cape Coast',
  pedu: 'Cape Coast',
  'cape coast': 'Cape Coast',
  tarkwa: 'Sekondi-Takoradi',
  takoradi: 'Sekondi-Takoradi',
  sekondi: 'Sekondi-Takoradi',
  'sekondi-takoradi': 'Sekondi-Takoradi',
  kalpohin: 'Tamale',
  'sefwi wiawso': 'Sefwi Wiawso',
};

export function normalizePlaceToken(text: string): string {
  return text.trim().toLowerCase();
}

export function destinationCityOptions(): string[] {
  return GHANA_REGIONS.map((region) => region.capital).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function regionForCapital(capital: string): GhanaRegion | undefined {
  const normalized = normalizePlaceToken(capital);
  return GHANA_REGIONS.find(
    (region) => normalizePlaceToken(region.capital) === normalized,
  );
}

export function normalizeCity(city: string): string {
  const trimmed = city.trim();
  if (!trimmed) {
    return 'Accra';
  }

  const firstPart = trimmed.split(',')[0]?.trim() ?? trimmed;
  const token = normalizePlaceToken(firstPart);

  const alias = CITY_ALIASES[token];
  if (alias) {
    return alias;
  }

  const capitalMatch = GHANA_REGIONS.find(
    (region) => normalizePlaceToken(region.capital) === token,
  );
  if (capitalMatch) {
    return capitalMatch.capital;
  }

  return firstPart;
}

export function allKnownPlaceTokens(): string[] {
  const capitals = GHANA_REGIONS.map((region) => region.capital);
  const regions = GHANA_REGIONS.map((region) => region.name);
  const towns = GHANA_UNIVERSITIES.map((uni) => uni.town);
  return [...capitals, ...regions, ...GHANA_NEIGHBOURHOODS, ...towns].map(
    normalizePlaceToken,
  );
}

export function isKnownGhanaPlace(text: string): boolean {
  const normalized = normalizePlaceToken(text);
  const tokens = allKnownPlaceTokens();
  if (tokens.includes(normalized)) {
    return true;
  }

  const firstPart = normalized.split(',')[0]?.trim() ?? '';
  if (tokens.includes(firstPart)) {
    return true;
  }

  return CITY_ALIASES[normalized] != null || CITY_ALIASES[firstPart] != null;
}

export function universitiesForCity(city: string): string[] {
  const normalizedDestination = normalizePlaceToken(normalizeCity(city));
  const matches = GHANA_UNIVERSITIES.filter((uni) =>
    uni.matchDestinations.some(
      (destination) =>
        normalizePlaceToken(destination) === normalizedDestination,
    ),
  );

  return matches.map((uni) => uni.name);
}

export function allUniversityOptions(): string[] {
  return GHANA_UNIVERSITIES.map((uni) => uni.name);
}

export function universityOptionsForCity(city: string): string[] {
  const filtered = universitiesForCity(city);
  if (filtered.length === 0) {
    return [...allUniversityOptions(), UNIVERSITY_OTHER_OPTION];
  }
  return [...filtered, UNIVERSITY_OTHER_OPTION];
}

export function destinationPlaceholderExamples(limit = 4): string {
  return destinationCityOptions().slice(0, limit).join(', ');
}

/** @deprecated Use destinationCityOptions — kept for legacy imports. */
export const GHANA_PLACES = allKnownPlaceTokens() as readonly string[];
