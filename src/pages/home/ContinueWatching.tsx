import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const ContinueWatching: React.FC = () => {
  const navigate = useNavigate();

  // Placeholder data
  const items = [
    { title: "Frieren", subtitle: "Continue from Episode 18" },
    { title: "One Piece", subtitle: "Continue from Episode 1136" },
    { title: "Trigun", subtitle: "Continue from Episode 2" },
  ];

  return (
    <div className="home-section">
      <div className="home-section-title-bar">
        <div className="home-section-title">Continue Watching</div>
        <div className="home-section-action" onClick={() => navigate(ROUTES.SHOWS)}>
          View All →
        </div>
      </div>
      
      <div className="continue-watching-list">
        {items.map((item, i) => (
          <div key={i} className="continue-watching-item">
            <div className="cw-item-left">
              <div className="cw-icon-wrapper">
                <Play className="cw-icon" size={16} fill="currentColor" />
              </div>
              <div className="cw-item-info">
                <div className="cw-item-title">{item.title}</div>
                <div className="cw-item-subtitle">{item.subtitle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
