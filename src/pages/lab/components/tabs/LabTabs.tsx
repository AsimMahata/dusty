import React from 'react';
import { Terminal, Database, Cpu, FileCode, Key, Palette } from 'lucide-react';
import type { LabTab } from '../../constants/constants';

interface LabTabsProps {
    tabs: LabTab[];
    activeTabId: string;
    selectTab: (id: string) => void;
}

const getTabIcon = (id: string) => {
    switch (id) {
        case 'api':
            return <Terminal size={16} />;
        case 'database':
            return <Database size={16} />;
        case 'system':
            return <Cpu size={16} />;
        case 'tokenizer':
            return <FileCode size={16} />;
        case 'session':
            return <Key size={16} />;
        case 'theme':
            return <Palette size={16} />;
        default:
            return <Terminal size={16} />;
    }
};

export const LabTabs: React.FC<LabTabsProps> = ({
    tabs,
    activeTabId,
    selectTab
}) => {
    return (
        <div className="lab-tabs-nav">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        className={`lab-tab-button ${isActive ? 'active' : ''}`}
                        onClick={() => selectTab(tab.id)}
                        title={tab.description}
                    >
                        {getTabIcon(tab.id)}
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default LabTabs;
