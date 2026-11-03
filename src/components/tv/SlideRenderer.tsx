import React from 'react';
import { SlideId } from '../../types';
import { HeroSlide } from './slides/HeroSlide';
import { TeamsOverviewSlide } from './slides/TeamsOverviewSlide';
import { TeamRosterSlide } from './slides/TeamRosterSlide';
import { ScheduleSlide } from './slides/ScheduleSlide';
import { FixturesSlide } from './slides/FixturesSlide';
import { LeaderboardSlide } from './slides/LeaderboardSlide';
import { ResultsSlide } from './slides/ResultsSlide';
import { AnnouncementsSlide } from './slides/AnnouncementsSlide';

interface SlideRendererProps {
  slideId: SlideId;
  isPaused?: boolean;
  onFixturesComplete?: () => void;
  onFixturesProgress?: (ratio: number) => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slideId,
  isPaused = false,
  onFixturesComplete,
  onFixturesProgress,
}) => {
  switch (slideId) {
    case 'hero':
      return <HeroSlide />;
    case 'teams_overview':
      return <TeamsOverviewSlide />;
    case 'team_a':
      return <TeamRosterSlide teamId="team-a" />;
    case 'team_b':
      return <TeamRosterSlide teamId="team-b" />;
    case 'team_c':
      return <TeamRosterSlide teamId="team-c" />;
    case 'team_d':
      return <TeamRosterSlide teamId="team-d" />;
    case 'schedule':
      return <ScheduleSlide />;
    case 'fixtures':
      return (
        <FixturesSlide
          isPaused={isPaused}
          onComplete={onFixturesComplete}
          onProgress={onFixturesProgress}
        />
      );
    case 'leaderboard':
      return <LeaderboardSlide />;
    case 'results':
      return <ResultsSlide />;
    case 'announcements':
      return <AnnouncementsSlide />;
    default:
      return <HeroSlide />;
  }
};
