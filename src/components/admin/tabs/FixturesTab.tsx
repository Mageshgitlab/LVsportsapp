import React, { useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { GameStatus, TeamId } from '../../../types';
import {
  Swords,
  Trophy,
  Shuffle,
  Users,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const FixturesTab: React.FC = () => {
  const {
    data,
    updatePairMatch,
    assignPairPlayer,
    shuffleFixtures,
    setFixturesGame,
  } = useCarnivalStore();

  const { fixtures, teams, members, games } = data;
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedTeamTab, setSelectedTeamTab] = useState<string>('team-a');
  const [notice, setNotice] = useState<string | null>(null);

  if (!fixtures) {
    return (
      <div className="p-8 text-center text-slate-400">
        No fixtures configured. Please reset to default settings.
      </div>
    );
  }

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);

  const handleShuffleAll = async () => {
    await shuffleFixtures();
    showNotice('Shuffled all pair matchups across all ties!');
  };

  const handleShuffleTie = async (tieId: string) => {
    await shuffleFixtures(tieId);
    showNotice('Shuffled pair matchups for this tie!');
  };

  const handleGameSelect = async (gameId: string) => {
    const selected = games.find((g) => g.id === gameId);
    if (selected) {
      await setFixturesGame(selected.id, selected.name, `${selected.name.toUpperCase()} FIXTURES`);
      showNotice(`Fixtures assigned to ${selected.name}`);
    }
  };

  const activeRound = fixtures.rounds.find((r) => r.roundNumber === selectedRound) || fixtures.rounds[0];

  return (
    <div className="space-y-8">
      {/* Top Banner & Game Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
            <Swords className="w-4 h-4" />
            <span>Fixtures & Pairings Management</span>
          </div>
          <h2 className="text-2xl font-black text-white font-['Rajdhani'] uppercase tracking-wider mt-0.5">
            {fixtures.title || 'CARROM FIXTURES'}
          </h2>
          <p className="text-xs text-slate-400">
            Manage 4 pairs per team, set match statuses, select pair match winners, and randomize matchups
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Game Selector */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-slate-400 uppercase">Sport:</span>
            <select
              value={fixtures.gameId || 'game-1'}
              onChange={(e) => handleGameSelect(e.target.value)}
              className="bg-black/60 text-white text-xs font-bold rounded px-2 py-1 border border-white/10 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Shuffle All Fixtures Button */}
          <button
            onClick={handleShuffleAll}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs font-['Rajdhani'] uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            title="Randomize pair matchups within all ties"
          >
            <Shuffle className="w-4 h-4 stroke-[2.5]" />
            <span>Shuffle All Fixtures</span>
          </button>
        </div>
      </div>

      {/* Transient Notification Notice */}
      {notice && (
        <div className="p-3 bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in font-['Rajdhani']">
          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
          <span>{notice}</span>
        </div>
      )}

      {/* Section 1: Team Pair Roster Assignment */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-amber-400" />
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
                Team Doubles Lineup (4 Pairs per Team)
              </h3>
              <p className="text-[11px] text-slate-400">
                Assign 2 athletes from the roster to each pair (Pair 1 to Pair 4)
              </p>
            </div>
          </div>

          {/* Team Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-lg border border-white/5">
            {teams.map((t) => {
              const isActive = selectedTeamTab === t.id;
              const style = TEAM_STYLES[t.id];
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeamTab(t.id)}
                  className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-['Rajdhani'] ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  style={isActive ? { backgroundColor: style?.primaryColor || t.color } : {}}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Pairs for Selected Team */}
        {(() => {
          const activeTeam = getTeam(selectedTeamTab);
          if (!activeTeam) return null;
          const teamMembers = members.filter((m) => m.teamId === activeTeam.id);
          const style = TEAM_STYLES[activeTeam.id];

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {[1, 2, 3, 4].map((pairNum) => {
                const pairKey = `${activeTeam.id}_pair_${pairNum}`;
                const pairAssigned = fixtures.pairPlayers?.[pairKey] || ['', ''];

                return (
                  <div
                    key={pairNum}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
                    style={{ borderTop: `3px solid ${style?.primaryColor || activeTeam.color}` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani']">
                        Pair {pairNum}
                      </span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.2 rounded text-slate-950 font-['Rajdhani'] uppercase"
                        style={{ backgroundColor: style?.primaryColor || activeTeam.color }}
                      >
                        Team {activeTeam.code}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Player 1 Dropdown */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Player 1
                        </label>
                        <select
                          value={pairAssigned[0] || ''}
                          onChange={(e) =>
                            assignPairPlayer(activeTeam.id, pairNum, 0, e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-['Rajdhani'] cursor-pointer"
                        >
                          <option value="">-- Select Member --</option>
                          {teamMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.role ? `(${m.role})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Player 2 Dropdown */}
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Player 2
                        </label>
                        <select
                          value={pairAssigned[1] || ''}
                          onChange={(e) =>
                            assignPairPlayer(activeTeam.id, pairNum, 1, e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-cyan-400 font-['Rajdhani'] cursor-pointer"
                        >
                          <option value="">-- Select Member --</option>
                          {teamMembers.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.role ? `(${m.role})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Section 2: Fixture Rounds & Match Results */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
        {/* Round Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
              Rounds & Match Scores
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {fixtures.rounds.map((r) => (
              <button
                key={r.roundNumber}
                onClick={() => setSelectedRound(r.roundNumber)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider font-['Rajdhani'] transition-all cursor-pointer ${
                  selectedRound === r.roundNumber
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'bg-black/40 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>

        {/* Ties in Selected Round */}
        <div className="space-y-6">
          {activeRound.ties.map((tie) => {
            const teamA = getTeam(tie.teamAId);
            const teamB = getTeam(tie.teamBId);
            if (!teamA || !teamB) return null;

            const styleA = TEAM_STYLES[teamA.id];
            const styleB = TEAM_STYLES[teamB.id];

            const aWins = tie.matches.filter((m) => m.winnerTeamId === teamA.id).length;
            const bWins = tie.matches.filter((m) => m.winnerTeamId === teamB.id).length;

            return (
              <div
                key={tie.id}
                className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-4"
              >
                {/* Tie Summary Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    {/* Team A */}
                    <div className="flex items-center gap-2">
                      <TeamCrest team={teamA} size="sm" />
                      <span className="text-base font-black text-white font-['Rajdhani'] uppercase tracking-wider">
                        {teamA.name}
                      </span>
                    </div>

                    {/* Tie Score Badge */}
                    <div className="px-4 py-1.5 rounded-lg bg-[#070A1E] border border-cyan-500/40 flex items-center gap-3">
                      <span
                        className="text-xl font-black font-['Rajdhani'] tabular-nums"
                        style={{ color: styleA?.primaryColor || teamA.color }}
                      >
                        {aWins}
                      </span>
                      <span className="text-slate-500 font-bold text-xs uppercase">VS</span>
                      <span
                        className="text-xl font-black font-['Rajdhani'] tabular-nums"
                        style={{ color: styleB?.primaryColor || teamB.color }}
                      >
                        {bWins}
                      </span>
                    </div>

                    {/* Team B */}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-white font-['Rajdhani'] uppercase tracking-wider">
                        {teamB.name}
                      </span>
                      <TeamCrest team={teamB} size="sm" />
                    </div>
                  </div>

                  {/* Shuffle Tie Button */}
                  <button
                    onClick={() => handleShuffleTie(tie.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold font-['Rajdhani'] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    title="Randomize pair matchups for this tie only"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Shuffle This Tie</span>
                  </button>
                </div>

                {/* 4 Pair Matches Rows */}
                <div className="space-y-2.5">
                  {tie.matches.map((match, mIdx) => {
                    const aWon = match.winnerTeamId === teamA.id;
                    const bWon = match.winnerTeamId === teamB.id;

                    const pairKeyA = `${teamA.id}_pair_${match.pairANumber}`;
                    const pairKeyB = `${teamB.id}_pair_${match.pairBNumber}`;
                    const playersA = fixtures.pairPlayers?.[pairKeyA] || ['', ''];
                    const playersB = fixtures.pairPlayers?.[pairKeyB] || ['', ''];

                    const nameA1 = members.find((m) => m.id === playersA[0])?.name || '';
                    const nameA2 = members.find((m) => m.id === playersA[1])?.name || '';
                    const nameB1 = members.find((m) => m.id === playersB[0])?.name || '';
                    const nameB2 = members.find((m) => m.id === playersB[1])?.name || '';

                    return (
                      <div
                        key={match.id}
                        className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                          aWon
                            ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/40'
                            : bWon
                            ? 'bg-gradient-to-l from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/40'
                            : 'bg-slate-900/60 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Match Label & Pair A */}
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <span className="text-xs font-bold text-slate-500 font-mono w-5">
                            #{mIdx + 1}
                          </span>
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-slate-950 font-['Rajdhani']"
                            style={{ backgroundColor: styleA?.primaryColor || teamA.color }}
                          >
                            {match.pairANumber}
                          </span>
                          <div>
                            <div className="text-xs font-extrabold text-white font-['Rajdhani'] uppercase">
                              {teamA.name} Pair {match.pairANumber}
                            </div>
                            <div className="text-[11px] text-slate-400 font-['Rajdhani'] truncate">
                              {nameA1 && nameA2 ? `${nameA1} & ${nameA2}` : nameA1 || nameA2 || 'Squad pair unassigned'}
                            </div>
                          </div>
                        </div>

                        {/* VS Center Indicator */}
                        <div className="text-center font-bold text-xs text-slate-400 font-['Rajdhani'] px-2">
                          VS
                        </div>

                        {/* Pair B */}
                        <div className="flex items-center gap-3 min-w-[240px] justify-start md:justify-end">
                          <div className="text-left md:text-right">
                            <div className="text-xs font-extrabold text-white font-['Rajdhani'] uppercase">
                              {teamB.name} Pair {match.pairBNumber}
                            </div>
                            <div className="text-[11px] text-slate-400 font-['Rajdhani'] truncate">
                              {nameB1 && nameB2 ? `${nameB1} & ${nameB2}` : nameB1 || nameB2 || 'Squad pair unassigned'}
                            </div>
                          </div>
                          <span
                            className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-slate-950 font-['Rajdhani']"
                            style={{ backgroundColor: styleB?.primaryColor || teamB.color }}
                          >
                            {match.pairBNumber}
                          </span>
                        </div>

                        {/* Match Status & Winner Controls */}
                        <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                          {/* Status */}
                          <select
                            value={match.status}
                            onChange={(e) =>
                              updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                status: e.target.value as GameStatus,
                              })
                            }
                            className={`px-2 py-1 rounded text-xs font-bold font-['Rajdhani'] uppercase border focus:outline-none cursor-pointer ${
                              match.status === 'live'
                                ? 'bg-red-950/80 text-red-300 border-red-500/50'
                                : match.status === 'completed'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                                : 'bg-slate-900 text-slate-300 border-white/10'
                            }`}
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live Now</option>
                            <option value="completed">Completed</option>
                          </select>

                          {/* Winner Picker */}
                          <select
                            value={match.winnerTeamId || ''}
                            onChange={(e) => {
                              const winnerId = e.target.value as TeamId || null;
                              updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                winnerTeamId: winnerId,
                                status: winnerId ? 'completed' : match.status,
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-900 border border-white/15 rounded text-xs font-bold text-white font-['Rajdhani'] focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            <option value="">No Winner (Draw / Pending)</option>
                            <option value={teamA.id}>{teamA.name} Won</option>
                            <option value={teamB.id}>{teamB.name} Won</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
