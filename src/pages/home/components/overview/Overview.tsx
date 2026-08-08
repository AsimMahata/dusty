import React from 'react';
import { StatsGrid } from './StatsGrid';
import { useHomeContext } from '../../contexts/HomeContext';
import { User as UserIcon, Monitor } from 'lucide-react';

export const Overview: React.FC = () => {
  const { user, profile } = useHomeContext();

  return (
    <div className="home-card overview-card">
      <div className="home-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="home-card-title">Overview</span>
        {user && (
          <div className="user-overview-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', opacity: 0.85 }}>
            {profile.avatar && profile.avatar !== '/icon.png' ? (
              <img src={profile.avatar} alt={user.display_name} style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <UserIcon size={14} />
            )}
            <span style={{ fontWeight: 500 }}>{user.display_name}</span>
            {user.device_name && (
              <>
                <span style={{ opacity: 0.4 }}>•</span>
                <Monitor size={13} />
                <span style={{ opacity: 0.75 }}>{user.device_name}</span>
              </>
            )}
          </div>
        )}
      </div>
      <StatsGrid />
    </div>
  );
};
