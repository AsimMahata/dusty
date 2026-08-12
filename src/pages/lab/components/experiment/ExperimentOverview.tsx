import React from 'react';
import { Play, Square, RotateCcw, Activity, FileText, CheckCircle2, Clock, Cpu, HardDrive } from 'lucide-react';

interface ExperimentOverviewProps {
    experimentName: string;
    setExperimentName: (name: string) => void;
    status: 'idle' | 'running' | 'completed' | 'failed';
    onStartExperiment: () => void;
    onStopExperiment: () => void;
    onResetExperiment: () => void;
    logPath: string;
    metrics: {
        durationMs: number;
        eventsProcessed: number;
        logBytes: number;
        errorCount: number;
    };
    onSwitchToLog: () => void;
}

export const ExperimentOverview: React.FC<ExperimentOverviewProps> = ({
    experimentName,
    setExperimentName,
    status,
    onStartExperiment,
    onStopExperiment,
    onResetExperiment,
    logPath,
    metrics,
    onSwitchToLog
}) => {
    return (
        <div className="experiment-overview-container">
            {/* Header / Active Control Card */}
            <div className="experiment-card hero-card">
                <div className="experiment-hero-header">
                    <div>
                        <div className="experiment-tag">Active Experiment</div>
                        <h3 className="experiment-title">{experimentName}</h3>
                        <p className="experiment-description">
                            Monitors active system processes, scans workspace directories, and writes detailed execution events directly to log files.
                        </p>
                    </div>

                    <div className="experiment-actions">
                        {status === 'running' ? (
                            <button
                                type="button"
                                className="exp-btn danger"
                                onClick={onStopExperiment}
                            >
                                <Square size={16} /> Stop Experiment
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="exp-btn primary"
                                onClick={onStartExperiment}
                            >
                                <Play size={16} /> Run Experiment
                            </button>
                        )}
                        <button
                            type="button"
                            className="exp-btn secondary"
                            onClick={onResetExperiment}
                        >
                            <RotateCcw size={16} /> Reset
                        </button>
                    </div>
                </div>

                <div className="experiment-meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">Status</span>
                        <div className="meta-value">
                            <span className={`status-pill ${status}`}>
                                {status === 'running' && <span className="pulse-dot" />}
                                {status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Elapsed Time</span>
                        <span className="meta-value font-mono">
                            {(metrics.durationMs / 1000).toFixed(1)}s
                        </span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">Log Destination</span>
                        <span className="meta-value font-mono text-truncate" title={logPath}>
                            {logPath || 'Resolving app log...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="metrics-grid">
                <div className="metric-box">
                    <div className="metric-icon-wrap blue">
                        <Activity size={20} />
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Events Processed</span>
                        <span className="metric-value">{metrics.eventsProcessed.toLocaleString()}</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon-wrap green">
                        <FileText size={20} />
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Log Bytes Written</span>
                        <span className="metric-value">{(metrics.logBytes / 1024).toFixed(1)} KB</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon-wrap purple">
                        <Clock size={20} />
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Execution Time</span>
                        <span className="metric-value">{(metrics.durationMs / 1000).toFixed(2)}s</span>
                    </div>
                </div>

                <div className="metric-box">
                    <div className="metric-icon-wrap red">
                        <CheckCircle2 size={20} />
                    </div>
                    <div className="metric-content">
                        <span className="metric-label">Errors Detected</span>
                        <span className="metric-value">{metrics.errorCount}</span>
                    </div>
                </div>
            </div>

            {/* Configuration & Quick View */}
            <div className="experiment-two-col">
                <div className="experiment-card">
                    <h4 className="card-section-title">
                        <Cpu size={16} /> Experiment Setup & Parameters
                    </h4>
                    <div className="config-form-group">
                        <label className="config-label">Experiment Preset</label>
                        <select
                            className="api-select"
                            value={experimentName}
                            onChange={(e) => setExperimentName(e.target.value)}
                        >
                            <option value="System & Core IPC Diagnostics">System & Core IPC Diagnostics</option>
                            <option value="Database Query & Scan Stress Test">Database Query & Scan Stress Test</option>
                            <option value="P2P Discovery & Network Handshake">P2P Discovery & Network Handshake</option>
                        </select>
                    </div>

                    <div className="config-info-note">
                        <p>
                            Starting an experiment triggers diagnostic background workers which stream structured log messages. You can switch to the <strong>Log</strong> tab to watch the live output stream in real-time.
                        </p>
                    </div>
                </div>

                <div className="experiment-card">
                    <h4 className="card-section-title">
                        <HardDrive size={16} /> Live Log Direct Stream
                    </h4>
                    <p className="card-subtitle">
                        The live log tab opens the current experiment's log file with shared read access and non-blocking incremental tailing.
                    </p>

                    <div className="log-shortcut-box">
                        <div className="log-shortcut-text">
                            <span>Log File:</span>
                            <code className="log-path-code">{logPath || 'Loading path...'}</code>
                        </div>
                        <button
                            type="button"
                            className="exp-btn secondary"
                            onClick={onSwitchToLog}
                        >
                            <FileText size={16} /> Open Live Log Tab
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperimentOverview;
