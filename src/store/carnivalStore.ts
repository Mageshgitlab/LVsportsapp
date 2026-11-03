import { create } from 'zustand';
import {
  CarnivalData,
  CarnivalSettings,
  Game,
  GameStatus,
  Member,
  Team,
  TeamId,
  TeamScoreStat,
  Announcement,
  SlideConfig,
  SlideId,
  Sponsor,
  PairMatch,
  GameFixtures,
} from '../types';
import { dataService } from '../services/dataService';
import { INITIAL_DATA } from '../data/seed';

export function calculateLeaderboard(teams: Team[], games: Game[]): TeamScoreStat[] {
  const statsMap = new Map<string, { first: number; second: number; played: number; points: number }>();

  teams.forEach((t) => {
    statsMap.set(t.id, { first: 0, second: 0, played: 0, points: 0 });
  });

  games.forEach((game) => {
    if (game.firstPlaceTeamId && statsMap.has(game.firstPlaceTeamId)) {
      const stat = statsMap.get(game.firstPlaceTeamId)!;
      stat.first += 1;
      stat.points += 10;
      stat.played += 1;
    }
    if (game.secondPlaceTeamId && statsMap.has(game.secondPlaceTeamId)) {
      const stat = statsMap.get(game.secondPlaceTeamId)!;
      stat.second += 1;
      stat.points += 5;
      stat.played += 1;
    }
  });

  const sortedStats: TeamScoreStat[] = teams.map((team) => {
    const s = statsMap.get(team.id) || { first: 0, second: 0, played: 0, points: 0 };
    return {
      team,
      points: s.points,
      firstPlaceCount: s.first,
      secondPlaceCount: s.second,
      gamesPlayed: s.played,
      rank: 1, // calculated next
    };
  });

  // Sort by points descending, then gold/first place count descending, then team name
  sortedStats.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.firstPlaceCount !== a.firstPlaceCount) return b.firstPlaceCount - a.firstPlaceCount;
    return a.team.name.localeCompare(b.team.name);
  });

  // Assign ranks
  let currentRank = 1;
  for (let i = 0; i < sortedStats.length; i++) {
    if (i > 0 && sortedStats[i].points < sortedStats[i - 1].points) {
      currentRank = i + 1;
    }
    sortedStats[i].rank = currentRank;
  }

  return sortedStats;
}

export function getEligibleSlides(data: CarnivalData): SlideConfig[] {
  const allSlides = [...data.settings.slides].sort((a, b) => a.order - b.order);

  return allSlides.filter((slide) => {
    if (!slide.enabled) return false;

    // Check data availability per slide type
    switch (slide.id) {
      case 'announcements':
        return data.announcements.some((a) => a.active);
      case 'results':
        // Show results if any game has finished or any results assigned, or show games with results
        return data.games.length > 0;
      case 'team_a':
        return data.teams.some((t) => t.id === 'team-a');
      case 'team_b':
        return data.teams.some((t) => t.id === 'team-b');
      case 'team_c':
        return data.teams.some((t) => t.id === 'team-c');
      case 'team_d':
        return data.teams.some((t) => t.id === 'team-d');
      case 'fixtures':
        return !!data.fixtures && Array.isArray(data.fixtures.rounds) && data.fixtures.rounds.length > 0;
      default:
        return true;
    }
  });
}

interface CarnivalStoreState {
  data: CarnivalData;
  isLoading: boolean;
  activeSlideIndex: number;
  isPaused: boolean;
  timeRemainingMs: number;
  adminAuthenticated: boolean;

  // Actions
  initialize: () => Promise<void>;
  setAdminAuthenticated: (auth: boolean) => void;
  updateSettings: (settings: Partial<CarnivalSettings>) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  
  // Member actions
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (memberId: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (memberId: string) => Promise<void>;
  moveMember: (memberId: string, targetTeamId: TeamId) => Promise<void>;

  // Game actions
  addGame: (game: Omit<Game, 'id'>) => Promise<void>;
  updateGame: (gameId: string, updates: Partial<Game>) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  setGameResults: (gameId: string, firstPlaceTeamId: TeamId | null, secondPlaceTeamId: TeamId | null) => Promise<void>;

  // Fixtures actions
  updatePairMatch: (roundNumber: number, tieId: string, matchId: string, patch: Partial<PairMatch>) => Promise<void>;
  assignPairPlayer: (teamId: TeamId, pairNumber: number, playerIndex: 0 | 1, memberId: string) => Promise<void>;
  shuffleFixtures: (tieId?: string) => Promise<void>;
  setFixturesGame: (gameId: string, gameName: string, title?: string) => Promise<void>;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Sponsors
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => Promise<void>;
  updateSponsor: (id: string, updates: Partial<Sponsor>) => Promise<void>;
  deleteSponsor: (id: string) => Promise<void>;

  // Slide configuration
  setSlidesOrder: (slides: SlideConfig[]) => Promise<void>;
  toggleSlide: (slideId: SlideId, enabled: boolean) => Promise<void>;

  // Backup & reset
  resetToDefault: () => Promise<void>;
  exportData: () => string;
  importData: (json: string) => Promise<{ success: boolean; error?: string }>;

  // TV Slideshow controls
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  togglePause: () => void;
  setPaused: (paused: boolean) => void;
  setTimeRemainingMs: (ms: number) => void;
}

export const useCarnivalStore = create<CarnivalStoreState>((set, get) => ({
  data: INITIAL_DATA,
  isLoading: true,
  activeSlideIndex: 0,
  isPaused: false,
  timeRemainingMs: 5000,
  adminAuthenticated: false,

  initialize: async () => {
    try {
      const data = await dataService.getData();
      set({
        data,
        isLoading: false,
        timeRemainingMs: data.settings.slideDurationMs || 5000,
      });
    } catch (e) {
      console.error('Failed to initialize carnival store:', e);
      set({ isLoading: false });
    }
  },

  setAdminAuthenticated: (auth: boolean) => {
    set({ adminAuthenticated: auth });
  },

  updateSettings: async (settingsUpdate) => {
    const current = get().data;
    const updated: CarnivalData = {
      ...current,
      settings: { ...current.settings, ...settingsUpdate },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateTeam: async (teamId, updates) => {
    const current = get().data;
    const updatedTeams = current.teams.map((t) => (t.id === teamId ? { ...t, ...updates } : t));
    const updated: CarnivalData = { ...current, teams: updatedTeams };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addMember: async (memberData) => {
    const current = get().data;
    const newMember: Member = {
      ...memberData,
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated: CarnivalData = {
      ...current,
      members: [...current.members, newMember],
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateMember: async (memberId, updates) => {
    const current = get().data;
    const updatedMembers = current.members.map((m) => (m.id === memberId ? { ...m, ...updates } : m));
    const updated: CarnivalData = { ...current, members: updatedMembers };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteMember: async (memberId) => {
    const current = get().data;
    const updatedMembers = current.members.filter((m) => m.id !== memberId);
    const updated: CarnivalData = { ...current, members: updatedMembers };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  moveMember: async (memberId, targetTeamId) => {
    const current = get().data;
    const updatedMembers = current.members.map((m) => (m.id === memberId ? { ...m, teamId: targetTeamId } : m));
    const updated: CarnivalData = { ...current, members: updatedMembers };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addGame: async (gameData) => {
    const current = get().data;
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}`,
    };
    const updated: CarnivalData = {
      ...current,
      games: [...current.games, newGame],
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateGame: async (gameId, updates) => {
    const current = get().data;
    const updatedGames = current.games.map((g) => (g.id === gameId ? { ...g, ...updates } : g));
    const updated: CarnivalData = { ...current, games: updatedGames };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteGame: async (gameId) => {
    const current = get().data;
    const updatedGames = current.games.filter((g) => g.id !== gameId);
    const updated: CarnivalData = { ...current, games: updatedGames };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  setGameResults: async (gameId, firstPlaceTeamId, secondPlaceTeamId) => {
    const current = get().data;
    const updatedGames = current.games.map((g) => {
      if (g.id === gameId) {
        let status: GameStatus = g.status;
        if (firstPlaceTeamId && secondPlaceTeamId) {
          status = 'completed';
        } else if (firstPlaceTeamId || secondPlaceTeamId) {
          status = 'live';
        }
        return {
          ...g,
          firstPlaceTeamId,
          secondPlaceTeamId,
          status,
        };
      }
      return g;
    });
    const updated: CarnivalData = { ...current, games: updatedGames };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updatePairMatch: async (roundNumber, tieId, matchId, patch) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updatedRounds = current.fixtures.rounds.map((round) => {
      if (round.roundNumber !== roundNumber) return round;
      const updatedTies = round.ties.map((tie) => {
        if (tie.id !== tieId) return tie;
        const updatedMatches = tie.matches.map((m) => {
          if (m.id !== matchId) return m;
          return { ...m, ...patch };
        });
        return { ...tie, matches: updatedMatches };
      });
      return { ...round, ties: updatedTies };
    });

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        rounds: updatedRounds,
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  assignPairPlayer: async (teamId, pairNumber, playerIndex, memberId) => {
    const current = get().data;
    if (!current.fixtures) return;

    const pairKey = `${teamId}_pair_${pairNumber}`;
    const currentPair = current.fixtures.pairPlayers?.[pairKey] || ['', ''];
    const newPair: [string, string] = [
      playerIndex === 0 ? memberId : currentPair[0],
      playerIndex === 1 ? memberId : currentPair[1],
    ];

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        pairPlayers: {
          ...(current.fixtures.pairPlayers || {}),
          [pairKey]: newPair,
        },
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  shuffleFixtures: async (targetTieId?: string) => {
    const current = get().data;
    if (!current.fixtures) return;

    const shuffleArray = <T>(arr: T[]): T[] => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const updatedRounds = current.fixtures.rounds.map((round) => {
      const updatedTies = round.ties.map((tie) => {
        if (targetTieId && tie.id !== targetTieId) return tie;

        const aPairs = shuffleArray([1, 2, 3, 4]);
        const bPairs = shuffleArray([1, 2, 3, 4]);

        const updatedMatches = tie.matches.map((match, idx) => ({
          ...match,
          pairANumber: aPairs[idx],
          pairBNumber: bPairs[idx],
        }));

        return { ...tie, matches: updatedMatches };
      });
      return { ...round, ties: updatedTies };
    });

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        rounds: updatedRounds,
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  setFixturesGame: async (gameId, gameName, title) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        gameId,
        gameName,
        title: title || `${gameName.toUpperCase()} FIXTURES`,
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addAnnouncement: async (announcementData) => {
    const current = get().data;
    const newAnn: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
    };
    const updated: CarnivalData = {
      ...current,
      announcements: [newAnn, ...current.announcements],
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateAnnouncement: async (id, updates) => {
    const current = get().data;
    const updated = {
      ...current,
      announcements: current.announcements.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteAnnouncement: async (id) => {
    const current = get().data;
    const updated = {
      ...current,
      announcements: current.announcements.filter((a) => a.id !== id),
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addSponsor: async (sponsorData) => {
    const current = get().data;
    const newSp: Sponsor = {
      ...sponsorData,
      id: `sp-${Date.now()}`,
    };
    const updated: CarnivalData = {
      ...current,
      sponsors: [...(current.sponsors || []), newSp],
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateSponsor: async (id, updates) => {
    const current = get().data;
    const updated: CarnivalData = {
      ...current,
      sponsors: (current.sponsors || []).map((s) => (s.id === id ? { ...s, ...updates } : s)),
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteSponsor: async (id) => {
    const current = get().data;
    const updated: CarnivalData = {
      ...current,
      sponsors: (current.sponsors || []).filter((s) => s.id !== id),
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  setSlidesOrder: async (slides) => {
    const current = get().data;
    const updated: CarnivalData = {
      ...current,
      settings: { ...current.settings, slides },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  toggleSlide: async (slideId, enabled) => {
    const current = get().data;
    const updatedSlides = current.settings.slides.map((s) => (s.id === slideId ? { ...s, enabled } : s));
    const updated: CarnivalData = {
      ...current,
      settings: { ...current.settings, slides: updatedSlides },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  resetToDefault: async () => {
    const reset = await dataService.resetToDefault();
    set({
      data: reset,
      activeSlideIndex: 0,
      timeRemainingMs: reset.settings.slideDurationMs || 5000,
    });
  },

  exportData: () => {
    return dataService.exportJson(get().data);
  },

  importData: async (jsonString: string) => {
    try {
      const imported = dataService.importJson(jsonString);
      set({
        data: imported,
        activeSlideIndex: 0,
        timeRemainingMs: imported.settings.slideDurationMs || 5000,
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to import JSON data' };
    }
  },

  // Slideshow actions
  nextSlide: () => {
    const eligible = getEligibleSlides(get().data);
    if (eligible.length === 0) return;
    const nextIdx = (get().activeSlideIndex + 1) % eligible.length;
    set({
      activeSlideIndex: nextIdx,
      timeRemainingMs: get().data.settings.slideDurationMs || 5000,
    });
  },

  prevSlide: () => {
    const eligible = getEligibleSlides(get().data);
    if (eligible.length === 0) return;
    const prevIdx = (get().activeSlideIndex - 1 + eligible.length) % eligible.length;
    set({
      activeSlideIndex: prevIdx,
      timeRemainingMs: get().data.settings.slideDurationMs || 5000,
    });
  },

  goToSlide: (index: number) => {
    const eligible = getEligibleSlides(get().data);
    if (index >= 0 && index < eligible.length) {
      set({
        activeSlideIndex: index,
        timeRemainingMs: get().data.settings.slideDurationMs || 5000,
      });
    }
  },

  togglePause: () => {
    set((s) => ({ isPaused: !s.isPaused }));
  },

  setPaused: (paused: boolean) => {
    set({ isPaused: paused });
  },

  setTimeRemainingMs: (ms: number) => {
    set({ timeRemainingMs: ms });
  },
}));
