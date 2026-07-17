import React from 'react';
import { useDusty } from '../../../../contexts/DustyContext';
import { CWHeader } from './CWHeader';
import { CWItem } from './CWItem';

export const ContinueWatching: React.FC = () => {
  const { continueWatching } = useDusty();

  return (
    <div className="home-card continue-watching-card">
      <CWHeader />
      <div className="cw-grid">
        {continueWatching.map(item => (
          <CWItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
