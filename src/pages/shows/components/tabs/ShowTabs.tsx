import React from 'react';
import { TABS } from '../../constants/constants';
import { useShow } from '../../../../hooks/shows/useShow';

interface ShowTabsProps {
    showHook: ReturnType<typeof useShow>;
    onAddAnime?: () => void;
}

export const ShowTabs: React.FC<ShowTabsProps> = ({ showHook, onAddAnime }) => {
    const { activeTab, setActiveTab, getCount } = showHook;
    
    return (
        <div className="show-tabs-container">
            <div className="show-tabs-list">
                {TABS.map(tab => {
                    const count = getCount(tab);
                    if (count === 0 && tab.id !== 'all' && tab.id !== 'watching' && tab.id !== 'seasonal') return null;
                    
                    return (
                        <div 
                            key={tab.id}
                            className={`show-tab-item ${activeTab.id === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.label} <span className="show-tab-count">{count}</span>
                        </div>
                    );
                })}
            </div>
            {onAddAnime && (
                <button className="open-add-anime-btn" onClick={onAddAnime}>
                    Add Anime
                </button>
            )}
        </div>
    );
};

