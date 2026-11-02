import React from 'react';
import { Crown, Star } from 'lucide-react';
import { THEME_COLORS } from '../../theme/theme';

interface MemberAvatarProps {
  name: string;
  color?: string;
  role?: 'captain' | 'vice-captain' | 'player';
  jerseyNumber?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  name,
  color = THEME_COLORS.neonCyan,
  role,
  jerseyNumber,
  size = 'md',
  showBadge = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isCaptain = role === 'captain';
  const isViceCaptain = role === 'vice-captain';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {/* High-Tech Character Select Portrait Frame */}
      <div
        className={`${sizeMap[size]} rounded-lg flex items-center justify-center font-black tracking-wider select-none relative overflow-hidden transition-all`}
        style={{
          background: `linear-gradient(135deg, rgba(20, 28, 70, 0.9) 0%, rgba(8, 11, 30, 0.95) 100%)`,
          border: `2px solid ${
            isCaptain
              ? '#FBBF24'
              : isViceCaptain
              ? '#38BDF8'
              : `${color}80`
          }`,
          color: '#FFFFFF',
          fontFamily: "'Rajdhani', sans-serif",
          boxShadow: isCaptain
            ? '0 0 16px rgba(251, 191, 36, 0.5), inset 0 0 8px rgba(251, 191, 36, 0.3)'
            : isViceCaptain
            ? '0 0 14px rgba(56, 189, 248, 0.4), inset 0 0 8px rgba(56, 189, 248, 0.2)'
            : `0 0 10px ${color}30`,
        }}
      >
        <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {getInitials(name)}
        </span>

        {jerseyNumber !== undefined && (
          <span
            className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/85 text-[9px] font-mono tabular-nums text-amber-300 font-bold border-tl border-white/20"
            style={{ fontSize: size === 'sm' ? '7px' : '9px' }}
          >
            #{jerseyNumber}
          </span>
        )}
      </div>

      {/* Captain Badge */}
      {showBadge && isCaptain && (
        <span
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg ring-2 ring-slate-900 font-black"
          title="Captain"
        >
          <Crown className="w-3 h-3 stroke-[2.5]" />
        </span>
      )}

      {/* Vice Captain Badge */}
      {showBadge && isViceCaptain && (
        <span
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-300 text-slate-950 flex items-center justify-center shadow-lg ring-2 ring-slate-900 font-black"
          title="Vice Captain"
        >
          <Star className="w-3 h-3 stroke-[2.5] fill-current" />
        </span>
      )}
    </div>
  );
};
