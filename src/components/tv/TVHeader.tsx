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

  const liveGames = data.games.filter((g) => g.status === 'live');
  const nextGame = data.games.find((g) => g.status === 'upcoming');

  return (
    <header className="h-[80px] w-full px-5 bg-gradient-to-b from-[#211914] via-[#17120f]/95 to-[#0f0d0b]/85 flex items-center justify-between border-b border-amber-500/25 z-30 shrink-0 relative shadow-2xl backdrop-blur-md">
      {/* Top Neon Accent Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b00] via-[#d4a017] to-transparent opacity-80" />

      {/* Brand Lockup: Clean Carnival Emblem + Event Title */}
      <div className="flex items-center gap-3">
        <CarnivalEmblem size="lg" glow={true} />

        <div>
          <div className="flex items-center gap-2">
            <h1
              className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#fff6dc] via-[#ffe19a] to-[#d4a017] font-['Rajdhani'] uppercase drop-shadow-[0_2px_18px_rgba(212,160,23,0.65)]"
              style={{
                fontSize: '30px',
                lineHeight: 1.1,
                WebkitTextStroke: '0.72px rgba(36, 22, 10, 0.78)',
              }}
            >
              {data.settings.eventTitle}
            </h1>
            <span
              className="px-2.5 py-0.5 font-black tracking-[0.2em] uppercase bg-amber-500/15 text-amber-200 border border-amber-500/45 rounded-sm font-['Rajdhani']"
              style={{ fontSize: '18px' }}
            >
              ARENA
            </span>
          </div>
          <p
            className="font-bold text-[#efe2c8] tracking-wider uppercase font-['Rajdhani'] drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]"
            style={{ fontSize: '14px' }}
          >
            {data.settings.eventSubtitle} · {data.settings.venueName}
          </p>
        </div>
      </div>

      {/* Center Zone: Current Game Status + Slide Navigator */}
      <div className="flex items-center gap-3">
        {/* Current Game Status Indicator */}
        {liveGames.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border-2 border-red-500 text-red-200 font-black tracking-wider uppercase font-['Rajdhani'] shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span style={{ fontSize: '16px' }}>
              LIVE: {liveGames[0].name} ({liveGames[0].venue})
            </span>
          </div>
        ) : nextGame ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 font-bold tracking-wider uppercase font-['Rajdhani'] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span style={{ fontSize: '16px' }}>
              NEXT: {nextGame.name} · {nextGame.scheduledTime}
            </span>
          </div>
        ) : null}

        {isPaused ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 font-black tracking-widest font-['Rajdhani'] animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Pause className="w-4 h-4 text-amber-400" />
            <span style={{ fontSize: '16px' }}>PAUSED</span>
          </div>
        ) : (
          slides.length > 1 && (
            <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-[#1a1512]/90 border border-amber-500/35 shadow-[0_0_15px_rgba(212,160,23,0.18)]">
              <span
                className="font-['Rajdhani'] font-black tracking-wider text-amber-300 whitespace-nowrap"
                style={{ fontSize: '16px' }}
              >
                SLIDE {activeSlideIndex + 1}/{slides.length}
              </span>
              <div className="flex items-center gap-2">
                {slides.map((s, idx) => {
                  const isActive = idx === activeSlideIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => onSelectSlide?.(idx)}
                      className={`arena-slide-indicator transition-all duration-300 cursor-pointer focus:outline-none ${
                        isActive
                          ? 'w-3.5 h-3.5 bg-gradient-to-b from-[#ffdfa1] via-[#d4a017] to-[#8f6714] shadow-[0_0_12px_rgba(212,160,23,0.7)] border border-[#f6d590]'
                          : 'w-3 h-3 bg-[#2a2421] hover:bg-[#3a2e28] border border-[#6f5533]'
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
      <div className="flex items-center gap-3.5">
        {/* Controls Toolbar */}
        <div className="flex items-center gap-1 bg-[#0D1129]/80 p-1 rounded-lg border border-cyan-500/25 shadow-inner">
          <button
            onClick={toggleSound}
            className={`p-2 rounded transition-colors cursor-pointer ${
              themeSettings.soundEnabled
                ? 'text-amber-200 bg-amber-500/20'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
            }`}
            title={themeSettings.soundEnabled ? 'Mute Tournament Audio' : 'Enable Tournament SFX'}
            aria-label="Toggle sound"
          >
            {themeSettings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-300" />
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
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Open Admin Portal"
            aria-label="Admin portal"
          >
            <Settings className="w-4 h-4" />
          </a>
        </div>

        {/* Live Clock with Ticking Seconds */}
        <div className="text-right pl-3 border-l border-amber-500/30">
          <div className="text-xl font-black font-['Rajdhani'] tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-300 tracking-wider drop-shadow-[0_2px_8px_rgba(212,160,23,0.35)]">
            {timeStr || '00:00:00'}
          </div>
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-['Rajdhani']">
            {dateStr}
          </div>
        </div>
      </div>
    </header>
  );
};
