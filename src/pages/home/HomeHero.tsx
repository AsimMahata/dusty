import React from 'react';

export const HomeHero: React.FC = () => {
  return (
    <div className="home-hero-container">
      <div className="home-hero-banner">
        <img className="home-hero-bg" src="/banner.jpg" alt="Daily Banner" />
        <div className="home-hero-overlay"></div>
        <div className="home-brand-logo-container">
          <img className="home-brand-logo" src="/icon.png" alt="Dusty Logo" />
          <div className="home-brand-name">Dusty</div>
        </div>
      </div>
    </div>
  );
};
