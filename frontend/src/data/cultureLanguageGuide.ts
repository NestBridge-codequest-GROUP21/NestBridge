/**
 * Ghana Culture & Language Guide — communication, etiquette, and customs.
 * Practical daily living (transport fares, SIM, banking) lives in practicalLocalTips.
 */

export type CulturalPhraseCard = {
  id: string;
  emoji: string;
  phrase: string;
  /** Plain-English meaning and when to use it. */
  translation: string;
  /** Simple sound guide for beginners (not IPA). */
  pronunciation: string;
  hasAudio: boolean;
};

export type CulturalTopicCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type PhraseGuideSection = {
  id: string;
  title: string;
  subtitle: string;
  phrases: CulturalPhraseCard[];
};

export type TopicGuideSection = {
  id: string;
  title: string;
  subtitle: string;
  topics: CulturalTopicCard[];
};

export type CultureGuideProgressSummary = {
  phrasesCompleted: number;
  phrasesTotal: number;
  topicsCompleted: number;
  topicsTotal: number;
  pronunciationPracticed: number;
  percent: number;
};

const phrase = (
  partial: Omit<CulturalPhraseCard, 'hasAudio'> & { hasAudio?: boolean },
): CulturalPhraseCard => ({
  hasAudio: partial.hasAudio ?? true,
  ...partial,
});

/** Curated Twi / everyday Ghana phrases for newcomers. */
export const culturePhraseSections: PhraseGuideSection[] = [
  {
    id: 'greetings-time',
    title: 'Greetings by time of day',
    subtitle: 'Start every interaction with a greeting — it matters more than the request.',
    phrases: [
      phrase({
        id: 'akwaaba',
        emoji: '👋',
        phrase: 'Akwaaba',
        pronunciation: 'ah-KWAH-bah',
        translation: 'Welcome — warm reply when someone arrives at a home, shop, or gathering.',
      }),
      phrase({
        id: 'maakye',
        emoji: '🌅',
        phrase: 'Maakye',
        pronunciation: 'maa-CHEH',
        translation: 'Good morning — use until late morning with hosts, neighbours, and vendors.',
      }),
      phrase({
        id: 'maaha',
        emoji: '☀️',
        phrase: 'Maaha',
        pronunciation: 'maa-HAH',
        translation: 'Good afternoon — friendly daytime greeting after midday.',
      }),
      phrase({
        id: 'maadwo',
        emoji: '🌙',
        phrase: 'Maadwo',
        pronunciation: 'maa-JOH',
        translation: 'Good evening — use from late afternoon into the night.',
      }),
      phrase({
        id: 'eti-sen',
        emoji: '😊',
        phrase: 'Ɛte sɛn?',
        pronunciation: 'eh-teh SEN',
        translation: 'How are you? — everyday check-in; people often expect a brief reply.',
      }),
    ],
  },
  {
    id: 'responses',
    title: 'Common responses',
    subtitle: 'Short replies you will hear and can use confidently.',
    phrases: [
      phrase({
        id: 'me-ho-ye',
        emoji: '🙂',
        phrase: 'Me ho yɛ',
        pronunciation: 'meh ho YEH',
        translation: 'I am fine — standard reply to “Ɛte sɛn?”',
      }),
      phrase({
        id: 'eye',
        emoji: '👍',
        phrase: 'Ɛyɛ',
        pronunciation: 'eh-YEH',
        translation: 'It’s fine / okay — casual agreement you will hear often.',
      }),
      phrase({
        id: 'aane',
        emoji: '✅',
        phrase: 'Aane',
        pronunciation: 'AH-neh',
        translation: 'Yes — clear agreement.',
      }),
      phrase({
        id: 'daabi',
        emoji: '🚫',
        phrase: 'Daabi',
        pronunciation: 'DAH-bee',
        translation: 'No — polite refusal; soften with “mepa wo kyɛw” when needed.',
      }),
      phrase({
        id: 'medaase',
        emoji: '🙏',
        phrase: 'Medaase',
        pronunciation: 'meh-DAA-seh',
        translation: 'Thank you — use freely with hosts, drivers, and vendors.',
      }),
      phrase({
        id: 'medaase-paa',
        emoji: '🙌',
        phrase: 'Medaase paa',
        pronunciation: 'meh-DAA-seh paa',
        translation: 'Thank you very much — stronger gratitude after real help.',
      }),
    ],
  },
  {
    id: 'address',
    title: 'Respectful forms of address',
    subtitle: 'Titles show respect — especially with elders and people in authority.',
    phrases: [
      phrase({
        id: 'papa',
        emoji: '🧓',
        phrase: 'Papa / Maame',
        pronunciation: 'PAH-pah / MAA-meh',
        translation: 'Polite ways to address an older man / woman when you do not know their name.',
      }),
      phrase({
        id: 'bra-sister',
        emoji: '🧑',
        phrase: 'Bra / Sister',
        pronunciation: 'brah / SIS-ter',
        translation: 'Friendly address for a younger or peer man / woman in casual settings.',
      }),
      phrase({
        id: 'mepa-kyew',
        emoji: '✋',
        phrase: 'Mepa wo kyɛw',
        pronunciation: 'meh-pah woh CHEW',
        translation: 'Please / excuse me — get attention politely before asking anything.',
      }),
      phrase({
        id: 'me-din-de',
        emoji: '🗣️',
        phrase: 'Me din de…',
        pronunciation: 'meh deen deh…',
        translation: 'My name is… — introduce yourself to a host family or new acquaintance.',
      }),
    ],
  },
  {
    id: 'asking-help',
    title: 'Asking for help',
    subtitle: 'Clear, polite phrases when you are lost or unsure.',
    phrases: [
      phrase({
        id: 'boa-me',
        emoji: '🛟',
        phrase: 'Mepa wo kyɛw, boa me',
        pronunciation: 'meh-pah woh CHEW, boh-ah meh',
        translation: 'Please help me — opener before explaining what you need.',
      }),
      phrase({
        id: 'where-is',
        emoji: '📍',
        phrase: 'Ɛhe na… wɔ?',
        pronunciation: 'eh-HEH nah… woh',
        translation: 'Where is …? — add a place name after (e.g. the station, the pharmacy).',
      }),
      phrase({
        id: 'slow-down',
        emoji: '🐢',
        phrase: 'Kasa brɛoo',
        pronunciation: 'KAH-sah BREH-oh',
        translation: 'Please speak slowly — useful when you are still learning.',
      }),
      phrase({
        id: 'no-twi',
        emoji: '🔤',
        phrase: 'Mente Twi',
        pronunciation: 'men-teh CHwee',
        translation: 'I do not understand Twi — many people will switch to English kindly.',
      }),
    ],
  },
  {
    id: 'market',
    title: 'Market conversations',
    subtitle: 'Useful when buying food, fabric, or small goods.',
    phrases: [
      phrase({
        id: 'eye-sen',
        emoji: '💰',
        phrase: 'Ɛyɛ sɛn?',
        pronunciation: 'eh-YEH sen',
        translation: 'How much is it? — ask before assuming a price.',
      }),
      phrase({
        id: 'te-so',
        emoji: '📉',
        phrase: 'Te so kakra',
        pronunciation: 'teh so KAH-krah',
        translation: 'Reduce it a little — polite way to negotiate; stay friendly.',
      }),
      phrase({
        id: 'me-pe',
        emoji: '🛒',
        phrase: 'Me pɛ…',
        pronunciation: 'meh peh…',
        translation: 'I want… — name the item after (water, tomatoes, cloth).',
      }),
      phrase({
        id: 'eye-me',
        emoji: '🤝',
        phrase: 'Ɛyɛ me',
        pronunciation: 'eh-YEH meh',
        translation: 'I’ll take it — confirm you are buying at the agreed price.',
      }),
    ],
  },
  {
    id: 'food',
    title: 'Ordering food',
    subtitle: 'At chop bars, street stalls, and family meals.',
    phrases: [
      phrase({
        id: 'me-pɛ-food',
        emoji: '🍽️',
        phrase: 'Me pɛ aduane',
        pronunciation: 'meh peh ah-DWAH-neh',
        translation: 'I would like food — simple start when pointing at a menu or display.',
      }),
      phrase({
        id: 'spicy',
        emoji: '🌶️',
        phrase: 'Mma ɛnyɛ hyew',
        pronunciation: 'mmah en-YEH hyew',
        translation: 'Please not too spicy — ask early; heat levels vary a lot.',
      }),
      phrase({
        id: 'water',
        emoji: '💧',
        phrase: 'Nsuo, mepa wo kyɛw',
        pronunciation: 'n-SOO-oh, meh-pah woh CHEW',
        translation: 'Water, please — sealed sachets (“pure water”) are common and convenient.',
      }),
      phrase({
        id: 'delicious',
        emoji: '😋',
        phrase: 'Ɛyɛ dɛ',
        pronunciation: 'eh-YEH deh',
        translation: 'It is delicious — a kind compliment after a meal.',
      }),
    ],
  },
  {
    id: 'transport-phrases',
    title: 'Transport phrases',
    subtitle: 'Language for rides and stops — not fare tables (see Local tips / Transport guide).',
    phrases: [
      phrase({
        id: 'me-reba',
        emoji: '🚏',
        phrase: 'Me gyina ha',
        pronunciation: 'meh JEE-nah hah',
        translation: 'I alight here — say clearly to the mate before your stop.',
      }),
      phrase({
        id: 'kotoko',
        emoji: '🚐',
        phrase: 'Mesrɛ wo, gyae ha',
        pronunciation: 'meh-sreh woh, jah-eh hah',
        translation: 'Please stop here — another clear way to request your drop-off.',
      }),
      phrase({
        id: 'how-much-ride',
        emoji: '🚕',
        phrase: 'Ɛyɛ sɛn akɔ…?',
        pronunciation: 'eh-YEH sen ah-koh…',
        translation: 'How much to go to …? — agree the fare before an unmarked taxi moves.',
      }),
    ],
  },
  {
    id: 'emergency-phrases',
    title: 'Emergency phrases',
    subtitle: 'Keep these ready; call local emergency numbers when safety is at risk.',
    phrases: [
      phrase({
        id: 'help',
        emoji: '🆘',
        phrase: 'Boa me!',
        pronunciation: 'boh-ah meh',
        translation: 'Help me! — loud, clear call for immediate assistance.',
      }),
      phrase({
        id: 'call-police',
        emoji: '🚓',
        phrase: 'Frɛ police',
        pronunciation: 'freh po-LEES',
        translation: 'Call the police — pair with the emergency numbers in SOS.',
      }),
      phrase({
        id: 'i-am-lost',
        emoji: '🧭',
        phrase: 'Mayera',
        pronunciation: 'mah-YEH-rah',
        translation: 'I am lost — then show a map pin or landmark name if you can.',
      }),
      phrase({
        id: 'hospital',
        emoji: '🏥',
        phrase: 'Ɛhe na hospital wɔ?',
        pronunciation: 'eh-HEH nah HOS-pi-tal woh',
        translation: 'Where is the hospital? — ask a shopkeeper or security guard.',
      }),
    ],
  },
];

/** Cultural etiquette and expectations — not practical living logistics. */
export const cultureTopicSections: TopicGuideSection[] = [
  {
    id: 'greetings-etiquette',
    title: 'Greetings and handshakes',
    subtitle: 'First impressions in Ghana often begin with a greeting, not a request.',
    topics: [
      {
        id: 'greet-first',
        emoji: '🤝',
        title: 'Greet before you ask',
        description:
          'Say hello before asking for directions, prices, or favours. Skipping a greeting can feel abrupt. A smile plus “Maakye,” “Maaha,” or “Hello” goes a long way.',
      },
      {
        id: 'right-hand',
        emoji: '🤚',
        title: 'Right hand for respect',
        description:
          'Use your right hand for handshakes, giving or receiving money, and passing food. If your right hand is busy, touch your right forearm with your left as a courteous signal.',
      },
      {
        id: 'elders-first',
        emoji: '👴',
        title: 'Greet elders first',
        description:
          'In a room or compound, acknowledge older people first. A slight nod or polite greeting shows respect and helps you settle into family or community spaces.',
      },
    ],
  },
  {
    id: 'home-visits',
    title: 'Visiting someone’s home',
    subtitle: 'Homestays and family visits are warmer when you follow local hospitality cues.',
    topics: [
      {
        id: 'arrive-greet',
        emoji: '🏡',
        title: 'Arrive with a greeting',
        description:
          'Greet everyone you meet at the door or in the courtyard. Hosts often appreciate a small gift from your country (tea, sweets, or a souvenir) — never expected, always kind.',
      },
      {
        id: 'shoes-and-space',
        emoji: '👟',
        title: 'Follow the household’s lead',
        description:
          'Some homes prefer shoes off indoors; others do not. Watch what your hosts do. Ask before photographing people, altars, or private rooms.',
      },
      {
        id: 'time-flexibility',
        emoji: '🕐',
        title: 'Allow flexible timing',
        description:
          'Plans may start later than the clock says. Build buffer time and stay patient — relationships often matter more than strict punctuality in social visits.',
      },
    ],
  },
  {
    id: 'eating-customs',
    title: 'Eating customs',
    subtitle: 'Shared meals are a common way families show welcome.',
    topics: [
      {
        id: 'wait-to-be-invited',
        emoji: '🍽️',
        title: 'Wait to be invited to eat',
        description:
          'Do not help yourself until you are asked. Handwashing before a shared meal is common. Trying the food — even a small portion — is a warm way to show respect.',
      },
      {
        id: 'left-hand-food',
        emoji: '🥗',
        title: 'Eating with your right hand',
        description:
          'When eating with hands (for example fufu or banku), use your right hand. If you need cutlery, it is fine to ask — hosts usually understand newcomers.',
      },
      {
        id: 'refuse-politely',
        emoji: '🙏',
        title: 'Decline food politely',
        description:
          'If you cannot eat something, thank your host and explain briefly (allergy, faith, or fullness). A soft “Medaase, me nni kɔm” (thank you, I am not hungry) keeps the tone kind.',
      },
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing expectations',
    subtitle: 'Dress codes shift with the setting — casual city wear is not always right for every space.',
    topics: [
      {
        id: 'everyday-dress',
        emoji: '👕',
        title: 'Everyday city wear',
        description:
          'In Accra and many cities, neat casual clothes are normal. Light fabrics help in the heat. Very revealing outfits may draw unwanted attention in some neighbourhoods.',
      },
      {
        id: 'faith-spaces',
        emoji: '🕌',
        title: 'Churches, mosques, and ceremonies',
        description:
          'Cover shoulders and knees for churches, mosques, and many formal family events. Remove hats in some Christian services; follow posted guidance at mosques.',
      },
      {
        id: 'traditional-events',
        emoji: '🎀',
        title: 'Funerals and celebrations',
        description:
          'Funeral colours and styles can be specific (often black, red, or white depending on community). Ask a local friend before dressing for a funeral or traditional ceremony.',
      },
    ],
  },
  {
    id: 'faith-sensitivity',
    title: 'Religious and cultural sensitivity',
    subtitle: 'Ghana is diverse in faith and custom — curiosity is welcome when it is respectful.',
    topics: [
      {
        id: 'faith-diversity',
        emoji: '✨',
        title: 'Faith is part of daily life',
        description:
          'Christian and Muslim communities are both large, and traditional practices remain meaningful for many. Avoid mocking prayer, fasting, or libation rituals you may witness.',
      },
      {
        id: 'ask-before-joining',
        emoji: '❓',
        title: 'Ask before joining rituals',
        description:
          'If invited to a naming ceremony, funeral, or festival rite, ask what is appropriate to wear, say, or photograph. Hosts usually appreciate honest questions.',
      },
    ],
  },
  {
    id: 'festivals',
    title: 'Festivals and celebrations',
    subtitle: 'Public joy is common — join as a guest, not as the centre of attention.',
    topics: [
      {
        id: 'festival-guest',
        emoji: '🎉',
        title: 'Be a respectful guest',
        description:
          'Homowo, Aboakyer, Adae, and other festivals are living traditions. Cheer, learn, and follow marshals or elders. Do not block processions for photos.',
      },
      {
        id: 'photography',
        emoji: '📸',
        title: 'Ask before you photograph people',
        description:
          'Always ask before close-up photos of people, especially children, chiefs, or ceremonial dress. Some sacred objects or spaces prohibit photography entirely.',
      },
    ],
  },
  {
    id: 'gestures',
    title: 'Gestures and body language',
    subtitle: 'Small signals carry meaning — a few are easy to get wrong.',
    topics: [
      {
        id: 'pointing',
        emoji: '👉',
        title: 'Pointing and beckoning',
        description:
          'Pointing at people with one finger can feel rude. Beckon with your palm down and fingers waving toward you, rather than a sharp upward finger curl.',
      },
      {
        id: 'public-affection',
        emoji: '💑',
        title: 'Public affection',
        description:
          'Holding hands between partners is less common in many public spaces than in some Western cities. Read the room; same-gender friends holding hands can be a friendship gesture.',
      },
      {
        id: 'voice-level',
        emoji: '🔉',
        title: 'Calm beats confrontation',
        description:
          'Raising your voice in public disagreements can escalate quickly. Step aside, keep your tone steady, and ask a calm local to help translate if needed.',
      },
    ],
  },
  {
    id: 'avoid',
    title: 'Things visitors should avoid',
    subtitle: 'Practical respect — not scare stories.',
    topics: [
      {
        id: 'left-hand-giving',
        emoji: '🚫',
        title: 'Avoid giving with the left hand alone',
        description:
          'Passing money, gifts, or food with only the left hand can offend. Use the right hand, or both hands for formal offerings.',
      },
      {
        id: 'public-criticism',
        emoji: '🙊',
        title: 'Avoid public shaming',
        description:
          'Correcting someone loudly in front of others can cause deep embarrassment. Take sensitive feedback private and keep humour gentle.',
      },
      {
        id: 'assume-sameness',
        emoji: '🌍',
        title: 'Avoid assuming one “Ghanaian culture”',
        description:
          'Akan, Ewe, Ga, Dagomba, and many other communities have distinct languages and customs. What is normal in Accra may differ in Kumasi, Tamale, or a smaller town — ask locally.',
      },
    ],
  },
  {
    id: 'culture-shock',
    title: 'Helpful facts that reduce culture shock',
    subtitle: 'Expectations that help the first weeks feel less confusing.',
    topics: [
      {
        id: 'english-plus',
        emoji: '🗨️',
        title: 'English is widely used — local languages still matter',
        description:
          'You can manage daily life in English in many urban places. Learning a few Twi (or local) greetings still opens doors and softens first meetings.',
      },
      {
        id: 'community-pace',
        emoji: '🌿',
        title: 'Community often comes before the clock',
        description:
          'Queues, visits, and meetings may move socially rather than strictly by schedule. Build buffers and treat waiting as normal, not personal.',
      },
      {
        id: 'hospitality',
        emoji: '💛',
        title: 'Hospitality is real — reciprocity helps',
        description:
          'People may go out of their way to help. Say thank you, offer to share small costs when appropriate, and stay humble when you receive kindness from strangers.',
      },
    ],
  },
];

export function flattenCulturePhrases(
  sections: PhraseGuideSection[] = culturePhraseSections,
): CulturalPhraseCard[] {
  return sections.flatMap((section) => section.phrases);
}

export function flattenCultureTopics(
  sections: TopicGuideSection[] = cultureTopicSections,
): CulturalTopicCard[] {
  return sections.flatMap((section) => section.topics);
}

export function summarizeCultureGuideProgress(input: {
  phraseSections: PhraseGuideSection[];
  topicSections: TopicGuideSection[];
  completedPhraseIds: string[];
  practicedPhraseIds: string[];
  completedTopicIds: string[];
}): CultureGuideProgressSummary {
  const phrases = flattenCulturePhrases(input.phraseSections);
  const topics = flattenCultureTopics(input.topicSections);
  const phraseIdSet = new Set(phrases.map((item) => item.id));
  const topicIdSet = new Set(topics.map((item) => item.id));

  const phrasesCompleted = input.completedPhraseIds.filter((id) =>
    phraseIdSet.has(id),
  ).length;
  const topicsCompleted = input.completedTopicIds.filter((id) =>
    topicIdSet.has(id),
  ).length;
  const pronunciationPracticed = input.practicedPhraseIds.filter((id) =>
    phraseIdSet.has(id),
  ).length;

  const phrasesTotal = phrases.length;
  const topicsTotal = topics.length;
  const totalUnits = phrasesTotal + topicsTotal;
  const doneUnits = phrasesCompleted + topicsCompleted;
  const percent =
    totalUnits === 0 ? 0 : Math.round((doneUnits / totalUnits) * 100);

  return {
    phrasesCompleted,
    phrasesTotal,
    topicsCompleted,
    topicsTotal,
    pronunciationPracticed,
    percent,
  };
}

/** Journey language milestone: practised a meaningful set of phrases. */
export function hasCompletedLanguageBasics(input: {
  completedPhraseIds: string[];
  practicedPhraseIds: string[];
  phrasesTotal: number;
}): boolean {
  const unique = new Set([
    ...input.completedPhraseIds,
    ...input.practicedPhraseIds,
  ]);
  const target = Math.min(8, Math.max(5, Math.ceil(input.phrasesTotal * 0.25)));
  return unique.size >= target;
}

/** Journey culture milestone: read a meaningful set of etiquette topics. */
export function hasCompletedCultureTips(input: {
  completedTopicIds: string[];
  topicsTotal: number;
}): boolean {
  const target = Math.min(6, Math.max(4, Math.ceil(input.topicsTotal * 0.3)));
  return input.completedTopicIds.length >= target;
}
