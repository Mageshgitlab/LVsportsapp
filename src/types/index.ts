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

export interface Game {
  id: string;
  name: string; // 'Cricket', 'Football', 'Snooker', 'Carrom', 'Chess', 'Tug of War'
  category: string; // 'Outdoor', 'Indoor', 'Mind Game', 'Power'
  icon: string; // 'cricket' | 'football' | 'snooker' | 'carrom' | 'chess' | 'tug_of_war' | 'generic'
  status: GameStatus;
  scheduledTime: string; // e.g. 'Day 1 - 09:30 AM'
  venue: string; // e.g. 'Main Oval Arena'
  firstPlaceTeamId?: TeamId | null; // Winner (10 pts)
  secondPlaceTeamId?: TeamId | null; // Runner-up (5 pts)
  notes?: string;
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
}

export interface CarnivalSettings {
  eventTitle: string;
  eventSubtitle: string;
  eventDate: string;
  venueName: string;
  slideDurationMs: number; // default 5000
  slides: SlideConfig[];
  autoRotate: boolean;
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

export interface GameFixtures {
  gameId: string;
  gameName: string;
  title: string;
  subtitle?: string;
  pairPlayers?: Record<string, [string, string]>; // `${teamId}_pair_${pairNumber}` -> [memberId1, memberId2]
  rounds: FixtureRound[];
}

export interface CarnivalData {
  settings: CarnivalSettings;
  teams: Team[];
  members: Member[];
  games: Game[];
  announcements: Announcement[];
  sponsors: Sponsor[];
  fixtures: GameFixtures;
}
