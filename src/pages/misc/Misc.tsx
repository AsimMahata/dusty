import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { CategoryPage } from '../../components/category/CategoryPage';
import { useMisc } from '../../hooks/misc/useMisc';
import { useEmptyDirTab } from '../../hooks/misc/useEmptyDirTab';

export const Misc: React.FC = () => {
    const misc = useMisc();
    const emptyDirTab = useEmptyDirTab(misc);

    const renderContent = () => {
        if (misc.activeTab === 'coming_soon') {
            return (
                <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <h2>Coming Soon...</h2>
                </div>
            );
        }
        
        return <CategoryPage tab={emptyDirTab} />;
    };

    return (
        <PageLayout hook={misc}>
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${misc.activeTab === 'empty_directories' ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab('empty_directories')}
                >
                    Empty Directories
                </button>
                <button 
                    className={`tab-btn ${misc.activeTab === 'coming_soon' ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab('coming_soon')}
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
