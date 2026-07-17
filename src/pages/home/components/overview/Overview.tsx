import React from 'react';
import { StatsGrid } from './StatsGrid';

export const Overview: React.FC = () => {
  return (
    <div className="home-card overview-card">
      <div className="home-card-header">
        <span className="home-card-title">Overview</span>
      </div>
      <StatsGrid />
    </div>
  );
};
