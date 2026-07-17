import React from 'react';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TITLE_COMING_SOON, TITLE_EMPTY_DIRECTORIES } from '../../../../constants/tabs';
import type { useMisc } from '../../../../hooks/misc/useMisc';

interface MiscTabsProps {
    misc: ReturnType<typeof useMisc>;
}

export const MiscTabs: React.FC<MiscTabsProps> = ({ misc }) => {
    const MISC_TABS = [
        { id: TYPE_EMPTY_DIRECTORIES, label: TITLE_EMPTY_DIRECTORIES },
        { id: TYPE_COMING_SOON, label: TITLE_COMING_SOON }
    ];

    return (
        <div className="tabs-container">
            {MISC_TABS.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-btn ${misc.activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(tab.id as typeof TYPE_COMING_SOON | typeof TYPE_EMPTY_DIRECTORIES)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
