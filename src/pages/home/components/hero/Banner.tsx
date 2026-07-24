import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';

export const Banner: React.FC = () => {
    const { heroBanner, heroLogo } = useHomeContext();

    const getDailyBanner = () => {
        if (!heroBanner || heroBanner.length === 0) return '';
        const date = new Date().getDate();
        const index = date % heroBanner.length;
        return heroBanner[index];
    };

    return (
        <div className="home-hero-banner">
            <img className="home-hero-bg" src={getDailyBanner()} alt="Daily Banner" draggable={false} />
            <div className="home-hero-overlay"></div>
            <div className="home-brand-logo-container">
                <img className="home-brand-logo" src={heroLogo} alt="Dusty Logo" draggable={false} />
            </div>
        </div>
    );
};
