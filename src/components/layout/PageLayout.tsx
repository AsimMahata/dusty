import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDusty } from '../../contexts/DustyContext';
import { Search, FlaskConical, Settings, RefreshCw, X, ListTodo } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

interface PageLayoutProps {
  title?: string;
  hook?: {
    title?: string;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    isRefreshing: boolean;
    isLoading?: boolean;
    fetchData: (sync?: boolean) => void;
    selectedItem?: any;
    isItemSelected?: boolean;
  };
  searchQuery?: string;
  setSearchQuery?: (val: string) => void;
  hideSearch?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  isLoading?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  title: propTitle, 
  hook,
  searchQuery: propSearchQuery, 
  setSearchQuery: propSetSearchQuery, 
  hideSearch: propHideSearch,
  onRefresh: propOnRefresh,
  isRefreshing: propIsRefreshing,
  isLoading: propIsLoading,
  showCloseButton,
  children 
}) => {
  const navigate = useNavigate();
  const { lastOpenedPage } = useDusty();

  const displayTitle = hook?.title || propTitle || "Unknown";
  const searchQuery = hook ? hook.searchQuery : propSearchQuery;
  const setSearchQuery = hook ? hook.setSearchQuery : propSetSearchQuery;
  const hideSearch = hook ? (!!hook.selectedItem || !!hook.isItemSelected) : propHideSearch;
  const onRefresh = hook ? hook.fetchData : propOnRefresh;
  const isRefreshing = hook ? hook.isRefreshing : propIsRefreshing;
  const isLoading = hook ? hook.isLoading : propIsLoading;

  return (
    <>
      <header className="main-header">
        <h1>{displayTitle}</h1>
        <div className="header-actions">
          {!hideSearch && setSearchQuery && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder={`Search ${displayTitle}...`} 
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          {onRefresh && (
            <button 
              onClick={() => onRefresh(true)} 
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
          {showCloseButton ? (
            <span title="Close" style={{ display: 'flex' }}>
              <X size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => navigate(lastOpenedPage)} />
            </span>
          ) : (
            <>
              <span title="Lab / Experiment Zone" style={{ display: 'flex' }}>
                <FlaskConical size={20} style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.LAB)} />
              </span>
              <span title="Todo Tasks" style={{ display: 'flex' }}>
                <ListTodo size={20} style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.TODO)} />
              </span>
              <span title="Settings" style={{ display: 'flex' }}>
                <Settings size={20} style={{ cursor: 'pointer' }} onClick={() => navigate(ROUTES.SETTINGS)} />
              </span>
            </>
          )}
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
