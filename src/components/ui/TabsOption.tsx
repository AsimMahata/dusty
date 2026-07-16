import React from 'react';
import type { Tab } from '../../types/types';
import { logger } from '../../utility/logger';

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
                        onClick={() => {
                            logger.info("CHANGE_TAB_ACTION", tab, isItemSelected);
                            setActiveTab(tab);
                        }}
                    >
                        {tab.title}
                    </button>
                ))

            }
        </div>
    );
};
