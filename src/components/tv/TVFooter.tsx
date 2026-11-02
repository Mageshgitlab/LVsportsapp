import React from 'react';
import { useCarnivalStore, calculateLeaderboard } from '../../store/carnivalStore';
import { Trophy, Bell, Calendar, Swords, Flame, Sparkles } from 'lucide-react';
import { TEAM_STYLES } from '../../theme/theme';

export const TVFooter: React.FC = () => {
  const { data } = useCarnivalStore();
  const leaderboard = calculateLeaderboard(data.teams, data.games);
  const activeAnnouncements = data.announcements.filter((a) => a.active);
  const liveGames = data.games.filter((g) => g.status === 'live');
  const upcomingGames = data.games.filter((g) => g.status === 'upcoming');

  const tickerItems = (
    <div className="flex items-center gap-10 whitespace-nowrap shrink-0">
      {/* Standings block */}
      <div className="flex items-center gap-2">
        <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300 font-['Rajdhani']">
          CHAMPIONSHIP LEADERBOARD:
        </span>
      </div>

      {leaderboard.map((stat, idx) => {
        const teamStyle = TEAM_STYLES[stat.team.id];
        return (
          <div key={stat.team.id} className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-sm flex items-center justify-center text-xs font-black text-slate-950 font-['Rajdhani']"
              style={{ backgroundColor: teamStyle?.primaryColor || stat.team.color }}
            >
              #{idx + 1}
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-white font-['Rajdhani']">
              {stat.team.name}
            </span>
            <span className="text-xs font-black font-['Rajdhani'] tabular-nums text-amber-300">
              {stat.points} PTS
            </span>
            <span className="text-slate-600">/</span>
          </div>
        );
      })}

      {/* Live Match Alert */}
      {liveGames.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-0.5 bg-red-500/20 border border-red-500/50 rounded-sm">
          <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-wider text-red-200 font-['Rajdhani']">
            LIVE MATCH: {liveGames[0].name} ({liveGames[0].venue})
          </span>
          <span className="text-slate-600">/</span>
        </div>
      )}

      {/* Upcoming Highlight */}
      {upcomingGames.length > 0 && (
        <div className="flex items-center gap-2 text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-['Rajdhani']">
            NEXT FIXTURE:
          </span>
          <span className="text-xs font-bold text-white font-['Rajdhani']">
            {upcomingGames[0].name} · {upcomingGames[0].scheduledTime}
          </span>
          <span className="text-slate-600">/</span>
        </div>
      )}

      {/* Announcements */}
      {activeAnnouncements.length > 0 && (
        <div className="flex items-center gap-2 text-slate-300">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-slate-200 font-['Rajdhani']">
            {activeAnnouncements[0].message}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <footer className="h-[48px] w-full bg-[#070A1E] border-t border-cyan-500/20 flex items-center overflow-hidden z-20 shrink-0 relative shadow-2xl">
      {/* Fixed Left Badge */}
      <div className="h-full px-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 flex items-center gap-2 font-black text-xs uppercase tracking-widest text-white shrink-0 z-10 shadow-lg font-['Rajdhani'] border-r border-cyan-400/40">
        <Swords className="w-4 h-4 text-white animate-pulse" />
        <span>LIVE CARNIVAL FEED</span>
      </div>

      {/* Continuous Marquee Ticker */}
      <div className="flex-1 overflow-hidden relative flex items-center bg-[#050716]">
        <div className="flex items-center gap-10 animate-marquee text-sm">
          {tickerItems}
          {tickerItems}
        </div>
      </div>
    </footer>
  );
};
