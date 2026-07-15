import React, { useState } from 'react';
import { PageLayout } from '../../components/PageLayout';
import { EmptyDir } from './EmptyDir';

export const Misc: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('empty_directories');

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleRefreshingChange = (refreshing: boolean, loading: boolean) => {
    setIsRefreshing(refreshing);
    setIsLoading(loading);
  };

  const renderContent = () => {
    if (activeTab === 'coming_soon') {
      return (
        <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <h2>Coming Soon...</h2>
        </div>
      );
    }
    
    return (
      <EmptyDir 
        searchQuery={searchQuery} 
        refreshTrigger={refreshTrigger} 
        onRefreshingChange={handleRefreshingChange} 
      />
    );
  };

  return (
    <PageLayout 
      title="Misc" 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
      hideSearch={activeTab === 'coming_soon'}
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
      isLoading={isLoading}
    >
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'empty_directories' ? 'active' : ''}`}
          onClick={() => setActiveTab('empty_directories')}
        >
          Empty Directories
        </button>
        {/* Always the last option */}
        <button 
          className={`tab-btn ${activeTab === 'coming_soon' ? 'active' : ''}`}
          onClick={() => setActiveTab('coming_soon')}
        >
          Coming Soon
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>
    </PageLayout>
  );
};
