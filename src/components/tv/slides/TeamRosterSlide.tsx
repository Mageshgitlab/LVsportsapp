import React from 'react';
import { useCarnivalStore } from '../../../store/carnivalStore';
import { TeamId } from '../../../types';
import { TeamCrest } from '../../common/TeamCrest';
import { MemberAvatar } from '../../common/MemberAvatar';
import { TEAM_STYLES } from '../../../theme/theme';
import { Flame, Sparkles, Users, Swords, Trophy, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface TeamRosterSlideProps {
  teamId: TeamId;
}

export const TeamRosterSlide: React.FC<TeamRosterSlideProps> = ({ teamId }) => {
  const { data } = useCarnivalStore();
  const team = data.teams.find((t) => t.id === teamId);
  const teamMembers = data.members.filter((m) => m.teamId === teamId);

  if (!team) return null;

  const style = TEAM_STYLES[team.id] || {
    characterName: team.name,
    themeStyle: 'Vanguard',
    primaryColor: team.color,
    secondaryColor: team.secondaryColor,
    glowColor: 'rgba(0, 240, 255, 0.4)',
    tagline: team.name,
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between px-8 py-5 bg-gradient-to-b from-[#070A1E] via-[#0B0F2A] to-[#050716] overflow-hidden">
      {/* Background ambient lighting matching team primary accent */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 pointer-events-none"
        style={{ backgroundColor: style.primaryColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{ backgroundColor: style.secondaryColor }}
      />

      {/* Slide Top Bar */}
      <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3 relative z-10 shrink-0">
        <div className="flex items-center gap-4">
          <span
            className="px-3.5 py-1 rounded font-black font-['Rajdhani'] text-slate-950 uppercase tracking-widest shadow-md"
            style={{ backgroundColor: style.primaryColor, fontSize: 'var(--fs-badge, 24px)' }}
          >
            TEAM {team.code} · {style.characterName.toUpperCase()}
          </span>
          <h2
            className="font-black text-white font-['Rajdhani'] uppercase tracking-wider"
            style={{ fontSize: 'var(--fs-section, 58px)', lineHeight: 1.1 }}
          >
            {team.name}
          </h2>
          <span
            className="text-cyan-300 font-bold font-['Rajdhani']"
            style={{ fontSize: 'var(--fs-row, 36px)' }}
          >
            · {style.tagline}
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1129] border border-cyan-500/30 text-slate-300 font-bold uppercase tracking-wider font-['Rajdhani']"
          style={{ fontSize: 'var(--fs-row, 36px)' }}
        >
          <Users className="w-6 h-6" style={{ color: style.primaryColor }} />
          <span>
            Active Athletes:{' '}
            <strong className="text-white font-mono">{teamMembers.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Content Split: Left Pillar (Captain/Vice) & Right Roster Grid */}
      <div className="grid grid-cols-12 gap-7 flex-1 my-3 relative z-10 items-stretch min-h-0">
        {/* Left Column: 4 cols - Team Emblem & Captain Spotlight */}
        <div
          className="col-span-4 flex flex-col justify-between bg-[#0D1129]/95 border-2 rounded-xl p-5 backdrop-blur-md shadow-2xl h-full"
          style={{ borderColor: `${style.primaryColor}80` }}
        >
          {/* Emblem & Branding */}
          <div className="flex flex-col items-center text-center pb-3 border-b border-white/10">
            <TeamCrest team={team} size="xl" glow={true} />
            <h3
              className="font-black text-white font-['Rajdhani'] mt-2 tracking-wider"
              style={{ fontSize: 'var(--fs-subheading, 48px)', lineHeight: 1.1 }}
            >
              {team.name}
            </h3>
            <p
              className="font-bold text-amber-400 uppercase tracking-widest font-['Rajdhani'] mt-0.5"
              style={{ fontSize: '20px' }}
            >
              {style.tagline}
            </p>
          </div>

          {/* Captain & Vice Captain Spotlight */}
          <div className="space-y-3 py-2">
            {/* Captain Card */}
            <div className="p-3.5 rounded-lg bg-[#070A1E] border border-amber-500/40 flex items-center gap-3.5 shadow-md">
              <MemberAvatar
                name={team.captain}
                color={style.primaryColor}
                role="captain"
                size="md"
                jerseyNumber={1}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="flex items-center gap-1.5 font-black uppercase tracking-wider text-amber-400 font-['Rajdhani']"
                  style={{ fontSize: 'var(--fs-badge, 24px)' }}
                >
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>Captain</span>
                </div>
                <div
                  className="font-black text-white truncate font-['Rajdhani'] mt-0.5"
                  style={{ fontSize: 'var(--fs-name, 40px)', lineHeight: 1.1 }}
                >
                  {team.captain}
                </div>
                <div
                  className="text-slate-400 font-semibold font-['Rajdhani']"
                  style={{ fontSize: '20px' }}
                >
                  Squad Leader
                </div>
              </div>
            </div>

            {/* Vice Captain Card */}
            <div className="p-3.5 rounded-lg bg-[#070A1E] border border-cyan-500/30 flex items-center gap-3.5 shadow-md">
              <MemberAvatar
                name={team.viceCaptain}
                color={style.primaryColor}
                role="vice-captain"
                size="md"
                jerseyNumber={2}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="flex items-center gap-1.5 font-black uppercase tracking-wider text-cyan-300 font-['Rajdhani']"
                  style={{ fontSize: 'var(--fs-badge, 24px)' }}
                >
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Vice Captain</span>
                </div>
                <div
                  className="font-black text-white truncate font-['Rajdhani'] mt-0.5"
                  style={{ fontSize: 'var(--fs-name, 40px)', lineHeight: 1.1 }}
                >
                  {team.viceCaptain}
                </div>
                <div
                  className="text-slate-400 font-semibold font-['Rajdhani']"
                  style={{ fontSize: '20px' }}
                >
                  Second in Command
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Team Banner */}
          <div
            className="p-3 bg-[#070A1E]/80 rounded text-center border border-white/10 font-['Rajdhani'] font-bold text-slate-300 tracking-wider"
            style={{ fontSize: '22px' }}
          >
            FACTION COLOR: <strong style={{ color: style.primaryColor }}>{team.color.toUpperCase()}</strong>
          </div>
        </div>

        {/* Right Area: 8 cols - Full Roster Grid (or Empty Squad State) */}
        <div className="col-span-8 flex flex-col justify-center">
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-hidden">
              {teamMembers.map((member, index) => {
                const isLeader = member.name === team.captain || member.name === team.viceCaptain;
                const roleType =
                  member.name === team.captain
                    ? 'captain'
                    : member.name === team.viceCaptain
                    ? 'vice-captain'
                    : 'player';

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: index * 0.02 }}
                    className="flex items-center gap-3.5 p-3 rounded-lg bg-[#0D1129]/95 border border-white/10 hover:border-cyan-400/60 transition-all shadow-md group"
                    style={{
                      borderLeftColor: style.primaryColor,
                      borderLeftWidth: '4px',
                    }}
                  >
                    <MemberAvatar
                      name={member.name}
                      color={style.primaryColor}
                      role={roleType}
                      jerseyNumber={member.jerseyNumber || index + 3}
                      size="md"
                    />

                    <div className="min-w-0 flex-1">
                      <div
                        className="font-extrabold text-white truncate group-hover:text-cyan-200 transition-colors font-['Rajdhani']"
                        style={{ fontSize: 'var(--fs-row, 36px)', lineHeight: 1.15 }}
                      >
                        {member.name}
                      </div>
                      <div className="font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                        {isLeader ? (
                          <span
                            className="font-black uppercase tracking-wider px-2 py-0.5 rounded font-['Rajdhani']"
                            style={{
                              backgroundColor: `${style.primaryColor}30`,
                              color: style.primaryColor,
                              fontSize: '18px',
                            }}
                          >
                            {roleType === 'captain' ? 'CAPTAIN' : 'VICE CAPTAIN'}
                          </span>
                        ) : (
                          <span
                            className="font-['Rajdhani'] text-slate-400 font-bold uppercase tracking-wider"
                            style={{ fontSize: '18px' }}
                          >
                            ATHLETE · #{member.jerseyNumber || index + 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Empty State: Squad to be announced */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center p-12 rounded-xl bg-[#0D1129]/80 border-2 border-dashed border-cyan-500/40 text-center space-y-4 shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-500/15 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 animate-pulse">
                <Users className="w-10 h-10" />
              </div>

              <div className="space-y-1.5 max-w-lg">
                <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-['Rajdhani']">
                  ROSTER STATUS
                </span>
                <h4 className="text-2xl font-black text-white font-['Rajdhani'] tracking-wider">
                  Squad to be announced
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-['Rajdhani'] font-medium">
                  Captain <strong className="text-white">{team.captain}</strong> and Vice Captain{' '}
                  <strong className="text-white">{team.viceCaptain}</strong> are finalizing the squad lineup.
                  Full roster details will appear upon verification.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 text-xs font-['Rajdhani'] text-amber-400 uppercase tracking-wider">
                <Swords className="w-4 h-4 text-amber-400" />
                <span>Roster configuration manageable in Admin Portal</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Kicker */}
      <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-[0.3em] font-['Rajdhani'] relative z-10 pb-1">
        PLAY WITH PASSION · WIN WITH HONOR
      </div>
    </div>
  );
};
