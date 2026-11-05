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
  FixtureTie,
  GameFixtures,
  PanelIntervals,
  FixtureMode,
  GroupFixtureFormat,
  GameWiseFixture,
} from '../types';
import { dataService } from '../services/dataService';
import { INITIAL_DATA } from '../data/seed';

const PAIR_GAME_NAMES = new Set(['carrom', 'foosball', 'batmitoon', 'badminton', 'snooker', 'cricket']);

const inferFixtureMode = (gameName: string): FixtureMode => {
  const normalized = (gameName || '').trim().toLowerCase();
  if (normalized === 'football' || normalized === 'volleyball') return 'group';
  if (PAIR_GAME_NAMES.has(normalized)) return 'pair';
  return 'pair';
};

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
      case 'teams_overview':
        return false;
      case 'team_a':
        return false;
      case 'team_b':
        return false;
      case 'team_c':
        return false;
      case 'team_d':
        return false;
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
  addGroupMatchup: (roundNumber: number) => Promise<void>;
  addPairMatchup: (roundNumber: number) => Promise<void>;
  deleteFixtureTie: (roundNumber: number, tieId: string) => Promise<void>;
  updateFixtureTie: (roundNumber: number, tieId: string, patch: Partial<Pick<FixtureTie, 'teamAId' | 'teamBId'>>) => Promise<void>;
  assignPairPlayer: (teamId: TeamId, pairNumber: number, playerIndex: 0 | 1, memberId: string) => Promise<void>;
  updatePairName: (gameId: string, teamId: TeamId, pairNumber: number, name: string) => Promise<void>;
  shuffleFixtures: (tieId?: string) => Promise<void>;
  setFixturesGame: (gameId: string, gameName: string, title?: string) => Promise<void>;
  setFixturesMode: (mode: FixtureMode) => Promise<void>;
  setTeamPairCount: (teamId: TeamId, pairCount: number) => Promise<void>;
  updateRoundTitle: (roundNumber: number, title: string) => Promise<void>;
  addFixtureRound: () => Promise<void>;
  deleteFixtureRound: (roundNumber: number) => Promise<void>;
  setGroupFormat: (format: GroupFixtureFormat) => Promise<void>;
  addGameWiseFixture: (fixture: Omit<GameWiseFixture, 'id'>) => Promise<void>;
  updateGameWiseFixture: (fixtureId: string, patch: Partial<GameWiseFixture>) => Promise<void>;
  deleteGameWiseFixture: (fixtureId: string) => Promise<void>;

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
  updateSlideDuration: (slideId: SlideId, durationSec: number) => Promise<void>;
  updatePanelIntervals: (intervals: Partial<PanelIntervals>) => Promise<void>;

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

      // Subscribe to live cloud changes (Supabase Realtime)
      if (dataService.subscribeToChanges) {
        dataService.subscribeToChanges((updatedData) => {
          set({ data: updatedData });
        });
      }
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

  addGroupMatchup: async (roundNumber) => {
    const current = get().data;
    const round = current.fixtures?.rounds.find((item) => item.roundNumber === roundNumber);
    if (!current.fixtures || !round || current.teams.length < 2) return;
    const firstTwo = current.teams.slice(0, 2);
    const tieId = `group-${roundNumber}-${Date.now()}`;
    const tie: FixtureTie = {
      id: tieId,
      tieNumber: round.ties.length + 1,
      roundNumber,
      teamAId: firstTwo[0].id,
      teamBId: firstTwo[1].id,
      matches: [{ id: `group-match-${Date.now()}`, pairANumber: 1, pairBNumber: 1, status: 'upcoming', winnerTeamId: null }],
    };
    const updated: CarnivalData = {
      ...current,
      fixtures: { ...current.fixtures, rounds: current.fixtures.rounds.map((item) => item.roundNumber === roundNumber ? { ...item, ties: [...item.ties, tie] } : item) },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addPairMatchup: async (roundNumber) => {
    const current = get().data;
    const round = current.fixtures?.rounds.find((item) => item.roundNumber === roundNumber);
    if (!current.fixtures || !round || current.teams.length < 2) return;
    const [teamA, teamB] = current.teams;
    const timestamp = Date.now();
    const tie: FixtureTie = {
      id: `pair-${roundNumber}-${timestamp}`,
      tieNumber: round.ties.length + 1,
      roundNumber,
      teamAId: teamA.id,
      teamBId: teamB.id,
      matches: Array.from({ length: 4 }, (_, index) => ({
        id: `pair-match-${roundNumber}-${timestamp}-${index + 1}`,
        pairANumber: index + 1,
        pairBNumber: index + 1,
        status: 'upcoming' as GameStatus,
        winnerTeamId: null,
      })),
    };
    const updated: CarnivalData = {
      ...current,
      fixtures: { ...current.fixtures, rounds: current.fixtures.rounds.map((item) => item.roundNumber === roundNumber ? { ...item, ties: [...item.ties, tie] } : item) },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteFixtureTie: async (roundNumber, tieId) => {
    const current = get().data;
    if (!current.fixtures) return;
    const updated: CarnivalData = {
      ...current,
      fixtures: { ...current.fixtures, rounds: current.fixtures.rounds.map((round) => round.roundNumber !== roundNumber ? round : { ...round, ties: round.ties.filter((tie) => tie.id !== tieId) }) },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateFixtureTie: async (roundNumber, tieId, patch) => {
    const current = get().data;
    if (!current.fixtures) return;
    const updated: CarnivalData = {
      ...current,
      fixtures: { ...current.fixtures, rounds: current.fixtures.rounds.map((round) => round.roundNumber !== roundNumber ? round : { ...round, ties: round.ties.map((tie) => tie.id === tieId ? { ...tie, ...patch } : tie) }) },
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

  updatePairName: async (gameId, teamId, pairNumber, name) => {
    const current = get().data;
    if (!current.fixtures) return;
    const pairNameKey = `${gameId}_${teamId}_pair_${pairNumber}`;
    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        pairNames: { ...(current.fixtures.pairNames || {}), [pairNameKey]: name },
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

        const teamPairCounts = current.fixtures.teamPairCounts || {};
        const aCount = Math.max(1, teamPairCounts[tie.teamAId] || 4);
        const bCount = Math.max(1, teamPairCounts[tie.teamBId] || 4);
        const aBase = Array.from({ length: aCount }, (_, idx) => idx + 1);
        const bBase = Array.from({ length: bCount }, (_, idx) => idx + 1);

        const shuffledA = shuffleArray(aBase);
        const shuffledB = shuffleArray(bBase);
        const aPairs = tie.matches.map((_, idx) => shuffledA[idx % shuffledA.length]);
        const bPairs = tie.matches.map((_, idx) => shuffledB[idx % shuffledB.length]);

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
        mode: inferFixtureMode(gameName),
        groupFormat: current.fixtures.groupFormat || 'round_robin',
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  setFixturesMode: async (mode) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        mode,
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  setTeamPairCount: async (teamId, pairCount) => {
    const current = get().data;
    if (!current.fixtures) return;

    const clampedCount = Math.max(1, Math.min(12, Math.floor(pairCount)));
    const updatedPairCounts = {
      ...(current.fixtures.teamPairCounts || {}),
      [teamId]: clampedCount,
    };

    const updatedPairPlayers = { ...(current.fixtures.pairPlayers || {}) };
    Object.keys(updatedPairPlayers).forEach((key) => {
      if (key.startsWith(`${teamId}_pair_`)) {
        const pairNum = Number(key.split('_').pop());
        if (Number.isFinite(pairNum) && pairNum > clampedCount) {
          delete updatedPairPlayers[key];
        }
      }
    });

    const updatedRounds = current.fixtures.rounds.map((round) => ({
      ...round,
      ties: round.ties.map((tie) => {
        if (tie.teamAId !== teamId && tie.teamBId !== teamId) return tie;
        return {
          ...tie,
          matches: tie.matches.map((match) => ({
            ...match,
            pairANumber:
              tie.teamAId === teamId ? Math.min(match.pairANumber, clampedCount) : match.pairANumber,
            pairBNumber:
              tie.teamBId === teamId ? Math.min(match.pairBNumber, clampedCount) : match.pairBNumber,
          })),
        };
      }),
    }));

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        teamPairCounts: updatedPairCounts,
        pairPlayers: updatedPairPlayers,
        rounds: updatedRounds,
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateRoundTitle: async (roundNumber, title) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        rounds: current.fixtures.rounds.map((round) =>
          round.roundNumber === roundNumber
            ? {
                ...round,
                title,
              }
            : round
        ),
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  addFixtureRound: async () => {
    const current = get().data;
    if (!current.fixtures) return;

    const sortedRounds = [...current.fixtures.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
    const nextRoundNumber = sortedRounds.length > 0 ? sortedRounds[sortedRounds.length - 1].roundNumber + 1 : 1;

    const teamIds = current.teams.map((team) => team.id);
    const tiePairs: Array<[string, string]> = [];
    if (current.fixtures.mode !== 'group') {
      for (let idx = 0; idx + 1 < teamIds.length; idx += 2) tiePairs.push([teamIds[idx], teamIds[idx + 1]]);
    }

    const newRound = {
      roundNumber: nextRoundNumber,
      title: `Round ${nextRoundNumber}`,
      ties: tiePairs.map(([teamAId, teamBId], tieIdx) => ({
        id: `tie-r${nextRoundNumber}-${tieIdx + 1}-${Date.now()}`,
        tieNumber: (current.fixtures.rounds.flatMap((r) => r.ties).length || 0) + tieIdx + 1,
        roundNumber: nextRoundNumber,
        teamAId,
        teamBId,
        matches: Array.from({ length: 4 }, (_, matchIdx) => ({
          id: `m-r${nextRoundNumber}-${tieIdx + 1}-${matchIdx + 1}-${Date.now()}`,
          pairANumber: matchIdx + 1,
          pairBNumber: matchIdx + 1,
          status: 'upcoming' as GameStatus,
          winnerTeamId: null,
        })),
      })),
    };

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        rounds: [...current.fixtures.rounds, newRound],
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteFixtureRound: async (roundNumber) => {
    const current = get().data;
    if (!current.fixtures) return;
    if (current.fixtures.rounds.length <= 1) return;

    const filtered = current.fixtures.rounds
      .filter((round) => round.roundNumber !== roundNumber)
      .sort((a, b) => a.roundNumber - b.roundNumber)
      .map((round, idx) => ({
        ...round,
        roundNumber: idx + 1,
        title: round.title || `Round ${idx + 1}`,
        ties: round.ties.map((tie) => ({
          ...tie,
          roundNumber: idx + 1,
        })),
      }));

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        rounds: filtered,
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  setGroupFormat: async (format) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        groupFormat: format,
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  addGameWiseFixture: async (fixtureData) => {
    const current = get().data;
    if (!current.fixtures) return;

    const newFixture: GameWiseFixture = {
      ...fixtureData,
      id: `gwf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        gameWiseFixtures: [...(current.fixtures.gameWiseFixtures || []), newFixture],
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  updateGameWiseFixture: async (fixtureId, patch) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        gameWiseFixtures: (current.fixtures.gameWiseFixtures || []).map((fixture) =>
          fixture.id === fixtureId ? { ...fixture, ...patch } : fixture
        ),
      },
    };

    await dataService.saveData(updated);
    set({ data: updated });
  },

  deleteGameWiseFixture: async (fixtureId) => {
    const current = get().data;
    if (!current.fixtures) return;

    const updated: CarnivalData = {
      ...current,
      fixtures: {
        ...current.fixtures,
        gameWiseFixtures: (current.fixtures.gameWiseFixtures || []).filter((fixture) => fixture.id !== fixtureId),
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

  updateSlideDuration: async (slideId, durationSec) => {
    const current = get().data;
    const updatedSlides = current.settings.slides.map((s) =>
      s.id === slideId ? { ...s, durationSec: Math.max(2, durationSec) } : s
    );
    const updatedDurations = {
      ...(current.settings.slideDurations || {}),
      [slideId]: Math.max(2, durationSec),
    };
    const updated: CarnivalData = {
      ...current,
      settings: {
        ...current.settings,
        slides: updatedSlides,
        slideDurations: updatedDurations,
      },
    };
    await dataService.saveData(updated);
    set({ data: updated });
  },

  updatePanelIntervals: async (intervals) => {
    const current = get().data;
    const updated: CarnivalData = {
      ...current,
      settings: {
        ...current.settings,
        panelIntervals: {
          ...(current.settings.panelIntervals || {
            gamesScheduleSec: 8,
            fixturesSec: 10,
            announcementsSec: 8,
          }),
          ...intervals,
        },
      },
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
