import React from 'react';
import { TYPE_COMING_SOON, TYPE_EMPTY_DIRECTORIES, TYPE_EXE_FILES, TYPE_JSON_FILES, TYPE_TEXT_FILES, TYPE_OFFICE_FILES, TITLE_COMING_SOON, TITLE_EMPTY_DIRECTORIES, TITLE_EXE_FILES, TITLE_JSON_FILES, TITLE_TEXT_FILES, TITLE_OFFICE_FILES } from '../../constants/constants';
import type { useMisc } from '../../hooks/useMisc';

interface MiscTabsProps {
    misc: ReturnType<typeof useMisc>;
}

export const MiscTabs: React.FC<MiscTabsProps> = ({ misc }) => {
    const MISC_TABS = [
        { id: TYPE_EMPTY_DIRECTORIES, label: TITLE_EMPTY_DIRECTORIES },
        { id: TYPE_EXE_FILES, label: TITLE_EXE_FILES },
        { id: TYPE_JSON_FILES, label: TITLE_JSON_FILES },
        { id: TYPE_TEXT_FILES, label: TITLE_TEXT_FILES },
        { id: TYPE_OFFICE_FILES, label: TITLE_OFFICE_FILES },
        { id: TYPE_COMING_SOON, label: TITLE_COMING_SOON }
    ];

    return (
        <div className="tabs-container">
            {MISC_TABS.map(tab => (
                <button
                    key={tab.id}
                    className={`tab-btn ${misc.activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => misc.setActiveTab(tab.id as any)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
