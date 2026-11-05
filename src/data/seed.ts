import { CarnivalData, SlideConfig, GameFixtures } from '../types';

export const INITIAL_SLIDES: SlideConfig[] = [
  { id: 'hero', title: 'Welcome & Championship Showcase', enabled: true, order: 1, durationSec: 10 },
  { id: 'live_dashboard', title: 'Live Tournament Dashboard', enabled: true, order: 2, durationSec: 60 },
  { id: 'teams_overview', title: 'Teams Overview', enabled: true, order: 3, durationSec: 10 },
  { id: 'team_a', title: 'Team A - Pardus', enabled: true, order: 4, durationSec: 12 },
  { id: 'team_b', title: 'Team B - Falcon Fury', enabled: true, order: 5, durationSec: 12 },
  { id: 'team_c', title: 'Team C - Stormbreakers', enabled: true, order: 6, durationSec: 12 },
  { id: 'team_d', title: 'Team D - Tiger Ka Hukum', enabled: true, order: 7, durationSec: 12 },
];

export const DEFAULT_PANEL_INTERVALS = {
  gamesScheduleSec: 8,
  fixturesSec: 10,
  announcementsSec: 8,
};

export const INITIAL_DATA: CarnivalData = {
  settings: {
    eventTitle: 'LV Sports Carnival',
    eventSubtitle: 'Annual Corporate Sports Championship',
    eventDate: 'November 2026',
    venueName: 'Olympic Arena Complex',
    slideDurationMs: 10000,
    slides: INITIAL_SLIDES,
    autoRotate: true,
    panelIntervals: DEFAULT_PANEL_INTERVALS,
  },
  teams: [
    {
      id: 'team-a',
      code: 'A',
      name: 'Pardus',
      color: '#F59E0B', // Cyber Amber / Neon Orange
      secondaryColor: '#EA580C',
      accentColor: '#FEF08A',
      captain: 'Rajesh',
      viceCaptain: 'Saathithya',
      mascot: 'Panther',
    },
    {
      id: 'team-b',
      code: 'B',
      name: 'Falcon Fury',
      color: '#00F0FF', // Neon Cyan / Electric Blue
      secondaryColor: '#2563EB',
      accentColor: '#E0F2FE',
      captain: 'Sathish',
      viceCaptain: 'Monisha',
      mascot: 'Falcon',
    },
    {
      id: 'team-c',
      code: 'C',
      name: 'Stormbreakers',
      color: '#A855F7', // Electric Violet / Cosmic Purple
      secondaryColor: '#06B6D4',
      accentColor: '#F3E8FF',
      captain: 'Rohithkumar',
      viceCaptain: 'Abdul Aziz',
      mascot: 'Stormbreaker',
    },
    {
      id: 'team-d',
      code: 'D',
      name: 'Tiger Ka Hukum',
      color: '#EF4444', // Radiant Crimson Red
      secondaryColor: '#DC2626',
      accentColor: '#FBBF24',
      captain: 'Pugazh Vaanan',
      viceCaptain: 'Kanishka',
      mascot: 'Tiger',
    },
  ],
  members: [
    // Team A - Pardus
    { id: 'm-a-1', name: 'Ram Ganesh', teamId: 'team-a', jerseyNumber: 7 },
    { id: 'm-a-2', name: 'Pradheep Gunasekaran', teamId: 'team-a', jerseyNumber: 10 },
    { id: 'm-a-3', name: 'Karthick Ponnusamy', teamId: 'team-a', jerseyNumber: 12 },
    { id: 'm-a-4', name: 'Praveen Kumar', teamId: 'team-a', jerseyNumber: 18 },
    { id: 'm-a-5', name: 'Vijay Kumar', teamId: 'team-a', jerseyNumber: 23 },
    { id: 'm-a-6', name: 'Haris Ahmed', teamId: 'team-a', jerseyNumber: 9 },
    { id: 'm-a-7', name: 'Kumaran Elumalai', teamId: 'team-a', jerseyNumber: 14 },
    { id: 'm-a-8', name: 'Rajesh RS', teamId: 'team-a', role: 'captain', jerseyNumber: 1 },
    { id: 'm-a-9', name: 'Vignesh Purusothaman', teamId: 'team-a', jerseyNumber: 11 },
    { id: 'm-a-10', name: 'Sivadharshini Subramanian', teamId: 'team-a', jerseyNumber: 5 },
    { id: 'm-a-11', name: 'Saathithya Manokaran', teamId: 'team-a', role: 'vice-captain', jerseyNumber: 2 },
    { id: 'm-a-12', name: 'Murugeswari Mariselvam', teamId: 'team-a', jerseyNumber: 8 },
    { id: 'm-a-13', name: 'Sumathi', teamId: 'team-a', jerseyNumber: 16 },

    // Team B - Falcon Fury
    { id: 'm-b-1', name: 'Arunkumar Babu', teamId: 'team-b', jerseyNumber: 3 },
    { id: 'm-b-2', name: 'Dharmendran Lakshmi Narayanan', teamId: 'team-b', jerseyNumber: 17 },
    { id: 'm-b-3', name: 'Arunmozhi Balasekaran', teamId: 'team-b', jerseyNumber: 4 },
    { id: 'm-b-4', name: 'Madesh Ram', teamId: 'team-b', jerseyNumber: 13 },
    { id: 'm-b-5', name: 'Pradeep Nagaraj Perumal', teamId: 'team-b', jerseyNumber: 6 },
    { id: 'm-b-6', name: 'Alagusiva Palanisamy', teamId: 'team-b', jerseyNumber: 15 },
    { id: 'm-b-7', name: 'Loganathan Panneerselvam', teamId: 'team-b', jerseyNumber: 21 },
    { id: 'm-b-8', name: 'Sathish Moorthy', teamId: 'team-b', role: 'captain', jerseyNumber: 1 },
    { id: 'm-b-9', name: 'Dinesh Manoharan', teamId: 'team-b', jerseyNumber: 9 },
    { id: 'm-b-10', name: 'Monisha Murugesan', teamId: 'team-b', role: 'vice-captain', jerseyNumber: 2 },
    { id: 'm-b-11', name: 'Gowri Silaparasetty', teamId: 'team-b', jerseyNumber: 8 },
    { id: 'm-b-12', name: 'Bhanu Kuchharlapati', teamId: 'team-b', jerseyNumber: 22 },
    { id: 'm-b-13', name: 'Harshitha Ranjini', teamId: 'team-b', jerseyNumber: 19 },

    // Team C - Stormbreakers
    { id: 'm-c-1', name: 'Shaik Rahuman', teamId: 'team-c', jerseyNumber: 9 },
    { id: 'm-c-2', name: 'Ashok Yoganandan', teamId: 'team-c', jerseyNumber: 11 },
    { id: 'm-c-3', name: 'Abdul Aziz', teamId: 'team-c', role: 'vice-captain', jerseyNumber: 2 },
    { id: 'm-c-4', name: 'Srinath Haridas', teamId: 'team-c', jerseyNumber: 14 },
    { id: 'm-c-5', name: 'Anantharaj Baskar', teamId: 'team-c', jerseyNumber: 17 },
    { id: 'm-c-6', name: 'Thiruvenkadam Palanivelu', teamId: 'team-c', jerseyNumber: 8 },
    { id: 'm-c-7', name: 'Rohithkumar Rajagopal', teamId: 'team-c', role: 'captain', jerseyNumber: 1 },
    { id: 'm-c-8', name: 'Gopalakrishnan Gunakaran', teamId: 'team-c', jerseyNumber: 20 },
    { id: 'm-c-9', name: 'Rathesh Kumar', teamId: 'team-c', jerseyNumber: 15 },
    { id: 'm-c-10', name: 'Amith Saseendran', teamId: 'team-c', jerseyNumber: 5 },
    { id: 'm-c-11', name: 'Madhumitha Raja', teamId: 'team-c', jerseyNumber: 7 },
    { id: 'm-c-12', name: 'Priyadharshini Ramachandran', teamId: 'team-c', jerseyNumber: 12 },
    { id: 'm-c-13', name: 'Vinothini Jeyam', teamId: 'team-c', jerseyNumber: 24 },
    { id: 'm-c-14', name: 'Maheshwari', teamId: 'team-c', jerseyNumber: 25 },

    // Team D - Tiger Ka Hukum
    { id: 'm-d-1', name: 'Munishvaran R', teamId: 'team-d', jerseyNumber: 3 },
    { id: 'm-d-2', name: 'Arun Arumugasamy', teamId: 'team-d', jerseyNumber: 4 },
    { id: 'm-d-3', name: 'SriKrishnan M', teamId: 'team-d', jerseyNumber: 6 },
    { id: 'm-d-4', name: 'Magesh Sekar', teamId: 'team-d', jerseyNumber: 7 },
    { id: 'm-d-5', name: 'Pugazh Veerappan', teamId: 'team-d', jerseyNumber: 8 },
    { id: 'm-d-6', name: 'Ashok Kumar Subramani', teamId: 'team-d', jerseyNumber: 9 },
    { id: 'm-d-7', name: 'Poovarasan Muthusamy', teamId: 'team-d', jerseyNumber: 10 },
    { id: 'm-d-8', name: 'Karthik Nagarajan', teamId: 'team-d', jerseyNumber: 11 },
    { id: 'm-d-9', name: 'Visshal Babu', teamId: 'team-d', jerseyNumber: 13 },
    { id: 'm-d-10', name: 'Felix', teamId: 'team-d', jerseyNumber: 14 },
    { id: 'm-d-11', name: 'Bharathi Venkatesan', teamId: 'team-d', jerseyNumber: 15 },
    { id: 'm-d-12', name: 'Kanishka Murugan', teamId: 'team-d', role: 'vice-captain', jerseyNumber: 2 },
    { id: 'm-d-13', name: 'Katheeja fathima Faluliya', teamId: 'team-d', jerseyNumber: 18 },
    { id: 'm-d-14', name: 'Haritha', teamId: 'team-d', jerseyNumber: 20 },
  ],
  games: [
    {
      id: 'game-1',
      name: 'Carrom',
      category: 'Indoor Board Championship',
      icon: 'carrom',
      status: 'upcoming',
      scheduledTime: '09:30 AM',
      venue: 'Recreation Arena Table A',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: 'Doubles standard 29 points or 8 boards',
    },
    {
      id: 'game-2',
      name: 'Foosball',
      category: 'Indoor Table Arena',
      icon: 'foosball',
      status: 'upcoming',
      scheduledTime: '11:30 AM',
      venue: 'Game Zone Table 1',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: 'Best of 3 games · 5 goals win per frame',
    },
    {
      id: 'game-3',
      name: 'Cricket',
      category: 'Outdoor Turf Championship',
      icon: 'cricket',
      status: 'upcoming',
      scheduledTime: '02:00 PM',
      venue: 'Main Oval Turf Ground',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: '10 Overs a side · Tennis ball clash',
    },
    {
      id: 'game-4',
      name: 'Football',
      category: 'Outdoor Turf Arena',
      icon: 'football',
      status: 'upcoming',
      scheduledTime: '04:30 PM',
      venue: 'Central Football Stadium',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: '7v7 Knockout matches · 15 min halves',
    },
    {
      id: 'game-5',
      name: 'Snooker',
      category: 'Indoor Cue Sports',
      icon: 'snooker',
      status: 'upcoming',
      scheduledTime: '09:30 AM',
      venue: 'Club House Table 1',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: 'Best of 3 frames · 15 reds traditional',
    },
    {
      id: 'game-6',
      name: 'Volleyball',
      category: 'Outdoor Power Arena',
      icon: 'volleyball',
      status: 'upcoming',
      scheduledTime: '11:30 AM',
      venue: 'Grand Sand Court',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: '6v6 Best of 3 sets to 25 points',
    },
    {
      id: 'game-7',
      name: 'Badminton',
      category: 'Indoor Fast Court',
      icon: 'badminton',
      status: 'upcoming',
      scheduledTime: '02:00 PM',
      venue: 'Indoor Court 1 & 2',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: 'Men & Women Doubles 21 points',
    },
    {
      id: 'game-8',
      name: 'Chess',
      category: 'Mind Championship',
      icon: 'chess',
      status: 'upcoming',
      scheduledTime: '04:00 PM',
      venue: 'Strategy Mind Lounge',
      firstPlaceTeamId: null,
      secondPlaceTeamId: null,
      notes: 'Rapid 15 min + 10s increment FIDE clock',
    },
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Grand Opening Ceremony',
      message: 'Welcome to LV Sports Carnival! Assemble at the central arena for team oaths and the lighting of the tournament torch.',
      category: 'celebration',
      active: true,
      createdAt: '08:30 AM',
    },
    {
      id: 'ann-2',
      title: 'Carrom & Foosball Fixtures',
      message: 'Carrom and Foosball team pairs must report to Recreation Hall by 09:15 AM sharp for match drawings.',
      category: 'schedule',
      active: true,
      createdAt: '09:00 AM',
    },
    {
      id: 'ann-3',
      title: 'Live Standings Active',
      message: 'Points update live after every finished match: 1st Place = 10 pts, 2nd Place = 5 pts. Keep watching the big screen!',
      category: 'general',
      active: true,
      createdAt: '09:15 AM',
    },
    {
      id: 'ann-4',
      title: 'Hydration & Medical Support',
      message: 'First aid and hydration energy booths are operational behind Pavilion B and Court 2.',
      category: 'general',
      active: true,
      createdAt: '09:30 AM',
    },
  ],
  sponsors: [
    {
      id: 'sp-1',
      name: 'LV Group Global',
      tier: 'Title Partner',
      logoText: 'LV SPORTS',
    },
    {
      id: 'sp-2',
      name: 'Apex Energy Solutions',
      tier: 'Official Hydration Partner',
      logoText: 'APEX',
    },
    {
      id: 'sp-3',
      name: 'Titan Athletic Gear',
      tier: 'Kit & Equipment Partner',
      logoText: 'TITAN GEAR',
    },
    {
      id: 'sp-4',
      name: 'Zenith Health & Wellness',
      tier: 'Wellness & Medical Partner',
      logoText: 'ZENITH',
    },
  ],
  fixtures: {
    gameId: 'game-1',
    gameName: 'Carrom',
    title: 'CARROM FIXTURES',
    subtitle: 'Carrom Doubles League · 4 Pairs per Team · 3 Rounds',
    mode: 'pair',
    groupFormat: 'round_robin',
    teamPairCounts: {
      'team-a': 4,
      'team-b': 4,
      'team-c': 4,
      'team-d': 4,
    },
    gameWiseFixtures: [
      { id: 'gwf-1', gameId: 'game-3', gameName: 'Cricket', fixtureDate: '2026-11-16', fixtureEndDate: '2026-11-20', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-2', gameId: 'game-6', gameName: 'Volleyball', fixtureDate: '2026-11-23', fixtureEndDate: '2026-11-25', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-3', gameId: 'game-7', gameName: 'Badminton', fixtureDate: '2026-11-30', fixtureEndDate: '2026-12-03', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-4', gameId: 'game-4', gameName: 'Football', fixtureDate: '2026-12-06', fixtureEndDate: '2026-12-08', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-5', gameId: 'game-8', gameName: 'Chess', fixtureDate: '2026-11-16', fixtureEndDate: '2026-11-20', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-6', gameId: 'game-1', gameName: 'Carrom', fixtureDate: '2026-11-17', fixtureEndDate: '2026-11-18', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-7', gameId: 'game-5', gameName: 'Snooker', fixtureDate: '2026-11-23', fixtureEndDate: '2026-11-25', roundLabel: 'Tournament', status: 'upcoming' },
      { id: 'gwf-8', gameId: 'game-2', gameName: 'Foosball', fixtureDate: '2026-11-30', fixtureEndDate: '2026-12-03', roundLabel: 'Tournament', status: 'upcoming' },
    ],
    pairPlayers: {
      // Team A - Pardus
      'team-a_pair_1': ['m-a-1', 'm-a-2'], // Ram Ganesh & Pradheep Gunasekaran
      'team-a_pair_2': ['m-a-3', 'm-a-4'], // Karthick Ponnusamy & Praveen Kumar
      'team-a_pair_3': ['m-a-5', 'm-a-6'], // Vijay Kumar & Haris Ahmed
      'team-a_pair_4': ['m-a-7', 'm-a-8'], // Kumaran Elumalai & Rajesh RS
      // Team B - Falcon Fury
      'team-b_pair_1': ['m-b-1', 'm-b-2'], // Arunkumar Babu & Dharmendran Lakshmi Narayanan
      'team-b_pair_2': ['m-b-3', 'm-b-4'], // Arunmozhi Balasekaran & Madesh Ram
      'team-b_pair_3': ['m-b-5', 'm-b-6'], // Pradeep Nagaraj Perumal & Alagusiva Palanisamy
      'team-b_pair_4': ['m-b-7', 'm-b-8'], // Loganathan Panneerselvam & Sathish Moorthy
      // Team C - Stormbreakers
      'team-c_pair_1': ['m-c-1', 'm-c-2'], // Shaik Rahuman & Ashok Yoganandan
      'team-c_pair_2': ['m-c-3', 'm-c-4'], // Abdul Aziz & Srinath Haridas
      'team-c_pair_3': ['m-c-5', 'm-c-6'], // Anantharaj Baskar & Thiruvenkadam Palanivelu
      'team-c_pair_4': ['m-c-7', 'm-c-8'], // Rohithkumar Rajagopal & Gopalakrishnan Gunakaran
      // Team D - Tiger Ka Hukum
      'team-d_pair_1': ['m-d-1', 'm-d-2'], // Munishvaran R & Arun Arumugasamy
      'team-d_pair_2': ['m-d-3', 'm-d-4'], // SriKrishnan M & Magesh Sekar
      'team-d_pair_3': ['m-d-5', 'm-d-6'], // Pugazh Veerappan & Ashok Kumar Subramani
      'team-d_pair_4': ['m-d-7', 'm-d-8'], // Poovarasan Muthusamy & Karthik Nagarajan
    },
    rounds: [
      {
        roundNumber: 1,
        title: 'Round 1',
        ties: [
          {
            id: 'tie-1',
            tieNumber: 1,
            roundNumber: 1,
            teamAId: 'team-a',
            teamBId: 'team-b',
            matches: [
              { id: 'm-t1-1', pairANumber: 3, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t1-2', pairANumber: 1, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t1-3', pairANumber: 4, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t1-4', pairANumber: 2, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
            ],
          },
          {
            id: 'tie-2',
            tieNumber: 2,
            roundNumber: 1,
            teamAId: 'team-c',
            teamBId: 'team-d',
            matches: [
              { id: 'm-t2-1', pairANumber: 2, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t2-2', pairANumber: 4, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t2-3', pairANumber: 1, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t2-4', pairANumber: 3, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
            ],
          },
        ],
      },
      {
        roundNumber: 2,
        title: 'Round 2',
        ties: [
          {
            id: 'tie-3',
            tieNumber: 3,
            roundNumber: 2,
            teamAId: 'team-a',
            teamBId: 'team-c',
            matches: [
              { id: 'm-t3-1', pairANumber: 2, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t3-2', pairANumber: 4, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t3-3', pairANumber: 1, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t3-4', pairANumber: 3, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
            ],
          },
          {
            id: 'tie-4',
            tieNumber: 4,
            roundNumber: 2,
            teamAId: 'team-b',
            teamBId: 'team-d',
            matches: [
              { id: 'm-t4-1', pairANumber: 4, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t4-2', pairANumber: 1, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t4-3', pairANumber: 3, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t4-4', pairANumber: 2, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
            ],
          },
        ],
      },
      {
        roundNumber: 3,
        title: 'Round 3',
        ties: [
          {
            id: 'tie-5',
            tieNumber: 5,
            roundNumber: 3,
            teamAId: 'team-a',
            teamBId: 'team-d',
            matches: [
              { id: 'm-t5-1', pairANumber: 4, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t5-2', pairANumber: 2, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t5-3', pairANumber: 3, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t5-4', pairANumber: 1, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
            ],
          },
          {
            id: 'tie-6',
            tieNumber: 6,
            roundNumber: 3,
            teamAId: 'team-b',
            teamBId: 'team-c',
            matches: [
              { id: 'm-t6-1', pairANumber: 3, pairBNumber: 1, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t6-2', pairANumber: 2, pairBNumber: 4, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t6-3', pairANumber: 1, pairBNumber: 2, status: 'upcoming', winnerTeamId: null },
              { id: 'm-t6-4', pairANumber: 4, pairBNumber: 3, status: 'upcoming', winnerTeamId: null },
            ],
          },
        ],
      },
    ],
  },
};
