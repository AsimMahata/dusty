import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Tv, 
  FolderGit2, 
  Box, 
  Music as MusicIcon, 
  Film, 
  Image as ImageIcon,
  Menu
} from 'lucide-react';

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

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon size={20} /> },
    { label: 'Shows', path: '/shows', icon: <Tv size={20} /> },
    { label: 'Projects', path: '/projects', icon: <FolderGit2 size={20} /> },
    { label: 'Music', path: '/music', icon: <MusicIcon size={20} /> },
    { label: 'Videos', path: '/videos', icon: <Film size={20} /> },
    { label: 'Images', path: '/images', icon: <ImageIcon size={20} /> },
    { label: 'Misc', path: '/misc', icon: <Box size={20} /> },
  ];

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
        {navItems.map((item) => {
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
