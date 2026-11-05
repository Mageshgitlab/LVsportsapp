/**
 * Centralized Asset Configuration for LV Sports Carnival
 * All tournament emblems, background arenas, and audio files are referenced here
 * so users can drop in their own files under /public/.
 */

const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
const asset = (filePath: string) => `${baseUrl}/${filePath.replace(/^\/+/, '')}`;

export const ASSETS = {
  // Tournament Emblem
  carnivalLogo: asset('images/carnival-logo.png'),
  carnivalLogoSvg: asset('images/carnival-logo.svg'),

  // Arena Backgrounds
  cyberArenaBg: asset('images/backgrounds/cyber_arena.jpg'),
  neonStadiumBg: asset('images/backgrounds/neon_stadium.jpg'),
  heroStadium: asset('images/stadium_hero.jpg'),
  trophySpotlight: asset('images/golden_trophy.jpg'),
  sportsEquipment: asset('images/sports_equipment.jpg'),
  stadiumFans: asset('images/stadium_fans.jpg'),
  arenaTemple: asset('images/backgrounds/temple_courtyard.jpg'),
  arenaPit: asset('images/backgrounds/fiery_pit.jpg'),
  arenaPillars: asset('images/backgrounds/stone_pillars.jpg'),
  arenaDragon: asset('images/dragon_emblem.png'),
  arenaRoyalOriginal: asset('images/backgrounds/arena_royal_original.svg'),
  arenaEmbersOriginal: asset('images/backgrounds/arena_embers_original.svg'),

  // Audio Sound Effects (Synthesized via Web Audio if missing)
  audio: {
    gong: asset('audio/gong.mp3'),
    fight: asset('audio/fight.mp3'),
    victory: asset('audio/victory.mp3'),
    roundStart: asset('audio/round_start.mp3'),
    flawlessVictory: asset('audio/flawless_victory.mp3'),
  },
};
