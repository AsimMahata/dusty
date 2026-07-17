import React from 'react';
import { Banner } from './Banner';
import { Tagline } from './Tagline';

export const HomeHero: React.FC = () => {
  return (
    <div className="home-hero-container">
      <Banner />
      <Tagline />
    </div>
  );
};
