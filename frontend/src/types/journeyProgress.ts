export type JourneyStepId =
  | 'profile'
  | 'accommodation'
  | 'guide'
  | 'emergency'
  | 'culture'
  | 'language';

export interface JourneyStep {
  id: JourneyStepId;
  title: string;
  subtitle: string;
  iconGlyph: string;
  completed: boolean;
  /**
   * @deprecated Journey is status-only on Home. Explore owns navigation.
   * Kept optional for older callers; new builders omit this.
   */
  routeHint?:
    | 'AccountSetup'
    | 'MatchSearch'
    | 'ExploreStays'
    | 'GuideSearch'
    | 'StudentBookings'
    | 'SOS'
    | 'LocalTips';
}

export interface JourneyProgress {
  title: string;
  subtitle: string;
  percent: number;
  completedCount: number;
  totalCount: number;
  steps: JourneyStep[];
}

/** Soft milestones that are not derived from bookings/profile alone. */
export interface JourneyMilestones {
  emergencyContactsSaved: boolean;
  cultureTipsCompleted: boolean;
  languageBasicsCompleted: boolean;
}

export const EMPTY_JOURNEY_MILESTONES: JourneyMilestones = {
  emergencyContactsSaved: false,
  cultureTipsCompleted: false,
  languageBasicsCompleted: false,
};
