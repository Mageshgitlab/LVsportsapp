import React from 'react';

interface ProgressBarProps {
  progressRatio: number; // 0 to 1
  isPaused?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressRatio, isPaused }) => {
  const percentage = Math.min(100, Math.max(0, progressRatio * 100));

  return (
    <div className="w-full h-1.5 bg-[#050716] border-t border-cyan-500/20 relative overflow-hidden z-30 shrink-0">
      <div
        className={`h-full transition-all duration-100 ease-linear ${
          isPaused
            ? 'bg-amber-400 opacity-70'
            : 'bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-amber-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]'
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
