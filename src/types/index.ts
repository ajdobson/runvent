export type UnitType = 'km' | 'miles';

export interface RunEntry {
  date: string; // YYYY-MM-DD format
  distance: number;
  completed: boolean;
  timestamp?: number;
}

export interface UserSettings {
  adsRemoved?: boolean;
  unitType: UnitType;
  year: number;
}

export interface DayChallenge {
  day: number;
  targetDistance: number;
  completed: boolean;
  actualDistance?: number;
  date: Date;
}

