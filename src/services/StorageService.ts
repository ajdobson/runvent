import AsyncStorage from '@react-native-async-storage/async-storage';
import { RunEntry, UserSettings } from '../types';

const RUNS_KEY = '@runvent_runs';
const SETTINGS_KEY = '@runvent_settings';

export class StorageService {
  static async init(): Promise<void> {
    try {
      const settings = await this.getSettings();
      if (!settings) {
        // Set default settings
        await this.saveSettings({
          unitType: 'km',
          year: new Date().getFullYear(),
        });
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  static async getRuns(): Promise<RunEntry[]> {
    try {
      const runsJson = await AsyncStorage.getItem(RUNS_KEY);
      return runsJson ? JSON.parse(runsJson) : [];
    } catch (error) {
      console.error('Error loading runs:', error);
      return [];
    }
  }

  static async saveRun(run: RunEntry): Promise<void> {
    try {
      const runs = await this.getRuns();
      const existingIndex = runs.findIndex(r => r.date === run.date);
      
      if (existingIndex >= 0) {
        runs[existingIndex] = run;
      } else {
        runs.push(run);
      }
      
      await AsyncStorage.setItem(RUNS_KEY, JSON.stringify(runs));
    } catch (error) {
      console.error('Error saving run:', error);
      throw error;
    }
  }

  static async getRunByDate(date: string): Promise<RunEntry | null> {
    try {
      const runs = await this.getRuns();
      return runs.find(r => r.date === date) || null;
    } catch (error) {
      console.error('Error getting run by date:', error);
      return null;
    }
  }

  static async getSettings(): Promise<UserSettings | null> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      return settingsJson ? JSON.parse(settingsJson) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
}

