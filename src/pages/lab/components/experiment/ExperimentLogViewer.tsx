import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
    Play,
    Pause,
    RotateCcw,
    Copy,
    Check,
    Download,
    Search,
    Filter,
    ArrowDown,
    Folder,
    RefreshCw
} from 'lucide-react';

interface LogReadResult {
    content: String;
    next_offset: number;
    total_bytes: number;
    log_path: string;
}

interface ExperimentLogViewerProps {
    logPath: string;
    setLogPath: (path: string) => void;
    isExperimentRunning?: boolean;
}

export const ExperimentLogViewer: React.FC<ExperimentLogViewerProps> = ({
    logPath,
    setLogPath,
    isExperimentRunning = false
}) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isLive, setIsLive] = useState<boolean>(true);
    const [refreshRateMs, setRefreshRateMs] = useState<number>(500);
    const [autoScroll, setAutoScroll] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [levelFilter, setLevelFilter] = useState<string>('ALL');
    const [copied, setCopied] = useState<boolean>(false);
    const [totalBytes, setTotalBytes] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const nextOffsetRef = useRef<number>(0);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Initial setup: resolve log path if not set
    useEffect(() => {
        const resolvePath = async () => {
            if (!logPath) {
                try {
                    const defaultPath: string = await invoke('get_experiment_log_path');
                    setLogPath(defaultPath);
                } catch (err) {
                    console.error('Failed to resolve log path:', err);
                }
            }
        };
        resolvePath();
    }, [logPath, setLogPath]);

    // Fetch log function using incremental offset
    const fetchLogData = async (fromOffset: number | null = null) => {
        try {
            setIsFetching(true);
            const res: LogReadResult = await invoke('get_experiment_log', {
                path: logPath || null,
                fromByte: fromOffset
            });

            if (res.log_path && res.log_path !== logPath) {
                setLogPath(res.log_path);
            }

            setTotalBytes(res.total_bytes);
            setLastUpdated(new Date().toLocaleTimeString());

            if (fromOffset === null || fromOffset === 0) {
                // Initial full/tail load
                const newLines = res.content.split('\n');
                setLogs(newLines);
                nextOffsetRef.current = res.next_offset;
            } else if (res.content && res.content.length > 0) {
                // Appending new lines
                const appendedLines = res.content.split('\n');
                setLogs(prev => {
                    // Combine last unfinished line with first new line if applicable
                    const updated = [...prev];
                    if (updated.length > 0 && !res.content.startsWith('\n')) {
                        updated[updated.length - 1] += appendedLines[0];
                        return [...updated, ...appendedLines.slice(1)];
                    }
                    return [...updated, ...appendedLines];
                });
                nextOffsetRef.current = res.next_offset;
            } else {
                nextOffsetRef.current = res.next_offset;
            }
        } catch (err) {
            console.error('Log fetch error:', err);
        } finally {
            setIsFetching(false);
        }
    };

    // Reload entire log from start
    const handleReload = () => {
        nextOffsetRef.current = 0;
        fetchLogData(null);
    };

    // Periodic live streaming timer
    useEffect(() => {
        // Initial fetch
        handleReload();
    }, [logPath]);

    useEffect(() => {
        if (isExperimentRunning) {
            setIsLive(true);
        }
    }, [isExperimentRunning]);

    useEffect(() => {
        if (!isLive) return;

        const timer = setInterval(() => {
            fetchLogData(nextOffsetRef.current);
        }, refreshRateMs);

        return () => clearInterval(timer);
    }, [isLive, refreshRateMs, logPath]);

    // Auto-scroll effect
    useEffect(() => {
        if (autoScroll && logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    // Filter log lines
    const filteredLogs = logs.filter(line => {
        if (!line.trim() && searchQuery) return false;
        
        // Level filter
        if (levelFilter !== 'ALL') {
            const upper = line.toUpperCase();
            if (levelFilter === 'ERROR' && !upper.includes('ERROR')) return false;
            if (levelFilter === 'WARN' && !upper.includes('WARN') && !upper.includes('WARNING')) return false;
            if (levelFilter === 'INFO' && !upper.includes('INFO')) return false;
            if (levelFilter === 'DEBUG' && !upper.includes('DEBUG')) return false;
        }

        // Search query filter
        if (searchQuery) {
            return line.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(logs.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment-${Date.now()}.log`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getLineClass = (line: string) => {
        const upper = line.toUpperCase();
        if (upper.includes('ERROR') || upper.includes('FAILED')) return 'log-line error';
        if (upper.includes('WARN') || upper.includes('WARNING')) return 'log-line warn';
        if (upper.includes('INFO') || upper.includes('SUCCESS')) return 'log-line info';
        if (upper.includes('DEBUG') || upper.includes('TRACE')) return 'log-line debug';
        return 'log-line';
    };

    return (
        <div className="experiment-log-viewer">
            {/* Log Controls Header Toolbar */}
            <div className="log-toolbar">
                <div className="log-toolbar-left">
                    <button
                        type="button"
                        className={`exp-btn ${isLive ? 'primary' : 'secondary'}`}
                        onClick={() => setIsLive(!isLive)}
                    >
                        {isLive ? <Pause size={14} /> : <Play size={14} />}
                        {isLive ? 'Live Streaming' : 'Paused'}
                    </button>

                    <div className="log-refresh-rate">
                        <span>Refresh:</span>
                        <select
                            className="api-select mini-select"
                            value={refreshRateMs}
                            onChange={(e) => setRefreshRateMs(Number(e.target.value))}
                        >
                            <option value={250}>250 ms</option>
                            <option value={500}>500 ms</option>
                            <option value={1000}>1.0 s</option>
                            <option value={2000}>2.0 s</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className={`exp-btn icon-btn ${autoScroll ? 'active' : ''}`}
                        onClick={() => setAutoScroll(!autoScroll)}
                        title="Auto-scroll to bottom"
                    >
                        <ArrowDown size={14} /> Auto-scroll
                    </button>
                </div>

                <div className="log-toolbar-right">
                    {/* Search filter */}
                    <div className="log-search-input-wrap">
                        <Search size={14} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Filter logs..."
                            className="log-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Level filter */}
                    <div className="log-level-filter">
                        <Filter size={14} />
                        <select
                            className="api-select mini-select"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            <option value="ALL">All Levels</option>
                            <option value="INFO">INFO</option>
                            <option value="WARN">WARN</option>
                            <option value="ERROR">ERROR</option>
                            <option value="DEBUG">DEBUG</option>
                        </select>
                    </div>

                    <button
                        type="button"
                        className="exp-btn secondary icon-only"
                        onClick={handleReload}
                        title="Reload full log"
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        type="button"
                        className="exp-btn secondary icon-only"
                        onClick={handleCopy}
                        title="Copy logs"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <button
                        type="button"
                        className="exp-btn secondary icon-only"
                        onClick={handleDownload}
                        title="Download log file"
                    >
                        <Download size={14} />
                    </button>
                </div>
            </div>

            {/* Log Info Banner */}
            <div className="log-info-subbar font-mono">
                <div className="log-path-display" title={logPath}>
                    <Folder size={14} />
                    <span>{logPath || 'Default Experiment Log'}</span>
                </div>
                <div className="log-stats-display">
                    {isExperimentRunning && <span className="pulse-dot inline-dot" title="Experiment Active" />}
                    {isFetching && <RefreshCw size={12} className="spin-icon" />}
                    <span>{(totalBytes / 1024).toFixed(1)} KB</span>
                    &bull;
                    <span>{filteredLogs.length} / {logs.length} Lines</span>
                    &bull;
                    <span>Updated: {lastUpdated || 'Just now'}</span>
                </div>
            </div>

            {/* Code Log Container */}
            <div className="log-console-container" ref={logContainerRef}>
                {filteredLogs.length > 0 ? (
                    <div className="log-lines-wrapper">
                        {filteredLogs.map((line, index) => (
                            <div key={index} className={getLineClass(line)}>
                                <span className="line-num">{index + 1}</span>
                                <span className="line-content">{line}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="log-empty-console">
                        <p>{searchQuery ? 'No lines matching filter query.' : 'Log file is currently empty or loading...'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperimentLogViewer;
