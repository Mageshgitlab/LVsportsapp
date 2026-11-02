/**
 * Centralized Asset Configuration for LV Sports Carnival
 * All tournament emblems, background arenas, and audio files are referenced here
 * so users can drop in their own files under /public/.
 */

export const ASSETS = {
  // Tournament Emblem
  carnivalLogo: '/images/carnival-logo.png',
  carnivalLogoSvg: '/images/carnival-logo.svg',

  // Arena Backgrounds
  cyberArenaBg: '/images/backgrounds/cyber_arena.jpg',
  neonStadiumBg: '/images/backgrounds/neon_stadium.jpg',
  heroStadium: '/images/stadium_hero.jpg',
  trophySpotlight: '/images/golden_trophy.jpg',
  sportsEquipment: '/images/sports_equipment.jpg',
  stadiumFans: '/images/stadium_fans.jpg',

  // Audio Sound Effects (Synthesized via Web Audio if missing)
  audio: {
    gong: '/audio/gong.mp3',
    fight: '/audio/fight.mp3',
    victory: '/audio/victory.mp3',
    roundStart: '/audio/round_start.mp3',
  },
};
