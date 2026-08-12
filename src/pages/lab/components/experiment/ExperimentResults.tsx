import React, { useState } from 'react';
import { BarChart3, Copy, Check, Download, Layers } from 'lucide-react';

interface ExperimentResultsProps {
    experimentName: string;
    resultsData: Record<string, any> | null;
    status: 'idle' | 'running' | 'completed' | 'failed';
}

export const ExperimentResults: React.FC<ExperimentResultsProps> = ({
    experimentName,
    resultsData,
    status
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!resultsData) return;
        navigator.clipboard.writeText(JSON.stringify(resultsData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!resultsData) return;
        const blob = new Blob([JSON.stringify(resultsData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experiment-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="experiment-results-container">
            <div className="results-header-card">
                <div>
                    <h3 className="results-title">
                        <BarChart3 size={20} style={{ color: 'var(--accent)' }} />
                        Experiment Output & Performance Data
                    </h3>
                    <p className="results-subtitle font-mono">
                        {experimentName} &bull; Status: <span className={`status-pill ${status}`}>{status.toUpperCase()}</span>
                    </p>
                </div>

                <div className="results-actions">
                    <button
                        type="button"
                        className="exp-btn secondary"
                        onClick={handleCopy}
                        disabled={!resultsData}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy JSON'}
                    </button>
                    <button
                        type="button"
                        className="exp-btn primary"
                        onClick={handleDownload}
                        disabled={!resultsData}
                    >
                        <Download size={14} /> Export Results
                    </button>
                </div>
            </div>

            {resultsData ? (
                <div className="results-content-grid">
                    {/* Execution Summary Table */}
                    <div className="experiment-card">
                        <h4 className="card-section-title">
                            <Layers size={16} /> Summary Statistics
                        </h4>
                        <div className="db-table-wrapper">
                            <table className="db-data-table">
                                <thead>
                                    <tr>
                                        <th>Metric Name</th>
                                        <th>Recorded Value</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(resultsData).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="font-mono">{key}</td>
                                            <td className="font-mono">
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value)
                                                    : String(value)}
                                            </td>
                                            <td>
                                                <span className="api-status-badge success">
                                                    Recorded
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* JSON Output Viewer */}
                    <div className="experiment-card">
                        <h4 className="card-section-title">Raw Payload Output (JSON)</h4>
                        <pre className="api-response-viewer font-mono">
                            {JSON.stringify(resultsData, null, 2)}
                        </pre>
                    </div>
                </div>
            ) : (
                <div className="results-empty-state">
                    <BarChart3 size={48} className="empty-icon" />
                    <h4>No Experiment Results Generated Yet</h4>
                    <p>Run the experiment from the Overview tab to inspect execution metrics and performance data.</p>
                </div>
            )}
        </div>
    );
};

export default ExperimentResults;
