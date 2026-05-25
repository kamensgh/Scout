export type IntegrationType = 'github' | 'duolingo' | 'strava' | 'manual' | 'screenshot';

export interface Integration {
  type: IntegrationType;
  username?: string;
  token?: string;
}

export interface CheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  verified: boolean;
  method: IntegrationType;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  emoji: string;
  integration: Integration;
  checkIns: CheckIn[];
  createdAt: string;
}

export interface Trophy {
  id: string;
  habitId: string;
  habitName: string;
  habitEmoji: string;
  milestone: 7 | 30 | 100 | 365;
  unlockedAt: string;
}

export interface Settings {
  githubToken?: string;
  stravaToken?: string;
  anthropicKey?: string;
}

export interface AppData {
  habits: Habit[];
  trophies: Trophy[];
  settings: Settings;
}

export type ScreenName =
  | 'dashboard'
  | 'habit-detail'
  | 'new-habit'
  | 'check-in'
  | 'trophy-room'
  | 'settings';

export interface ScreenState {
  name: ScreenName;
  habitId?: string;
}
