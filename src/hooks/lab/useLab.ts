import { useState } from 'react';
import { LAB_TABS, type LabTab } from '../../pages/lab/constants/constants';

export const useLab = () => {
    const [activeTabId, setActiveTabId] = useState<string>(LAB_TABS[0].id);

    const activeTab = LAB_TABS.find(tab => tab.id === activeTabId) || LAB_TABS[0];

    const selectTab = (id: string) => {
        setActiveTabId(id);
    };

    return {
        tabs: LAB_TABS,
        activeTabId,
        activeTab,
        selectTab
    };
};
