import React from 'react';
import { useCarnivalStore, calculateLeaderboard } from '../../../store/carnivalStore';
import { TeamId } from '../../../types';
import { GameIcon } from '../../common/GameIcon';
import { TeamCrest } from '../../common/TeamCrest';
import { Trophy, Medal, RotateCcw, CheckCircle2, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ResultsTab: React.FC = () => {
  const { data, setGameResults } = useCarnivalStore();
  const { games, teams } = data;
  const leaderboard = calculateLeaderboard(teams, games);

  const handleSelectWinner = async (gameId: string, teamId: string | '') => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    const newFirst = teamId ? (teamId as TeamId) : null;
    let newSecond = game.secondPlaceTeamId || null;
    if (newFirst && newSecond === newFirst) {
      newSecond = null; // Can't be both 1st and 2nd
    }

    await setGameResults(gameId, newFirst, newSecond);

    if (newFirst) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handleSelectRunnerUp = async (gameId: string, teamId: string | '') => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    const newSecond = teamId ? (teamId as TeamId) : null;
    let newFirst = game.firstPlaceTeamId || null;
    if (newSecond && newFirst === newSecond) {
      newFirst = null; // Can't be both
    }

    await setGameResults(gameId, newFirst, newSecond);
  };

  const handleClearResults = async (gameId: string) => {
    await setGameResults(gameId, null, null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Results & Points Calculator</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Assign 1st place (+10 pts) and 2nd place (+5 pts) winners per game. Points and leaderboard calculate automatically.
          </p>
        </div>
      </div>

      {/* Grid of Games for Outcome Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => {
          const hasResults = Boolean(game.firstPlaceTeamId || game.secondPlaceTeamId);

          return (
            <div
              key={game.id}
              className={`p-5 rounded-2xl border transition-all ${
                hasResults
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/60 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-orange-400">
                    <GameIcon icon={game.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white font-['Outfit']">
                      {game.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">
                      {game.scheduledTime}
                    </span>
                  </div>
                </div>

                {hasResults && (
                  <button
                    onClick={() => handleClearResults(game.id)}
                    className="p-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset results"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Podium Selectors */}
              <div className="space-y-3.5 my-4">
                {/* 1st Place (+10 pts) */}
                <div>
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1.5 text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>1st Place Winner</span>
                    </span>
                    <span className="font-mono text-[10px] bg-amber-500/20 px-2 py-0.2 rounded border border-amber-500/30">
                      +10 PTS
                    </span>
                  </label>
                  <select
                    value={game.firstPlaceTeamId || ''}
                    onChange={(e) => handleSelectWinner(game.id, e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      -- Choose Winning Squad --
                    </option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                        Team {t.code}: {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2nd Place (+5 pts) */}
                <div>
                  <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Medal className="w-3.5 h-3.5 text-slate-400" />
                      <span>2nd Place Runner-Up</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-500/20 px-2 py-0.2 rounded border border-slate-500/30">
                      +5 PTS
                    </span>
                  </label>
                  <select
                    value={game.secondPlaceTeamId || ''}
                    onChange={(e) => handleSelectRunnerUp(game.id, e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-slate-400 font-semibold cursor-pointer"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      -- Choose Runner-Up Squad --
                    </option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                        Team {t.code}: {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Computed Standings Preview in Admin */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-['Outfit']">
              Live Calculated Standings Preview
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Auto-synced with TV Dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaderboard.map((stat, idx) => (
            <div
              key={stat.team.id}
              className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
              style={{
                borderLeftColor: stat.team.color,
                borderLeftWidth: '4px',
              }}
            >
              <div className="flex items-center gap-3">
                <TeamCrest team={stat.team} size="sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <h5 className="font-extrabold text-white text-sm">
                      {stat.team.name}
                    </h5>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    1st: {stat.firstPlaceCount} | 2nd: {stat.secondPlaceCount}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className="text-2xl font-black font-mono tabular-nums"
                  style={{ color: stat.team.color }}
                >
                  {stat.points}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                  PTS
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
