import React from 'react';
import { useConfigInspector } from '../../hooks/useConfigInspector';
import { COLORS } from '../../../../constants/color';

const KNOWN_CONFIG_KEYS = [
    { key: 'default_terminal', label: 'Default Terminal', desc: 'Selected system terminal application' },
    { key: 'active_show_page_tab', label: 'Active Show Tab', desc: 'Last active tab on Shows page' },
    { key: 'show_page_sort_method', label: 'Shows Sort Method', desc: 'Current sort criterion for Shows' },
    { key: 'show_page_sort_ascending', label: 'Shows Sort Direction', desc: 'Ascending / Descending sort flag' },
    { key: 'show_page_is_grid_layout', label: 'Shows Grid Layout', desc: 'Grid view toggle state' },
    { key: 'todo_page_sort_method', label: 'Todo Sort Method', desc: 'Sort criteria for Todo list' },
    { key: 'todo_page_sort_direction', label: 'Todo Sort Direction', desc: 'Ascending or Descending' },
    { key: 'projects_page_sort_option', label: 'Projects Sort Option', desc: 'Current sort mode for Projects' },
    { key: 'projects_page_sort_ascending', label: 'Projects Sort Ascending', desc: 'Sort order for Projects' },
    { key: 'zip_page_sort_mode', label: 'Zip Page Sort Mode', desc: 'Sorting mode for Zip files' },
    { key: 'pdf_page_sort_mode', label: 'PDF Page Sort Mode', desc: 'Sorting mode for PDF files' },
    { key: 'misc_page_sort_mode', label: 'Misc Page Sort Mode', desc: 'Sorting mode for Misc files' },
    { key: 'media_sources_page_sort_method', label: 'Media Sources Sort', desc: 'Sort method for Media Sources' },
    { key: 'media_sources_page_sort_ascending', label: 'Media Sources Ascending', desc: 'Sort order for Media Sources' },
    { key: 'media_list_page_sort_mode', label: 'Media List Sort Mode', desc: 'Sort mode for Media List' },
];

export const ConfigInspector: React.FC = () => {
    const {
        configKey,
        setConfigKey,
        configValue,
        newValueInput,
        setNewValueInput,
        isLoading,
        statusMsg,
        queryConfigKey,
        saveConfigKey
    } = useConfigInspector();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
                padding: '16px 20px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
            }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>
                    User Configuration Inspector
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Query or update raw values stored in user configuration (`~/.dusty/user/config`) using `getConfigValueIPC` and `addOrUpdateConfigValueIPC`.
                </p>
            </div>

            {/* Presets Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '10px'
            }}>
                {KNOWN_CONFIG_KEYS.map(item => (
                    <button
                        key={item.key}
                        onClick={() => {
                            setConfigKey(item.key);
                            queryConfigKey(item.key);
                        }}
                        style={{
                            padding: '10px 14px',
                            textAlign: 'left',
                            borderRadius: '6px',
                            backgroundColor: configKey === item.key ? COLORS.TRANSPARENT.ACCENT_15 : 'var(--bg-card)',
                            border: `1px solid ${configKey === item.key ? 'var(--accent)' : 'var(--border-color)'}`,
                            color: configKey === item.key ? 'var(--accent)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{item.key}</div>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>{item.label}</div>
                    </button>
                ))}
            </div>

            {/* Active Key Inspector / Editor */}
            <div style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        value={configKey}
                        onChange={(e) => setConfigKey(e.target.value)}
                        placeholder="Enter config key..."
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '6px',
                            backgroundColor: COLORS.TRANSPARENT.BLACK_20,
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '13px'
                        }}
                    />
                    <button
                        onClick={() => queryConfigKey()}
                        disabled={isLoading}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--accent)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1
                        }}
                    >
                        Query
                    </button>
                </div>

                {statusMsg && (
                    <div style={{
                        fontSize: '12px',
                        color: statusMsg.includes('Failed') ? COLORS.LAB.RED : COLORS.LAB.GREEN,
                        fontFamily: 'monospace'
                    }}>
                        {statusMsg}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Read Value Display */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Current Value (Read-Only)
                        </label>
                        <pre style={{
                            margin: 0,
                            padding: '12px',
                            borderRadius: '6px',
                            backgroundColor: COLORS.TRANSPARENT.BLACK_30,
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            height: '180px',
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}>
                            {configValue || '// Click Query to fetch current value'}
                        </pre>
                    </div>

                    {/* New Value Editor */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            New Value (JSON or String)
                        </label>
                        <textarea
                            value={newValueInput}
                            onChange={(e) => setNewValueInput(e.target.value)}
                            placeholder='Enter new raw JSON string value...'
                            rows={8}
                            style={{
                                margin: 0,
                                padding: '12px',
                                borderRadius: '6px',
                                backgroundColor: COLORS.TRANSPARENT.BLACK_20,
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                height: '180px',
                                resize: 'none'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={saveConfigKey}
                        disabled={isLoading || !configKey.trim()}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '6px',
                            backgroundColor: COLORS.LAB.GREEN,
                            color: '#fff',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: (isLoading || !configKey.trim()) ? 'not-allowed' : 'pointer',
                            opacity: (isLoading || !configKey.trim()) ? 0.6 : 1
                        }}
                    >
                        Save Configuration Value
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigInspector;

