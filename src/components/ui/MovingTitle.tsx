import React, { useEffect, useState } from 'react';
import './css/MovingTitle.css';

interface MovingTitleProps {
  title: string;
  maxLength?: number;
  className?: string;
}

export const MovingTitle: React.FC<MovingTitleProps> = ({ title, maxLength = 25, className = '' }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (title.length > maxLength) {
      setShouldAnimate(true);
    } else {
      setShouldAnimate(false);
    }
  }, [title, maxLength]);

  return (
    <div className={`moving-title-wrapper ${className}`}>
      <div className={`moving-title-content ${shouldAnimate ? 'is-moving' : ''}`}>
        <span className="moving-title-text">{title}</span>
        {shouldAnimate && <span className="moving-title-text duplicate-text">{title}</span>}
      </div>
    </div>
  );
};
