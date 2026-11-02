import React from 'react';
import { SlideConfig } from '../../types';

interface SlideDotsProps {
  slides: SlideConfig[];
  activeIndex: number;
  onSelectSlide: (index: number) => void;
}

export const SlideDots: React.FC<SlideDotsProps> = ({
  slides,
  activeIndex,
  onSelectSlide,
}) => {
  if (slides.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1129]/90 backdrop-blur-md border border-cyan-500/30 z-30 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
      <span className="text-[11px] font-['Rajdhani'] font-black tabular-nums text-cyan-400 mr-1">
        {activeIndex + 1}/{slides.length}
      </span>
      {slides.map((slide, idx) => {
        const isActive = idx === activeIndex;
        return (
          <button
            key={slide.id}
            onClick={() => onSelectSlide(idx)}
            className={`transition-all duration-300 cursor-pointer focus:outline-none transform rotate-45 ${
              isActive
                ? 'w-2.5 h-2.5 bg-gradient-to-tr from-cyan-400 to-amber-300 shadow-[0_0_10px_rgba(0,240,255,0.9)] border border-white'
                : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500 border border-slate-600'
            }`}
            title={`Slide ${idx + 1}: ${slide.title}`}
            aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
          />
        );
      })}
    </div>
  );
};
