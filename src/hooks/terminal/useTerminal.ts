import { useState, useEffect } from 'react';
import type { TerminalTab } from '../../pages/Terminal/constants/types';
import { DEFAULT_CWD, TERMINAL_WELCOME_MSG, MOCK_FILE_SYSTEM } from '../../pages/Terminal/constants/constants';

const CREATE_TAB_LIMIT = 10;

export const useTerminal = () => {
    const [tabs, setTabs] = useState<TerminalTab[]>([]);
    const [activeTabId, setActiveTabId] = useState<string>('');

    // Load initial tab if empty
    useEffect(() => {
        if (tabs.length === 0) {
            const initialId = Date.now().toString();
            const initialTab: TerminalTab = {
                id: initialId,
                name: 'Terminal 1',
                cwd: DEFAULT_CWD,
                history: [TERMINAL_WELCOME_MSG],
                commandHistory: []
            };
            setTabs([initialTab]);
            setActiveTabId(initialId);
        }
    }, [tabs]);

    const addTab = () => {
        if (tabs.length >= CREATE_TAB_LIMIT) return;
        const newId = Date.now().toString();
        const newTab: TerminalTab = {
            id: newId,
            name: `Terminal ${tabs.length + 1}`,
            cwd: DEFAULT_CWD,
            history: [TERMINAL_WELCOME_MSG],
            commandHistory: []
        };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newId);
    };

    const closeTab = (id: string) => {
        if (tabs.length <= 1) {
            // Keep at least one tab, just reset it
            const resetId = Date.now().toString();
            setTabs([
                {
                    id: resetId,
                    name: 'Terminal 1',
                    cwd: DEFAULT_CWD,
                    history: [TERMINAL_WELCOME_MSG],
                    commandHistory: []
                }
            ]);
            setActiveTabId(resetId);
            return;
        }

        const index = tabs.findIndex(t => t.id === id);
        const filtered = tabs.filter(t => t.id !== id);
        setTabs(filtered);

        if (activeTabId === id) {
            // Switch to a neighboring tab
            const nextActiveIndex = index > 0 ? index - 1 : 0;
            if (filtered[nextActiveIndex]) {
                setActiveTabId(filtered[nextActiveIndex].id);
            }
        }
    };

    const renameTab = (id: string, name: string) => {
        if (!name.trim()) return;
        setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    };

    const selectTab = (id: string) => {
        setActiveTabId(id);
    };

    const clearHistory = (id: string) => {
        setTabs(prev => prev.map(t => t.id === id ? { ...t, history: [] } : t));
    };

    const executeCommand = (id: string, commandText: string) => {
        const trimmed = commandText.trim();
        if (!trimmed) return;

        setTabs(prev => prev.map(t => {
            if (t.id !== id) return t;

            const newCommandHistory = [...t.commandHistory, trimmed];
            const currentHistory = [...t.history];
            
            // Append user prompt to history
            currentHistory.push(`dusty@user:${t.cwd.split('\\').pop() || t.cwd} $ ${trimmed}`);

            const args = trimmed.split(' ');
            const cmdName = args[0].toLowerCase();
            const cmdArg = args.slice(1).join(' ');

            let response = '';

            switch (cmdName) {
                case 'help':
                    response = [
                        'Available mock commands:',
                        '  help     - Show list of mock commands',
                        '  clear    - Clear terminal screen',
                        '  neofetch - Display system statistics and ASCII logo',
                        '  ls       - List directory contents',
                        '  cd <dir> - Change current working directory (e.g. cd src or cd ..)',
                        '  about    - Learn more about Dusty workspace developer tool',
                        '  date     - Show current date & time'
                    ].join('\r\n');
                    break;
                case 'clear':
                    // We handle clear by resetting history in the hook state below, 
                    // but we will also just wipe it directly.
                    setTimeout(() => clearHistory(id), 0);
                    return {
                        ...t,
                        commandHistory: newCommandHistory,
                        history: []
                    };
                case 'neofetch':
                    response = [
                        ' \x1b[36m   __/\x1b[0m       \x1b[1;36mdusty@developer\x1b[0m',
                        ' \x1b[36m  /  /\\ \x1b[0m     ------------------',
                        ' \x1b[36m /  /_/ \x1b[0m     \x1b[32mOS\x1b[0m: Windows 11 / Tauri Sandbox',
                        ' \x1b[36m/  /\\ \x1b[0m       \x1b[32mShell\x1b[0m: Dusty Shell v0.1.0',
                        ' \x1b[36m\\__/__/\x1b[0m      \x1b[32mMemory\x1b[0m: 16 GB RAM',
                        '             \x1b[32mWorkspace\x1b[0m: C:\\Users\\asim\\projects\\dusty',
                        '             \x1b[32mFeatures\x1b[0m: File Manager, Code, Shows, Music, Zip',
                        ''
                    ].join('\r\n');
                    break;
                case 'ls':
                    const currentFiles = MOCK_FILE_SYSTEM[t.cwd];
                    if (currentFiles && currentFiles.length > 0) {
                        response = currentFiles.join('   ');
                    } else {
                        response = 'No files found in directory or directory is empty.';
                    }
                    break;
                case 'cd':
                    if (!cmdArg) {
                        response = 'cd: missing directory path argument';
                    } else if (cmdArg === '..') {
                        // Go up
                        const parts = t.cwd.split('\\');
                        if (parts.length > 3) { // Stop going up past project folder
                            parts.pop();
                            const parentCwd = parts.join('\\');
                            return {
                                ...t,
                                cwd: parentCwd,
                                commandHistory: newCommandHistory,
                                history: [...currentHistory]
                            };
                        } else {
                            response = 'cd: cannot navigate outside workspace directory root';
                        }
                    } else {
                        // Check if valid child directory
                        const files = MOCK_FILE_SYSTEM[t.cwd];
                        const targetPath = t.cwd + '\\' + cmdArg;
                        const targetMockExists = MOCK_FILE_SYSTEM[targetPath];
                        if (files && files.includes(cmdArg) && targetMockExists) {
                            return {
                                ...t,
                                cwd: targetPath,
                                commandHistory: newCommandHistory,
                                history: [...currentHistory]
                            };
                        } else {
                            response = `cd: no such directory: ${cmdArg}`;
                        }
                    }
                    break;
                case 'about':
                    response = 'Dusty is a premium visual dashboard designed to consolidate media, project workspace code explorers, file managers, and terminals into a single, unified environment.';
                    break;
                case 'date':
                    response = new Date().toString();
                    break;
                default:
                    response = `command not found: ${cmdName}. Type "help" for valid options.`;
            }

            if (response) {
                currentHistory.push(response);
            }

            return {
                ...t,
                commandHistory: newCommandHistory,
                history: currentHistory
            };
        }));
    };

    const activeTab = tabs.find(t => t.id === activeTabId);

    return {
        tabs,
        activeTabId,
        activeTab,
        addTab,
        closeTab,
        selectTab,
        renameTab,
        executeCommand,
        clearHistory
    };
};
export type UseTerminalReturn = ReturnType<typeof useTerminal>;
