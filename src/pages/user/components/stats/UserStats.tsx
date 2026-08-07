import React from 'react';
import { ACTIVITY_ICON_18 } from '../../../../constants/icon';

export const UserStats: React.FC = () => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        {React.cloneElement(ACTIVITY_ICON_18, { className: 'card-header-icon' })}
        <h3>Statistics</h3>
      </div>
      <div className="stats-subgrid">
        <div className="stat-item">
          <div className="stat-number">0</div>
          <div className="stat-desc">Files Shared</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">0 GB</div>
          <div className="stat-desc">Transferred</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">0</div>
          <div className="stat-desc">Parties Hosted</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">0</div>
          <div className="stat-desc">Parties Joined</div>
        </div>
      </div>
    </div>
  );
};
