import React from 'react';
import { TVDashboard } from '../tv/TVDashboard';
import { X, ExternalLink, Tv } from 'lucide-react';

interface TVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TVPreviewModal: React.FC<TVPreviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-[#070A1E] border-2 border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-3.5 bg-[#0B0F2A] border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tv className="w-5 h-5 text-cyan-400" />
            <span className="font-black text-sm text-white uppercase tracking-wider font-['Rajdhani']">
              Live 75" TV Dashboard Preview (16:9 1080p Simulation)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              REAL-TIME SYNC
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#/tv"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 text-xs font-black font-['Rajdhani'] rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Dedicated /tv Tab</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 16:9 Aspect Ratio Frame */}
        <div className="w-full aspect-video bg-black relative overflow-hidden flex items-center justify-center">
          <div className="w-full h-full transform origin-top-left">
            <TVDashboard isEmbedded={true} />
          </div>
        </div>

        {/* Footnote */}
        <div className="px-6 py-2.5 bg-[#0B0F2A] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-['Rajdhani'] font-bold">
          <span>Keyboard controls active: Space (pause/resume), Left/Right Arrows (slide navigation).</span>
          <span className="text-cyan-400">Target TV Display: 1920x1080 Landscape · Zero Scrolling</span>
        </div>
      </div>
    </div>
  );
};
