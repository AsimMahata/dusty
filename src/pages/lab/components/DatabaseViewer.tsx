import React, { useEffect } from 'react';
import { useDatabaseViewer } from '../hooks/useDatabaseViewer';

export const DatabaseViewer: React.FC = () => {
    const { data, isLoading, error, fetchData } = useDatabaseViewer();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const truncate = (val: any) => {
        if (val === null || val === undefined) return 'null';
        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        const s = String(val);
        return s.length > 15 ? s.substring(0, 15) + '...' : s;
    };

    return (
        <div className="lab-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="lab-section-title" style={{ margin: 0 }}>Database Contents</h2>
                <button className="lab-button" onClick={fetchData} disabled={isLoading}>
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
            
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}
            
            <div className="db-tables-container">
                {Object.entries(data).map(([tableName, rows]) => (
                    <div key={tableName} className="lab-result-container" style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
                        <h3 className="lab-result-title" style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            {tableName} <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>({rows.length} rows)</span>
                        </h3>
                        {rows.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr>
                                        {Object.keys(rows[0]).map(col => (
                                            <th key={col} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).map((val, j) => (
                                                <td key={j} title={String(val ?? 'null')} style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap' }}>
                                                    {truncate(val)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ color: 'var(--text-secondary)' }}>No data in this table.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
