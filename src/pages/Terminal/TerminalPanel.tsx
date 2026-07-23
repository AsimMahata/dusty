import React from 'react';
import { useTerminal } from '../../hooks/terminal/useTerminal';
import { TerminalTabs } from './components/tabs/TerminalTabs';
import { TerminalContent } from './components/panel/TerminalContent';
import './css/Terminal.css';
import type { TerminalTab } from './terminal.options';

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
                            No terminal tabs open. Click the + button above to open a tab.
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default TerminalPanel;
