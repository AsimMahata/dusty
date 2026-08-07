import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ICON_20 } from '../../constants/icon';
import { SIDEBAR_NAV_ITEMS } from './constants/ui';
import { ROUTES } from '../../constants/routes';
import { getUserIPC, convertFileSrcIPC } from '../../personalities/ambiverts/user';

import type { User } from '../../personalities/ambiverts/user';
import { ChevronRight } from 'lucide-react';



interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleSidebar 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const data = await getUserIPC();
      setUser(data);
    } catch (err) {
      console.error("Failed to load user in sidebar", err);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener('user-updated', loadUser);
    return () => {
      window.removeEventListener('user-updated', loadUser);
    };
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <img src="/icon.png" alt="Dusty Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            Dusty
          </div>
        )}
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          {MENU_ICON_20}
        </button>
      </div>
      
      <div className="sidebar-nav">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.label}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="nav-icon">{item.icon}</div>
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          );
        })}
      </div>

      <div 
        className="sidebar-account" 
        onClick={() => navigate(ROUTES.USER)}
        title={isCollapsed ? (user?.display_name || 'Profile') : undefined}
      >
        <div className="sidebar-account-avatar-wrapper">
          <div 
            className="sidebar-account-avatar"
            style={
              user?.avatar && user.avatar.startsWith('linear-gradient')
                ? { background: user.avatar }
                : user?.avatar 
                  ? { backgroundImage: `url(${convertFileSrcIPC(user.avatar)}?t=${user?.updated_at || Date.now()})` }
                  : undefined
            }

          >
            {(!user?.avatar || user.avatar.startsWith('linear-gradient')) && getInitials(user?.display_name || 'Dusty User')}
          </div>
          <div className="sidebar-account-status-dot" />
        </div>
        
        <div className="sidebar-account-info">
          <span className="sidebar-account-name">{user?.display_name || 'Loading...'}</span>
          <span className="sidebar-account-meta">{user?.device_name || 'Local User'}</span>
        </div>

        <div className="sidebar-account-chevron">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

