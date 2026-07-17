import React from 'react';
import { useDusty } from '../../../../contexts/DustyContext';

export const Quote: React.FC = () => {
  const { systemStatus } = useDusty();

  return (
    <div className="home-quote">
      <span className="quote-mark">“</span> {systemStatus}
    </div>
  );
};
