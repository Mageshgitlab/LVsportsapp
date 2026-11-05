import React, { useEffect, useMemo, useState } from 'react';
import { useCarnivalStore, calculateLeaderboard } from '../../../store/carnivalStore';
import { TeamCrest } from '../../common/TeamCrest';
import { Calendar, Clock, Flame, Swords, Trophy, Users } from 'lucide-react';

const SECTION = {
  standings: { accent: '#f5b301', bar: '#5c4300', tint: 'rgba(245,179,1,0.07)' },
  fixtures: { accent: '#e5383b', bar: '#6b1518', tint: 'rgba(229,56,59,0.06)' },
  schedule: { accent: '#16c7c7', bar: '#0e5e5e', tint: 'rgba(22,199,199,0.06)' },
  spotlight: { accent: '#8b5cf6', bar: '#442787', tint: 'rgba(139,92,246,0.07)' },
};

const FIXTURE_DATE_RANGES: Record<string, [string, string]> = {
  cricket: ['2026-11-16', '2026-11-20'],
  volleyball: ['2026-11-23', '2026-11-25'],
  badminton: ['2026-11-30', '2026-12-03'],
  football: ['2026-12-06', '2026-12-08'],
  chess: ['2026-11-16', '2026-11-20'],
  carrom: ['2026-11-17', '2026-11-18'],
  snooker: ['2026-11-23', '2026-11-25'],
  foosball: ['2026-11-30', '2026-12-03'],
};

export const LiveDashboardSlide: React.FC = () => {
  const { data } = useCarnivalStore();
  const { teams, members, games, fixtures, settings } = data;

  const panelIntervals = settings.panelIntervals || {
    gamesScheduleSec: 8,
    fixturesSec: 10,
    announcementsSec: 8,
  };

  const leaderboard = useMemo(() => calculateLeaderboard(teams, games), [teams, games]).slice(0, 4);
  const maxPoints = Math.max(...leaderboard.map((s) => s.points), 10);

  const [teamSpotlightIndex, setTeamSpotlightIndex] = useState(0);
  const [teamSpotlightProgress, setTeamSpotlightProgress] = useState(0);
  const [activeFixtureIndex, setActiveFixtureIndex] = useState(0);
  const [fixturesProgress, setFixturesProgress] = useState(0);

  const spotlightTeams = teams.length > 0 ? teams : [];
  const activeSpotlightTeam =
    spotlightTeams.length > 0 ? spotlightTeams[teamSpotlightIndex % spotlightTeams.length] : null;

  const rounds = fixtures?.rounds || [];
  const gameWiseFixtures = useMemo(() => {
    const configured = fixtures?.gameWiseFixtures || [];
    const legacyRoundFixtures = configured.length > 0 ? [] : rounds.flatMap((round) =>
      round.ties.map((tie) => ({
        id: `${round.roundNumber}-${tie.id}`,
        gameId: fixtures?.gameId || 'legacy',
        gameName: fixtures?.gameName || 'Fixture',
        fixtureDate: 'TBD',
        roundLabel: round.title,
        status: tie.matches.some((m) => m.status === 'live')
          ? 'live'
          : tie.matches.every((m) => m.status === 'completed')
          ? 'completed'
          : 'upcoming',
        notes: `${teams.find((t) => t.id === tie.teamAId)?.name || 'Team A'} vs ${
          teams.find((t) => t.id === tie.teamBId)?.name || 'Team B'
        }`,
      }))
    );
    const configuredGameIds = new Set([
      ...configured.map((fixture) => fixture.gameId),
      ...legacyRoundFixtures.map((fixture) => fixture.gameId),
    ]);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const toIsoDate = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
    const missingUpcomingGames = games
      .filter((game) => game.status === 'upcoming' && !configuredGameIds.has(game.id))
      .map((game) => {
        const range = FIXTURE_DATE_RANGES[game.name.trim().toLowerCase()];
        return {
          id: `schedule-${game.id}`,
          gameId: game.id,
          gameName: game.name,
          fixtureDate: range?.[0] || toIsoDate(game.scheduledTime.toLowerCase().includes('day 2') ? tomorrow : today),
          fixtureEndDate: range?.[1],
          roundLabel: range ? 'Tournament' : game.scheduledTime,
          status: game.status,
          notes: game.venue,
        };
      });
    return [...configured, ...legacyRoundFixtures, ...missingUpcomingGames].sort((a, b) => {
      if (a.fixtureDate === b.fixtureDate) return a.gameName.localeCompare(b.gameName);
      return a.fixtureDate.localeCompare(b.fixtureDate);
    });
  }, [fixtures?.gameWiseFixtures, fixtures?.gameId, fixtures?.gameName, rounds, teams, games]);

  const dateStamp = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const todayDate = dateStamp(today);
  const tomorrowDate = dateStamp(tomorrow);
  const isScheduledOn = (fixture: (typeof gameWiseFixtures)[number], date: string) =>
    fixture.fixtureDate <= date && (fixture.fixtureEndDate || fixture.fixtureDate) >= date;
  const todayFixtures = gameWiseFixtures.filter((fixture) => isScheduledOn(fixture, todayDate));
  const tomorrowFixtures = gameWiseFixtures.filter((fixture) => isScheduledOn(fixture, tomorrowDate));
  const feedFixtures = gameWiseFixtures.filter((fixture) =>
    fixture.status !== 'completed' && (
      fixture.fixtureDate === 'TBD' ||
      (fixture.fixtureEndDate || fixture.fixtureDate) > tomorrowDate ||
      (fixture.gameId === fixtures?.gameId && rounds.some((round) => round.ties.length > 0))
    )
  );
  const daySections = todayFixtures.length > 0 || tomorrowFixtures.length > 0
    ? [
        ...(todayFixtures.length > 0 ? [{ label: 'TODAY', date: todayDate, items: todayFixtures }] : []),
        ...(tomorrowFixtures.length > 0 ? [{ label: 'TOMORROW', date: tomorrowDate, items: tomorrowFixtures }] : []),
      ]
    : [...new Set(feedFixtures.map((fixture) => fixture.fixtureDate))]
        .slice(0, 2)
        .map((date) => ({
          label: 'UPCOMING',
          date,
          items: feedFixtures.filter((fixture) => fixture.fixtureDate === date),
        }));

  const activeSpotlightMembers = useMemo(() => {
    if (!activeSpotlightTeam) return [] as string[];
    return members
      .filter((member) => member.teamId === activeSpotlightTeam.id)
      .map((member) => member.name);
  }, [activeSpotlightTeam, members]);

  const currentFixture =
    feedFixtures.length > 0
      ? feedFixtures[activeFixtureIndex % feedFixtures.length]
      : null;

  const getFixtureMatchups = (fixture: (typeof gameWiseFixtures)[number]) => {
    if (!fixtures || fixture.gameId !== fixtures.gameId) return [];
    const matchingRounds = rounds.filter((round) =>
      round.title.trim().toLowerCase() === fixture.roundLabel.trim().toLowerCase()
    );
    const roundList = matchingRounds.length > 0 ? matchingRounds : rounds;
    return roundList.flatMap((round) => round.ties.map((tie) => ({
      id: tie.id,
      teamA: teams.find((team) => team.id === tie.teamAId),
      teamB: teams.find((team) => team.id === tie.teamBId),
      winner: tie.matches.find((match) => match.winnerTeamId)?.winnerTeamId,
    }))).filter((matchup) => matchup.teamA && matchup.teamB);
  };

  useEffect(() => {
    if (spotlightTeams.length <= 1) return;

    const durationMs = 8000;
    const tickMs = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += tickMs;
      setTeamSpotlightProgress(Math.min(1, elapsed / durationMs));
      if (elapsed >= durationMs) {
        elapsed = 0;
        setTeamSpotlightProgress(0);
        setTeamSpotlightIndex((prev) => (prev + 1) % spotlightTeams.length);
      }
    }, tickMs);

    return () => clearInterval(timer);
  }, [spotlightTeams.length]);

  useEffect(() => {
    if (feedFixtures.length <= 1) return;

    const durationMs = (panelIntervals.fixturesSec || 10) * 1000;
    const tickMs = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += tickMs;
      setFixturesProgress(Math.min(1, elapsed / durationMs));
      if (elapsed >= durationMs) {
        elapsed = 0;
        setFixturesProgress(0);
        setActiveFixtureIndex((prev) => (prev + 1) % feedFixtures.length);
      }
    }, tickMs);

    return () => clearInterval(timer);
  }, [feedFixtures.length, panelIntervals.fixturesSec]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4 bg-[#070A1E] text-slate-100 select-none overflow-hidden">
      <div
        className="rounded-xl border-2 overflow-hidden"
        style={{ borderColor: `${SECTION.standings.accent}80`, backgroundColor: SECTION.standings.tint }}
      >
        <div
          className="h-14 px-4 flex items-center justify-between border-t-4"
          style={{ backgroundColor: SECTION.standings.bar, borderTopColor: SECTION.standings.accent }}
        >
          <div className="flex items-center gap-3 text-white">
            <Trophy className="w-6 h-6" />
            <span className="font-['Rajdhani'] font-bold uppercase tracking-[0.06em]" style={{ fontSize: '42px', lineHeight: 1 }}>
              STANDINGS
            </span>
          </div>
          <span className="font-['Rajdhani'] font-bold uppercase text-white" style={{ fontSize: '22px' }}>
            LIVE RANKS
          </span>
        </div>

        <div className="h-[170px] p-3 grid grid-cols-4 gap-3">
          {leaderboard.map((stat, idx) => {
            const percentage = Math.min(100, Math.max(10, Math.round((stat.points / maxPoints) * 100)));
            const rank = idx + 1;

            return (
              <div key={stat.team.id} className="rounded-lg border px-3 py-2.5 flex flex-col justify-between bg-[#0d1129]/75 border-white/20">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black font-['Rajdhani'] text-slate-950 shrink-0"
                      style={{
                        fontSize: '24px',
                        backgroundColor: rank === 1 ? '#f5b301' : rank === 2 ? '#d5d7dc' : rank === 3 ? '#c48244' : '#9ca3af',
                      }}
                    >
                      #{rank}
                    </div>
                    <TeamCrest team={stat.team} size="sm" />
                    <div className="min-w-0">
                      <div className="font-['Rajdhani'] font-black uppercase truncate text-white" style={{ fontSize: '31px', lineHeight: 1 }}>
                        {stat.team.name}
                      </div>
                      <div className="font-['Rajdhani'] font-bold uppercase text-slate-300" style={{ fontSize: '16px' }}>
                        W:{stat.firstPlaceCount} / D:{stat.secondPlaceCount} / P:{stat.gamesPlayed} / GD:{stat.points}
                      </div>
                    </div>
                  </div>
                  <div className="font-['Rajdhani'] font-black text-[#ffe08a] leading-none" style={{ fontSize: '66px' }}>
                    {stat.points}
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-black/55 border border-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${percentage}%`, background: 'linear-gradient(90deg,#7a0e14 0%,#e5383b 50%,#f5b301 100%)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 flex-1 min-h-0" style={{ gridTemplateColumns: '48fr 22fr 30fr' }}>
        <div
          className="rounded-xl border-2 overflow-hidden flex flex-col min-h-0"
          style={{ borderColor: `${SECTION.fixtures.accent}80`, backgroundColor: SECTION.fixtures.tint }}
        >
          <div
            className="h-14 px-4 flex items-center justify-between border-t-4"
            style={{ backgroundColor: SECTION.fixtures.bar, borderTopColor: SECTION.fixtures.accent }}
          >
            <div className="flex items-center gap-3 text-white">
              <Swords className="w-6 h-6" />
              <span className="font-['Rajdhani'] font-bold uppercase tracking-[0.06em]" style={{ fontSize: '42px', lineHeight: 1 }}>
                FIXTURES
              </span>
            </div>

            <div className="flex items-center gap-2">
              {feedFixtures.map((fixture, idx) => {
                const isActive = idx === (activeFixtureIndex % Math.max(1, feedFixtures.length));
                return (
                  <span
                    key={fixture.id}
                    className={`px-2.5 py-0.5 rounded font-black font-['Rajdhani'] uppercase ${isActive ? 'bg-white/25 text-white' : 'bg-black/25 text-white/80'}`}
                    style={{ fontSize: '20px' }}
                  >
                    {idx + 1}
                  </span>
                );
              })}
              <div className="w-16 h-1.5 bg-black/35 rounded-full overflow-hidden">
                <div className="h-full bg-white/90" style={{ width: `${fixturesProgress * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="px-3 py-2 flex items-center justify-between gap-2 shrink-0 border-b border-white/10">
            <span className="text-white font-['Rajdhani'] font-bold uppercase" style={{ fontSize: '19px' }}>
              TODAY: {todayFixtures.length} FIXTURES
            </span>
            <span className="text-white/90 font-['Rajdhani'] font-bold uppercase" style={{ fontSize: '16px' }}>
              TOMORROW: {tomorrowFixtures.length} FIXTURES · LATER FIXTURES AUTO-ROTATE
            </span>
          </div>

          <div className="p-3 flex-1 min-h-0 flex flex-col gap-2">
            {daySections.length > 0 && <div className="grid grid-cols-2 gap-2 shrink-0">
              {daySections.map((day) => (
                <div key={day.label} className="rounded-lg border border-white/15 bg-[#0d1129]/72 px-2 py-1.5 min-w-0">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="font-['Rajdhani'] font-black text-cyan-300 uppercase" style={{ fontSize: '16px' }}>{day.label}</span>
                    <span className="font-['Rajdhani'] font-bold text-slate-300" style={{ fontSize: '18px' }}>{day.date}</span>
                  </div>
                  {day.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-1 py-0.5 font-['Rajdhani'] uppercase" style={{ fontSize: '15px' }}>
                      <span className="text-white font-black truncate">{item.gameName}</span>
                      <span className="text-slate-400 font-bold truncate">{item.roundLabel}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>}

            {currentFixture && <div className="flex-1 min-h-0 rounded-lg border border-white/15 bg-[#0d1129]/72 p-2 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1 shrink-0">
                <span className="font-['Rajdhani'] font-black text-amber-300 uppercase" style={{ fontSize: '16px' }}>Upcoming Feed</span>
                {currentFixture && <span className="font-['Rajdhani'] font-bold text-slate-300 uppercase" style={{ fontSize: '18px' }}>{currentFixture.fixtureDate}{currentFixture.fixtureEndDate && currentFixture.fixtureEndDate !== currentFixture.fixtureDate ? ` – ${currentFixture.fixtureEndDate}` : ''} · {currentFixture.roundLabel}</span>}
              </div>
              <div key={currentFixture.id} className="fixture-round-transition flex-1 min-h-0 flex flex-col justify-center">
                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <div className="font-['Rajdhani'] font-black uppercase text-white truncate" style={{ fontSize: '24px' }}>{currentFixture.gameName}</div>
                      {currentFixture.notes && <div className="font-['Rajdhani'] font-bold text-slate-400 truncate" style={{ fontSize: '14px' }}>{currentFixture.notes}</div>}
                    </div>
                    <span className="px-2 py-1 rounded bg-white/10 text-white font-['Rajdhani'] font-black uppercase shrink-0" style={{ fontSize: '13px' }}>{currentFixture.status}</span>
                  </div>
                  {getFixtureMatchups(currentFixture).length > 0 && <div className="mt-1 flex-1 min-h-0 flex flex-col justify-evenly border-t border-white/10 pt-1">
                    {getFixtureMatchups(currentFixture).map((matchup, index) => <div key={matchup.id} className="grid grid-cols-[6rem_1fr] items-center gap-2 rounded bg-black/25 px-2 py-1 font-['Rajdhani'] font-bold uppercase" style={{ fontSize: '18px' }}>
                      <span className="text-cyan-300">Match {index + 1}</span>
                      <span className="flex items-center justify-center gap-2"><span className={matchup.winner === matchup.teamA?.id ? 'text-amber-300' : 'text-white'}>{matchup.teamA?.name}</span><span className="text-slate-500">VS</span><span className={matchup.winner === matchup.teamB?.id ? 'text-amber-300' : 'text-white'}>{matchup.teamB?.name}</span></span>
                    </div>)}
                  </div>}
              </div>
            </div>}
          </div>
        </div>

        <div
          className="rounded-xl border-2 overflow-hidden flex flex-col min-h-0"
          style={{ borderColor: `${SECTION.schedule.accent}80`, backgroundColor: SECTION.schedule.tint }}
        >
          <div
            className="h-14 px-4 flex items-center justify-between border-t-4"
            style={{ backgroundColor: SECTION.schedule.bar, borderTopColor: SECTION.schedule.accent }}
          >
            <div className="flex items-center gap-3 text-white">
              <Calendar className="w-6 h-6" />
              <span className="font-['Rajdhani'] font-bold uppercase tracking-[0.06em]" style={{ fontSize: '40px', lineHeight: 1 }}>
                SCHEDULE
              </span>
            </div>
            <span className="font-['Rajdhani'] font-bold uppercase text-white" style={{ fontSize: '20px' }}>
              {games.length} GAMES
            </span>
          </div>

          <div className="p-2.5 grid gap-2 flex-1 min-h-0">
            {games.map((game) => {
              const isLive = game.status === 'live';
              const isCompleted = game.status === 'completed';

              return (
                <div
                  key={game.id}
                  className={`rounded-md border px-2 py-1.5 ${
                    isLive
                      ? 'bg-red-950/35 border-[#e5383b]/75 shadow-[0_0_16px_rgba(229,56,59,0.25)]'
                      : 'bg-[#0d1129]/72 border-white/12'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-2 flex-1">
                      {isLive ? (
                        <Flame className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-cyan-300 shrink-0" />
                      )}
                      <span className="font-['Rajdhani'] font-black text-white uppercase truncate" style={{ fontSize: '21px' }}>
                        {game.name}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded font-['Rajdhani'] font-black uppercase shrink-0 ${
                        isLive
                          ? 'bg-[#e5383b] text-white'
                          : isCompleted
                          ? 'bg-[#f5b301]/25 text-[#ffe4a5] border border-[#f5b301]/45'
                          : 'bg-white/12 text-slate-100'
                      }`}
                      style={{ fontSize: '13px' }}
                    >
                      {isLive ? 'LIVE' : isCompleted ? 'DONE' : 'UPCOMING'}
                    </span>
                  </div>

                  <div className="font-['Rajdhani'] font-bold uppercase text-slate-300 truncate" style={{ fontSize: '14px' }}>
                    {game.scheduledTime} · {game.venue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="rounded-xl border-2 overflow-hidden flex flex-col min-h-0"
          style={{ borderColor: `${SECTION.spotlight.accent}80`, backgroundColor: SECTION.spotlight.tint }}
        >
          <div
            className="h-14 px-4 flex items-center justify-between border-t-4"
            style={{ backgroundColor: SECTION.spotlight.bar, borderTopColor: SECTION.spotlight.accent }}
          >
            <div className="flex items-center gap-3 text-white">
              <Users className="w-6 h-6" />
              <span className="font-['Rajdhani'] font-bold uppercase tracking-[0.06em]" style={{ fontSize: '40px', lineHeight: 1 }}>
                TEAM SPOTLIGHT
              </span>
            </div>
            <div className="w-20 h-1.5 bg-black/35 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90"
                style={{ width: `${teamSpotlightProgress * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 flex-1 min-h-0">
            {!activeSpotlightTeam ? (
              <div className="rounded-lg border border-white/10 bg-[#070A1E]/70 h-full flex items-center justify-center">
                <p className="text-white/80 font-['Rajdhani'] font-black uppercase" style={{ fontSize: '26px' }}>
                  Team Data Not Available
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-white/15 bg-[#0d1129]/72 p-3 h-full flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamCrest team={activeSpotlightTeam} size="md" />
                    <div className="min-w-0">
                      <div className="font-['Rajdhani'] font-black uppercase text-white truncate" style={{ fontSize: '30px', lineHeight: 1 }}>
                        {activeSpotlightTeam.name}
                      </div>
                      <div className="font-['Rajdhani'] font-bold uppercase text-slate-300" style={{ fontSize: '14px' }}>
                        Captain: {activeSpotlightTeam.captain} · Vice Captain: {activeSpotlightTeam.viceCaptain}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 overflow-hidden flex-1 content-start auto-rows-min">
                  {activeSpotlightMembers.map((memberName, idx) => (
                    <div key={`${activeSpotlightTeam.id}-${idx}`} className="min-w-0 px-2 py-0.5 rounded bg-black/35 border border-white/10">
                      <span className="font-['Rajdhani'] font-black text-white uppercase truncate block" style={{ fontSize: '16px' }}>
                        {memberName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
