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
      'Valid student ID or enrollment letter',
      'Minimum GPA of 2.5 or equivalent',
      'Personal statement (500 words)',
      'Two letters of recommendation',
      'Proof of financial need',
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
];

export function getSponsorById(sponsorId: string): SponsorListing | undefined {
  return SPONSORS_MOCK.find((sponsor) => sponsor.id === sponsorId);
}
