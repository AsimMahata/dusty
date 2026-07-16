import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Folder, Music, Film } from 'lucide-react';
import { useDusty } from '../../contexts/DustyContext';
import { ROUTES } from '../../constants/routes';

export const HomeOverview: React.FC = () => {
  const navigate = useNavigate();
  const { overviewStats, storageInfo } = useDusty();

  return (
    <div className="home-overview-row">
      <div className="home-card overview-card">
        <div className="home-card-header">
          <span className="home-card-title">Overview</span>
        </div>
        <div className="overview-stats-grid">
          
          <div className="stat-box" onClick={() => navigate(ROUTES.SHOWS)}>
            <div className="stat-icon-wrapper" style={{ color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)' }}>
              <Tv size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{overviewStats.shows}</span>
              <span className="stat-label">Shows</span>
            </div>
          </div>

          <div className="stat-box" onClick={() => navigate(ROUTES.PROJECTS)}>
            <div className="stat-icon-wrapper" style={{ color: '#34d399', background: 'rgba(52, 211, 153, 0.1)' }}>
              <Folder size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{overviewStats.projects}</span>
              <span className="stat-label">Projects</span>
            </div>
          </div>

          <div className="stat-box" onClick={() => navigate(ROUTES.MUSIC)}>
            <div className="stat-icon-wrapper" style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)' }}>
              <Music size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{overviewStats.songs}</span>
              <span className="stat-label">Songs</span>
            </div>
          </div>

          <div className="stat-box" onClick={() => navigate(ROUTES.VIDEOS)}>
            <div className="stat-icon-wrapper" style={{ color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)' }}>
              <Film size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{overviewStats.videos}</span>
              <span className="stat-label">Videos</span>
            </div>
          </div>

        </div>
      </div>

      <div className="home-card storage-card">
        <div className="home-card-header">
          <span className="home-card-title">Storage</span>
        </div>
        <div className="storage-content">
          <div className="storage-progress-bar">
            {storageInfo.segments.map((segment, index) => (
              <div key={index} className={`storage-segment ${segment.color}`} style={{ width: `${segment.percent}%` }}></div>
            ))}
          </div>
          <div className="storage-labels">
            <span className="storage-used"><strong>{storageInfo.used}</strong> Used</span>
            <span className="storage-free">{storageInfo.free}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
