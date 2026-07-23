import React from 'react';
import { useTerminal } from '../../hooks/terminal/useTerminal';
import { TerminalTabs } from './components/tabs/TerminalTabs';
import { TerminalContent } from './components/panel/TerminalContent';
import './css/Terminal.css';

export const TerminalPanel: React.FC = () => {
    const {
        tabs,
        activeTabId,
        activeTab,
        addTab,
        closeTab,
        selectTab,
        renameTab,
        executeCommand,
        clearHistory
    } = useTerminal();

    return (
        <div className="terminal-container">
            <TerminalTabs
                tabs={tabs}
                activeTabId={activeTabId}
                addTab={addTab}
                closeTab={closeTab}
                selectTab={selectTab}
                renameTab={renameTab}
            />

            <div className="terminal-body">
                {activeTab ? (
                    <TerminalContent
                        tab={activeTab}
                        executeCommand={executeCommand}
                        clearHistory={clearHistory}
                    />
                ) : (
                    <div className="terminal-empty-state">
                        No terminal tabs open. Click the + button above to open a tab.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminalPanel;
