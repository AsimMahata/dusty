import React from 'react';
import type { useShow } from '../../hooks/shows/useShow';

interface ShowTabsOptionProps {
    show: ReturnType<typeof useShow>;
}

export const ShowTabsOption: React.FC<ShowTabsOptionProps> = ({ show }) => {
    if (show.isItemSelected) return null;

    return (
        <div className="tabs-container">
            <button
                className={`tab-btn ${show.activeTab === 'normal' ? 'active' : ''}`}
                onClick={() => show.setActiveTab('normal')}
            >
                Shows
            </button>
            <button
                className={`tab-btn ${show.activeTab === 'banned' ? 'active' : ''}`}
                onClick={() => show.setActiveTab('banned')}
            >
                Banned
            </button>
        </div>
    );
};
