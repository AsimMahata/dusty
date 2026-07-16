import React from 'react';
import type { Tab } from '../../types/types';

interface TabsOptionProps {
    isItemSelected: boolean,
    activeTab: Tab,
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>,
    tabs: Tab[],
}

export const TabsOption: React.FC<TabsOptionProps> = ({ isItemSelected, activeTab, setActiveTab, tabs }) => {
    if (isItemSelected) return null;

    return (
        <div className="tabs-container">
            {
                tabs.map((tab, i) => (
                    <button
                        key={`tab.title-${i}`}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.title}
                    </button>
                ))

            }
        </div>
    );
};
