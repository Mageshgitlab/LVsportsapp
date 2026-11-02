import React, { useState } from 'react';
import {
  getStoredThemeSettings,
  saveThemeSettings,
  tournamentSound,
  ThemeSettings,
  THEME_COLORS,
} from '../../../theme/theme';
import { Volume2, VolumeX, Sparkles, Zap, Trophy, Play, Check } from 'lucide-react';

export const ThemeTab: React.FC = () => {
  const [settings, setSettings] = useState<ThemeSettings>(getStoredThemeSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  const update = (patch: Partial<ThemeSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    saveThemeSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleTestSound = (sound: 'gong' | 'fight' | 'victory' | 'round') => {
    tournamentSound.play(sound);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Rajdhani'] tracking-wider">
            Sports Carnival Visual & Audio FX
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-['Rajdhani'] font-semibold">
            Manage tournament sound effects, transition flashes, and display intensity
          </p>
        </div>

        {savedNotice && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded">
            <Check className="w-3.5 h-3.5" />
            <span>Theme updated</span>
          </span>
        )}
      </div>

      {/* Audio Sound FX Section */}
      <div className="p-6 rounded-xl bg-[#0D1129]/95 border border-cyan-500/30 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Rajdhani'] tracking-wide">
                Tournament Audio Cues
              </h3>
              <p className="text-xs text-slate-400 font-['Rajdhani']">
                Synthesizes slide transition sounds, "FIGHT!" cues, and victory fanfares
              </p>
            </div>
          </div>

          <button
            onClick={() => update({ soundEnabled: !settings.soundEnabled })}
            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider font-['Rajdhani'] transition-all cursor-pointer flex items-center gap-2 ${
              settings.soundEnabled
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{settings.soundEnabled ? 'Audio Enabled' : 'Audio Muted'}</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-['Rajdhani']">
            <span>Audio Volume</span>
            <span className="font-mono text-cyan-400">{Math.round(settings.soundVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.soundVolume}
            onChange={(e) => update({ soundVolume: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Test Audio Cues */}
        <div className="pt-2">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-['Rajdhani'] mb-2.5">
            Preview Audio Cues:
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleTestSound('round')}
              className="px-3 py-2 bg-black/50 hover:bg-black/80 text-cyan-300 border border-cyan-500/40 rounded text-xs font-bold font-['Rajdhani'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Arena Chime</span>
            </button>
            <button
              onClick={() => handleTestSound('fight')}
              className="px-3 py-2 bg-black/50 hover:bg-black/80 text-amber-300 border border-amber-500/40 rounded text-xs font-bold font-['Rajdhani'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Clash Impact</span>
            </button>
            <button
              onClick={() => handleTestSound('victory')}
              className="px-3 py-2 bg-black/50 hover:bg-black/80 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold font-['Rajdhani'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Victory Fanfare</span>
            </button>
            <button
              onClick={() => handleTestSound('gong')}
              className="px-3 py-2 bg-black/50 hover:bg-black/80 text-yellow-300 border border-yellow-400/40 rounded text-xs font-bold font-['Rajdhani'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Gong Resonance</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Effects & Intensity */}
      <div className="p-6 rounded-xl bg-[#0D1129]/95 border border-cyan-500/30 space-y-5 shadow-2xl">
        <div>
          <h3 className="text-base font-bold text-white font-['Rajdhani'] tracking-wide">
            Visual Motion & Flash Intensity
          </h3>
          <p className="text-xs text-slate-400 font-['Rajdhani']">
            Controls transition flashes and glow energy on slide rotations
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(['low', 'medium', 'high'] as const).map((level) => {
            const isSelected = settings.effectsIntensity === level;
            return (
              <button
                key={level}
                onClick={() => update({ effectsIntensity: level })}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#121B3D] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black uppercase tracking-wider font-['Rajdhani'] text-white">
                    {level}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-xs text-slate-400 font-['Rajdhani']">
                  {level === 'low'
                    ? 'Subtle transitions (safe for lower-spec display processors)'
                    : level === 'medium'
                    ? 'Smooth cyber flash and energy highlights'
                    : 'Full neon glows, flash effects, and sharp fighting game panels'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plain Dark Fallback Toggle */}
      <div className="p-6 rounded-xl bg-[#0D1129]/95 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white font-['Rajdhani']">
              Plain Dark Mode (Zero Motion)
            </h4>
            <p className="text-xs text-slate-400 font-['Rajdhani']">
              Disables all flash animations while maintaining crisp high-contrast readability
            </p>
          </div>

          <button
            onClick={() => update({ plainDarkFallback: !settings.plainDarkFallback })}
            className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider font-['Rajdhani'] transition-colors cursor-pointer ${
              settings.plainDarkFallback
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {settings.plainDarkFallback ? 'Plain Mode ON' : 'Dynamic Mode'}
          </button>
        </div>
      </div>
    </div>
  );
};
