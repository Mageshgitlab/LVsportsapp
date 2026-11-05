import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { CarnivalEmblem } from '../../common/CarnivalEmblem';
import { ASSETS } from '../../../config/assets';

export const HeroSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { settings, teams } = data;

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-12 py-8 overflow-hidden bg-[#070A1E]">
      {/* Dynamic Cyber Stadium / Arena Background with Glowing Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={ASSETS.heroStadium}
          alt="Stadium Arena"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A1E] via-[#0B1032]/85 to-[#070A1E]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(168,85,247,0.12)_40%,transparent_75%)]" />
      </div>

      {/* Minimal event identity */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
          <div className="relative mb-4 scale-90">
            <CarnivalEmblem size="2xl" glow={true} />
            <div className="absolute -inset-6 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none -z-10" />
          </div>

          <h1
            className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 font-['Rajdhani'] uppercase drop-shadow-[0_4px_30px_rgba(0,240,255,0.6)] leading-[1.05]"
            style={{ fontSize: '84px' }}
          >
            {settings.eventTitle}
          </h1>
          <p className="mt-3 text-slate-200 font-semibold tracking-wider font-['Rajdhani']" style={{ fontSize: '28px' }}>
            {settings.eventSubtitle}
          </p>
          <div className="mt-3 h-1 w-40 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      </div>

      {/* Compact team lineup */}
      <div className="relative z-10 flex items-center justify-center gap-5 w-full max-w-6xl mx-auto shrink-0">
        {teams.map((team) => {
          return (
            <div
              key={team.id}
              className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#0D1129]/85 border border-white/15 min-w-0"
            >
              <TeamCrest team={team} size="sm" />
              <span className="font-black text-white font-['Rajdhani'] uppercase tracking-wider whitespace-nowrap" style={{ fontSize: '26px' }}>
                {team.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
