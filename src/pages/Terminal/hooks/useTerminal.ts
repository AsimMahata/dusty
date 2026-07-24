import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { TerminalTab } from '../terminal.options';

export const CREATE_TAB_LIMIT = 10;
const INITIAL_TABS: TerminalTab[] = [];

export const useTerminal = () => {
    const [tabs, setTabs] = useState<TerminalTab[]>(INITIAL_TABS);
    const [availableShells, setAvailableShells] = useState<string[]>(['pwsh', 'powershell', 'cmd']);
    const [selectedShell, setSelectedShell] = useState<string>('pwsh');

    useEffect(() => {
        const fetchAvailableTerminals = async () => {
            try {
                const list: string[] = await invoke('get_available_terminals');
                if (Array.isArray(list)) {
                    // Exclude 'wt' as explicitly requested by user
                    const filtered = list.filter(s => s.toLowerCase() !== 'wt');
                    if (filtered.length > 0) {
                        setAvailableShells(filtered);
                        if (filtered.includes('pwsh')) {
                            setSelectedShell('pwsh');
                        } else if (filtered.includes('powershell')) {
                            setSelectedShell('powershell');
                        } else {
                            setSelectedShell(filtered[0]);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch available terminals from backend:", err);
            }
        };

        fetchAvailableTerminals();
    }, []);

    const addNewTerminalTab = () => {
        if (tabs.length >= CREATE_TAB_LIMIT) return;
        const newId = `tab-${Date.now()}`;
        setTabs(prev => [
            ...prev.map(t => ({ ...t, active: false })),
            { id: newId, name: `terminal ${prev.length + 1}`, active: true, shell: selectedShell }
        ]);
    };

    const closeTab = (id: string) => {
        setTabs(prev => {
            const filtered = prev.filter(t => t.id !== id);
            if (filtered.length && !filtered.some(t => t.active)) {
                filtered[0].active = true;
            }
            return filtered;
        });
    };

    const selectTab = (id: string) => {
        setTabs(prev => prev.map(t => ({
            ...t,
            active: t.id === id
        })));
    };

    const updateActiveTabShell = (shell: string) => {
        setSelectedShell(shell);
        setTabs(prev => prev.map(t => t.active ? { ...t, shell } : t));
    };

    return {
        tabs,
        availableShells,
        selectedShell,
        setSelectedShell: updateActiveTabShell,
        addNewTerminalTab,
        closeTab,
        selectTab,
    };
};
export type UseTerminalReturn = ReturnType<typeof useTerminal>;
