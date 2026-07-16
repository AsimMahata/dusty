import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, MoreVertical, ArrowRight } from 'lucide-react';
import { useDusty } from '../../contexts/DustyContext';
import { ROUTES } from '../../constants/routes';

export const ContinueWatching: React.FC = () => {
  const navigate = useNavigate();
  const { continueWatching } = useDusty();

  return (
    <div className="home-card continue-watching-card">
      <div className="home-card-header">
        <span className="home-card-title">Continue Watching</span>
        <button className="view-all-btn" onClick={() => navigate(ROUTES.SHOWS)}>
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="cw-grid">
        {continueWatching.map(item => (
          <div key={item.id} className="cw-item">
            <div className="cw-image-container">
              <img src={item.image} alt={item.title} className="cw-image" />
              <div className="cw-play-overlay">
                <Play size={20} fill="currentColor" />
              </div>
              <div className="cw-progress-bar">
                <div className="cw-progress-fill" style={{ width: `${item.progressPercent}%` }}></div>
              </div>
            </div>
            <div className="cw-info">
              <div className="cw-text">
                <span className="cw-title">{item.title}</span>
                <span className="cw-subtitle">{item.subtitle}</span>
              </div>
              <button className="cw-menu-btn"><MoreVertical size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
