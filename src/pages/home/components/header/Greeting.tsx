import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';
import { GREETING_THRESHOLDS } from '../../constants/constants';

export const Greeting: React.FC = () => {
    const { profile } = useHomeContext();

    const getGreeting = () => {
        const hour = new Date().getHours();
        return GREETING_THRESHOLDS.find(g => hour < g.maxHour) || GREETING_THRESHOLDS[GREETING_THRESHOLDS.length - 1];
    };

    const { text, emoji } = getGreeting();

    return (
        <div className="home-greeting">
            <span style={{ fontSize: '32px', marginRight: '12px' }}>{emoji}</span>
            {text}, {profile.name}.
        </div>
    );
};
