import React from 'react';
import { useCarnivalStore, calculateLeaderboard } from '../../store/carnivalStore';
import { Trophy, Bell, Swords, Skull } from 'lucide-react';
import { TEAM_STYLES } from '../../theme/theme';

export const TVFooter: React.FC = () => {
  const { data } = useCarnivalStore();
  const leaderboard = calculateLeaderboard(data.teams, data.games);
  const activeAnnouncements = data.announcements.filter((a) => a.active);

  const getTeam = (teamId?: string | null) => data.teams.find((team) => team.id === teamId);

  const resultGames = data.games
    .filter((game) => game.firstPlaceTeamId && game.secondPlaceTeamId)
    .slice()
    .reverse();

  const resultItems = resultGames.length
    ? resultGames.map((game) => {
        const first = getTeam(game.firstPlaceTeamId);
        const second = getTeam(game.secondPlaceTeamId);

        return (
          <div key={`result-${game.id}`} className="flex items-center gap-3 text-slate-100">
            <span
              className="px-2 py-0.5 rounded border border-amber-400/60 bg-amber-500/20 text-amber-300 font-black uppercase tracking-widest font-['Rajdhani']"
              style={{ fontSize: '20px' }}
            >
              RESULT
            </span>
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <span className="font-black uppercase tracking-wider font-['Rajdhani']" style={{ fontSize: '30px' }}>
              {game.name}
            </span>
            <span className="text-slate-500 font-black" style={{ fontSize: '30px' }}>·</span>
            <span className="font-bold text-slate-100 font-['Rajdhani']" style={{ fontSize: '30px' }}>
              1st
            </span>
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: TEAM_STYLES[first?.id || '']?.primaryColor || first?.color || '#F59E0B' }}
            />
            <span className="font-black text-white font-['Rajdhani']" style={{ fontSize: '30px' }}>
              {first?.name || 'TBD'} (10 pts)
            </span>
            <span className="text-slate-500 font-black" style={{ fontSize: '30px' }}>·</span>
            <span className="font-bold text-slate-100 font-['Rajdhani']" style={{ fontSize: '30px' }}>
              2nd
            </span>
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: TEAM_STYLES[second?.id || '']?.primaryColor || second?.color || '#00F0FF' }}
            />
            <span className="font-black text-white font-['Rajdhani']" style={{ fontSize: '30px' }}>
              {second?.name || 'TBD'} (5 pts)
            </span>
          </div>
        );
      })
    : [
        <div key="result-empty" className="flex items-center gap-3 text-slate-100">
          <span
            className="px-2 py-0.5 rounded border border-amber-400/60 bg-amber-500/20 text-amber-300 font-black uppercase tracking-widest font-['Rajdhani']"
            style={{ fontSize: '20px' }}
          >
            RESULT
          </span>
          <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
          <span className="font-bold text-slate-200 font-['Rajdhani']" style={{ fontSize: '30px' }}>
            Results will appear here after each game · 1st place 10 pts · 2nd place 5 pts
          </span>
        </div>,
      ];

  const standingsItems = leaderboard.map((stat, idx) => (
    <div key={`standing-${stat.team.id}`} className="flex items-center gap-3">
      <span
        className="px-2 py-0.5 rounded border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-black uppercase tracking-widest font-['Rajdhani']"
        style={{ fontSize: '20px' }}
      >
        STANDINGS
      </span>
      <span
        className="w-8 h-8 rounded flex items-center justify-center font-black text-slate-950 font-['Rajdhani']"
        style={{
          backgroundColor: TEAM_STYLES[stat.team.id]?.primaryColor || stat.team.color,
          fontSize: '22px',
        }}
      >
        #{idx + 1}
      </span>
      <span className="font-black uppercase tracking-wider text-white font-['Rajdhani']" style={{ fontSize: '30px' }}>
        {stat.team.name}
      </span>
      <span className="font-black text-amber-300 font-['Rajdhani']" style={{ fontSize: '30px' }}>
        {stat.points} PTS
      </span>
    </div>
  ));

  const announcementItems = activeAnnouncements.length
    ? activeAnnouncements.map((announcement) => (
        <div key={`announcement-${announcement.id}`} className="flex items-center gap-3 text-slate-100">
          <span
            className="px-2 py-0.5 rounded border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-black uppercase tracking-widest font-['Rajdhani']"
            style={{ fontSize: '20px' }}
          >
            BULLETIN
          </span>
          <Bell className="w-6 h-6 text-cyan-300 shrink-0" />
          <span className="font-bold text-slate-100 font-['Rajdhani']" style={{ fontSize: '30px' }}>
            {announcement.message}
          </span>
        </div>
      ))
    : [];

  const feedItems = [...standingsItems, ...resultItems, ...announcementItems];

  const tickerItems = (
    <div className="flex items-center gap-8 whitespace-nowrap shrink-0">
      {feedItems.map((item, index) => (
        <React.Fragment key={`feed-item-${index}`}>
          {item}
          <span className="arena-feed-separator flex items-center gap-1" style={{ fontSize: '24px' }}>
            <Trophy className="w-4 h-4" />
            <span>|</span>
            <Skull className="w-4 h-4" />
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <footer className="h-[68px] w-full bg-[#13100f] border-t-2 border-[#d4a017]/35 flex items-center overflow-hidden z-20 shrink-0 relative shadow-2xl">
      <div className="h-full px-6 bg-gradient-to-r from-[#6a151a] via-[#9d2028] to-[#c13a1e] flex items-center gap-3 font-black uppercase tracking-widest text-white shrink-0 z-10 shadow-lg font-['Rajdhani'] border-r border-[#d4a017]/40">
        <Swords className="w-6 h-6 text-white animate-pulse" />
        <span style={{ fontSize: 'var(--fs-badge, 24px)' }}>CARNIVAL FEED</span>
      </div>

      <div className="flex-1 overflow-hidden relative flex items-center bg-[#0b0b0d] h-full">
        <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#0b0b0d] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#0b0b0d] to-transparent z-10 pointer-events-none" />
        <div className="flex items-center gap-10 animate-marquee pl-6">
          {tickerItems}
          {tickerItems}
        </div>
      </div>
    </footer>
  );
};
