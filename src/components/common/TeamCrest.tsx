import React from 'react';
import { Team } from '../../types';
import { TEAM_STYLES } from '../../theme/theme';

interface TeamCrestProps {
  team: Team;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  glow?: boolean;
}

export const TeamCrest: React.FC<TeamCrestProps> = ({
  team,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
    '2xl': 'w-48 h-48',
  };

  const dim = sizeMap[size] || sizeMap.md;
  const style = TEAM_STYLES[team.id] || {
    characterName: team.name,
    primaryColor: team.color || '#F59E0B',
    secondaryColor: team.secondaryColor || '#EA580C',
    accentColor: '#FFFFFF',
    glowColor: 'rgba(245, 158, 11, 0.5)',
  };

  const primary = style.primaryColor;
  const secondary = style.secondaryColor;

  const renderEmblemSymbol = () => {
    switch (team.code) {
      case 'A': // Pardus - Panther / Leopard
        return (
          <g>
            {/* Angular Cyber Leopard / Panther Silhouette */}
            <circle cx="52" cy="48" r="28" fill={primary} opacity="0.12" />
            {/* Sleek Feline Head Shape */}
            <path
              d="M32 30 C28 20 76 20 72 30 L76 56 C76 72 52 84 52 84 C52 84 28 72 28 56 Z"
              fill="#10152B"
              stroke={primary}
              strokeWidth="2.5"
            />
            {/* Pointed Ears */}
            <polygon points="26,32 32,16 42,28" fill={primary} />
            <polygon points="78,32 72,16 62,28" fill={primary} />
            <polygon points="30,29 33,20 38,27" fill="#FFFFFF" />
            <polygon points="74,29 71,20 66,27" fill="#FFFFFF" />
            {/* Piercing Angled Eyes */}
            <polygon points="38,44 48,46 42,49" fill="#FFF" />
            <polygon points="66,44 56,46 62,49" fill="#FFF" />
            <circle cx="43" cy="46" r="1.5" fill="#F59E0B" />
            <circle cx="61" cy="46" r="1.5" fill="#F59E0B" />
            {/* Geometric Snout & Energy Whiskers */}
            <polygon points="52,54 48,60 56,60" fill={primary} />
            <path d="M44 64 Q52 70 60 64" stroke="#FFF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <line x1="30" y1="56" x2="18" y2="54" stroke={primary} strokeWidth="1.5" />
            <line x1="30" y1="62" x2="20" y2="64" stroke={primary} strokeWidth="1.5" />
            <line x1="74" y1="56" x2="86" y2="54" stroke={primary} strokeWidth="1.5" />
            <line x1="74" y1="62" x2="84" y2="64" stroke={primary} strokeWidth="1.5" />
          </g>
        );

      case 'B': // Falcon Fury - Supersonic Falcon
        return (
          <g>
            <circle cx="52" cy="48" r="28" fill={primary} opacity="0.12" />
            {/* Razor Aerodynamic Wings */}
            <path
              d="M52 18 L68 36 L92 30 L76 54 L92 58 L72 72 L78 86 L52 72 L26 86 L32 72 L12 58 L28 54 L12 30 L36 36 Z"
              fill={primary}
            />
            {/* Inner Wing Feathers */}
            <path d="M52 25 L62 46 L76 44 L64 60 L74 62 L52 80 L30 62 L40 60 L28 44 L42 46 Z" fill="#0C1535" />
            {/* Falcon Head Profile */}
            <circle cx="52" cy="38" r="8" fill="#FFF" />
            <polygon points="56,38 70,44 56,47" fill="#F59E0B" />
            <circle cx="50" cy="36" r="2" fill="#060919" />
            <circle cx="50.5" cy="35.5" r="0.8" fill="#00F0FF" />
          </g>
        );

      case 'C': // Stormbreakers - Thor's Stormbreaker Battleaxe & Lightning
        return (
          <g>
            {/* Electric Storm Energy Core */}
            <circle cx="52" cy="50" r="30" stroke="#00F0FF" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.4" />
            {/* Thor's Stormbreaker Axe Head */}
            {/* Axe Blade (Curved right) */}
            <path
              d="M52 24 L76 16 C82 30 84 50 76 64 L52 56 Z"
              fill={primary}
              stroke="#FFF"
              strokeWidth="2"
            />
            {/* Hammer Blunt Head (Flat left) */}
            <polygon points="52,26 30,22 28,54 52,54" fill="#6B21A8" stroke={primary} strokeWidth="2" />
            {/* Central Axe Collar & Wooden Handle */}
            <rect x="49" y="18" width="6" height="66" rx="2" fill="#3B2616" stroke="#D4A017" strokeWidth="1" />
            {/* Glowing Lightning Energy Bolts around Axe */}
            <polygon points="52,14 42,32 50,32 44,52 64,30 54,30" fill="#00F0FF" stroke="#FFF" strokeWidth="1" />
            <circle cx="52" cy="40" r="3" fill="#FFF" />
          </g>
        );

      case 'D': // Tiger Ka Hukum - Imperial Roaring Tiger
        return (
          <g>
            <circle cx="52" cy="48" r="28" fill={primary} opacity="0.15" />
            {/* Powerful Tiger Head Contour */}
            <path
              d="M26 36 C20 48 24 68 34 78 C42 86 62 86 70 78 C80 68 84 48 78 36 C72 24 32 24 26 36 Z"
              fill="#180C14"
              stroke={primary}
              strokeWidth="2.5"
            />
            {/* Tiger Ears */}
            <polygon points="24,36 18,18 34,26" fill={secondary} />
            <polygon points="80,36 86,18 70,26" fill={secondary} />
            <circle cx="26" cy="27" r="3" fill="#FFF" />
            <circle cx="78" cy="27" r="3" fill="#FFF" />
            {/* Tiger War Stripes */}
            <path d="M52 22 L52 36" stroke={primary} strokeWidth="3" strokeLinecap="round" />
            <path d="M44 26 L60 26" stroke={primary} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M28 46 L38 48" stroke={primary} strokeWidth="3" strokeLinecap="round" />
            <path d="M76 46 L66 48" stroke={primary} strokeWidth="3" strokeLinecap="round" />
            <path d="M30 58 L42 56" stroke={primary} strokeWidth="3" strokeLinecap="round" />
            <path d="M74 58 L62 56" stroke={primary} strokeWidth="3" strokeLinecap="round" />
            {/* Piercing Glowing Tiger Eyes */}
            <ellipse cx="40" cy="48" rx="4" ry="2.5" fill="#FFF" />
            <ellipse cx="64" cy="48" rx="4" ry="2.5" fill="#FFF" />
            <circle cx="41" cy="48" r="1.8" fill="#EF4444" />
            <circle cx="63" cy="48" r="1.8" fill="#EF4444" />
            {/* Snout & Deadly White Fangs */}
            <polygon points="48,58 56,58 52,64" fill="#000" />
            <polygon points="44,66 46,74 48,66" fill="#FFF" />
            <polygon points="56,66 58,74 60,66" fill="#FFF" />
          </g>
        );

      default:
        return (
          <text
            x="52"
            y="64"
            textAnchor="middle"
            fill={primary}
            fontSize="34"
            fontWeight="bold"
            fontFamily="'Rajdhani', sans-serif"
          >
            {team.code}
          </text>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      style={{
        filter: glow ? `drop-shadow(0 0 16px ${primary}80)` : undefined,
      }}
    >
      <svg
        viewBox="0 0 104 104"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-crest-rim-${team.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor={primary} />
            <stop offset="70%" stopColor={secondary} />
            <stop offset="100%" stopColor="#0B0F28" />
          </linearGradient>
          <linearGradient id={`grad-crest-bg-${team.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B234A" />
            <stop offset="50%" stopColor="#0F1433" />
            <stop offset="100%" stopColor="#06091A" />
          </linearGradient>
        </defs>

        {/* Outer Angular Shield Frame */}
        <polygon
          points="52,4 94,18 86,72 52,98 18,72 10,18"
          fill={`url(#grad-crest-bg-${team.id})`}
          stroke={`url(#grad-crest-rim-${team.id})`}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Laser Inset */}
        <polygon
          points="52,10 88,22 81,68 52,91 23,68 16,22"
          fill="#060A1F"
          stroke={primary}
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />

        {/* Team Symbol */}
        {renderEmblemSymbol()}

        {/* Team Ribbon at Bottom */}
        <g transform="translate(0, 10)">
          <path
            d="M34 82 L70 82 L64 91 L52 95 L40 91 Z"
            fill="#090E26"
            stroke={primary}
            strokeWidth="1.5"
          />
          <text
            x="52"
            y="90"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="7"
            fontWeight="900"
            letterSpacing="0.1em"
            fontFamily="'Rajdhani', sans-serif"
          >
            TEAM {team.code}
          </text>
        </g>
      </svg>
    </div>
  );
};
