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

    // Remove full-page slides that now duplicate the dashboard panels
    const duplicateIds = new Set(['schedule', 'fixtures', 'leaderboard', 'results', 'announcements', 'leaders', 'sponsors']);
    rawSlides = rawSlides.filter((s: any) => !duplicateIds.has(s.id));

    // Ensure hero is present
    if (!rawSlides.some((s: any) => s.id === 'hero')) {
      rawSlides.unshift({ id: 'hero' as const, title: 'Welcome & Championship Showcase', enabled: true, order: 1, durationSec: 10 });
    }

    rawSlides = rawSlides.map((slide: any) =>
      slide.id === 'hero' && slide.durationSec === 8 ? { ...slide, durationSec: 10 } : slide
    );

    // Ensure live_dashboard is present right after hero
    if (!rawSlides.some((s: any) => s.id === 'live_dashboard')) {
      rawSlides.splice(1, 0, {
        id: 'live_dashboard' as const,
        title: 'Live Tournament Dashboard',
        enabled: true,
        order: 2,
        durationSec: 60,
      });
    }

    // Ensure teams_overview is present
    if (!rawSlides.some((s: any) => s.id === 'teams_overview')) {
      rawSlides.splice(2, 0, {
        id: 'teams_overview' as const,
        title: 'Teams Overview',
        enabled: true,
        order: 3,
        durationSec: 10,
      });
    }

    // Ensure team roster slides are present
    const teamIds = ['team_a', 'team_b', 'team_c', 'team_d'];
    const teamTitles: Record<string, string> = {
      team_a: 'Team A - Pardus',
      team_b: 'Team B - Falcon Fury',
      team_c: 'Team C - Stormbreakers',
      team_d: 'Team D - Tiger Ka Hukum',
    };
    teamIds.forEach((tId) => {
      if (!rawSlides.some((s: any) => s.id === tId)) {
        rawSlides.push({
          id: tId as any,
          title: teamTitles[tId] || tId,
          enabled: true,
          order: rawSlides.length + 1,
          durationSec: 12,
        });
      }
    });

    // Ensure live_dashboard is the 2nd slide
    const ldIdx = rawSlides.findIndex((s: any) => s.id === 'live_dashboard');
    if (ldIdx !== -1 && ldIdx !== 1) {
      const [ldSlide] = rawSlides.splice(ldIdx, 1);
      const heroIdx = rawSlides.findIndex((s: any) => s.id === 'hero');
      if (heroIdx !== -1) {
        rawSlides.splice(heroIdx + 1, 0, ldSlide);
      } else {
        rawSlides.unshift(ldSlide);
      }
    }

    // Assign per-slide durations if missing
    const defaultDurations: Record<string, number> = {
      hero: 8,
      live_dashboard: 60,
      teams_overview: 10,
      team_a: 12,
      team_b: 12,
      team_c: 12,
      team_d: 12,
    };

    rawSlides = rawSlides.map((s: any, idx: number) => ({
      ...s,
      order: idx + 1,
      durationSec: s.durationSec && s.durationSec > 0 ? s.durationSec : (defaultDurations[s.id] || 10),
    }));

    const sanitizedSettings = {
      ...INITIAL_DATA.settings,
      ...(raw.settings || {}),
      panelIntervals: {
        gamesScheduleSec: raw.settings?.panelIntervals?.gamesScheduleSec || 8,
        fixturesSec: raw.settings?.panelIntervals?.fixturesSec || 10,
        announcementsSec: raw.settings?.panelIntervals?.announcementsSec || 8,
      },
      slides: rawSlides,
    };

    return {
      settings: sanitizedSettings,
      teams: raw.teams && raw.teams.length > 0 ? raw.teams : INITIAL_DATA.teams,
      members: Array.isArray(raw.members) ? raw.members : INITIAL_DATA.members,
      games: (Array.isArray(raw.games) && raw.games.length > 0 ? raw.games : INITIAL_DATA.games).map((game) => ({
        ...game,
        scheduledTime: (game.scheduledTime || '').replace(/^Day\s+\d+\s*[·•-]\s*/i, '').trim(),
      })),
      announcements: (Array.isArray(raw.announcements) ? raw.announcements : INITIAL_DATA.announcements).map((announcement) => ({
        ...announcement,
        createdAt: (announcement.createdAt || '').replace(/^Day\s+\d+\s*[·•-]\s*/i, '').trim(),
      })),
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
