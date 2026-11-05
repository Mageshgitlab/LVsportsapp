/**
 * Centralized Modern Fighting Game Theme Tokens & Configuration
 * LV Sports Carnival
 */

import { ASSETS } from '../config/assets';

export interface ThemeSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  effectsIntensity: 'low' | 'medium' | 'high';
  backgroundEnabled: boolean;
  plainDarkFallback: boolean;
}

export const THEME_COLORS = {
  canvasBg: '#0b0b0d',
  canvasDeep: '#060607',
  panelBg: 'rgba(20, 17, 15, 0.9)',
  panelBorder: 'rgba(212, 160, 23, 0.45)',
  panelGlow: 'rgba(193, 18, 31, 0.22)',
  
  // High-Energy Fighting Game Accents
  neonCyan: '#5EC8FF',
  neonViolet: '#8B7CF6',
  neonPink: '#D36D7D',
  neonAmber: '#FF6B00',
  neonEmerald: '#8CA870',
  neonCrimson: '#C1121F',
  goldBright: '#D4A017',

  // UI Surfaces
  surfaceDark: '#1a1512',
  surfaceLight: '#2a211c',
  borderGlass: 'rgba(212, 160, 23, 0.22)',
};

export const THEME_FONTS = {
  title: "'Rajdhani', 'Outfit', sans-serif",
  subTitle: "'Rajdhani', 'Plus Jakarta Sans', sans-serif",
  body: "'Plus Jakarta Sans', sans-serif",
  mono: "'Rajdhani', 'JetBrains Mono', monospace",
};

export interface TeamStyle {
  characterName: string;
  codename: string;
  themeStyle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  glowColor: string;
  symbol: string;
  tagline: string;
}

export const TEAM_STYLES: Record<string, TeamStyle> = {
  'team-a': {
    characterName: 'Pardus',
    codename: 'SOLAR PANTHER',
    themeStyle: 'Solar Overdrive',
    primaryColor: '#FF6B00',
    secondaryColor: '#C84D00',
    accentColor: '#F5C14A',
    glowColor: 'rgba(255, 107, 0, 0.55)',
    symbol: 'Panther',
    tagline: 'PREDATORY SPEED & SOLAR FURY',
  },
  'team-b': {
    characterName: 'Falcon Fury',
    codename: 'CYBER FALCON',
    themeStyle: 'Supersonic Wing',
    primaryColor: '#5EC8FF',
    secondaryColor: '#2C8FD0',
    accentColor: '#EAF7FF',
    glowColor: 'rgba(94, 200, 255, 0.55)',
    symbol: 'Falcon',
    tagline: 'VELOCITY UNBOUND & APEX CONTROL',
  },
  'team-c': {
    characterName: 'Stormbreakers',
    codename: 'STORMBREAKER AXE',
    themeStyle: 'Thunder Vanguard',
    primaryColor: '#8D59E6',
    secondaryColor: '#C7B7FF',
    accentColor: '#F7F3FF',
    glowColor: 'rgba(141, 89, 230, 0.55)',
    symbol: 'Thor Stormbreaker',
    tagline: 'FORGED IN HEARTS OF DYING STARS',
  },
  'team-d': {
    characterName: 'Tiger Ka Hukum',
    codename: 'IMPERIAL TIGER',
    themeStyle: 'Crimson Roar',
    primaryColor: '#C1121F',
    secondaryColor: '#8B0D17',
    accentColor: '#D4A017',
    glowColor: 'rgba(193, 18, 31, 0.6)',
    symbol: 'Tiger',
    tagline: 'MAJESTIC RULER OF THE ARENA',
  },
};

const THEME_STORAGE_KEY = 'lv_carnival_theme_settings_v2';

export const getStoredThemeSettings = (): ThemeSettings => {
  const defaults: ThemeSettings = {
    soundEnabled: false,
    soundVolume: 0.6,
    effectsIntensity: 'high',
    backgroundEnabled: true,
    plainDarkFallback: false,
  };

  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to read theme settings:', e);
  }
  return defaults;
};

export const saveThemeSettings = (settings: ThemeSettings): void => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('theme-settings-changed', { detail: settings }));
  } catch (e) {
    console.error('Failed to save theme settings:', e);
  }
};

/**
 * Web Audio Synthesizer for modern tournament video game sound effects
 */
class TournamentSoundFX {
  private ctx: AudioContext | null = null;
  private audioEls: Partial<Record<'gong' | 'fight' | 'victory' | 'round', HTMLAudioElement>> = {};

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public play(sound: 'gong' | 'fight' | 'victory' | 'round'): void {
    const settings = getStoredThemeSettings();
    if (!settings.soundEnabled) return;

    const assetMap: Record<'gong' | 'fight' | 'victory' | 'round', string> = {
      gong: ASSETS.audio.gong,
      fight: ASSETS.audio.fight,
      victory: ASSETS.audio.victory,
      round: ASSETS.audio.roundStart,
    };

    const src = assetMap[sound];
    if (src) {
      if (!this.audioEls[sound]) {
        this.audioEls[sound] = new Audio(src);
      }
      const clip = this.audioEls[sound]!;
      clip.volume = Math.min(1, Math.max(0, settings.soundVolume));
      clip.currentTime = 0;
      clip.play().catch(() => {
        this.playSynth(sound, settings.soundVolume);
      });
      return;
    }

    this.playSynth(sound, settings.soundVolume);
  }

  private playSynth(sound: 'gong' | 'fight' | 'victory' | 'round', volume: number): void {

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.7, now);
    masterGain.connect(ctx.destination);

    if (sound === 'fight') {
      // Impact double hit
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);
      gain.gain.setValueAtTime(1.0, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (sound === 'victory') {
      // Electronic fanfare
      [440, 554, 659, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        chordGain.gain.setValueAtTime(0.5, now + idx * 0.08);
        chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
        osc.connect(chordGain);
        chordGain.connect(masterGain);
        osc.start(now + idx * 0.08);
        osc.stop(now + 1.8);
      });
    } else {
      // Resonant arena chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 1.5);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.6);
    }
  }
}

export const tournamentSound = new TournamentSoundFX();
