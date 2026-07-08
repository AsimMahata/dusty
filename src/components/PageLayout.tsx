import React from 'react';
import { Search, Bell, Settings, RefreshCw } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  hideSearch?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  title, 
  searchQuery, 
  setSearchQuery, 
  hideSearch,
  onRefresh,
  isRefreshing,
  isLoading,
  children 
}) => {
  return (
    <>
      <header className="main-header">
        <h1>{title}</h1>
        <div className="header-actions">
          {!hideSearch && setSearchQuery && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder={`Search ${title}...`} 
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          {onRefresh && (
            <button 
              onClick={onRefresh} 
              title="Refresh Data"
              style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex' }}
            >
              <RefreshCw 
                size={20} 
                style={{ cursor: 'pointer' }} 
                className={isRefreshing ? 'spin-animation' : ''}
              />
            </button>
          )}
          <Bell size={20} style={{ cursor: 'pointer' }} />
          <Settings size={20} style={{ cursor: 'pointer' }} />
        </div>
      </header>
      <div className="content-body">
        {isLoading ? (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Loading...
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
};
