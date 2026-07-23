import React from 'react';
import { Plus, X, Terminal } from 'lucide-react';
import type { TerminalTab } from '../../terminal.options';

interface TerminalTabsProps {
    tabs: TerminalTab[];
    availableShells: string[];
    selectedShell: string;
    onSelectShell: (shell: string) => void;
    addNewTerminalTab: () => void;
    closeTab: (id: string) => void;
    selectTab: (id: string) => void;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({
    tabs,
    availableShells,
    selectedShell,
    onSelectShell,
    addNewTerminalTab,
    closeTab,
    selectTab,
}) => {
    const tabsLeftRef = React.useRef<HTMLDivElement>(null);

    const handleWheel = (e: React.WheelEvent) => {
        if (tabsLeftRef.current) {
            tabsLeftRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className="terminal-tabs-bar">
            <div className="terminal-tabs-left" ref={tabsLeftRef} onWheel={handleWheel}>
                {tabs.map((tab) => {
                    return (
                        <div key={tab.id} className={`terminal-tab-item ${tab.active ? 'active' : ''}`} onClick={() => selectTab(tab.id)} >
                            <Terminal size={14} className="terminal-tab-icon" />

                            <span className="terminal-tab-title">{tab.name}</span>

                            <span className="terminal-tab-close-btn" onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} title="Close tab" >
                                <X size={12} />
                            </span>
                        </div>
                    );
                })}

                <button type="button" className="terminal-tabs-add-btn" onClick={addNewTerminalTab} title="Add new terminal tab" >
                    <Plus size={16} />
                </button>
            </div>

            <div className="terminal-shell-selector-wrap">
                <span className="terminal-shell-label">Choose Terminal:</span>
                <select
                    className="terminal-shell-dropdown"
                    value={selectedShell}
                    onChange={(e) => onSelectShell(e.target.value)}
                    title="Select shell"
                >
                    {availableShells.map((shell) => (
                        <option key={shell} value={shell}>
                            {shell}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
export default TerminalTabs;
