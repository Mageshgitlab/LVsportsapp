import React from 'react';
import { useCarnivalStore, calculateLeaderboard } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { Trophy, Crown, Swords, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const LeaderboardSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const leaderboard = calculateLeaderboard(data.teams, data.games);

  // Maximum points for calculating healthbar width
  const maxPoints = Math.max(...leaderboard.map((l) => l.points), 40);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.8)] border border-white">
            <Crown className="w-6 h-6 stroke-[2.5]" />
          </div>
        );
      case 2:
        return (
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black text-lg flex items-center justify-center shadow-[0_0_15px_rgba(203,213,225,0.4)] border border-white/60">
            <span className="font-['Rajdhani'] font-black">2ND</span>
          </div>
        );
      case 3:
        return (
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-lg flex items-center justify-center shadow-[0_0_15px_rgba(180,83,9,0.3)] border border-amber-400/50">
            <span className="font-['Rajdhani'] font-black">3RD</span>
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-lg bg-slate-800 text-slate-400 font-black text-lg flex items-center justify-center border border-white/10">
            <span className="font-['Rajdhani'] font-bold">4TH</span>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 relative z-10 shrink-0">
        <div>
          <div className="text-xs font-black tracking-[0.3em] text-cyan-400 uppercase font-['Rajdhani'] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>OFFICIAL LEADERBOARD</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 font-['Rajdhani'] uppercase tracking-wider mt-1">
            Points Table & Championship Standings
          </h2>
        </div>

        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0D1129] border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider font-['Rajdhani'] shadow-lg">
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Winner: +10 Pts · Runner-Up: +5 Pts</span>
        </div>
      </div>

      {/* Leaderboard Stack: Health-Bar Style Rows filling full height */}
      <div className="flex-1 my-3 flex flex-col justify-between gap-3 relative z-10 max-w-6xl mx-auto w-full min-h-0">
        {leaderboard.map((stat, idx) => {
          const { team, points, firstPlaceCount, secondPlaceCount, gamesPlayed, rank } = stat;
          const style = TEAM_STYLES[team.id] || {
            characterName: team.name,
            themeStyle: 'Vanguard',
            primaryColor: team.color,
            secondaryColor: team.secondaryColor,
            glowColor: 'rgba(0, 240, 255, 0.4)',
            tagline: team.name,
          };

          const percentage = Math.max(6, (points / maxPoints) * 100);
          const isLeader = rank === 1;

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`relative rounded-xl p-4 border-2 backdrop-blur-md shadow-2xl transition-all overflow-hidden flex-1 flex flex-col justify-center ${
                isLeader
                  ? 'bg-[#0D1333]/95 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                  : 'bg-[#0D1129]/90 border-cyan-500/20'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between gap-6">
                {/* Left: Rank Badge, Crest, Team Name */}
                <div className="flex items-center gap-4 min-w-[320px]">
                  {getRankBadge(rank)}

                  <TeamCrest team={team} size="md" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[9px] font-black font-['Rajdhani'] px-1.5 py-0.2 rounded text-slate-950 uppercase"
                        style={{ backgroundColor: style.primaryColor }}
                      >
                        TEAM {team.code}
                      </span>
                      <span className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider font-['Rajdhani']">
                        {style.characterName}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white font-['Rajdhani'] truncate tracking-wider mt-0.5">
                      {team.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider font-['Rajdhani'] truncate">
                      Captain: <strong className="text-slate-200">{team.captain}</strong>
                    </div>
                  </div>
                </div>

                {/* Middle: Health-Bar Style Points Meter */}
                <div className="flex-1 px-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5 font-['Rajdhani']">
                    <div className="flex items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                        <span>Wins (10p): <strong className="text-white font-mono">{firstPlaceCount}</strong></span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                        <span>Runner-Up (5p): <strong className="text-white font-mono">{secondPlaceCount}</strong></span>
                      </span>
                      <span className="text-slate-400">
                        Fixtures: <strong className="text-slate-200 font-mono">{gamesPlayed}</strong>
                      </span>
                    </div>

                    {/* Gold "TOURNAMENT LEADER" Badge for Rank 1 */}
                    {isLeader && (
                      <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[10px] tracking-widest font-['Rajdhani'] shadow-[0_0_12px_rgba(245,158,11,0.7)] animate-pulse flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>TOURNAMENT LEADER</span>
                      </div>
                    )}
                  </div>

                  {/* Health Bar Container */}
                  <div className="fg-healthbar-track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="fg-healthbar-fill"
                    />
                  </div>
                </div>

                {/* Right: Big Bold Tabular Points */}
                <div className="text-right pl-5 border-l border-cyan-500/25 min-w-[150px]">
                  <div
                    className="text-4xl font-black font-['Rajdhani'] tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(0,240,255,0.5)]"
                    style={{ color: style.primaryColor }}
                  >
                    {points}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-300 font-['Rajdhani']">
                    CARNIVAL POINTS
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] relative z-10 pb-1">
        EVERY POINT COUNTS · THE HIGHEST TOTAL CLAIMS THE CHAMPIONSHIP TROPHY
      </div>
    </div>
  );
};
