import React, { useEffect } from 'react';
import { Key, Save, Search, CheckCircle2 } from 'lucide-react';
import { useSessionInspector } from '../../hooks/useSessionInspector';

const SESSION_PRESET_KEYS = [
    'default_terminal',
    'active_show_page_tab',
    'projects_sort_option',
    'projects_sort_ascending'
];

export const SessionInspector: React.FC = () => {
    const {
        sessionKey,
        setSessionKey,
        sessionValue,
        newValueInput,
        setNewValueInput,
        isLoading,
        statusMsg,
        querySessionKey,
        saveSessionKey
    } = useSessionInspector();

    useEffect(() => {
        querySessionKey('default_terminal');
    }, []);

    return (
        <div>
            <div className="db-inspector-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Key size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        Session & Cache Storage Inspector
                    </h3>
                </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Query or update raw values stored in the SQLite session database using `getValueBySessionIdIPC` and `addOrUpdateBySessionIdIPC`.
            </p>

            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span className="api-input-label">Known Session Keys:</span>
                {SESSION_PRESET_KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        className={`db-table-pill ${sessionKey === key ? 'active' : ''}`}
                        onClick={() => {
                            setSessionKey(key);
                            querySessionKey(key);
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* Query Form */}
            <div className="api-editor-card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }} className="api-input-group">
                        <label className="api-input-label">Session ID / Key Name</label>
                        <input
                            type="text"
                            className="api-text-input"
                            value={sessionKey}
                            onChange={(e) => setSessionKey(e.target.value)}
                            placeholder="Enter session key..."
                        />
                    </div>
                    <button
                        type="button"
                        className="api-run-btn"
                        style={{ alignSelf: 'flex-end', height: '40px' }}
                        onClick={() => querySessionKey()}
                        disabled={isLoading}
                    >
                        <Search size={16} />
                        <span>{isLoading ? 'Querying...' : 'Query Session Key'}</span>
                    </button>
                </div>
            </div>

            {statusMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0dbc79', background: 'rgba(13,188,121,0.1)', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.875rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{statusMsg}</span>
                </div>
            )}

            {/* Value Editor & Inspector */}
            <div className="api-console-grid">
                <div className="api-editor-card">
                    <label className="api-input-label">Current Stored Value (Read Only)</label>
                    <pre className="api-response-viewer" style={{ minHeight: '160px' }}>
                        {sessionValue || '// No value loaded yet.'}
                    </pre>
                </div>

                <div className="api-editor-card">
                    <label className="api-input-label">Modify Stored Value</label>
                    <textarea
                        className="api-textarea"
                        style={{ minHeight: '160px' }}
                        value={newValueInput}
                        onChange={(e) => setNewValueInput(e.target.value)}
                        placeholder="Enter value to write to session database..."
                    />
                    <button
                        type="button"
                        className="api-run-btn"
                        onClick={saveSessionKey}
                        disabled={isLoading}
                    >
                        <Save size={16} />
                        <span>{isLoading ? 'Saving...' : 'Save Session Value'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionInspector;
