import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from './constants/ui';

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
          <Menu size={20} />
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
    </div>
  );
};
