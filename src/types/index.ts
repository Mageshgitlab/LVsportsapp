export type TeamId = 'team-a' | 'team-b' | 'team-c' | 'team-d' | string;

export interface Team {
  id: TeamId;
  code: string; // 'A', 'B', 'C', 'D'
  name: string; // 'Pardus', 'Falcon Fury', 'Stormbreakers', 'Tiger Ka Hukum'
  color: string; // Hex color e.g. '#F97316'
  secondaryColor: string; // Hex darker shade e.g. '#C2410C'
  accentColor: string; // Glow/light shade
  captain: string;
  viceCaptain: string;
  mascot: string; // 'Panther / Leopard', 'Falcon', 'Lightning / Storm', 'Tiger'
  logoImage?: string;
}

export interface Member {
  id: string;
  name: string;
  teamId: TeamId;
  role?: 'captain' | 'vice-captain' | 'player';
  jerseyNumber?: number;
}

export type GameStatus = 'upcoming' | 'live' | 'completed';
export type FixtureMode = 'pair' | 'group';
export type GroupFixtureFormat = 'round_robin' | 'knockout';

export interface Game {
  id: string;
  name: string; // 'Cricket', 'Football', 'Snooker', 'Carrom', 'Chess', 'Tug of War'
  category: string; // 'Outdoor', 'Indoor', 'Mind Game', 'Power'
  icon: string; // 'cricket' | 'football' | 'snooker' | 'carrom' | 'chess' | 'tug_of_war' | 'generic'
  status: GameStatus;
  scheduledTime: string; // event time or free-form schedule label
  venue: string; // e.g. 'Main Oval Arena'
  firstPlaceTeamId?: TeamId | null; // Winner (10 pts)
  secondPlaceTeamId?: TeamId | null; // Runner-up (5 pts)
  notes?: string;
  type?: FixtureMode;
  playersPerSide?: number;
  squadSize?: number;
  maxSubs?: number;
  format?: 'round_robin' | 'knockout' | 'manual';
  pairSize?: 1 | 2;
  maxPairsPerTeam?: number;
  playersCount?: number;
  subsCount?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'general' | 'urgent' | 'schedule' | 'celebration';
  active: boolean;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: string;
  logoText: string;
  logoUrl?: string;
}

export type SlideId =
  | 'hero'
  | 'live_dashboard'
  | 'teams_overview'
  | 'team_a'
  | 'team_b'
  | 'team_c'
  | 'team_d'
  | 'schedule'
  | 'fixtures'
  | 'leaderboard'
  | 'results'
  | 'announcements';

export interface SlideConfig {
  id: SlideId;
  title: string;
  enabled: boolean;
  order: number;
  durationSec?: number; // per-slide duration in seconds
}

export interface PanelIntervals {
  gamesScheduleSec: number; // default 8
  fixturesSec: number; // default 10
  announcementsSec: number; // default 8
}

export interface CarnivalSettings {
  eventTitle: string;
  eventSubtitle: string;
  eventDate: string;
  venueName: string;
  slideDurationMs: number; // default fallback (ms)
  slides: SlideConfig[];
  autoRotate: boolean;
  slideDurations?: Record<string, number>; // slideId -> duration in seconds
  panelIntervals?: PanelIntervals;
}

export interface TeamScoreStat {
  team: Team;
  points: number;
  firstPlaceCount: number;
  secondPlaceCount: number;
  gamesPlayed: number;
  rank: number;
}

export interface PairMatch {
  id: string;
  pairANumber: number; // 1 | 2 | 3 | 4
  pairBNumber: number; // 1 | 2 | 3 | 4
  status: GameStatus; // 'upcoming' | 'live' | 'completed'
  winnerTeamId?: TeamId | null; // which team won this pair match
}

export interface FixtureTie {
  id: string;
  tieNumber: number; // 1 to 6
  roundNumber: number; // 1, 2, 3
  teamAId: TeamId;
  teamBId: TeamId;
  matches: PairMatch[];
}

export interface FixtureRound {
  roundNumber: number;
  title: string;
  ties: FixtureTie[];
}

export interface GameWiseFixture {
  id: string;
  gameId: string;
  gameName: string;
  fixtureDate: string;
  fixtureEndDate?: string;
  roundLabel: string;
  status: GameStatus;
  notes?: string;
}

export interface GameFixtures {
  gameId: string;
  gameName: string;
  title: string;
  subtitle?: string;
  mode?: FixtureMode;
  groupFormat?: GroupFixtureFormat;
  pairPlayers?: Record<string, [string, string]>; // `${teamId}_pair_${pairNumber}` -> [memberId1, memberId2]
  pairNames?: Record<string, string>; // `${gameId}_${teamId}_pair_${pairNumber}` -> editable pair name
  teamPairCounts?: Record<string, number>; // `${teamId}` -> number of configured pairs
  gameWiseFixtures?: GameWiseFixture[];
  rounds: FixtureRound[];
}

export interface Registration {
  gameId: string;
  teamId: TeamId;
  pairs?: { id: string; label?: string; memberIds: string[] }[];
  playerIds?: string[];
  substituteIds?: string[];
}

export type FixtureStatus = 'upcoming' | 'live' | 'completed' | 'postponed';

export interface FixtureRecord {
  id: string;
  gameId: string;
  round: string;
  sideA: { teamId: TeamId; pairId?: string };
  sideB: { teamId: TeamId; pairId?: string };
  date: string;
  time: string;
  venue: string;
  status: FixtureStatus;
  result?: { winnerSide: 'A' | 'B' | 'draw' | null; scoreA?: string; scoreB?: string };
}

export interface CarnivalData {
  settings: CarnivalSettings;
  teams: Team[];
  members: Member[];
  games: Game[];
  announcements: Announcement[];
  sponsors: Sponsor[];
  fixtures: GameFixtures;
  registrations: Registration[];
  fixtureRecords: FixtureRecord[];
  participatingTeams: Record<string, TeamId[]>;
}
