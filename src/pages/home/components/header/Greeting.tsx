import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';

export const Greeting: React.FC = () => {
  const { profile } = useHomeContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good Afternoon', emoji: '☀️' };
    return { text: 'Good Evening', emoji: '🌙' };
  };

  const { text, emoji } = getGreeting();

  return (
    <div className="home-greeting">
      <span style={{ fontSize: '32px', marginRight: '12px' }}>{emoji}</span>
      {text}, {profile.name}.
    </div>
  );
};
