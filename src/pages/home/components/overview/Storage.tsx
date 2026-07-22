import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';

export const Storage: React.FC = () => {
  const { storageInfo } = useHomeContext();

  const usedPercent = storageInfo.segments.reduce((acc, segment) => acc + segment.percent, 0);
  const freePercent = 100 - usedPercent;

  let freeColor = '#34d399'; // Green (> 30% free)
  if (freePercent < 10) {
    freeColor = '#ef4444'; // Red (< 10% free)
  } else if (freePercent < 20) {
    freeColor = '#f97316'; // Orange (< 20% free)
  } else if (freePercent < 30) {
    freeColor = '#fbbf24'; // Yellow (< 30% free)
  }
  
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
          <span className="storage-free" style={{ color: freeColor }}>{storageInfo.free} Free</span>
        </div>
      </div>
    </div>
  );
};
