import React from 'react';
import type { UserPageHook } from '../../hooks/useUserPage';
import { EDIT3_ICON_14, LAPTOP_ICON_16, CALENDAR_ICON_14, COPY_ICON_14, CHECK_ICON_14 } from '../../../../constants/icon';

interface ProfileHeroProps {
  hook: UserPageHook;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ hook }) => {
  const {
    user,
    deviceInfo,
    setIsEditModalOpen,
    handleCopyId: onCopyId,
    copied,
    getInitials,
    convertFileSrc
  } = hook;

  const onEditClick = () => setIsEditModalOpen(true);

  const formattedDate = user?.created_at 
    ? new Date(user.created_at * 1000).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <div className="profile-hero-card">
      <div className="hero-avatar-wrapper">
        <div 
          className="hero-avatar"
          style={
            user?.avatar && user.avatar.startsWith('linear-gradient')
              ? { background: user.avatar }
              : user?.avatar 
                ? { backgroundImage: `url('${convertFileSrc(user.avatar)}?t=${user?.updated_at || Date.now()}')` }
                : undefined
          }
        >

          {(!user?.avatar || user.avatar.startsWith('linear-gradient')) && getInitials(user?.display_name || 'Dusty User')}
        </div>
        <div className="hero-status-dot" title="Online" />
      </div>

      <div className="hero-details">
        <div className="hero-name-row">
          <h2 className="hero-display-name">{user?.display_name || 'Loading...'}</h2>
          <button className="edit-profile-btn" onClick={onEditClick}>
            {EDIT3_ICON_14}
            Edit Profile
          </button>
        </div>
        
        <p className="hero-subtitle">
          {LAPTOP_ICON_16}
          <span>{deviceInfo?.device_name || 'Local Device'}</span>
        </p>

        <div className="hero-meta-row">
          <div className="hero-meta-item">
            <span>ID:</span>
            <span className="hero-id-text">{user?.id ? `${user.id.slice(0, 8)}...` : ''}</span>
            <button className="copy-id-btn" onClick={onCopyId} title="Copy User ID">
              {copied ? CHECK_ICON_14 : COPY_ICON_14}
            </button>
          </div>

          {formattedDate && (
            <div className="hero-meta-item">
              {CALENDAR_ICON_14}
              <span>Joined: {formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
