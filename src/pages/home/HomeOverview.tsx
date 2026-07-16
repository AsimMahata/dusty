import React from 'react';
import { Tv, FolderCode, Music, Film } from 'lucide-react';

export const HomeOverview: React.FC = () => {
  // Placeholder stats
  const stats = [
    { label: "Shows", value: 531, icon: <Tv size={24} /> },
    { label: "Projects", value: 35, icon: <FolderCode size={24} /> },
    { label: "Songs", value: 2410, icon: <Music size={24} /> },
    { label: "Videos", value: 486, icon: <Film size={24} /> },
  ];

  return (
    <div className="home-overview-row">
      <div className="home-section">
        <div className="home-section-title-bar">
          <div className="home-section-title">Overview</div>
        </div>
        <div className="overview-grid">
          {stats.map((stat, i) => (
            <div key={i} className="overview-item">
              <div className="overview-item-icon">
                {stat.icon}
              </div>
              <div className="overview-item-text">
                <span className="overview-item-value">{stat.value}</span>
                <span className="overview-item-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-section">
        <div className="home-section-title-bar">
          <div className="home-section-title">Storage</div>
        </div>
        <div className="storage-container">
          <div className="storage-bar-wrapper">
            <div className="storage-bar-bg">
              {/* Dynamic color could be based on percentage later. Using accent for now. */}
              <div className="storage-bar-fill" style={{ width: '66%', background: 'linear-gradient(90deg, #10b981, #f59e0b)' }}></div>
            </div>
          </div>
          <div className="storage-stats">
            <div className="storage-stat-line">
              <span className="storage-stat-value">1.2 TB</span> Used
            </div>
            <div className="storage-stat-line">
              <span className="storage-stat-value">600 GB</span> Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
