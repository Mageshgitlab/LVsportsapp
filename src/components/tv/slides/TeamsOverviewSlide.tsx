import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { Flame, Sparkles, Users, Swords, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const TeamsOverviewSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { teams, members } = data;

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background Cyber Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Slide Header: Character Select Framing */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 relative z-10 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>ROSTER OVERVIEW · 4 CONTENDING FACTIONS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Teams & Contenders Overview
          </h2>
        </div>

        <div className="flex items-center gap-2 text-slate-300 text-sm font-bold uppercase tracking-wider font-['Rajdhani']">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Total Athletes: <strong className="text-cyan-300 text-lg font-mono">{members.length}</strong></span>
        </div>
      </div>

      {/* 4 Cards Grid - Character Select Framing filling full height */}
      <div className="grid grid-cols-4 gap-6 flex-1 my-3 relative z-10 items-stretch min-h-0">
        {teams.map((team, idx) => {
          const teamMembers = members.filter((m) => m.teamId === team.id);
          const memberCount = teamMembers.length;
          const style = TEAM_STYLES[team.id] || {
            characterName: team.name,
            themeStyle: 'Vanguard',
            primaryColor: team.color,
            secondaryColor: team.secondaryColor,
            glowColor: 'rgba(0, 240, 255, 0.4)',
            tagline: team.name,
          };

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative flex flex-col justify-between rounded-xl p-6 bg-[#0D1129]/95 border-2 transition-all duration-300 shadow-2xl overflow-hidden group hover:scale-[1.01] h-full"
              style={{
                borderColor: `${style.primaryColor}80`,
                boxShadow: `0 10px 30px -5px ${style.glowColor}, inset 0 0 15px rgba(0,0,0,0.6)`,
              }}
            >
              {/* Top ambient color bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: style.primaryColor }}
              />

              {/* Card Top: Crest & Emblem */}
              <div className="flex flex-col items-center text-center pt-2">
                <TeamCrest team={team} size="2xl" glow={true} />

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-sm text-xs font-black font-['Rajdhani'] text-slate-950 uppercase tracking-wider shadow-sm"
                    style={{ backgroundColor: style.primaryColor }}
                  >
                    TEAM {team.code}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-300 font-['Rajdhani']">
                    {style.characterName}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-white font-['Rajdhani'] mt-1.5 tracking-wider">
                  {team.name}
                </h3>
                <span className="text-xs text-cyan-300 font-bold uppercase tracking-[0.2em] font-['Rajdhani'] mt-0.5">
                  {style.tagline}
                </span>
              </div>

              {/* Card Middle: Captain & Vice Captain */}
              <div className="my-3 space-y-3 bg-[#070A1E]/80 rounded-xl p-4 border border-white/10 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Captain</span>
                  </div>
                  <span className="text-base font-black text-white font-['Rajdhani'] truncate max-w-[170px]">
                    {team.captain}
                  </span>
                </div>

                <div className="h-px bg-white/10 w-full" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Vice Captain</span>
                  </div>
                  <span className="text-base font-black text-slate-200 font-['Rajdhani'] truncate max-w-[170px]">
                    {team.viceCaptain}
                  </span>
                </div>
              </div>

              {/* Card Bottom: Member count */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Rajdhani']">
                  Squad Size
                </span>
                <div className="flex items-center gap-2 font-['Rajdhani']">
                  {memberCount > 0 ? (
                    <span className="text-2xl font-black text-white tabular-nums">
                      {memberCount} <span className="text-xs text-cyan-400 font-bold">ATHLETES</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-['Rajdhani']">
                      ANNOUNCING SOON
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] relative z-10 shrink-0 pt-1">
        CHAMPIONS TRAIN WITH INTENSITY · PREVAIL THROUGH DETERMINATION
      </div>
    </div>
  );
};
