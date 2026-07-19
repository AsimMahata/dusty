import React from 'react';
import { useDusty } from '../../../contexts/DustyContext';

export const SystemInfoViewer: React.FC = () => {
    const { systemData } = useDusty();

    if (!systemData) {
        return <div style={{ color: 'var(--text-secondary)' }}>Loading System Data...</div>;
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>System Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>General</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>OS:</strong> {systemData.os_version || 'Unknown'}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Hostname:</strong> {systemData.hostname || 'Unknown'}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Uptime:</strong> {systemData.uptime} seconds</p>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Memory</h4>
                    <p style={{ margin: '0.25rem 0' }}><strong>Total:</strong> {formatBytes(systemData.total_memory)}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Used:</strong> {formatBytes(systemData.used_memory)}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Swap:</strong> {formatBytes(systemData.used_swap)} / {formatBytes(systemData.total_swap)}</p>
                </div>
            </div>

            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Disks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                {systemData.disks.map((disk, idx) => (
                    <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <strong>{disk.name}</strong> ({disk.file_system}) - {formatBytes(disk.total_space - disk.available_space)} / {formatBytes(disk.total_space)} used
                    </div>
                ))}
            </div>

            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CPUs ({systemData.cpus.length})</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '2rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                {systemData.cpus.map((cpu, idx) => (
                    <div key={idx} style={{ fontSize: '0.85rem', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
                        {cpu.name}: {cpu.cpu_usage.toFixed(1)}% @ {cpu.frequency} MHz
                    </div>
                ))}
            </div>

            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Top 50 Processes</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '4px' }}>
                <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '0.5rem' }}>PID</th>
                            <th style={{ padding: '0.5rem' }}>Name</th>
                            <th style={{ padding: '0.5rem' }}>Memory</th>
                            <th style={{ padding: '0.5rem' }}>CPU</th>
                        </tr>
                    </thead>
                    <tbody>
                        {systemData.processes.map((proc, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{proc.pid}</td>
                                <td style={{ padding: '0.5rem' }}>{proc.name}</td>
                                <td style={{ padding: '0.5rem' }}>{formatBytes(proc.memory)}</td>
                                <td style={{ padding: '0.5rem' }}>{proc.cpu_usage.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
