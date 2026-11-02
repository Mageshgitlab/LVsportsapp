import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { GameIcon } from '../../common/GameIcon';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { Trophy, Swords, CheckCircle, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const ResultsSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { games, teams } = data;

  const getTeam = (teamId?: string | null) => {
    if (!teamId) return null;
    return teams.find((t) => t.id === teamId) || null;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>GAME-WISE RESULTS & POINTS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Championship Results & Points Allocation
          </h2>
        </div>

        <div className="flex items-center gap-5 text-xs font-black uppercase tracking-wider font-['Rajdhani']">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>WINNER: +10 Points</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>RUNNER-UP: +5 Points</span>
          </div>
        </div>
      </div>

      {/* Grid of Results: 4x2 Grid filling full height */}
      <div className="grid grid-cols-4 gap-4 flex-1 my-3 items-stretch min-h-0">
        {games.map((game, idx) => {
          const firstTeam = getTeam(game.firstPlaceTeamId);
          const secondTeam = getTeam(game.secondPlaceTeamId);
          const isCompleted = game.status === 'completed' && (firstTeam || secondTeam);

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className={`rounded-xl p-3.5 border-2 backdrop-blur-md shadow-xl flex flex-col justify-between transition-all h-full ${
                isCompleted
                  ? 'bg-[#0E1528]/95 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-[#0D1129]/80 border-cyan-500/20'
              }`}
            >
              {/* Game Title & Status */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#070A1E] border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <GameIcon icon={game.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-white font-['Rajdhani'] tracking-wide truncate">
                      {game.name}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-['Rajdhani'] block truncate">
                      {game.venue}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isCompleted ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-['Rajdhani']">
                      DECIDED
                    </span>
                  ) : game.status === 'live' ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse font-['Rajdhani']">
                      LIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700 font-['Rajdhani']">
                      UPCOMING
                    </span>
                  )}
                </div>
              </div>

              {/* Podium Breakdown */}
              <div className="my-2.5 space-y-2">
                {/* 1st Place: Winner */}
                <div
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    firstTeam
                      ? 'bg-[#070A1E] border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'bg-black/30 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] uppercase font-['Rajdhani'] shrink-0 tracking-wider">
                      WINNER
                    </div>

                    {firstTeam ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <TeamCrest team={firstTeam} size="sm" />
                        <span className="text-xs font-black text-white font-['Rajdhani'] truncate">
                          {firstTeam.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 font-['Rajdhani'] italic">
                        Pending
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-black font-['Rajdhani'] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    +10 PTS
                  </span>
                </div>

                {/* 2nd Place: Runner-Up */}
                <div
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    secondTeam
                      ? 'bg-[#070A1E] border-cyan-400/50'
                      : 'bg-black/20 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="px-1.5 py-0.5 rounded bg-cyan-700 text-cyan-100 font-black text-[9px] uppercase font-['Rajdhani'] shrink-0 tracking-wider">
                      RUNNER-UP
                    </div>

                    {secondTeam ? (
                      <div className="flex items-center gap-1.5 min-w-0">
                        <TeamCrest team={secondTeam} size="sm" />
                        <span className="text-xs font-black text-white font-['Rajdhani'] truncate">
                          {secondTeam.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 font-['Rajdhani'] italic">
                        Pending
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-black font-['Rajdhani'] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                    +5 PTS
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-1.5 border-t border-white/5 text-[10px] font-['Rajdhani'] font-bold text-slate-400 flex items-center justify-between">
                <span>{game.scheduledTime}</span>
                {firstTeam && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] pb-1">
        STANDINGS CALCULATED AUTOMATICALLY · 10 POINTS FOR 1ST · 5 POINTS FOR 2ND
      </div>
    </div>
  );
};
