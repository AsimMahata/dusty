import React from 'react';
import { HomeHeader } from './components/header/HomeHeader';
import { HomeHero } from './components/hero/HomeHero';
import { HomeOverview } from './components/overview/HomeOverview';
import { ContinueWatching } from './components/continue-watching/ContinueWatching';
import { HomeProvider } from './contexts/HomeContext';
import './css/Home.css';

export const Home: React.FC = () => {
  return (
    <HomeProvider>
      <div className="home-dashboard">
        <HomeHeader />
        <HomeHero />
        <HomeOverview />
        <ContinueWatching />
      </div>
    </HomeProvider>
  );
};
