import React from 'react';
import { useHomeContext } from '../../contexts/HomeContext';

export const Quote: React.FC = () => {
  const { systemStatus } = useHomeContext();

  return (
    <div className="home-quote">
      <span className="quote-mark">“</span> {systemStatus}
    </div>
  );
};
