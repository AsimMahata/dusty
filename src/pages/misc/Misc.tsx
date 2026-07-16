import React from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { CategoryPage } from '../../components/category/CategoryPage';
import { useMisc } from '../../hooks/misc/useMisc';
import { useEmptyDirTab } from '../../hooks/misc/useEmptyDirTab';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TITLE_COMING_SOON, TITLE_EMPTY_DIRECTORIES } from '../../constants/tabs';

export const Misc: React.FC = () => {
    const misc = useMisc();
    const emptyDirTab = useEmptyDirTab(misc);

    const renderContent = () => {
        if (misc.activeTab === TYPE_COMING_SOON) {
            return (
                <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <h2>{TITLE_COMING_SOON}...</h2>
                </div>
            );
        }
        
        return <CategoryPage tab={emptyDirTab} />;
    };

    return (
        <PageLayout hook={misc}>
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${misc.activeTab === TYPE_EMPTY_DIRECTORIES ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(TYPE_EMPTY_DIRECTORIES)}
                >
                    {TITLE_EMPTY_DIRECTORIES}
                </button>
                <button 
                    className={`tab-btn ${misc.activeTab === TYPE_COMING_SOON ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(TYPE_COMING_SOON)}
                >
                    {TITLE_COMING_SOON}
                </button>
            </div>

            <div className="tab-content">
                {renderContent()}
            </div>
        </PageLayout>
    );
};
