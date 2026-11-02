import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { CarnivalEmblem } from '../../common/CarnivalEmblem';
import { ASSETS } from '../../../config/assets';
import { TEAM_STYLES } from '../../../theme/theme';
import { Calendar, MapPin, Swords, Flame, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { settings, teams } = data;

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 overflow-hidden bg-[#070A1E]">
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

      {/* Top Meta Strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between border-b border-cyan-500/20 pb-3 shrink-0"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-200 text-xs font-black tracking-widest uppercase font-['Rajdhani'] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>ANNUAL SPORTS CARNIVAL</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 text-xs font-bold tracking-wider uppercase font-['Rajdhani']">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.eventDate}</span>
            <span className="text-cyan-600">·</span>
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.venueName}</span>
          </div>
        </div>

        <div className="text-xs font-black tracking-widest uppercase text-amber-400 font-['Rajdhani'] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>4 TEAMS · 8 SPORTS · 1 SUPREME CHAMPION</span>
        </div>
      </motion.div>

      {/* Center Hero Block: Tournament Emblem & Title */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-6xl mx-auto py-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative mb-2">
            <CarnivalEmblem size="2xl" glow={true} />
            <div className="absolute -inset-6 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none -z-10" />
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-[#0D1129]/90 border border-cyan-400/40 text-cyan-300 font-black uppercase tracking-[0.3em] text-xs font-['Rajdhani'] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>CLASH OF TITANS · PLAY WITH HONOR</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>

          <h1 className="text-7xl lg:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 font-['Rajdhani'] uppercase drop-shadow-[0_4px_30px_rgba(0,240,255,0.6)] leading-[1.05]">
            {settings.eventTitle}
          </h1>

          <div className="flex items-center gap-4 text-2xl font-black text-amber-400 tracking-[0.3em] font-['Rajdhani']">
            <span>CHAMPIONSHIP ARENA</span>
            <span className="text-cyan-400">───</span>
            <span className="text-white">LET THE GAMES BEGIN!</span>
          </div>

          <p className="text-lg text-slate-300 max-w-3xl mx-auto tracking-wider font-semibold font-['Rajdhani']">
            Four elite factions clash across 8 sporting disciplines. Speed, agility, teamwork, and unstoppable determination.
          </p>
        </motion.div>
      </div>

      {/* Bottom 4 Team Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 grid grid-cols-4 gap-5 w-full max-w-6xl mx-auto shrink-0 pb-1"
      >
        {teams.map((team) => {
          const style = TEAM_STYLES[team.id] || {
            characterName: team.name,
            themeStyle: 'Fighter',
            primaryColor: team.color,
            secondaryColor: team.secondaryColor,
            glowColor: 'rgba(0, 240, 255, 0.4)',
            tagline: team.name,
          };

          return (
            <div
              key={team.id}
              className="relative flex items-center gap-4 p-4 rounded-xl bg-[#0D1129]/95 border-2 transition-all duration-300 shadow-2xl overflow-hidden group hover:scale-[1.02]"
              style={{
                borderColor: `${style.primaryColor}80`,
                boxShadow: `0 8px 25px -5px ${style.glowColor}`,
              }}
            >
              {/* Colored ambient glow */}
              <div
                className="absolute top-0 right-0 w-28 h-28 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ backgroundColor: style.primaryColor }}
              />

              <TeamCrest team={team} size="lg" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[10px] font-black font-['Rajdhani'] px-1.5 py-0.2 rounded text-slate-950 uppercase"
                    style={{ backgroundColor: style.primaryColor }}
                  >
                    TEAM {team.code}
                  </span>
                  <span className="text-xs text-cyan-300 font-bold tracking-wider uppercase font-['Rajdhani'] truncate">
                    {style.characterName}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white font-['Rajdhani'] truncate tracking-wider mt-0.5">
                  {team.name}
                </h3>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider font-['Rajdhani'] truncate mt-0.5">
                  Captain: <span className="text-white font-black">{team.captain}</span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
