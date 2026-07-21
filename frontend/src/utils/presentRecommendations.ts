import type {
  RecommendationItem,
  RecommendationLayout,
  RecommendationSection,
} from '../types/recommendations';

export type RecommendationGroupId =
  | 'nearby'
  | 'prepare'
  | 'explore'
  | 'grow'
  | 'opportunities';

export interface PresentedRecommendationSection extends RecommendationSection {
  /** Numbered rows for institution-style lists. */
  numbered?: boolean;
  /** Initial visible count before “Show more”. */
  previewCount?: number;
}

export interface PresentedRecommendationGroup {
  id: RecommendationGroupId;
  title: string;
  sections: PresentedRecommendationSection[];
}

type SectionPresentation = {
  group: RecommendationGroupId;
  title: string;
  layout: RecommendationLayout;
  numbered?: boolean;
  previewCount?: number;
};

const GROUP_TITLES: Record<RecommendationGroupId, string> = {
  nearby: 'Recommended nearby',
  prepare: 'Prepare for arrival',
  explore: 'Explore your destination',
  grow: 'Grow your profile',
  opportunities: 'Opportunities for you',
};

const SECTION_PRESENTATION: Record<string, SectionPresentation> = {
  institutions: {
    group: 'nearby',
    title: 'Nearby universities',
    layout: 'list',
    numbered: true,
    previewCount: 3,
  },
  accommodation: {
    group: 'nearby',
    title: 'Homestays near you',
    layout: 'list',
    previewCount: 3,
  },
  guides: {
    group: 'nearby',
    title: 'Local guides',
    layout: 'list',
    previewCount: 3,
  },
  transport: {
    group: 'prepare',
    title: 'Getting there',
    layout: 'list',
    previewCount: 3,
  },
  resources: {
    group: 'prepare',
    title: 'Arrival resources',
    layout: 'list',
    previewCount: 4,
  },
  attractions: {
    group: 'explore',
    title: 'Places to explore',
    layout: 'grid',
    previewCount: 4,
  },
  culture: {
    group: 'explore',
    title: 'Culture & language',
    layout: 'grid',
    previewCount: 4,
  },
  food: {
    group: 'explore',
    title: 'Featured experiences',
    layout: 'featured',
    previewCount: 4,
  },
  'profile-tips': {
    group: 'grow',
    title: 'Profile tips',
    layout: 'list',
    previewCount: 4,
  },
  opportunities: {
    group: 'opportunities',
    title: 'Relevant opportunities',
    layout: 'list',
    previewCount: 4,
  },
};

const TYPE_ACTION: Partial<Record<RecommendationItem['type'], string>> = {
  INSTITUTION: 'View',
  HOST: 'View stay',
  GUIDE: 'View guide',
  SITE: 'Explore',
  LODGING: 'View stay',
  TRANSPORT: 'Open',
  CULTURE: 'Read tip',
  RESOURCE: 'Open',
  PROFILE_TIP: 'Improve',
  OPPORTUNITY: 'View',
};

const GROUP_ORDER: RecommendationGroupId[] = [
  'nearby',
  'prepare',
  'explore',
  'grow',
  'opportunities',
];

function extractLocation(item: RecommendationItem, fallbackCity?: string): string | undefined {
  if (item.location?.trim()) {
    return item.location.trim();
  }
  const subtitle = item.subtitle ?? '';
  const beforeDot = subtitle.split('·')[0]?.trim();
  if (beforeDot && beforeDot.length > 0 && beforeDot.length < 48) {
    // Prefer city-like fragments over long sentences.
    if (!/[.!?]$/.test(beforeDot) || beforeDot.split(' ').length <= 5) {
      return beforeDot;
    }
  }
  const nearMatch = subtitle.match(/\bnear\s+([^·.]+)/i);
  if (nearMatch?.[1]) {
    return nearMatch[1].trim();
  }
  return fallbackCity?.trim() || undefined;
}

function actionLabelFor(item: RecommendationItem): string {
  return item.actionLabel ?? TYPE_ACTION[item.type] ?? 'Explore';
}

function presentationFor(
  section: RecommendationSection,
): SectionPresentation {
  const known = SECTION_PRESENTATION[section.id];
  if (known) {
    return known;
  }

  const firstType = section.items[0]?.type;
  if (firstType === 'SITE' || firstType === 'CULTURE') {
    return {
      group: 'explore',
      title: section.title,
      layout: 'grid',
      previewCount: 4,
    };
  }
  if (firstType === 'PROFILE_TIP') {
    return {
      group: 'grow',
      title: section.title,
      layout: 'list',
      previewCount: 4,
    };
  }
  if (firstType === 'OPPORTUNITY') {
    return {
      group: 'opportunities',
      title: section.title,
      layout: 'list',
      previewCount: 4,
    };
  }
  if (
    firstType === 'TRANSPORT' ||
    firstType === 'RESOURCE'
  ) {
    return {
      group: 'prepare',
      title: section.title,
      layout: 'list',
      previewCount: 3,
    };
  }

  return {
    group: 'nearby',
    title: section.title,
    layout: section.layout === 'grid' ? 'grid' : 'list',
    previewCount: 3,
  };
}

function enrichItem(
  item: RecommendationItem,
  city?: string,
): RecommendationItem {
  const skipInferredLocation =
    item.type === 'OPPORTUNITY' || item.type === 'PROFILE_TIP';
  return {
    ...item,
    location: skipInferredLocation
      ? item.location?.trim() || undefined
      : extractLocation(item, city),
    actionLabel: actionLabelFor(item),
  };
}

/**
 * Presentation-only transform: regroups and relayouts recommendation
 * sections for marketplace UX without changing source data or scoring.
 */
export function presentRecommendationGroups(
  sections: RecommendationSection[],
  city?: string,
): PresentedRecommendationGroup[] {
  const buckets = new Map<RecommendationGroupId, PresentedRecommendationSection[]>();

  for (const section of sections) {
    if (!section.items.length) {
      continue;
    }
    const meta = presentationFor(section);
    const presented: PresentedRecommendationSection = {
      id: section.id,
      title: meta.title,
      layout: meta.layout,
      numbered: meta.numbered,
      previewCount: meta.previewCount ?? 3,
      items: section.items.map((item) => enrichItem(item, city)),
    };
    const list = buckets.get(meta.group) ?? [];
    list.push(presented);
    buckets.set(meta.group, list);
  }

  return GROUP_ORDER.flatMap((groupId) => {
    const groupSections = buckets.get(groupId);
    if (!groupSections?.length) {
      return [];
    }
    return [
      {
        id: groupId,
        title: GROUP_TITLES[groupId],
        sections: groupSections,
      },
    ];
  });
}

export function recommendationHeadlineForCity(city?: string): string {
  const place = city?.trim();
  if (!place) {
    return 'Picked for your Ghana trip';
  }
  return `Picked for your stay in ${place.split(',')[0]?.trim() || place}`;
}
