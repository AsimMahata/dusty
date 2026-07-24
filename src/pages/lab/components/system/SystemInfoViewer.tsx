import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Server, RefreshCw, Search } from 'lucide-react';
import { getSystemInfo } from '../../../../personalities/introverts/system/system';
import type { SystemInfoData } from '../../../home/types/types';

export const SystemInfoViewer: React.FC = () => {
    const [systemData, setSystemData] = useState<SystemInfoData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [procSearch, setProcSearch] = useState<string>('');

    const fetchInfo = async () => {
        setIsLoading(true);
        try {
            const info = await getSystemInfo();
            setSystemData(info);
        } catch (err) {
            console.error("Failed to load system info", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    if (!systemData) {
        return (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Fetching system environment metrics...
            </div>
        );
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const memUsedPercent = systemData.total_memory > 0
        ? Math.round((systemData.used_memory / systemData.total_memory) * 100)
        : 0;

    const filteredProcesses = systemData.processes.filter(p => {
        if (!procSearch.trim()) return true;
        const q = procSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || String(p.pid).includes(q);
    });

    return (
        <div>
            {/* Control Bar */}
            <div className="db-inspector-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Server size={20} style={{ color: 'var(--accent)' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>
                        Hardware & Environment Monitor
                    </h3>
                </div>

                <button
                    type="button"
                    className="api-run-btn"
                    style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                    onClick={fetchInfo}
                    disabled={isLoading}
                >
                    <RefreshCw size={14} className={isLoading ? 'spin-animation' : ''} />
                    <span>{isLoading ? 'Refreshing...' : 'Refresh Metrics'}</span>
                </button>
            </div>

            {/* Overview Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        <Server size={16} />
                        <span>System OS</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {systemData.os_version || 'Unknown OS'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Host: {systemData.hostname || 'localhost'} | Uptime: {Math.round(systemData.uptime / 60)} mins
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        <Cpu size={16} />
                        <span>RAM Memory Usage</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatBytes(systemData.used_memory)} / {formatBytes(systemData.total_memory)} ({memUsedPercent}%)
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${memUsedPercent}%`, background: memUsedPercent > 85 ? '#f14c4c' : 'var(--accent)' }} />
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        <HardDrive size={16} />
                        <span>Disks Tracked</span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {systemData.disks.length} Drives Mounted
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        CPUs: {systemData.cpus.length} cores active
                    </div>
                </div>
            </div>

            {/* Disks List */}
            <h4 className="api-input-label" style={{ marginBottom: '8px' }}>Mounted Storage Disks</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {systemData.disks.map((disk, idx) => {
                    const used = disk.total_space - disk.available_space;
                    const pct = disk.total_space > 0 ? Math.round((used / disk.total_space) * 100) : 0;
                    return (
                        <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                                <strong style={{ color: 'var(--text-primary)' }}>{disk.name} ({disk.file_system})</strong>
                                <span style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                {formatBytes(used)} used of {formatBytes(disk.total_space)}
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: '#0dbc79' }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Process List */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 className="api-input-label" style={{ margin: 0 }}>Top Active Processes ({filteredProcesses.length})</h4>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search processes..."
                        value={procSearch}
                        onChange={(e) => setProcSearch(e.target.value)}
                        className="api-text-input"
                        style={{ paddingLeft: '32px', height: '30px', fontSize: '0.75rem', width: '180px' }}
                    />
                </div>
            </div>

            <div className="db-table-wrapper" style={{ maxHeight: '220px' }}>
                <table className="db-data-table">
                    <thead>
                        <tr>
                            <th>PID</th>
                            <th>Process Name</th>
                            <th>Memory Usage</th>
                            <th>CPU Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcesses.slice(0, 50).map((proc, idx) => (
                            <tr key={idx}>
                                <td style={{ fontFamily: 'monospace' }}>{proc.pid}</td>
                                <td>{proc.name}</td>
                                <td>{formatBytes(proc.memory)}</td>
                                <td>{proc.cpu_usage.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SystemInfoViewer;
