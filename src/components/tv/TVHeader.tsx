import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Pause, Play, Settings, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useCarnivalStore } from '../../store/carnivalStore';
import { CarnivalEmblem } from '../common/CarnivalEmblem';
import { SlideConfig } from '../../types';
import {
  getStoredThemeSettings,
  saveThemeSettings,
  tournamentSound,
  THEME_COLORS,
} from '../../theme/theme';

interface TVHeaderProps {
  slides?: SlideConfig[];
  activeSlideIndex?: number;
  onSelectSlide?: (index: number) => void;
}

export const TVHeader: React.FC<TVHeaderProps> = ({
  slides = [],
  activeSlideIndex = 0,
  onSelectSlide,
}) => {
  const { data, isPaused, togglePause } = useCarnivalStore();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeSettings, setThemeSettings] = useState(getStoredThemeSettings());

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setThemeSettings(e.detail || getStoredThemeSettings());
    };
    window.addEventListener('theme-settings-changed', handleThemeChange);
    return () => window.removeEventListener('theme-settings-changed', handleThemeChange);
  }, []);

  const toggleSound = () => {
    const updated = { ...themeSettings, soundEnabled: !themeSettings.soundEnabled };
    saveThemeSettings(updated);
    setThemeSettings(updated);
    if (updated.soundEnabled) {
      tournamentSound.play('gong');
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="h-[88px] w-full px-10 bg-gradient-to-b from-[#080B22] via-[#0B0F2A]/95 to-[#070A1E]/80 flex items-center justify-between border-b border-cyan-500/20 z-30 shrink-0 relative shadow-2xl backdrop-blur-md">
      {/* Top Neon Accent Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] via-[#A855F7] to-transparent opacity-80" />

      {/* Brand Lockup: Clean Carnival Emblem + Event Title */}
      <div className="flex items-center gap-4">
        <CarnivalEmblem size="md" glow={true} />

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 font-['Rajdhani'] uppercase drop-shadow-[0_2px_12px_rgba(0,240,255,0.4)]">
              {data.settings.eventTitle}
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-black tracking-[0.2em] uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 rounded-sm font-['Rajdhani']">
              CHAMPIONSHIP
            </span>
          </div>
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase font-['Rajdhani'] mt-0.5">
            {data.settings.eventSubtitle} · {data.settings.venueName}
          </p>
        </div>
      </div>

      {/* Center Zone: Slide Navigator & Live Round Tracker (NEVER overlaps slide content!) */}
      <div className="flex items-center gap-4">
        {isPaused ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-black tracking-widest font-['Rajdhani'] animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Pause className="w-3.5 h-3.5 text-amber-400" />
            <span>PAUSED (SPACE TO RESUME)</span>
          </div>
        ) : (
          slides.length > 1 && (
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0D1129]/90 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
              <span className="text-[11px] font-['Rajdhani'] font-black tracking-wider text-cyan-400 whitespace-nowrap">
                ROUND {activeSlideIndex + 1}/{slides.length}
              </span>
              <div className="flex items-center gap-1.5">
                {slides.map((s, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectSlide?.(idx)}
                      className={`transition-all duration-300 cursor-pointer focus:outline-none transform rotate-45 ${
                        isActive
                          ? 'w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-amber-300 shadow-[0_0_10px_rgba(0,240,255,0.9)] border border-white'
                          : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500 border border-slate-600'
                      }`}
                      title={`Slide ${idx + 1}: ${s.title}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Right Zone: Controls & High-Visibility Digital Clock */}
      <div className="flex items-center gap-5">
        {/* Controls Toolbar */}
        <div className="flex items-center gap-1.5 bg-[#0D1129]/80 p-1.5 rounded-lg border border-cyan-500/25 shadow-inner">
          <button
            onClick={toggleSound}
            className={`p-2 rounded transition-colors cursor-pointer ${
              themeSettings.soundEnabled
                ? 'text-cyan-300 bg-cyan-500/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title={themeSettings.soundEnabled ? 'Mute Tournament Audio' : 'Enable Tournament SFX'}
            aria-label="Toggle sound"
          >
            {themeSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            onClick={togglePause}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title={isPaused ? 'Resume auto-slideshow (Space)' : 'Pause slideshow (Space)'}
            aria-label="Toggle pause"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter 75" TV Fullscreen'}
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href="#/admin"
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Open Admin Portal"
            aria-label="Admin portal"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>

        {/* Live Clock with Ticking Seconds */}
        <div className="text-right pl-4 border-l border-cyan-500/30">
          <div className="text-2xl font-black font-['Rajdhani'] tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300 tracking-wider drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)]">
            {timeStr || '00:00:00'}
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-['Rajdhani']">
            {dateStr}
          </div>
        </div>
      </div>
    </header>
  );
};
