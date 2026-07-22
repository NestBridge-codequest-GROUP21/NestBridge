/**
 * Practical Local Tips — daily living logistics for foreigners in Ghana.
 * Culture, etiquette, and language live in cultureLanguageGuide.ts.
 */

export type PracticalTipCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type PracticalTipSection = {
  id: string;
  title: string;
  subtitle: string;
  tips: PracticalTipCard[];
};

export const practicalLocalTipSections: PracticalTipSection[] = [
  {
    id: 'transport',
    title: 'Transport',
    subtitle: 'How people actually move around — pair with the Transport guide for routes.',
    tips: [
      {
        id: 'ride-apps',
        emoji: '📱',
        title: 'Use ride apps when you can',
        description:
          'Bolt and Yango are widely used in major cities. Confirm the plate before you enter and share your trip with a friend at night.',
      },
      {
        id: 'trotro-basics',
        emoji: '🚌',
        title: 'Trotro basics',
        description:
          'Shared minibuses are cheap and common. The “mate” collects fares and calls stops. Say your stop early, keep small notes ready, and ask which station serves your route.',
      },
      {
        id: 'taxi-fare',
        emoji: '🚕',
        title: 'Agree unmarked taxi fares first',
        description:
          'Before an unmarked taxi moves, agree the price. If the quote feels high, politely decline and use an app or wait for another car.',
      },
    ],
  },
  {
    id: 'weather',
    title: 'Weather',
    subtitle: 'Pack and plan for heat, humidity, and rain seasons.',
    tips: [
      {
        id: 'heat-hydration',
        emoji: '🥵',
        title: 'Heat and hydration',
        description:
          'Expect strong sun and humidity on the coast. Carry sealed water, use sunscreen, and schedule walking for cooler morning or evening hours when you can.',
      },
      {
        id: 'rainy-season',
        emoji: '🌧️',
        title: 'Rainy season planning',
        description:
          'Heavy rains can flood roads and delay trotros. Keep a compact umbrella or light rain jacket and waterproof your phone and documents.',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    subtitle: 'Street-smart habits that reduce everyday risk.',
    tips: [
      {
        id: 'night-travel',
        emoji: '🌙',
        title: 'Night travel',
        description:
          'Prefer ride apps after dark. Avoid walking alone on poorly lit streets with headphones in, and keep valuables out of sight.',
      },
      {
        id: 'crowds',
        emoji: '🛡️',
        title: 'Crowded markets and stations',
        description:
          'In busy markets and transport hubs, keep your phone and wallet in a front pocket or zipped bag. Be polite but firm with persistent hawkers.',
      },
      {
        id: 'sos-ready',
        emoji: '🆘',
        title: 'Save emergency numbers',
        description:
          'Know Ghana’s emergency lines and your campus or hotel security desk. NestBridge SOS keeps key contacts in one place.',
      },
    ],
  },
  {
    id: 'banking',
    title: 'Banking',
    subtitle: 'Cash, cards, and everyday money practicalities.',
    tips: [
      {
        id: 'atm-use',
        emoji: '🏧',
        title: 'ATMs and cards',
        description:
          'Use ATMs at banks or busy malls when possible. Tell your home bank you are travelling. Keep a small cash float for trotros and street food.',
      },
      {
        id: 'currency',
        emoji: '₵',
        title: 'Ghana cedi basics',
        description:
          'Prices are in Ghana cedis (GHS). Break large notes at shops when you can — mates and small vendors prefer smaller denominations.',
      },
    ],
  },
  {
    id: 'mobile-money',
    title: 'Mobile money',
    subtitle: 'MoMo is everyday infrastructure — treat your PIN like a bank password.',
    tips: [
      {
        id: 'momo-register',
        emoji: '📲',
        title: 'Register with valid ID',
        description:
          'MTN MoMo and other wallets are used for transfers, airtime, and many payments. Register with your passport or approved ID and store the SIM securely.',
      },
      {
        id: 'momo-safety',
        emoji: '🔒',
        title: 'Protect your PIN and prompts',
        description:
          'Never share your MoMo PIN. Ignore unexpected USSD prompts from strangers. Confirm the recipient name before you send money.',
      },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping',
    subtitle: 'Markets, malls, and everyday purchases.',
    tips: [
      {
        id: 'market-cash',
        emoji: '🛍️',
        title: 'Markets often prefer cash',
        description:
          'Open markets may be cash-first even when MoMo exists. Ask the price first, keep small notes ready, and compare a few stalls for fresh food.',
      },
      {
        id: 'malls-supermarkets',
        emoji: '🏪',
        title: 'Malls and supermarkets',
        description:
          'Larger shops and malls are useful for familiar brands, cards, and fixed prices when you do not want to bargain.',
      },
    ],
  },
  {
    id: 'internet-sim',
    title: 'Internet and SIM cards',
    subtitle: 'Get connected quickly after arrival.',
    tips: [
      {
        id: 'local-sim',
        emoji: '📶',
        title: 'Buy a local SIM',
        description:
          'MTN, Telecel, and AirtelTigo kiosks are common at airports and malls. Bring your passport for registration and ask staff to help set a data bundle.',
      },
      {
        id: 'data-bundles',
        emoji: '📡',
        title: 'Data bundles beat random browsing',
        description:
          'Buy a known data package rather than relying on pay-as-you-go guesses. Keep a screenshot of your bundle balance and customer-care code.',
      },
      {
        id: 'wifi-expectations',
        emoji: '💻',
        title: 'Wi‑Fi varies by place',
        description:
          'Hotels, campuses, and cafés may offer Wi‑Fi, but speeds vary. Download offline maps and key documents before long road trips.',
      },
    ],
  },
  {
    id: 'budgeting',
    title: 'Budgeting',
    subtitle: 'Simple cost habits for the first month.',
    tips: [
      {
        id: 'week-one-buffer',
        emoji: '🧾',
        title: 'Keep a week-one buffer',
        description:
          'Your first days often include SIM, transport experiments, and extra meals out. Keep an emergency cash buffer separate from daily spending.',
      },
      {
        id: 'track-small-fares',
        emoji: '🧮',
        title: 'Track small fares',
        description:
          'Trotro and snack costs add up quietly. A simple daily note in your phone helps you adjust before money gets tight.',
      },
    ],
  },
  {
    id: 'student-survival',
    title: 'Student survival',
    subtitle: 'Campus-focused habits for exchange and international students.',
    tips: [
      {
        id: 'campus-orientation',
        emoji: '🎓',
        title: 'Use campus orientation',
        description:
          'Attend faculty orientation, find the international student office, and save clinic and security numbers in your phone on day one.',
      },
      {
        id: 'student-id',
        emoji: '🪪',
        title: 'Carry student ID when useful',
        description:
          'Student ID can help with campus access and some discounts. Keep a photo of key documents in an offline folder.',
      },
      {
        id: 'study-power',
        emoji: '🔋',
        title: 'Plan for power and study spaces',
        description:
          'Power cuts happen. Charge devices when power is on, keep a small power bank, and learn which campus spaces have more reliable outlets and Wi‑Fi.',
      },
    ],
  },
  {
    id: 'navigating-cities',
    title: 'Navigating cities',
    subtitle: 'Landmarks beat exact street numbers in many places.',
    tips: [
      {
        id: 'landmarks',
        emoji: '🗺️',
        title: 'Navigate by landmarks',
        description:
          'Directions often use junctions, malls, churches, or “the big roundabout.” Save landmark names, not only street addresses, in your maps app.',
      },
      {
        id: 'offline-maps',
        emoji: '📥',
        title: 'Download offline maps',
        description:
          'Download your city for offline use before you lose signal in traffic or on intercity roads. NestBridge also offers an offline map screen for key pins.',
      },
      {
        id: 'ask-locals',
        emoji: '🗣️',
        title: 'Ask locally — then confirm',
        description:
          'Shopkeepers and security guards are often helpful with directions. Cross-check with your map pin so one wrong turn does not compound.',
      },
    ],
  },
];
