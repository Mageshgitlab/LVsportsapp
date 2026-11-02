import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { Swords, Trophy, Flame, Clock, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { Team } from '../../../types';

export const FixturesSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { fixtures, teams, members } = data;

  if (!fixtures || !fixtures.rounds || fixtures.rounds.length === 0) {
    return null;
  }

  const getTeam = (teamId: string): Team | undefined => {
    return teams.find((t) => t.id === teamId);
  };

  const getPairPlayerNames = (teamId: string, pairNumber: number): string => {
    const pairKey = `${teamId}_pair_${pairNumber}`;
    const pairIds = fixtures.pairPlayers?.[pairKey];
    if (!pairIds || (!pairIds[0] && !pairIds[1])) {
      return '';
    }
    const p1 = members.find((m) => m.id === pairIds[0])?.name || '';
    const p2 = members.find((m) => m.id === pairIds[1])?.name || '';
    if (p1 && p2) {
      // Shorten first name if long
      const short1 = p1.split(' ')[0];
      const short2 = p2.split(' ')[0];
      return `${short1} & ${short2}`;
    }
    return p1 || p2 || '';
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Slide Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 relative z-10 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>LEAGUE FIXTURES · 4 PAIRS PER TEAM · 3 ROUNDS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            {fixtures.title || 'CARROM FIXTURES'}
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider font-['Rajdhani']">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0D1129] border border-cyan-500/30 text-cyan-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>ALL TEAMS PLAY ALL TEAMS</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/15 border border-amber-400/40 text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>4 PAIR MATCHES PER TIE</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout: Round 1, Round 2, Round 3 */}
      <div className="grid grid-cols-3 gap-5 flex-1 my-3 relative z-10 items-stretch min-h-0">
        {fixtures.rounds.map((round, rIdx) => (
          <motion.div
            key={round.roundNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: rIdx * 0.1 }}
            className="flex flex-col justify-between rounded-xl bg-[#090D24]/90 border border-cyan-500/25 p-3.5 shadow-2xl relative overflow-hidden backdrop-blur-md"
          >
            {/* Round Column Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20 shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-black font-['Rajdhani'] bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 uppercase tracking-widest shadow-sm">
                  {round.title.toUpperCase()}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase font-['Rajdhani'] tracking-wider">
                  2 TIES · 8 MATCHES
                </span>
              </div>
            </div>

            {/* 2 Ties in this Round */}
            <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
              {round.ties.map((tie) => {
                const teamA = getTeam(tie.teamAId);
                const teamB = getTeam(tie.teamBId);
                if (!teamA || !teamB) return null;

                const styleA = TEAM_STYLES[teamA.id];
                const styleB = TEAM_STYLES[teamB.id];

                // Calculate current tie scores (matches won by each team)
                const teamAWins = tie.matches.filter((m) => m.winnerTeamId === teamA.id).length;
                const teamBWins = tie.matches.filter((m) => m.winnerTeamId === teamB.id).length;
                const hasLiveMatch = tie.matches.some((m) => m.status === 'live');
                const isTieCompleted = tie.matches.every((m) => m.status === 'completed');

                return (
                  <div
                    key={tie.id}
                    className="flex-1 flex flex-col justify-between rounded-lg bg-[#0D122D]/95 border border-white/10 p-2.5 shadow-lg relative overflow-hidden"
                  >
                    {/* Tie Top Header with Score Summary */}
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 shrink-0">
                      {/* Team A */}
                      <div className="flex items-center gap-1.5 min-w-0">
                        <TeamCrest team={teamA} size="sm" />
                        <span className="text-xs font-black text-white font-['Rajdhani'] uppercase tracking-wider truncate max-w-[105px]">
                          {teamA.name}
                        </span>
                      </div>

                      {/* Mini Summary Score: e.g. Pardus 0 - 0 Falcon Fury */}
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/60 border border-cyan-500/30">
                        <span
                          className="text-sm font-black font-['Rajdhani'] tabular-nums"
                          style={{ color: styleA?.primaryColor || teamA.color }}
                        >
                          {teamAWins}
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold">─</span>
                        <span
                          className="text-sm font-black font-['Rajdhani'] tabular-nums"
                          style={{ color: styleB?.primaryColor || teamB.color }}
                        >
                          {teamBWins}
                        </span>
                        {hasLiveMatch && (
                          <Flame className="w-3 h-3 text-red-400 animate-pulse ml-0.5" />
                        )}
                        {isTieCompleted && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />
                        )}
                      </div>

                      {/* Team B */}
                      <div className="flex items-center gap-1.5 min-w-0 justify-end">
                        <span className="text-xs font-black text-white font-['Rajdhani'] uppercase tracking-wider truncate max-w-[105px] text-right">
                          {teamB.name}
                        </span>
                        <TeamCrest team={teamB} size="sm" />
                      </div>
                    </div>

                    {/* 4 Pair Match Rows */}
                    <div className="flex-1 flex flex-col justify-between gap-1 min-h-0">
                      {tie.matches.map((match) => {
                        const aWon = match.winnerTeamId === teamA.id;
                        const bWon = match.winnerTeamId === teamB.id;
                        const isLive = match.status === 'live';
                        const isDone = match.status === 'completed';

                        const playerNamesA = getPairPlayerNames(teamA.id, match.pairANumber);
                        const playerNamesB = getPairPlayerNames(teamB.id, match.pairBNumber);

                        return (
                          <div
                            key={match.id}
                            className={`flex items-center justify-between px-2 py-1 rounded border transition-all text-xs font-['Rajdhani'] ${
                              aWon
                                ? 'bg-gradient-to-r from-amber-500/20 via-black/40 to-transparent border-amber-500/40'
                                : bWon
                                ? 'bg-gradient-to-l from-amber-500/20 via-black/40 to-transparent border-amber-500/40'
                                : isLive
                                ? 'bg-red-950/40 border-red-500/40'
                                : 'bg-black/40 border-white/5 hover:border-cyan-500/30'
                            }`}
                          >
                            {/* Team A Pair */}
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span
                                className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-black text-slate-950 shrink-0 font-['Rajdhani'] ${
                                  aWon ? 'ring-1 ring-amber-400' : ''
                                }`}
                                style={{ backgroundColor: styleA?.primaryColor || teamA.color }}
                              >
                                {match.pairANumber}
                              </span>
                              <div className="min-w-0 flex-1 truncate">
                                <span
                                  className={`text-[11px] font-black uppercase tracking-wider truncate ${
                                    aWon ? 'text-amber-300 font-extrabold' : 'text-slate-200'
                                  }`}
                                >
                                  Pair {match.pairANumber}
                                </span>
                                {playerNamesA && (
                                  <span className="text-[9px] text-slate-400 block truncate font-medium">
                                    {playerNamesA}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Center VS & Status */}
                            <div className="px-2 shrink-0 flex items-center justify-center">
                              {aWon ? (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 uppercase">
                                  WON ◄
                                </span>
                              ) : bWon ? (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 border border-amber-500/50 uppercase">
                                  ► WON
                                </span>
                              ) : isLive ? (
                                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 border border-red-500/50 uppercase animate-pulse">
                                  LIVE
                                </span>
                              ) : isDone ? (
                                <span className="text-[9px] font-bold text-slate-400 uppercase">
                                  TIED
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-cyan-400/80 uppercase">
                                  VS
                                </span>
                              )}
                            </div>

                            {/* Team B Pair */}
                            <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end text-right">
                              <div className="min-w-0 flex-1 truncate">
                                <span
                                  className={`text-[11px] font-black uppercase tracking-wider truncate ${
                                    bWon ? 'text-amber-300 font-extrabold' : 'text-slate-200'
                                  }`}
                                >
                                  Pair {match.pairBNumber}
                                </span>
                                {playerNamesB && (
                                  <span className="text-[9px] text-slate-400 block truncate font-medium">
                                    {playerNamesB}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-black text-slate-950 shrink-0 font-['Rajdhani'] ${
                                  bWon ? 'ring-1 ring-amber-400' : ''
                                }`}
                                style={{ backgroundColor: styleB?.primaryColor || teamB.color }}
                              >
                                {match.pairBNumber}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] pt-1 shrink-0">
        CARROM DOUBLES TOURNAMENT · 4 PAIRS PER TEAM · 3 LEAGUE ROUNDS
      </div>
    </div>
  );
};
