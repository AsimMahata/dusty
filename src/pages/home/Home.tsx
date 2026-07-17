import React from 'react';
import { HomeHeader } from './components/header/HomeHeader';
import { HomeHero } from './components/hero/HomeHero';
import { HomeOverview } from './components/overview/HomeOverview';
import { ContinueWatching } from './components/continue-watching/ContinueWatching';
import './css/Home.css';

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
