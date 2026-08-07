import React from 'react';
import type { UserPageHook } from '../../hooks/useUserPage';
import { PALETTE_ICON_18 } from '../../../../constants/icon';
import toast from 'react-hot-toast';

interface UserPreferencesProps {
  hook: UserPageHook;
}

export const UserPreferences: React.FC<UserPreferencesProps> = ({ hook }) => {
  const {
    theme,
    setTheme,
    accent,
    setAccent
  } = hook;

  return (
    <div className="dashboard-card">
      <div className="card-header">
        {React.cloneElement(PALETTE_ICON_18, { className: 'card-header-icon' })}
        <h3>Preferences</h3>
      </div>
      <div className="details-list">
        <div className="details-row">
          <span className="details-label">Theme Mode</span>
          <div className="pref-selector">
            <button 
              className={`pref-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
            <button 
              className={`pref-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => {
                setTheme('light');
                toast("Light theme is coming soon!", { icon: '🌙' });
              }}
            >
              Light
            </button>
          </div>
        </div>

        <div className="details-row">
          <span className="details-label">Accent Color</span>
          <div className="pref-selector pref-selector-accent">
            {['#6366f1', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6'].map(color => (
              <span 
                key={color}
                className={`accent-dot ${accent === color ? 'active' : ''}`}
                style={{ backgroundColor: color, color: color }}
                onClick={() => {
                  setAccent(color);
                  toast.success("Accent color updated (preview)");
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
