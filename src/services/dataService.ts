import { CarnivalData } from '../types';
import { INITIAL_DATA } from '../data/seed';

const STORAGE_KEY = 'lv_sports_carnival_data_v2';

export interface IDataService {
  getData(): Promise<CarnivalData>;
  saveData(data: CarnivalData): Promise<void>;
  resetToDefault(): Promise<CarnivalData>;
  exportJson(data: CarnivalData): string;
  importJson(jsonString: string): CarnivalData;
}

/**
 * LocalStorage implementation of IDataService.
 * Can be effortlessly swapped with a FirestoreDataService implementing IDataService.
 */
class LocalStorageDataService implements IDataService {
  async getData(): Promise<CarnivalData> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CarnivalData;
        
        // Sanitize slides: replace or remove 'leaders' and ensure 'fixtures' exists
        let rawSlides = parsed.settings?.slides || INITIAL_DATA.settings.slides;
        // Filter out leaders, sponsors, and teams_overview
        rawSlides = rawSlides.filter((s: any) => s.id !== 'leaders' && s.id !== 'sponsors' && s.id !== 'teams_overview');
        if (!rawSlides.some((s: any) => s.id === 'fixtures')) {
          const scheduleIdx = rawSlides.findIndex((s: any) => s.id === 'schedule');
          const fixturesSlide = { id: 'fixtures' as const, title: 'Carrom Doubles Fixtures', enabled: true, order: 8 };
          if (scheduleIdx !== -1) {
            rawSlides.splice(scheduleIdx + 1, 0, fixturesSlide);
          } else {
            rawSlides.push(fixturesSlide);
          }
        }
        // Ensure leaderboard (points table) is the 2nd slide right after hero
        const lbIdx = rawSlides.findIndex((s: any) => s.id === 'leaderboard');
        if (lbIdx !== -1 && lbIdx !== 1) {
          const [lbSlide] = rawSlides.splice(lbIdx, 1);
          const heroIdx = rawSlides.findIndex((s: any) => s.id === 'hero');
          if (heroIdx !== -1) {
            rawSlides.splice(heroIdx + 1, 0, lbSlide);
          } else {
            rawSlides.unshift(lbSlide);
          }
        }
        // re-order sequentially
        rawSlides = rawSlides.map((s: any, idx: number) => ({ ...s, order: idx + 1 }));

        const sanitizedSettings = {
          ...INITIAL_DATA.settings,
          ...(parsed.settings || {}),
          slides: rawSlides,
        };

        return {
          settings: sanitizedSettings,
          teams: parsed.teams && parsed.teams.length > 0 ? parsed.teams : INITIAL_DATA.teams,
          members: Array.isArray(parsed.members) ? parsed.members : INITIAL_DATA.members,
          games: Array.isArray(parsed.games) && parsed.games.length > 0 ? parsed.games : INITIAL_DATA.games,
          announcements: Array.isArray(parsed.announcements) ? parsed.announcements : INITIAL_DATA.announcements,
          sponsors: Array.isArray(parsed.sponsors) ? parsed.sponsors : INITIAL_DATA.sponsors,
          fixtures: (parsed.fixtures && Array.isArray(parsed.fixtures.rounds) && parsed.fixtures.rounds.length > 0)
            ? parsed.fixtures
            : INITIAL_DATA.fixtures,
        };
      }
    } catch (e) {
      console.warn('Failed to parse stored carnival data, reverting to seed:', e);
    }
    // First time load: seed data
    this.saveToStorage(INITIAL_DATA);
    return INITIAL_DATA;
  }

  async saveData(data: CarnivalData): Promise<void> {
    this.saveToStorage(data);
  }

  async resetToDefault(): Promise<CarnivalData> {
    this.saveToStorage(INITIAL_DATA);
    return INITIAL_DATA;
  }

  exportJson(data: CarnivalData): string {
    return JSON.stringify(data, null, 2);
  }

  importJson(jsonString: string): CarnivalData {
    const parsed = JSON.parse(jsonString) as CarnivalData;
    if (!parsed.teams || !parsed.games || !parsed.settings) {
      throw new Error('Invalid Carnival JSON format: missing teams, games, or settings.');
    }
    this.saveToStorage(parsed);
    return parsed;
  }

  private saveToStorage(data: CarnivalData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }
}

// Export singleton instance of active data service
export const dataService: IDataService = new LocalStorageDataService();
