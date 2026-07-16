import React from 'react';
import { HomeHeader } from './HomeHeader';
import { HomeHero } from './HomeHero';
import { HomeOverview } from './HomeOverview';
import { ContinueWatching } from './ContinueWatching';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-dashboard">
      <HomeHeader />
      <HomeHero />
      <HomeOverview />
      <ContinueWatching />
    </div>
  );
};
