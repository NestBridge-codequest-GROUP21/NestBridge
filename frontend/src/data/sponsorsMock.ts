export type SponsorCategory =
  | 'Government'
  | 'Foundation'
  | 'Education'
  | 'Technology'
  | 'Hospitality'
  | 'NGO';

export interface SponsorListing {
  id: string;
  name: string;
  category: SponsorCategory;
  description: string;
  amountLabel: string;
  logo: string;
  eligibility: string;
  deadline: string;
  duration: string;
  location: string;
  aboutExtra: string;
  requirements: string[];
}

export const SPONSOR_CATEGORIES: Array<SponsorCategory | 'All'> = [
  'All',
  'Government',
  'Foundation',
  'Education',
  'Technology',
  'Hospitality',
  'NGO',
];

const COMMON_STUDENT_REQUIREMENTS = [
  'Valid student ID or enrollment letter',
  'Personal statement (300–500 words)',
  'Proof of financial need',
];

export const SPONSORS_MOCK: SponsorListing[] = [
  {
    id: '1',
    name: 'Ghana Tourism Authority',
    category: 'Government',
    description: 'Supporting student travel across Ghana.',
    amountLabel: 'Up to GHS 15,000',
    logo: '🏛️',
    eligibility: 'International students enrolled in accredited universities',
    deadline: 'August 30, 2026',
    duration: 'One academic year',
    location: 'Ghana & West Africa',
    aboutExtra:
      'This sponsorship helps international students and tourists experience the rich culture, history, and opportunities across the region. Recipients gain access to housing support, cultural immersion programmes, and mentorship networks.',
    requirements: [
      ...COMMON_STUDENT_REQUIREMENTS,
      'Minimum GPA of 2.5 or equivalent',
      'Two letters of recommendation',
    ],
  },
  {
    id: 'gov-2',
    name: 'Ministry of Education Exchange Grant',
    category: 'Government',
    description: 'National grant for inbound exchange students.',
    amountLabel: 'Up to GHS 12,000',
    logo: '🏛️',
    eligibility: 'Exchange students at public Ghanaian universities',
    deadline: 'July 20, 2026',
    duration: 'One academic semester',
    location: 'Nationwide',
    aboutExtra:
      'Covers part of accommodation and orientation costs for students arriving through formal exchange agreements.',
    requirements: [
      ...COMMON_STUDENT_REQUIREMENTS,
      'Exchange placement letter from host university',
    ],
  },
  {
    id: '2',
    name: 'Ashanti Royal Foundation',
    category: 'Foundation',
    description: 'Cultural heritage and student support.',
    amountLabel: 'Up to GHS 10,500',
    logo: '👑',
    eligibility: 'Students studying or visiting Ashanti Region',
    deadline: 'September 15, 2026',
    duration: 'One semester',
    location: 'Kumasi & Ashanti Region',
    aboutExtra:
      'Focused on cultural exchange and heritage learning for students settling into Ghana.',
    requirements: [
      'Valid student ID or enrollment letter',
      'Short essay on cultural interest',
      'Reference from a faculty member',
    ],
  },
  {
    id: 'found-2',
    name: 'Cape Coast Heritage Trust',
    category: 'Foundation',
    description: 'Support for students near historic coastal sites.',
    amountLabel: 'Up to GHS 8,000',
    logo: '👑',
    eligibility: 'Students living or studying in Central Region',
    deadline: 'August 10, 2026',
    duration: 'One semester',
    location: 'Cape Coast & Elmina',
    aboutExtra:
      'Helps students engage with coastal heritage programmes while covering homestay deposits.',
    requirements: [
      ...COMMON_STUDENT_REQUIREMENTS,
      'Short reflection on heritage learning goals',
    ],
  },
  {
    id: '3',
    name: 'KNUST Alumni Network',
    category: 'Education',
    description: 'Empowering KNUST students abroad.',
    amountLabel: 'Up to GHS 6,000',
    logo: '🎓',
    eligibility: 'KNUST-bound or KNUST exchange students',
    deadline: 'July 31, 2026',
    duration: 'One academic term',
    location: 'Kumasi',
    aboutExtra:
      'Alumni-funded support for accommodation and orientation costs near campus.',
    requirements: [
      'Proof of KNUST admission or exchange placement',
      'Personal statement (300 words)',
      'Student ID',
    ],
  },
  {
    id: 'edu-2',
    name: 'University of Ghana Partner Fund',
    category: 'Education',
    description: 'Campus welcome support for UG inbound students.',
    amountLabel: 'Up to GHS 7,500',
    logo: '🎓',
    eligibility: 'Inbound students at University of Ghana',
    deadline: 'August 5, 2026',
    duration: 'First semester',
    location: 'Accra / Legon',
    aboutExtra:
      'Orientation stipends and host-family match support for new arrivals at UG.',
    requirements: [
      'UG admission or exchange letter',
      ...COMMON_STUDENT_REQUIREMENTS,
    ],
  },
  {
    id: 'edu-3',
    name: 'UCC International Office Bursary',
    category: 'Education',
    description: 'Bursary for Cape Coast campus arrivals.',
    amountLabel: 'Up to GHS 5,500',
    logo: '🎓',
    eligibility: 'International students at University of Cape Coast',
    deadline: 'July 25, 2026',
    duration: 'One academic term',
    location: 'Cape Coast',
    aboutExtra:
      'Helps cover transport from Accra and the first month of lodging near campus.',
    requirements: [
      'UCC enrollment proof',
      'Personal statement (300 words)',
    ],
  },
  {
    id: '4',
    name: 'AfriTech Ventures',
    category: 'Technology',
    description: 'Tech-driven travel sponsorships.',
    amountLabel: 'Up to GHS 12,600',
    logo: '💻',
    eligibility: 'STEM students on exchange in Ghana',
    deadline: 'October 1, 2026',
    duration: 'One academic year',
    location: 'Accra & Kumasi',
    aboutExtra:
      'Supports students pursuing internships or research stays with local tech partners.',
    requirements: [
      'STEM programme enrollment proof',
      'Portfolio or project summary',
      'Personal statement (400 words)',
    ],
  },
  {
    id: 'tech-2',
    name: 'Accra Innovation Hub Scholars',
    category: 'Technology',
    description: 'Stipends for tech interns and research visitors.',
    amountLabel: 'Up to GHS 9,000',
    logo: '💻',
    eligibility: 'Students with confirmed Ghana tech internships',
    deadline: 'September 5, 2026',
    duration: '8–12 weeks',
    location: 'Accra',
    aboutExtra:
      'Covers coworking access and part of lodging for short tech placements.',
    requirements: [
      'Internship offer letter',
      'STEM enrollment proof',
      'Short project summary',
    ],
  },
  {
    id: '5',
    name: 'Accra Hospitality Group',
    category: 'Hospitality',
    description: 'Comfortable stays for international students.',
    amountLabel: 'Up to GHS 5,400',
    logo: '🏨',
    eligibility: 'First-year international students in Accra',
    deadline: 'August 15, 2026',
    duration: 'First semester',
    location: 'Accra',
    aboutExtra:
      'Short-term lodging credits and welcome packages for newly arrived students.',
    requirements: [
      'Proof of Accra enrollment',
      'Arrival dates within sponsor window',
      'Basic financial need statement',
    ],
  },
  {
    id: 'hosp-2',
    name: 'Labadi Welcome Stays',
    category: 'Hospitality',
    description: 'Partner hotel nights for new arrivals.',
    amountLabel: 'Up to GHS 4,200',
    logo: '🏨',
    eligibility: 'Students landing in Accra within 14 days of term start',
    deadline: 'Rolling until August 2026',
    duration: 'Up to 5 nights',
    location: 'Accra (Labadi / Airport area)',
    aboutExtra:
      'Bridge lodging after arrival while NestBridge host matching completes.',
    requirements: [
      'Flight itinerary',
      'University enrollment proof',
    ],
  },
  {
    id: '6',
    name: 'West Africa Students Fund',
    category: 'NGO',
    description: 'Pan-African student travel support.',
    amountLabel: 'Up to GHS 18,000',
    logo: '🌍',
    eligibility: 'International students from ECOWAS member states',
    deadline: 'September 30, 2026',
    duration: 'One academic year',
    location: 'Ghana',
    aboutExtra:
      'Regional fund covering travel, homestay deposits, and emergency support buffers.',
    requirements: [
      'Valid passport and student visa',
      'Enrollment letter',
      'Two references',
      'Financial need documentation',
    ],
  },
  {
    id: 'ngo-2',
    name: 'Safe Passage Ghana',
    category: 'NGO',
    description: 'Welfare and emergency buffer for new arrivals.',
    amountLabel: 'Up to GHS 3,500',
    logo: '🌍',
    eligibility: 'International students in first 90 days in Ghana',
    deadline: 'Open year-round',
    duration: 'One-time support',
    location: 'Nationwide',
    aboutExtra:
      'Small grants for emergency transport, SIM setup, and early welfare needs.',
    requirements: [
      'Enrollment letter',
      'Brief need statement',
    ],
  },
];

export function getSponsorById(sponsorId: string): SponsorListing | undefined {
  return SPONSORS_MOCK.find((sponsor) => sponsor.id === sponsorId);
}
