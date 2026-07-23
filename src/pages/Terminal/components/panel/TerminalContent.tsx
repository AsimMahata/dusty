import React, { useState, useEffect, useRef } from 'react';
import type { TerminalTab } from '../../constants/types';

interface TerminalContentProps {
    tab: TerminalTab;
    executeCommand: (id: string, cmd: string) => void;
    clearHistory: (id: string) => void;
}

export const TerminalContent: React.FC<TerminalContentProps> = ({
    tab,
    executeCommand,
    clearHistory,
}) => {
    const [inputVal, setInputVal] = useState('');
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when history changes
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        setHistoryIndex(null); // Reset command history index on new prompt
    }, [tab.history]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputVal.trim();
        if (trimmed) {
            executeCommand(tab.id, trimmed);
            setInputVal('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (tab.commandHistory.length === 0) return;

            let nextIndex = historyIndex;
            if (nextIndex === null) {
                nextIndex = tab.commandHistory.length - 1;
            } else if (nextIndex > 0) {
                nextIndex -= 1;
            }

            setHistoryIndex(nextIndex);
            setInputVal(tab.commandHistory[nextIndex]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (tab.commandHistory.length === 0 || historyIndex === null) return;

            let nextIndex = historyIndex + 1;
            if (nextIndex >= tab.commandHistory.length) {
                setHistoryIndex(null);
                setInputVal('');
            } else {
                setHistoryIndex(nextIndex);
                setInputVal(tab.commandHistory[nextIndex]);
            }
        }
    };

    // Auto-focus input on clicking anywhere in terminal body
    const handleContainerClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const displayCwd = tab.cwd.split('\\').pop() || tab.cwd;

    return (
        <div 
            className="simulated-terminal-container" 
            ref={containerRef}
            onClick={handleContainerClick}
        >
            <div className="terminal-history">
                {tab.history.map((line, idx) => (
                    <pre key={idx} className="simulated-terminal-line">
                        {line}
                    </pre>
                ))}
            </div>

            <form onSubmit={handleFormSubmit} className="simulated-terminal-prompt-row">
                <span className="simulated-terminal-prompt">
                    dusty@user:{displayCwd} $
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="simulated-terminal-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoFocus
                />
            </form>
        </div>
    );
};
export default TerminalContent;
