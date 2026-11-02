import React from 'react';

interface CarnivalEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  glow?: boolean;
}

export const CarnivalEmblem: React.FC<CarnivalEmblemProps> = ({
  size = 'md',
  className = '',
  glow = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
  };

  const dim = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      style={{
        filter: glow ? 'drop-shadow(0 0 18px rgba(0, 240, 255, 0.55))' : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="emblemCyberBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2756" />
            <stop offset="50%" stopColor="#0F1435" />
            <stop offset="100%" stopColor="#070A1E" />
          </linearGradient>
          <linearGradient id="emblemCyberRim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#FFB800" />
          </linearGradient>
          <linearGradient id="emblemFlame" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
        </defs>

        {/* Outer Angular Shield */}
        <polygon
          points="50,4 92,18 84,72 50,96 16,72 8,18"
          fill="url(#emblemCyberBg)"
          stroke="url(#emblemCyberRim)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Inner Tech Inset */}
        <polygon
          points="50,10 86,22 79,68 50,90 21,68 14,22"
          fill="#060919"
          stroke="#00F0FF"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* Angular Geometric Falcon / Energy Wings */}
        <path
          d="M50 20 L66 38 L84 32 L72 54 L86 58 L68 70 L50 84 L32 70 L14 58 L28 54 L16 32 L34 38 Z"
          fill="url(#emblemFlame)"
          opacity="0.95"
        />

        {/* Central Core Star & LV Monogram */}
        <polygon points="50,30 55,42 67,42 57,50 61,62 50,54 39,62 43,50 33,42 45,42" fill="#FFFFFF" />
        <circle cx="50" cy="46" r="4" fill="#00F0FF" />
        
        {/* Championship Ribbon */}
        <path d="M30 82 L70 82 L64 91 L50 95 L36 91 Z" fill="#0D1129" stroke="#FFB800" strokeWidth="1.5" />
        <text
          x="50"
          y="89"
          textAnchor="middle"
          fill="#FFB800"
          fontSize="7"
          fontWeight="900"
          letterSpacing="0.1em"
          fontFamily="Rajdhani, sans-serif"
        >
          LV CARNIVAL
        </text>
      </svg>
    </div>
  );
};
