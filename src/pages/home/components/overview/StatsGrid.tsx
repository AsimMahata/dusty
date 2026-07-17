import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Folder, Music, Film } from 'lucide-react';
import { useDusty } from '../../../../contexts/DustyContext';
import { ROUTES } from '../../../../constants/routes';
import { StatBox } from './StatBox';

export const StatsGrid: React.FC = () => {
  const navigate = useNavigate();
  const { overviewStats } = useDusty();

  const getAllDisplayableStats = () => [
    {
      label: 'Shows',
      value: overviewStats.shows,
      icon: Tv,
      color: '#a78bfa',
      bgColor: 'rgba(167, 139, 250, 0.1)',
      route: ROUTES.SHOWS,
    },
    {
      label: 'Projects',
      value: overviewStats.projects,
      icon: Folder,
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.1)',
      route: ROUTES.PROJECTS,
    },
    {
      label: 'Songs',
      value: overviewStats.songs,
      icon: Music,
      color: '#f43f5e',
      bgColor: 'rgba(244, 63, 94, 0.1)',
      route: ROUTES.MUSIC,
    },
    {
      label: 'Videos',
      value: overviewStats.videos,
      icon: Film,
      color: '#60a5fa',
      bgColor: 'rgba(96, 165, 250, 0.1)',
      route: ROUTES.VIDEOS,
    }
  ];

  return (
    <div className="overview-stats-grid">
      {getAllDisplayableStats().map((stat, index) => (
        <StatBox
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
          onClick={() => navigate(stat.route)}
        />
      ))}
    </div>
  );
};
