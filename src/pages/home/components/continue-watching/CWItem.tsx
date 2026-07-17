import React from 'react';
import { Play, MoreVertical } from 'lucide-react';
import type { MediaItem } from '../../../../contexts/DustyContext';

interface CWItemProps {
  item: MediaItem;
}

export const CWItem: React.FC<CWItemProps> = ({ item }) => {
  return (
    <div className="cw-item">
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
  );
};
