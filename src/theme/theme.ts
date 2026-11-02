/**
 * Centralized Modern Fighting Game Theme Tokens & Configuration
 * LV Sports Carnival
 */

export interface ThemeSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  effectsIntensity: 'low' | 'medium' | 'high';
  plainDarkFallback: boolean;
}

export const THEME_COLORS = {
  canvasBg: '#070A1E',
  canvasDeep: '#050716',
  panelBg: 'rgba(15, 20, 48, 0.85)',
  panelBorder: 'rgba(0, 240, 255, 0.25)',
  panelGlow: 'rgba(0, 240, 255, 0.15)',
  
  // High-Energy Fighting Game Accents
  neonCyan: '#00F0FF',
  neonViolet: '#A855F7',
  neonPink: '#EC4899',
  neonAmber: '#F59E0B',
  neonEmerald: '#10B981',
  neonCrimson: '#EF4444',
  goldBright: '#FBBF24',

  // UI Surfaces
  surfaceDark: '#0D1129',
  surfaceLight: '#1E2548',
  borderGlass: 'rgba(255, 255, 255, 0.12)',
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
    primaryColor: '#F59E0B', // Cyber Amber / Neon Orange
    secondaryColor: '#EA580C',
    accentColor: '#FEF08A',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    symbol: 'Panther',
    tagline: 'PREDATORY SPEED & SOLAR FURY',
  },
  'team-b': {
    characterName: 'Falcon Fury',
    codename: 'CYBER FALCON',
    themeStyle: 'Supersonic Wing',
    primaryColor: '#00F0FF', // Neon Cyan / Electric Blue
    secondaryColor: '#2563EB',
    accentColor: '#E0F2FE',
    glowColor: 'rgba(0, 240, 255, 0.6)',
    symbol: 'Falcon',
    tagline: 'VELOCITY UNBOUND & APEX CONTROL',
  },
  'team-c': {
    characterName: 'Stormbreakers',
    codename: 'STORMBREAKER AXE',
    themeStyle: 'Thunder Vanguard',
    primaryColor: '#A855F7', // Electric Violet / Cosmic Purple
    secondaryColor: '#06B6D4',
    accentColor: '#F3E8FF',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    symbol: 'Thor Stormbreaker',
    tagline: 'FORGED IN HEARTS OF DYING STARS',
  },
  'team-d': {
    characterName: 'Tiger Ka Hukum',
    codename: 'IMPERIAL TIGER',
    themeStyle: 'Crimson Roar',
    primaryColor: '#EF4444', // Radiant Crimson Red
    secondaryColor: '#DC2626',
    accentColor: '#FBBF24',
    glowColor: 'rgba(239, 68, 68, 0.65)',
    symbol: 'Tiger',
    tagline: 'MAJESTIC RULER OF THE ARENA',
  },
};

const THEME_STORAGE_KEY = 'lv_carnival_theme_settings_v2';

export const getStoredThemeSettings = (): ThemeSettings => {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read theme settings:', e);
  }
  return {
    soundEnabled: false,
    soundVolume: 0.6,
    effectsIntensity: 'high',
    plainDarkFallback: false,
  };
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

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(settings.soundVolume * 0.7, now);
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
