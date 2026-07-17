import React from 'react';
import { useDusty } from '../../contexts/DustyContext';

export const HomeHero: React.FC = () => {
  const { heroBanner, heroLogo } = useDusty();
  return (
    <div className="home-hero-container">
      <div className="home-hero-banner">
        <img className="home-hero-bg" src={heroBanner} alt="Daily Banner" draggable={false}/>
        <div className="home-hero-overlay"></div>
        <div className="home-brand-logo-container">
          <img className="home-brand-logo" src={heroLogo} alt="Dusty Logo" draggable={false}/>
        </div>
      </div>
      <div className="home-brand-tagline">
        Your filesystem intelligence engine.
      </div>
    </div>
  );
};
