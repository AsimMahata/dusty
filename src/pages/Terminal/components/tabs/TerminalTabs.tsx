import React, { useState } from 'react';
import { Plus, X, Terminal } from 'lucide-react';
import type { TerminalTab } from '../../constants/types';

interface TerminalTabsProps {
    tabs: TerminalTab[];
    activeTabId: string;
    addTab: () => void;
    closeTab: (id: string) => void;
    selectTab: (id: string) => void;
    renameTab: (id: string, name: string) => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({
    tabs,
    activeTabId,
    addTab,
    closeTab,
    selectTab,
    renameTab,
}) => {
    const [editingTabId, setEditingTabId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    const handleDoubleClick = (tab: TerminalTab) => {
        setEditingTabId(tab.id);
        setTempName(tab.name);
    };

    const handleRenameSubmit = (id: string) => {
        renameTab(id, tempName);
        setEditingTabId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            handleRenameSubmit(id);
        } else if (e.key === 'Escape') {
            setEditingTabId(null);
        }
    };

    return (
        <div className="terminal-tabs-bar">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const isEditing = tab.id === editingTabId;

                return (
                    <div
                        key={tab.id}
                        className={`terminal-tab-item ${isActive ? 'active' : ''}`}
                        onClick={() => !isEditing && selectTab(tab.id)}
                        onDoubleClick={() => handleDoubleClick(tab)}
                    >
                        <Terminal size={14} className="terminal-tab-icon" />
                        
                        {isEditing ? (
                            <input
                                type="text"
                                className="terminal-tab-rename-input"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={() => handleRenameSubmit(tab.id)}
                                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="terminal-tab-title">{tab.name}</span>
                        )}

                        <span
                            className="terminal-tab-close-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                            title="Close tab"
                        >
                            <X size={12} />
                        </span>
                    </div>
                );
            })}

            <button
                type="button"
                className="terminal-tabs-add-btn"
                onClick={addTab}
                title="Add new terminal tab"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};
export default TerminalTabs;
