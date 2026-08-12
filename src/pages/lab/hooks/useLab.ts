import { useState, useEffect, useRef } from 'react';
import { LAB_TABS,type ExperimentSubTab } from '../constants/constants';
import { invoke } from '@tauri-apps/api/core';

export const useLab = () => {
    const [activeTabId, setActiveTabId] = useState<string>('experiment');
    const [experimentSubTab, setExperimentSubTab] = useState<ExperimentSubTab>('overview');

    // Experiment state
    const [experimentName, setExperimentName] = useState<string>('System & Core IPC Diagnostics');
    const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
    const [logPath, setLogPath] = useState<string>('');
    const [metrics, setMetrics] = useState({
        durationMs: 0,
        eventsProcessed: 0,
        logBytes: 0,
        errorCount: 0
    });
    const [resultsData, setResultsData] = useState<Record<string, any> | null>(null);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    const activeTab = LAB_TABS.find(tab => tab.id === activeTabId) || LAB_TABS[0];

    const selectTab = (id: string) => {
        setActiveTabId(id);
    };

    const startExperiment = () => {
        setStatus('running');
        setMetrics({
            durationMs: 0,
            eventsProcessed: 0,
            logBytes: 0,
            errorCount: 0
        });
        setResultsData(null);
        startTimeRef.current = Date.now();

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(async () => {
            const elapsed = Date.now() - startTimeRef.current;

            try {
                if (elapsed % 1500 < 500) {
                    await invoke('tokenize', { input: `[Experiment Event] - ${experimentName} tick ${elapsed}ms` });
                }
            } catch (e) {
                console.error('Experiment invoke error:', e);
            }

            setMetrics(prev => ({
                durationMs: elapsed,
                eventsProcessed: prev.eventsProcessed + Math.floor(Math.random() * 4) + 1,
                logBytes: prev.logBytes + Math.floor(Math.random() * 200) + 50,
                errorCount: prev.errorCount
            }));
        }, 500);
    };

    const stopExperiment = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setStatus('completed');
        setResultsData({
            experiment: experimentName,
            status: 'completed',
            totalEventsProcessed: metrics.eventsProcessed,
            totalLogBytes: metrics.logBytes,
            totalDurationSeconds: (metrics.durationMs / 1000).toFixed(2),
            errorCount: metrics.errorCount,
            executedAt: new Date().toISOString(),
            environment: 'Dusty Tauri Core'
        });
    };

    const resetExperiment = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setStatus('idle');
        setMetrics({
            durationMs: 0,
            eventsProcessed: 0,
            logBytes: 0,
            errorCount: 0
        });
        setResultsData(null);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    return {
        tabs: LAB_TABS,
        activeTabId,
        activeTab,
        selectTab,
        experimentSubTab,
        setExperimentSubTab,
        experimentName,
        setExperimentName,
        status,
        startExperiment,
        stopExperiment,
        resetExperiment,
        logPath,
        setLogPath,
        metrics,
        resultsData
    };
};
