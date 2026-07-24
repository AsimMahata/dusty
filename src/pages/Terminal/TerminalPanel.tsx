import React from 'react';
import { useTerminal } from './hooks/useTerminal';
import { TerminalTabs } from './components/tabs/TerminalTabs';
import { TerminalContent } from './components/panel/TerminalContent';
import { Terminal as TerminalIcon, Plus } from 'lucide-react';
import './css/Terminal.css';
import type { TerminalTab } from './types/types';

export const TerminalPanel: React.FC = () => {
    const {
        tabs,
        availableShells,
        selectedShell,
        setSelectedShell,
        addNewTerminalTab,
        closeTab,
        selectTab,
    } = useTerminal();

    return (
        <div className="terminal-container">
            <TerminalTabs
                tabs={tabs}
                availableShells={availableShells}
                selectedShell={selectedShell}
                onSelectShell={setSelectedShell}
                addNewTerminalTab={addNewTerminalTab}
                closeTab={closeTab}
                selectTab={selectTab}
            />

            <div className="terminal-body">
                {
                    tabs.length ? (
                        tabs.map((tab: TerminalTab) => (
                            <TerminalContent key={tab.id} tab={tab} />
                        ))
                    ) : (
                        <div className="terminal-empty-state">
                            <div className="terminal-empty-icon">
                                <TerminalIcon size={32} />
                            </div>
                            <div className="terminal-empty-title">No Terminal Tabs Open</div>
                            <div className="terminal-empty-desc">
                                Click the <span>+</span> button above or below to open a new tab.
                            </div>
                            <button
                                type="button"
                                className="terminal-empty-add-btn"
                                onClick={addNewTerminalTab}
                            >
                                <Plus size={16} /> New Terminal
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default TerminalPanel;
