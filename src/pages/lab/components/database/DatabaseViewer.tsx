import React, { useEffect, useState } from 'react';
import { RefreshCw, Search, Table, Eye } from 'lucide-react';
import { useDatabaseViewer } from '../../hooks/useDatabaseViewer';

export const DatabaseViewer: React.FC = () => {
    const { data, isLoading, error, fetchData } = useDatabaseViewer();
    const [selectedTable, setSelectedTable] = useState<string>('');
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const tableNames = Object.keys(data);

    useEffect(() => {
        if (tableNames.length > 0 && !selectedTable) {
            setSelectedTable(tableNames[0]);
        }
    }, [tableNames, selectedTable]);

    const activeRows = selectedTable ? (data[selectedTable] || []) : [];

    const filteredRows = activeRows.filter(row => {
        if (!searchFilter.trim()) return true;
        const query = searchFilter.toLowerCase();
        return Object.values(row).some(val =>
            String(val ?? '').toLowerCase().includes(query)
        );
    });

    const truncate = (val: any) => {
        if (val === null || val === undefined) return 'null';
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        const s = String(val);
        return s.length > 25 ? s.substring(0, 25) + '...' : s;
    };

    return (
        <div>
            {/* Header controls */}
            <div className="db-inspector-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Table size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        SQLite Tables Inspector
                    </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filter table rows..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="api-text-input"
                            style={{ paddingLeft: '32px', height: '34px', fontSize: '0.8125rem', width: '220px' }}
                        />
                    </div>

                    <button
                        type="button"
                        className="api-run-btn"
                        style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                        onClick={fetchData}
                        disabled={isLoading}
                    >
                        <RefreshCw size={14} className={isLoading ? 'spin-animation' : ''} />
                        <span>{isLoading ? 'Refreshing...' : 'Refresh Tables'}</span>
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ color: '#f14c4c', background: 'rgba(241,76,76,0.1)', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.875rem' }}>
                    Error loading database tables: {error}
                </div>
            )}

            {/* Table Selection Pills */}
            <div className="db-tables-pills">
                {tableNames.map((tbl) => (
                    <button
                        key={tbl}
                        type="button"
                        className={`db-table-pill ${selectedTable === tbl ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedTable(tbl);
                            setSelectedRow(null);
                        }}
                    >
                        {tbl} ({data[tbl]?.length || 0})
                    </button>
                ))}
            </div>

            {/* Data Grid */}
            {selectedTable ? (
                <div>
                    <div className="db-table-wrapper" style={{ maxHeight: '360px' }}>
                        {filteredRows.length > 0 ? (
                            <table className="db-data-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}>Action</th>
                                        {Object.keys(filteredRows[0]).map(col => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>
                                                <button
                                                    type="button"
                                                    style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex' }}
                                                    onClick={() => setSelectedRow(row)}
                                                    title="View Full JSON"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                            </td>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} title={String(val ?? 'null')}>
                                                    {truncate(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No rows found matching filter in table "{selectedTable}".
                            </div>
                        )}
                    </div>

                    {/* Selected Row Modal Inspector */}
                    {selectedRow && (
                        <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span className="api-input-label">Row Object Inspector</span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRow(null)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                            </div>
                            <pre className="api-response-viewer" style={{ maxHeight: '180px' }}>
                                {JSON.stringify(selectedRow, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Loading database tables...
                </div>
            )}
        </div>
    );
};

export default DatabaseViewer;
