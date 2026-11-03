import { CarnivalData } from '../types';
import { INITIAL_DATA } from '../data/seed';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'lv_sports_carnival_data_v2';
const SUPABASE_TABLE = 'carnival_state';
const STATE_ROW_ID = 'primary';

export interface IDataService {
  getData(): Promise<CarnivalData>;
  saveData(data: CarnivalData): Promise<void>;
  resetToDefault(): Promise<CarnivalData>;
  exportJson(data: CarnivalData): string;
  importJson(jsonString: string): CarnivalData;
  subscribeToChanges?(onUpdate: (data: CarnivalData) => void): () => void;
  isCloudConnected(): boolean;
}

/**
 * Hybrid Supabase + LocalStorage Data Service.
 * Connects to Supabase (Project: cqkhfskjxeghcmknvibs) for live multi-screen syncing,
 * and maintains local caching for instant loading and offline resiliency.
 */
class HybridDataService implements IDataService {
  private realtimeChannel: any = null;

  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  }

  async getData(): Promise<CarnivalData> {
    const supabase = getSupabaseClient();

    // 1. If Supabase is configured, attempt to fetch live cloud data
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from(SUPABASE_TABLE)
          .select('data')
          .eq('id', STATE_ROW_ID)
          .maybeSingle();

        if (error) {
          console.warn('Supabase fetch failed, falling back to local cache:', error.message);
        } else if (data && data.data) {
          const sanitized = this.sanitizeData(data.data as CarnivalData);
          // Keep local cache in sync
          this.saveToStorage(sanitized);
          return sanitized;
        } else {
          // Table exists but no primary row yet -> seed initial data to Supabase
          console.info('No remote state found in Supabase. Seeding initial carnival data...');
          const initial = this.getLocalOrSeed();
          await this.saveData(initial);
          return initial;
        }
      } catch (err) {
        console.warn('Error reading from Supabase:', err);
      }
    }

    // 2. Fallback to LocalStorage / Initial Seed
    return this.getLocalOrSeed();
  }

  async saveData(data: CarnivalData): Promise<void> {
    const sanitized = this.sanitizeData(data);
    // Always persist to local cache first
    this.saveToStorage(sanitized);

    // If Supabase is available, sync to both carnival_state and individual relational tables
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // 1. carnival_state (Full state for live TV sync)
        await supabase.from(SUPABASE_TABLE).upsert(
          {
            id: STATE_ROW_ID,
            data: sanitized,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        // 2. teams table
        if (sanitized.teams && sanitized.teams.length > 0) {
          const formattedTeams = sanitized.teams.map((t) => ({
            id: t.id,
            code: t.code,
            name: t.name,
            color: t.color,
            secondary_color: t.secondaryColor || null,
            captain: t.captain || null,
            vice_captain: t.viceCaptain || null,
            mascot: t.mascot || null,
          }));
          await supabase.from('teams').upsert(formattedTeams, { onConflict: 'id' });
        }

        // 3. members table
        if (sanitized.members && sanitized.members.length > 0) {
          const formattedMembers = sanitized.members.map((m) => ({
            id: m.id,
            team_id: m.teamId,
            name: m.name,
            role: m.role || null,
            jersey_number: m.jerseyNumber || null,
          }));
          await supabase.from('members').upsert(formattedMembers, { onConflict: 'id' });
        }

        // 4. games table
        if (sanitized.games && sanitized.games.length > 0) {
          const formattedGames = sanitized.games.map((g) => ({
            id: g.id,
            name: g.name,
            category: g.category,
            icon: g.icon || 'generic',
            status: g.status || 'upcoming',
            scheduled_time: g.scheduledTime || '',
            venue: g.venue || '',
            first_place_team_id: g.firstPlaceTeamId || null,
            second_place_team_id: g.secondPlaceTeamId || null,
            notes: g.notes || '',
          }));
          await supabase.from('games').upsert(formattedGames, { onConflict: 'id' });
        }

        // 5. announcements table
        if (sanitized.announcements && sanitized.announcements.length > 0) {
          const formattedAnnouncements = sanitized.announcements.map((a) => ({
            id: a.id,
            title: a.title,
            message: a.message,
            category: a.category || 'general',
            active: a.active,
            created_at: a.createdAt || '',
          }));
          await supabase.from('announcements').upsert(formattedAnnouncements, { onConflict: 'id' });
        }
      } catch (err) {
        console.error('Error writing to Supabase tables:', err);
      }
    }
  }

  async resetToDefault(): Promise<CarnivalData> {
    await this.saveData(INITIAL_DATA);
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
    const sanitized = this.sanitizeData(parsed);
    this.saveData(sanitized);
    return sanitized;
  }

  subscribeToChanges(onUpdate: (data: CarnivalData) => void): () => void {
    const supabase = getSupabaseClient();
    if (!supabase) return () => {};

    try {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
      }

      this.realtimeChannel = supabase
        .channel('carnival_live_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: SUPABASE_TABLE, filter: `id=eq.${STATE_ROW_ID}` },
          (payload: any) => {
            if (payload?.new?.data) {
              const updated = this.sanitizeData(payload.new.data as CarnivalData);
              this.saveToStorage(updated);
              onUpdate(updated);
            }
          }
        )
        .subscribe();

      return () => {
        if (this.realtimeChannel) {
          supabase.removeChannel(this.realtimeChannel);
          this.realtimeChannel = null;
        }
      };
    } catch (err) {
      console.warn('Realtime subscription error:', err);
      return () => {};
    }
  }

  private getLocalOrSeed(): CarnivalData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CarnivalData;
        return this.sanitizeData(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage read error, using initial seed:', e);
    }
    this.saveToStorage(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private sanitizeData(raw: CarnivalData): CarnivalData {
    let rawSlides = raw.settings?.slides || INITIAL_DATA.settings.slides;
    // Filter out leaders, sponsors, and teams_overview
    rawSlides = rawSlides.filter(
      (s: any) => s.id !== 'leaders' && s.id !== 'sponsors' && s.id !== 'teams_overview'
    );

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
      ...(raw.settings || {}),
      slides: rawSlides,
    };

    return {
      settings: sanitizedSettings,
      teams: raw.teams && raw.teams.length > 0 ? raw.teams : INITIAL_DATA.teams,
      members: Array.isArray(raw.members) ? raw.members : INITIAL_DATA.members,
      games: Array.isArray(raw.games) && raw.games.length > 0 ? raw.games : INITIAL_DATA.games,
      announcements: Array.isArray(raw.announcements) ? raw.announcements : INITIAL_DATA.announcements,
      sponsors: Array.isArray(raw.sponsors) ? raw.sponsors : INITIAL_DATA.sponsors,
      fixtures:
        raw.fixtures && Array.isArray(raw.fixtures.rounds) && raw.fixtures.rounds.length > 0
          ? raw.fixtures
          : INITIAL_DATA.fixtures,
    };
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
export const dataService: IDataService = new HybridDataService();
