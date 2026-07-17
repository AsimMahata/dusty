import React from 'react';
import { Overview } from './Overview';
import { Storage } from './Storage';

export const HomeOverview: React.FC = () => {
  return (
    <div className="home-overview-row">
      <Overview />
      <Storage />
    </div>
  );
};
