import React from 'react';
import { TYPE_GENERAL, TYPE_DATA, TITLE_GENERAL, TITLE_DATA } from '../../constants';

interface SettingsTabsProps {
    activeTab: typeof TYPE_GENERAL | typeof TYPE_DATA;
    onTabChange: (tab: typeof TYPE_GENERAL | typeof TYPE_DATA) => void;
}

export const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, onTabChange }) => {
    const SETTINGS_TABS = [
        { id: TYPE_GENERAL, label: TITLE_GENERAL },
        { id: TYPE_DATA, label: TITLE_DATA }
    ];

    return (
        <div className="tabs-container">
            {SETTINGS_TABS.map(tab => (
                <button 
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id as typeof TYPE_GENERAL | typeof TYPE_DATA)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
