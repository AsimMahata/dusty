import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';

export const Storage: React.FC = () => {
  const { storageInfo } = useHomeContext();
  
  return (
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
          <span className="storage-used"><strong>{storageInfo.used}</strong> / {storageInfo.total} Used</span>
          <span className="storage-free">{storageInfo.free} Free</span>
        </div>
      </div>
    </div>
  );
};
