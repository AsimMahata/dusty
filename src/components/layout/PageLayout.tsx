import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_ICON_16_SEARCH, FLASK_CONICAL_ICON_20_POINTER, SETTINGS_ICON_20_POINTER, getRefreshCwIcon, X_ICON_24_SECONDARY, LIST_TODO_ICON_20_POINTER } from '../../constants/icon';
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
  const lastOpenedPage = localStorage.getItem('last_opened_page') || '/';

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
              {SEARCH_ICON_16_SEARCH}
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
              {getRefreshCwIcon(!!isRefreshing)}
            </button>
          )}
          {showCloseButton ? (
            <span title="Close" style={{ display: 'flex' }} onClick={() => navigate(lastOpenedPage)}>
              {X_ICON_24_SECONDARY}
            </span>
          ) : (
            <>
              <span title="Lab / Experiment Zone" style={{ display: 'flex' }} onClick={() => navigate(ROUTES.LAB)}>
                {FLASK_CONICAL_ICON_20_POINTER}
              </span>
              <span title="Todo Tasks" style={{ display: 'flex' }} onClick={() => navigate(ROUTES.TODO)}>
                {LIST_TODO_ICON_20_POINTER}
              </span>
              <span title="Settings" style={{ display: 'flex' }} onClick={() => navigate(ROUTES.SETTINGS)}>
                {SETTINGS_ICON_20_POINTER}
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
