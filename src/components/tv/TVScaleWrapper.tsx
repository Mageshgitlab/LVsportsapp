import React, { useEffect, useState, useRef } from 'react';

interface TVScaleWrapperProps {
  children: React.ReactNode;
  isInteractive?: boolean;
}

/**
 * TVScaleWrapper maintains a pristine 1920x1080 canvas scaled to the screen resolution.
 * Auto-hides mouse cursor after 3 seconds of inactivity.
 */
export const TVScaleWrapper: React.FC<TVScaleWrapperProps> = ({ children, isInteractive = true }) => {
  const [scale, setScale] = useState(1);
  const [isCursorHidden, setIsCursorHidden] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateScale = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const targetWidth = 1920;
      const targetHeight = 1080;

      // Scale to fit completely inside viewport while preserving 16:9
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Mouse idle detection (auto-hide cursor after 3 seconds on TV)
  useEffect(() => {
    if (!isInteractive) return;

    const resetIdleTimer = () => {
      setIsCursorHidden(false);
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = window.setTimeout(() => {
        setIsCursorHidden(true);
      }, 3000);
    };

    resetIdleTimer();
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    return () => {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, [isInteractive]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden bg-[#05070F] flex items-center justify-center select-none ${
        isCursorHidden ? 'cursor-none' : 'cursor-default'
      }`}
    >
      <div
        className="w-[1920px] h-[1080px] shrink-0 relative bg-[#070A14] text-slate-100 flex flex-col overflow-hidden shadow-2xl"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};
