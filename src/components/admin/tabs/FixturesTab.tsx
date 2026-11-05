import React, { useMemo, useState } from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { TEAM_STYLES } from '../../../theme/theme';
import { GameStatus, GroupFixtureFormat, TeamId } from '../../../types';
import {
  Calendar,
  CheckCircle2,
  Minus,
  Plus,
  Swords,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';

const PAIR_GAME_NAMES = new Set(['carrom', 'foosball', 'batmitoon', 'badminton', 'snooker', 'cricket']);
const GROUP_GAME_NAMES = new Set(['volleyball', 'football']);

const inferFixtureMode = (gameName: string): 'pair' | 'group' => {
  const normalized = (gameName || '').trim().toLowerCase();
  if (GROUP_GAME_NAMES.has(normalized)) return 'group';
  if (PAIR_GAME_NAMES.has(normalized)) return 'pair';
  return 'pair';
};

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const FixturesTab: React.FC = () => {
  const {
    data,
    updatePairMatch,
    addGroupMatchup,
    addPairMatchup,
    deleteFixtureTie,
    updateFixtureTie,
    assignPairPlayer,
    updatePairName,
    setFixturesGame,
    setFixturesMode,
    setTeamPairCount,
    updateRoundTitle,
    addFixtureRound,
    deleteFixtureRound,
    setGroupFormat,
    addGameWiseFixture,
    updateGameWiseFixture,
    deleteGameWiseFixture,
  } = useCarnivalStore();

  const { fixtures, teams, members, games } = data;

  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [selectedTeamTab, setSelectedTeamTab] = useState<string>('team-a');
  const [notice, setNotice] = useState<string | null>(null);

  if (!fixtures) {
    return <div className="p-8 text-center text-slate-400">No fixtures configured.</div>;
  }

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const selectedGame = games.find((g) => g.id === fixtures.gameId) || games[0] || null;
  const fixtureMode = fixtures.mode || inferFixtureMode(fixtures.gameName || selectedGame?.name || '');
  const isPairMode = fixtureMode === 'pair';
  const activeRound = fixtures.rounds.find((r) => r.roundNumber === selectedRound) || fixtures.rounds[0];
  const gameWiseFixtures = fixtures.gameWiseFixtures || [];

  const getTeam = (teamId: string) => teams.find((t) => t.id === teamId);
  const getTeamPairCount = (teamId: string): number => Math.max(1, fixtures.teamPairCounts?.[teamId] || 4);

  const handleGameSelect = async (gameId: string) => {
    const picked = games.find((g) => g.id === gameId);
    if (!picked) return;
    await setFixturesGame(picked.id, picked.name, `${picked.name.toUpperCase()} FIXTURES`);
    showNotice(`Fixtures assigned to ${picked.name}`);
  };

  const handleModeChange = async (mode: 'pair' | 'group') => {
    await setFixturesMode(mode);
    showNotice(`Fixture mode switched to ${mode === 'pair' ? 'Pair' : 'Group'}`);
  };

  const handleAddRound = async () => {
    await addFixtureRound();
    const nextRound = (fixtures.rounds?.length || 0) + 1;
    setSelectedRound(nextRound);
    showNotice('Round added');
  };

  const handleDeleteRound = async (roundNumber: number) => {
    if (fixtures.rounds.length <= 1) {
      showNotice('At least one round is required');
      return;
    }
    await deleteFixtureRound(roundNumber);
    const nextRound = Math.max(1, Math.min(selectedRound, fixtures.rounds.length - 1));
    setSelectedRound(nextRound);
    showNotice(`Round ${roundNumber} deleted`);
  };

  const handleAddGameFixture = async () => {
    const game = selectedGame || games[0];
    if (!game) return;

    await addGameWiseFixture({
      gameId: game.id,
      gameName: game.name,
      fixtureDate: toIsoDate(new Date()),
      roundLabel: 'Round 1',
      status: 'upcoming',
      notes: '',
    });
    showNotice('Game-wise fixture added');
  };

  const fixtureList = useMemo(
    () =>
      [...gameWiseFixtures].sort((a, b) => {
        if (a.fixtureDate === b.fixtureDate) return a.gameName.localeCompare(b.gameName);
        return a.fixtureDate.localeCompare(b.fixtureDate);
      }),
    [gameWiseFixtures]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest">
            <Swords className="w-4 h-4" />
            <span>Fixtures Management</span>
          </div>
          <h2 className="text-2xl font-black text-white font-['Rajdhani'] uppercase tracking-wider mt-0.5">
            {fixtures.title || 'FIXTURES'}
          </h2>
          <p className="text-xs text-slate-400">
            Pick sport, pick mode, edit rounds, then update fixtures below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-slate-400 uppercase">Sport:</span>
            <select
              value={fixtures.gameId || selectedGame?.id || ''}
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

          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs font-bold text-slate-400 uppercase">Mode:</span>
            <select
              value={fixtureMode}
              onChange={(e) => handleModeChange(e.target.value as 'pair' | 'group')}
              className="bg-black/60 text-white text-xs font-bold rounded px-2 py-1 border border-white/10 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="pair">Pair</option>
              <option value="group">Group</option>
            </select>
          </div>

          <div
            className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
              isPairMode
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {isPairMode ? 'Pair Game Mode' : 'Group Game Mode'}
          </div>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in font-['Rajdhani']">
          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
          <span>{notice}</span>
        </div>
      )}

      <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10">
        <h4 className="text-xs uppercase tracking-wider font-black text-cyan-300 mb-2">How to use</h4>
        <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
          <li>Select sport and fixture mode.</li>
          <li>Add or delete rounds from Manual Round Titles.</li>
          <li>Use Game-Wise Fixtures for date-wise fixture list.</li>
          <li>In Pair mode, assign pairs and update match results.</li>
        </ol>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
              Game-Wise Fixtures
            </h3>
          </div>
          <button
            onClick={handleAddGameFixture}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fixture</span>
          </button>
        </div>

        <div className="space-y-2">
          {fixtureList.map((fixture) => (
            <div key={fixture.id} className="p-3 rounded-lg border border-white/10 bg-black/35">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                <select
                  value={fixture.gameId}
                  onChange={(e) => {
                    const picked = games.find((g) => g.id === e.target.value);
                    if (!picked) return;
                    updateGameWiseFixture(fixture.id, { gameId: picked.id, gameName: picked.name });
                  }}
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                >
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </select>

                <input
                  type="date"
                  aria-label={`${fixture.gameName} fixture start date`}
                  value={fixture.fixtureDate}
                  onChange={(e) => updateGameWiseFixture(fixture.id, { fixtureDate: e.target.value })}
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                />

                <input
                  type="date"
                  aria-label={`${fixture.gameName} fixture end date`}
                  value={fixture.fixtureEndDate || fixture.fixtureDate}
                  onChange={(e) => updateGameWiseFixture(fixture.id, { fixtureEndDate: e.target.value })}
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                />

                <input
                  value={fixture.roundLabel}
                  onChange={(e) => updateGameWiseFixture(fixture.id, { roundLabel: e.target.value })}
                  placeholder="Round Label"
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                />

                <select
                  value={fixture.status}
                  onChange={(e) =>
                    updateGameWiseFixture(fixture.id, { status: e.target.value as GameStatus })
                  }
                  className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => deleteGameWiseFixture(fixture.id)}
                  className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
              <input
                value={fixture.notes || ''}
                onChange={(e) => updateGameWiseFixture(fixture.id, { notes: e.target.value })}
                placeholder="Notes"
                className="mt-2 w-full px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
              />
            </div>
          ))}

          {fixtureList.length === 0 && (
            <div className="p-4 rounded-lg border border-dashed border-white/20 text-slate-400 text-xs">
              No game-wise fixtures yet.
            </div>
          )}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
            Manual Round Titles
          </h3>
          </div>
          <button
            onClick={handleAddRound}
            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Round</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fixtures.rounds.map((round) => (
            <div key={round.roundNumber} className="p-3 bg-black/35 rounded-lg border border-white/10">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-[11px] text-slate-400 uppercase">Round {round.roundNumber}</div>
                <button
                  onClick={() => handleDeleteRound(round.roundNumber)}
                  className="p-1 rounded bg-red-500/20 text-red-300 border border-red-500/40 cursor-pointer"
                  title="Delete round"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <input
                value={round.title}
                onChange={(e) => updateRoundTitle(round.roundNumber, e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
              />
            </div>
          ))}
        </div>
      </div>

      {!isPairMode && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
              Group Game Settings
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase text-slate-400 font-bold">Format</span>
            <select
              value={fixtures.groupFormat || 'round_robin'}
              onChange={(e) => setGroupFormat(e.target.value as GroupFixtureFormat)}
              className="px-3 py-1.5 bg-slate-900 border border-white/10 rounded text-xs font-bold text-white"
            >
              <option value="round_robin">Round Robin</option>
              <option value="knockout">Knockout</option>
            </select>
          </div>

          <p className="text-xs text-slate-400">
            Set the team matchups and results for each round below.
          </p>
        </div>
      )}

      {!isPairMode && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">Group Matchups & Results</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {fixtures.rounds.map((round) => (
                <button key={round.roundNumber} onClick={() => setSelectedRound(round.roundNumber)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${selectedRound === round.roundNumber ? 'bg-cyan-600 text-white' : 'bg-black/40 text-slate-400'}`}>
                  {round.title}
                </button>
              ))}
              {activeRound && <button onClick={() => addGroupMatchup(activeRound.roundNumber)} className="px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add Matchup</button>}
            </div>
          </div>
          <div className="space-y-3">
            {activeRound?.ties.map((tie) => {
              const teamA = getTeam(tie.teamAId);
              const teamB = getTeam(tie.teamBId);
              const result = tie.matches[0];
              if (!teamA || !teamB || !result) return null;
              return <div key={tie.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_1fr_1fr_auto] gap-3 items-center p-3 rounded-lg bg-black/40 border border-white/10">
                <select value={tie.teamAId} onChange={(e) => updateFixtureTie(activeRound!.roundNumber, tie.id, { teamAId: e.target.value })} className="px-2 py-2 bg-slate-900 border border-white/10 rounded text-xs text-white">
                  {teams.map((team) => <option key={team.id} value={team.id} disabled={team.id === tie.teamBId}>{team.name}</option>)}
                </select><span className="text-slate-500 text-center">VS</span>
                <select value={tie.teamBId} onChange={(e) => updateFixtureTie(activeRound!.roundNumber, tie.id, { teamBId: e.target.value })} className="px-2 py-2 bg-slate-900 border border-white/10 rounded text-xs text-white">
                  {teams.map((team) => <option key={team.id} value={team.id} disabled={team.id === tie.teamAId}>{team.name}</option>)}
                </select>
                <select value={result.status} onChange={(e) => updatePairMatch(activeRound!.roundNumber, tie.id, result.id, { status: e.target.value as GameStatus })} className="px-2 py-2 bg-slate-900 border border-white/10 rounded text-xs text-white">
                  <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
                </select>
                <select value={result.winnerTeamId || ''} onChange={(e) => { const winner = (e.target.value as TeamId) || null; updatePairMatch(activeRound!.roundNumber, tie.id, result.id, { winnerTeamId: winner, status: winner ? 'completed' : result.status }); }} className="px-2 py-2 bg-slate-900 border border-white/10 rounded text-xs text-white">
                  <option value="">No result</option><option value={teamA.id}>{teamA.name} won</option><option value={teamB.id}>{teamB.name} won</option>
                </select>
                <button type="button" onClick={() => deleteFixtureTie(activeRound!.roundNumber, tie.id)} title="Delete matchup" aria-label={`Delete ${teamA.name} vs ${teamB.name}`} className="px-2 py-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-red-500/30">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>;
            })}
            {!activeRound?.ties.length && <p className="text-sm text-slate-400">No matchups yet. Use “Add Matchup” to choose the teams playing this round.</p>}
          </div>
        </div>
      )}

      {isPairMode && (
        <>
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-amber-400" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
                    Team Pair Roster
                  </h3>
                  <p className="text-[11px] text-slate-400">Add, edit, and delete pairs per team.</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-lg border border-white/5">
                {teams.map((t) => {
                  const isActive = selectedTeamTab === t.id;
                  const style = TEAM_STYLES[t.id];
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeamTab(t.id)}
                      className={`px-3 py-1 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-['Rajdhani'] ${
                        isActive ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                      style={isActive ? { backgroundColor: style?.primaryColor || t.color } : {}}
                    >
                      {t.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {(() => {
              const team = getTeam(selectedTeamTab);
              if (!team) return null;

              const pairCount = getTeamPairCount(team.id);
              const teamMembers = members.filter((m) => m.teamId === team.id);
              const style = TEAM_STYLES[team.id];

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setTeamPairCount(team.id, pairCount - 1)}
                      className="p-1.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 cursor-pointer"
                      title="Remove one pair"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-slate-300 font-bold uppercase">
                      {team.name} pairs: {pairCount}
                    </span>
                    <button
                      onClick={() => setTeamPairCount(team.id, pairCount + 1)}
                      className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                      title="Add one pair"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: pairCount }, (_, idx) => idx + 1).map((pairNum) => {
                      const pairKey = `${team.id}_pair_${pairNum}`;
                      const pairAssigned = fixtures.pairPlayers?.[pairKey] || ['', ''];

                      return (
                        <div
                          key={pairNum}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
                          style={{ borderTop: `3px solid ${style?.primaryColor || team.color}` }}
                        >
                          <input
                            value={fixtures.pairNames?.[`${fixtures.gameId}_${team.id}_pair_${pairNum}`] || ''}
                            onChange={(e) => updatePairName(fixtures.gameId, team.id, pairNum, e.target.value)}
                            placeholder={`Pair ${pairNum} name`}
                            aria-label={`${team.name} pair ${pairNum} name for ${fixtures.gameName}`}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-white/10 rounded text-xs font-black uppercase text-white"
                          />

                          <div className="space-y-2">
                            <select
                              value={pairAssigned[0] || ''}
                              onChange={(e) => assignPairPlayer(team.id, pairNum, 0, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded text-xs text-white"
                            >
                              <option value="">Player 1</option>
                              {teamMembers.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>

                            <select
                              value={pairAssigned[1] || ''}
                              onChange={(e) => assignPairPlayer(team.id, pairNum, 1, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded text-xs text-white"
                            >
                              <option value="">Player 2</option>
                              {teamMembers.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Rajdhani']">
                  Pair Match Results
                </h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
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
                {activeRound && <button onClick={() => addPairMatchup(activeRound.roundNumber)} className="px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-emerald-500 text-slate-950 flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add Matchup</button>}
              </div>
            </div>

            <div className="space-y-6">
              {activeRound?.ties.map((tie) => {
                const teamA = getTeam(tie.teamAId);
                const teamB = getTeam(tie.teamBId);
                if (!teamA || !teamB) return null;

                const styleA = TEAM_STYLES[teamA.id];
                const styleB = TEAM_STYLES[teamB.id];
                const pairOptionsA = Array.from({ length: getTeamPairCount(teamA.id) }, (_, i) => i + 1);
                const pairOptionsB = Array.from({ length: getTeamPairCount(teamB.id) }, (_, i) => i + 1);

                return (
                  <div key={tie.id} className="p-5 rounded-xl bg-black/50 border border-white/10 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <TeamCrest team={teamA} size="sm" />
                        <select value={tie.teamAId} onChange={(e) => updateFixtureTie(activeRound!.roundNumber, tie.id, { teamAId: e.target.value })} className="px-2 py-1.5 bg-slate-900 border border-white/10 rounded text-xs font-black uppercase text-white">
                          {teams.map((team) => <option key={team.id} value={team.id} disabled={team.id === tie.teamBId}>{team.name}</option>)}
                        </select>
                        <span className="text-xs text-slate-400 uppercase">vs</span>
                        <select value={tie.teamBId} onChange={(e) => updateFixtureTie(activeRound!.roundNumber, tie.id, { teamBId: e.target.value })} className="px-2 py-1.5 bg-slate-900 border border-white/10 rounded text-xs font-black uppercase text-white">
                          {teams.map((team) => <option key={team.id} value={team.id} disabled={team.id === tie.teamAId}>{team.name}</option>)}
                        </select>
                        <TeamCrest team={teamB} size="sm" />
                        <button type="button" onClick={() => deleteFixtureTie(activeRound!.roundNumber, tie.id)} title="Delete matchup" aria-label={`Delete ${teamA.name} vs ${teamB.name}`} className="p-2 bg-red-500/20 text-red-300 border border-red-500/40 rounded cursor-pointer hover:bg-red-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {tie.matches.map((match, mIdx) => {
                        const pairKeyA = `${teamA.id}_pair_${match.pairANumber}`;
                        const pairKeyB = `${teamB.id}_pair_${match.pairBNumber}`;
                        const playersA = fixtures.pairPlayers?.[pairKeyA] || ['', ''];
                        const playersB = fixtures.pairPlayers?.[pairKeyB] || ['', ''];
                        const nameA1 = members.find((m) => m.id === playersA[0])?.name || '';
                        const nameA2 = members.find((m) => m.id === playersA[1])?.name || '';
                        const nameB1 = members.find((m) => m.id === playersB[0])?.name || '';
                        const nameB2 = members.find((m) => m.id === playersB[1])?.name || '';

                        return (
                          <div key={match.id} className="p-3 rounded-lg border bg-slate-900/60 border-white/10">
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 items-center">
                              <div className="text-xs text-slate-400 font-bold">Match #{mIdx + 1}</div>

                              <div className="space-y-1">
                                <select
                                  value={match.pairANumber}
                                  onChange={(e) =>
                                    updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                      pairANumber: Number(e.target.value),
                                    })
                                  }
                                  className="w-full px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                                  style={{ borderColor: styleA?.primaryColor || teamA.color }}
                                >
                                  {pairOptionsA.map((num) => (
                                    <option key={num} value={num}>
                                      {teamA.name} {fixtures.pairNames?.[`${fixtures.gameId}_${teamA.id}_pair_${num}`] || `Pair ${num}`}
                                    </option>
                                  ))}
                                </select>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {nameA1 && nameA2 ? `${nameA1} & ${nameA2}` : 'Pair unassigned'}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <select
                                  value={match.pairBNumber}
                                  onChange={(e) =>
                                    updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                      pairBNumber: Number(e.target.value),
                                    })
                                  }
                                  className="w-full px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                                  style={{ borderColor: styleB?.primaryColor || teamB.color }}
                                >
                                  {pairOptionsB.map((num) => (
                                    <option key={num} value={num}>
                                      {teamB.name} {fixtures.pairNames?.[`${fixtures.gameId}_${teamB.id}_pair_${num}`] || `Pair ${num}`}
                                    </option>
                                  ))}
                                </select>
                                <div className="text-[11px] text-slate-400 truncate text-right">
                                  {nameB1 && nameB2 ? `${nameB1} & ${nameB2}` : 'Pair unassigned'}
                                </div>
                              </div>

                              <select
                                value={match.status}
                                onChange={(e) =>
                                  updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                    status: e.target.value as GameStatus,
                                  })
                                }
                                className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                              >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                              </select>

                              <select
                                value={match.winnerTeamId || ''}
                                onChange={(e) => {
                                  const winnerId = (e.target.value as TeamId) || null;
                                  updatePairMatch(activeRound.roundNumber, tie.id, match.id, {
                                    winnerTeamId: winnerId,
                                    status: winnerId ? 'completed' : match.status,
                                  });
                                }}
                                className="px-2 py-1 bg-slate-900 border border-white/10 rounded text-xs text-white"
                              >
                                <option value="">No Winner</option>
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
        </>
      )}
    </div>
  );
};
