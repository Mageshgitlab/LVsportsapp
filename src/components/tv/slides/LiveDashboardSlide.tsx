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
    // Once an admin fixture exists, rotate only that configured fixture queue.
    // Do not append every upcoming game from the general schedule.
    const missingUpcomingGames = configured.length === 0 && legacyRoundFixtures.length === 0
      ? games
          .filter((game) => game.status === 'upcoming' && !configuredGameIds.has(game.id))
          .map((game) => ({
            id: `schedule-${game.id}`,
            gameId: game.id,
            gameName: game.name,
            fixtureDate: 'TBD',
            roundLabel: 'Tournament',
            status: game.status,
            notes: game.venue,
          }))
      : [];
    return [...configured, ...legacyRoundFixtures, ...missingUpcomingGames];
  }, [fixtures?.gameWiseFixtures, fixtures?.gameId, fixtures?.gameName, rounds, teams, games]);

  // Day labels are unknown, but configured fixture dates remain visible.
  const feedFixtures = gameWiseFixtures.filter((fixture) => fixture.status !== 'completed');
  const fixtureDateSections = [...new Set(
    feedFixtures
      .map((fixture) => fixture.fixtureDate)
      .filter((date) => date && date !== 'TBD')
  )]
    .sort()
    .map((date) => ({
      date,
      items: feedFixtures.filter((fixture) => fixture.fixtureDate === date),
    }));
  const adminFixtureTies = rounds.flatMap((round) =>
    round.ties.map((tie) => ({ ...tie, roundTitle: round.title }))
  );

  const activeSpotlightMembers = useMemo(() => {
    if (!activeSpotlightTeam) return [] as string[];
    return members
      .filter((member) => member.teamId === activeSpotlightTeam.id)
      .map((member) => member.name);
  }, [activeSpotlightTeam, members]);

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
              {feedFixtures.length} UPCOMING FIXTURES
            </span>
            <span className="text-white/90 font-['Rajdhani'] font-bold uppercase" style={{ fontSize: '16px' }}>
              {fixtureDateSections.length} SCHEDULED DATES · FULL QUEUE AUTO-ROTATES
            </span>
          </div>

          <div className="p-3 flex-1 min-h-0 flex flex-col justify-center gap-2">
            {fixtureDateSections.length > 0 && <div className="relative shrink-0 overflow-hidden rounded-lg border border-white/15 bg-[#0d1129]/72 py-1.5" aria-label="Upcoming fixtures by date">
              <div className="fixture-date-feed flex w-max items-center gap-2 px-2">
                {[...fixtureDateSections, ...fixtureDateSections].map((section, copyIndex) => (
                  <div key={`${section.date}-${copyIndex}`} className="flex h-8 items-center gap-2 rounded-md border border-cyan-400/30 bg-cyan-950/30 px-2.5 whitespace-nowrap">
                    <span className="font-['Rajdhani'] font-black text-cyan-300 uppercase" style={{ fontSize: '15px' }}>{section.date}</span>
                    <span className="text-white/50">•</span>
                    <span className="font-['Rajdhani'] font-black text-white uppercase" style={{ fontSize: '15px' }}>
                      {section.items.map((item) => item.gameName).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>}

            {adminFixtureTies.length > 0 && <div className="rounded-lg border border-amber-400/30 bg-[#0d1129]/80 p-2.5 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1">
                <span className="font-['Rajdhani'] font-black text-amber-300 uppercase" style={{ fontSize: '17px' }}>ADMIN FIXTURES</span>
                <span className="font-['Rajdhani'] font-bold text-slate-300 uppercase" style={{ fontSize: '15px' }}>
                  {fixtures?.gameName || 'Configured Sport'} · {adminFixtureTies.length} TIES
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {adminFixtureTies.map((tie) => {
                  const teamA = teams.find((team) => team.id === tie.teamAId);
                  const teamB = teams.find((team) => team.id === tie.teamBId);
                  return (
                    <div key={tie.id} className="flex items-center justify-between gap-2 rounded border border-white/10 bg-black/25 px-2 py-1">
                      <span className="font-['Rajdhani'] font-bold text-cyan-300 uppercase" style={{ fontSize: '14px' }}>{tie.roundTitle} · TIE {tie.tieNumber}</span>
                      <span className="font-['Rajdhani'] font-black text-white uppercase truncate" style={{ fontSize: '16px' }}>
                        {teamA?.name || 'Team A'} <span className="text-amber-300">VS</span> {teamB?.name || 'Team B'}
                      </span>
                    </div>
                  );
                })}
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
