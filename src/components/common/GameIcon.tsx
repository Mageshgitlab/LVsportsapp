import React from 'react';
import { Trophy, Activity } from 'lucide-react';

interface GameIconProps {
  icon: string;
  className?: string;
  size?: number;
}

export const GameIcon: React.FC<GameIconProps> = ({ icon, className = 'w-6 h-6', size = 24 }) => {
  const norm = (icon || '').toLowerCase();

  // 1. Carrom
  if (norm.includes('carrom')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="6" cy="6" r="1.2" fill="currentColor" />
        <circle cx="18" cy="6" r="1.2" fill="currentColor" />
        <circle cx="6" cy="18" r="1.2" fill="currentColor" />
        <circle cx="18" cy="18" r="1.2" fill="currentColor" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="12" cy="12" r="1.2" fill="#EF4444" stroke="none" />
      </svg>
    );
  }

  // 2. Foosball
  if (norm.includes('foosball') || norm.includes('table soccer')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <line x1="2" y1="9" x2="22" y2="9" strokeWidth="1.5" />
        <line x1="2" y1="15" x2="22" y2="15" strokeWidth="1.5" />
        <circle cx="8" cy="9" r="1.5" fill="#00F0FF" stroke="none" />
        <circle cx="16" cy="9" r="1.5" fill="#00F0FF" stroke="none" />
        <circle cx="12" cy="15" r="1.5" fill="#EF4444" stroke="none" />
        <circle cx="12" cy="12" r="2" fill="#FFF" stroke="none" />
      </svg>
    );
  }

  // 3. Cricket
  if (norm.includes('cricket')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M4 20 L14 10" />
        <path d="M12 8 L16 12 L18 10 L14 6 Z" fill="currentColor" fillOpacity="0.25" />
        <line x1="3" y1="21" x2="6" y2="18" strokeWidth="2.5" />
        <circle cx="18" cy="18" r="3" fill="#EF4444" stroke="#B91C1C" />
        <path d="M17 16 Q18 18 17 20" stroke="#FFF" strokeWidth="0.8" />
      </svg>
    );
  }

  // 4. Football / Soccer
  if (norm.includes('football') || norm.includes('soccer')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="9" />
        <polygon points="12,8 15,10 14,14 10,14 9,10" fill="currentColor" fillOpacity="0.3" />
        <line x1="12" y1="3" x2="12" y2="8" />
        <line x1="15" y1="10" x2="19.5" y2="8" />
        <line x1="14" y1="14" x2="18" y2="18" />
        <line x1="10" y1="14" x2="6" y2="18" />
        <line x1="9" y1="10" x2="4.5" y2="8" />
      </svg>
    );
  }

  // 5. Snooker / Billiards / Pool
  if (norm.includes('snooker') || norm.includes('billiards') || norm.includes('pool')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <line x1="3" y1="21" x2="15" y2="9" strokeWidth="2.5" />
        <line x1="2" y1="22" x2="6" y2="18" strokeWidth="3" />
        <circle cx="16" cy="6" r="2.5" fill="#EF4444" stroke="none" />
        <circle cx="19" cy="8" r="2.5" fill="#00F0FF" stroke="none" />
        <circle cx="14" cy="10" r="2.5" fill="#F59E0B" stroke="none" />
        <circle cx="18" cy="13" r="2.5" fill="#FFFFFF" stroke="none" />
      </svg>
    );
  }

  // 6. Volleyball
  if (norm.includes('volleyball')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3 C12 7 9 10 5 11" />
        <path d="M12 3 C14 8 18 10 21 9" />
        <path d="M21 14 C17 14 13 17 12 21" />
        <path d="M3 14 C7 14 10 17 11 21" />
      </svg>
    );
  }

  // 7. Badminton
  if (norm.includes('badminton')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        {/* Shuttlecock */}
        <path d="M12 4 L8 12 L16 12 Z" fill="currentColor" fillOpacity="0.25" />
        <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" />
        <line x1="9" y1="8" x2="15" y2="8" strokeWidth="1.5" />
        <circle cx="12" cy="14" r="2.5" fill="#F59E0B" stroke="none" />
        {/* Racket Handle Hint */}
        <line x1="16" y1="16" x2="21" y2="21" strokeWidth="2" />
      </svg>
    );
  }

  // 8. Chess
  if (norm.includes('chess')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M8 20 L16 20 M9 20 L9 17 C9 15 7 14 6 12 C5 10 7 7 11 6 C13 5 15 3 16 2 C16 4 17 6 15 8 C17 8 18 10 18 12 C18 15 15 17 15 20" />
        <circle cx="11" cy="9" r="1" fill="currentColor" />
      </svg>
    );
  }

  return <Trophy className={className} />;
};
