import React, { useEffect, useRef, useState } from 'react';
import { useCarnivalStore, getEligibleSlides } from '../../store/carnivalStore';
import { TVScaleWrapper } from './TVScaleWrapper';
import { TVHeader } from './TVHeader';
import { TVFooter } from './TVFooter';
import { ProgressBar } from './ProgressBar';
import { SlideRenderer } from './SlideRenderer';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getStoredThemeSettings,
  tournamentSound,
  THEME_COLORS,
} from '../../theme/theme';

interface TVDashboardProps {
  isEmbedded?: boolean; // When rendered in admin live preview
}

export const TVDashboard: React.FC<TVDashboardProps> = ({ isEmbedded = false }) => {
  const {
    data,
    activeSlideIndex,
    isPaused,
    nextSlide,
    prevSlide,
    goToSlide,
    togglePause,
  } = useCarnivalStore();

  const eligibleSlides = getEligibleSlides(data);
  const slideDuration = data.settings.slideDurationMs || 5000;

  // Track progress fraction for active slide (0 to 1)
  const [elapsedMs, setElapsedMs] = useState(0);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState(getStoredThemeSettings());
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setThemeSettings(e.detail || getStoredThemeSettings());
    };
    window.addEventListener('theme-settings-changed', handleThemeChange);
    return () => window.removeEventListener('theme-settings-changed', handleThemeChange);
  }, []);

  // Trigger brief visual flash on slide change
  useEffect(() => {
    if (themeSettings.effectsIntensity !== 'low' && !themeSettings.plainDarkFallback) {
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeSlideIndex, themeSettings.effectsIntensity, themeSettings.plainDarkFallback]);

  // Play tournament sound cues if audio is enabled
  useEffect(() => {
    if (themeSettings.soundEnabled) {
      const currentSlide = eligibleSlides[activeSlideIndex % Math.max(1, eligibleSlides.length)];
      if (currentSlide?.id === 'results') {
        tournamentSound.play('victory');
      } else if (currentSlide?.id === 'schedule') {
        tournamentSound.play('fight');
      } else {
        tournamentSound.play('round');
      }
    }
  }, [activeSlideIndex, themeSettings.soundEnabled]);

  // Auto-advance slideshow timer (5 seconds default or configured duration)
  useEffect(() => {
    if (isPaused || eligibleSlides.length <= 1) return;

    const intervalMs = 50; // Smooth progress bar updates
    const interval = setInterval(() => {
      setElapsedMs((prev) => {
        const nextVal = prev + intervalMs;
        if (nextVal >= slideDuration) {
          nextSlide();
          return 0;
        }
        return nextVal;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPaused, slideDuration, eligibleSlides.length, nextSlide]);

  // Reset elapsed when slide index changes
  useEffect(() => {
    setElapsedMs(0);
  }, [activeSlideIndex]);

  // Show transient keyboard feedback
  const showFeedback = (text: string) => {
    setFeedbackNotice(text);
    if (feedbackTimerRef.current) window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackNotice(null);
    }, 1500);
  };

  // Keyboard navigation on TV page: Space = pause/resume, Left/Right = prev/next
  useEffect(() => {
    if (isEmbedded) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        showFeedback(!isPaused ? 'SLIDESHOW PAUSED' : 'AUTO-ROTATING');
        if (themeSettings.soundEnabled) tournamentSound.play('round');
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
        showFeedback('NEXT SLIDE');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
        showFeedback('PREVIOUS SLIDE');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEmbedded, isPaused, togglePause, nextSlide, prevSlide, themeSettings.soundEnabled]);

  const currentSlideConfig =
    eligibleSlides.length > 0
      ? eligibleSlides[activeSlideIndex % eligibleSlides.length]
      : null;

  const progressRatio = Math.min(1, elapsedMs / slideDuration);

  const content = (
    <div
      className="w-full h-full flex flex-col justify-between relative overflow-hidden select-none bg-[#070A1E] text-slate-100"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Rajdhani', sans-serif" }}
    >
      {/* Visual Flash effect */}
      {isFlashing && <div className="fg-flash-effect" />}

      {/* Persistent Top Header with Integrated Non-Overlapping Slide Indicator */}
      <TVHeader
        slides={eligibleSlides}
        activeSlideIndex={activeSlideIndex % Math.max(1, eligibleSlides.length)}
        onSelectSlide={goToSlide}
      />

      {/* Main Slide Area with Smooth Transitions - Clean & Zero Overlap */}
      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentSlideConfig && (
            <motion.div
              key={currentSlideConfig.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <SlideRenderer slideId={currentSlideConfig.id} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transient On-Screen Feedback Indicator */}
        {feedbackNotice && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-[#0D1129]/95 border-2 border-cyan-400 text-cyan-200 font-black tracking-widest text-xs shadow-[0_0_25px_rgba(0,240,255,0.6)] flex items-center gap-2.5 z-40 font-['Rajdhani']">
            {feedbackNotice.includes('PAUSE') ? (
              <Pause className="w-4 h-4 text-amber-400" />
            ) : feedbackNotice.includes('PREV') ? (
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
            ) : feedbackNotice.includes('NEXT') ? (
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <Play className="w-4 h-4 text-emerald-400" />
            )}
            <span>{feedbackNotice}</span>
          </div>
        )}
      </main>

      {/* Progress Bar Showing Time Left for Active Slide */}
      <ProgressBar progressRatio={progressRatio} isPaused={isPaused} />

      {/* Persistent Footer: Scrolling Ticker */}
      <TVFooter />
    </div>
  );

  // If rendering inside Admin Live Preview, render scaled in container without full-screen wrapper
  if (isEmbedded) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#070A1E]">
        {content}
      </div>
    );
  }

  // Otherwise, wrap in TVScaleWrapper for the 75" TV 1920x1080 display
  return <TVScaleWrapper>{content}</TVScaleWrapper>;
};
