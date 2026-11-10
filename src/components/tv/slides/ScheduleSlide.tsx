import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { GameIcon } from '../../common/GameIcon';
import { TEAM_STYLES } from '../../../theme/theme';
import { Calendar, MapPin, Clock, CheckCircle2, Flame, Swords, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const ScheduleSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { games, teams, fixtureRecords } = data;
  const scheduledGames = games.filter((game) => fixtureRecords.some((fixture) => fixture.gameId === game.id));

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
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>CARNIVAL FIXTURES & STATUS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Games Schedule & Live Match Arena
          </h2>
        </div>

        <div className="flex items-center gap-5 text-xs font-bold uppercase tracking-wider font-['Rajdhani']">
          <div className="flex items-center gap-1.5 text-red-400">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            <span>LIVE MATCHES</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>{scheduledGames.length} SPORTING EVENTS</span>
          </div>
        </div>
      </div>

      {/* Games Grid: 4 columns x 2 rows filling full height */}
      <div className="grid grid-cols-4 gap-4 flex-1 my-3 items-stretch min-h-0">
        {scheduledGames.map((game, idx) => {
          const gameFixtures = fixtureRecords.filter((fixture) => fixture.gameId === game.id);
          const liveFixture = gameFixtures.find((fixture) => fixture.status === 'live');
          const completedFixture = gameFixtures.find((fixture) => fixture.status === 'completed');
          const fixtureWinner = completedFixture?.result?.winnerSide === 'A' ? completedFixture.sideA.teamId : completedFixture?.result?.winnerSide === 'B' ? completedFixture.sideB.teamId : null;
          const winner = getTeam(game.firstPlaceTeamId);
          const isLive = !!liveFixture;
          const isCompleted = !!completedFixture;
          const isUpcoming = !isLive && !isCompleted;
          const winnerStyle = winner ? TEAM_STYLES[winner.id] : null;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className={`relative rounded-xl p-4 border-2 backdrop-blur-md shadow-xl transition-all flex flex-col justify-between overflow-hidden h-full ${
                isLive
                  ? 'bg-[#181128]/95 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)]'
                  : isCompleted
                  ? 'bg-[#0B1522]/90 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                  : 'bg-[#0D1129]/90 border-cyan-500/30 shadow-lg'
              }`}
            >
              {/* Card Top: Icon, Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${
                        isLive
                          ? 'bg-red-950/80 border-red-500 text-red-300'
                          : isCompleted
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-[#070A1E] border-cyan-500/40 text-cyan-300'
                      }`}
                    >
                      <GameIcon icon={game.icon} size={22} />
                    </div>

                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 font-['Rajdhani'] block truncate">
                        {game.category}
                      </span>
                      <h3 className="text-lg font-black text-white font-['Rajdhani'] tracking-wide truncate">
                        {game.name}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    {isLive && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)] font-['Rajdhani']">
                        <Flame className="w-3 h-3" />
                        <span>LIVE NOW</span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-black uppercase tracking-wider font-['Rajdhani']">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>COMPLETED</span>
                      </div>
                    )}
                    {isUpcoming && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider font-['Rajdhani']">
                        <Clock className="w-3 h-3" />
                        <span>UPCOMING</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match notes */}
                {game.notes && (
                  <p className="mt-2 text-[11px] text-slate-300 line-clamp-1 font-['Rajdhani'] font-semibold">
                    {game.notes}
                  </p>
                )}
              </div>

              {/* Tournament Center: Time & Venue */}
              <div className="my-2 py-1.5 px-2.5 rounded bg-black/40 border border-white/10 flex items-center justify-between text-xs font-['Rajdhani']">
                <div className="flex items-center gap-1 text-slate-300 font-bold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{game.scheduledTime}</span>
                </div>

                <div className="flex items-center gap-1 text-slate-300 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[100px]">{game.venue}</span>
                </div>
              </div>

              {/* Card Bottom: Victor or Points Allocation */}
              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-xs font-['Rajdhani']">
                {isCompleted && (winner || fixtureWinner) ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-black text-amber-400 uppercase font-['Rajdhani']">
                      WINNER:
                    </span>
                    <span
                      className="px-2 py-0.2 rounded font-black text-slate-950 text-[11px] uppercase truncate"
                      style={{ backgroundColor: winnerStyle?.primaryColor || winner?.color || '#F59E0B' }}
                    >
                      {getTeam(fixtureWinner || winner?.id)?.name} (10 pts)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full text-slate-400 text-[11px] font-['Rajdhani'] font-bold">
                    <span className="text-amber-400">1ST: 10 PTS</span>
                    <span>·</span>
                    <span className="text-white font-extrabold">FIGHT FOR GLORY</span>
                    <span>·</span>
                    <span className="text-cyan-300">2ND: 5 PTS</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] pb-1">
        HONOR THE SPIRIT OF THE GAME · COMPETE WITH INTEGRITY & GRIT
      </div>
    </div>
  );
};
