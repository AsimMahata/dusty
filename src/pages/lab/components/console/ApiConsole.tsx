import React, { useState } from 'react';
import { PLAY_ICON_16, CHECK_CIRCLE_2_ICON_14, ALERT_CIRCLE_ICON_14, CLOCK_ICON_12, CHECK_ICON_14_GREEN, COPY_ICON_14, ROTATE_CCW_ICON_12_HISTORY } from '../../../../constants/icon';
import { useApiConsole } from '../../hooks/useApiConsole';


export const ApiConsole: React.FC = () => {
    const {
        presets,
        commandName,
        setCommandName,
        paramJson,
        setParamJson,
        isExecuting,
        latestResult,
        history,
        selectPreset,
        replayLog,
        executeIpc
    } = useApiConsole();

    const [copied, setCopied] = useState(false);

    const handleCopyResponse = () => {
        if (!latestResult) return;
        const text = typeof latestResult.data === 'string'
            ? latestResult.data
            : JSON.stringify(latestResult.data, null, 2);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isPresetSelected = presets.some(p => p.command === commandName);

    return (
        <div className="api-console-grid">
            {/* Editor Panel */}
            <div className="api-editor-card">
                <div className="api-input-group">
                    <label className="api-input-label">Preset IPC Commands</label>
                    <select
                        className="api-select"
                        onChange={(e) => {
                            const found = presets.find(p => p.command === e.target.value);
                            if (found) selectPreset(found);
                        }}
                        value={isPresetSelected ? commandName : ''}
                    >
                        {!isPresetSelected && (
                            <option value="">Custom Command ({commandName})</option>
                        )}
                        {presets.map(p => (
                            <option key={p.command} value={p.command}>
                                {p.name} ({p.command})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="api-input-group">
                    <label className="api-input-label">IPC Command Name</label>
                    <input
                        type="text"
                        className="api-text-input"
                        value={commandName}
                        onChange={(e) => setCommandName(e.target.value)}
                        placeholder="e.g. get_system_info"
                    />
                </div>

                <div className="api-input-group">
                    <label className="api-input-label">JSON Parameters (Object)</label>
                    <textarea
                        className="api-textarea"
                        value={paramJson}
                        onChange={(e) => setParamJson(e.target.value)}
                        placeholder='{\n  "input": "test"\n}'
                        spellCheck={false}
                    />
                </div>

                <button
                    type="button"
                    className="api-run-btn"
                    onClick={executeIpc}
                    disabled={isExecuting}
                >
                    {PLAY_ICON_16}
                    <span>{isExecuting ? 'Invoking Backend...' : 'Execute IPC Command'}</span>
                </button>
            </div>

            {/* Response & Execution Viewer Panel */}
            <div className="api-editor-card">
                <div className="api-header-row">
                    <label className="api-input-label">JSON Response Output</label>
                    {latestResult && (
                        <div className="api-header-badges">
                            <span className={`api-status-badge ${latestResult.success ? 'success' : 'error'}`}>
                                {latestResult.success ? CHECK_CIRCLE_2_ICON_14 : ALERT_CIRCLE_ICON_14}
                                {latestResult.success ? '200 OK' : 'ERROR'}
                            </span>
                            <span className="api-execution-timer">
                                {CLOCK_ICON_12}
                                {latestResult.executionTimeMs} ms
                            </span>
                            <button
                                type="button"
                                onClick={handleCopyResponse}
                                className="api-copy-btn"
                                title="Copy JSON Response"
                            >
                                {copied ? CHECK_ICON_14_GREEN : COPY_ICON_14}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    )}
                </div>

                <pre className="api-response-viewer">
                    {latestResult
                        ? (typeof latestResult.data === 'string'
                            ? latestResult.data
                            : JSON.stringify(latestResult.data, null, 2))
                        : '// Select an IPC command on the left and click Execute to view backend results.'}
                </pre>

                {/* History Log */}
                {history.length > 0 && (
                    <div className="api-history-container">
                        <label className="api-input-label api-history-label">
                            Recent Execution Log (Click to Replay)
                        </label>
                        <div className="api-history-list">
                            {history.map((log) => (
                                <div
                                    key={log.id}
                                    className="api-history-item"
                                    onClick={() => replayLog(log)}
                                    title="Click to replay command and reload parameters"
                                >
                                    <div className="api-history-left">
                                        {ROTATE_CCW_ICON_12_HISTORY}
                                        <span className={`api-history-command ${log.success ? '' : 'error'}`}>
                                            {log.command}
                                        </span>
                                    </div>
                                    <span className="api-history-time">
                                        {log.timestamp} ({log.executionTimeMs}ms)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiConsole;
