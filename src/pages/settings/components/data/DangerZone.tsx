import React from 'react';
import { ConfirmationModal } from '../../../../components/ui/ConfirmationModal';
import { useDangerZone } from './hooks/useDangerZone';
import { getResetActions } from '../../actions/getResetActions';
import { SETTINGS_DANGER_ICON } from '../../../../constants/icon';
import { invoke } from '@tauri-apps/api/core';
import { CMD_GET_ALL_TABLES, CMD_RESET_TABLE, CMD_RESYNC_TABLE } from '../../../../constants/commands';
import { logger } from '../../../../utility/logger';
import toast from 'react-hot-toast';

export const DangerZone: React.FC = () => {
    const {
        activeModalId,
        setActiveModalId,
        resettingId,
        isAnyResetting,
        executeReset
    } = useDangerZone();

    const [tables, setTables] = React.useState<string[]>([]);

    React.useEffect(() => {
        const fetchTables = async () => {
            try {
                const fetchedTables = await invoke<string[]>(CMD_GET_ALL_TABLES);
                setTables(fetchedTables);
            } catch (err) {
                logger.error(`Failed to fetch tables: ${String(err)}`);
            }
        };
        fetchTables();
    }, []);

    const handleResetTable = async (tableName: string) => {
        if (!window.confirm(`Are you sure you want to reset the table: ${tableName}? All data in it will be lost.`)) return;
        try {
            await invoke(CMD_RESET_TABLE, { tableName });
            toast.success(`Successfully reset table: ${tableName}`);
        } catch (err) {
            toast.error(`Failed to reset table ${tableName}: ${String(err)}`);
        }
    };

    const handleResyncTable = async (tableName: string) => {
        try {
            await invoke(CMD_RESYNC_TABLE, { tableName });
            toast.success(`Resync initiated for table: ${tableName}`);
        } catch (err) {
            toast.error(`Failed to resync table ${tableName}: ${String(err)}`);
        }
    };

    const RESET_ACTIONS = getResetActions();
    const activeConfig = RESET_ACTIONS.find(action => action.id === activeModalId);

    return (
        <div className="settings-danger-zone-container">
            <h3 className="settings-danger-zone-header">
                {SETTINGS_DANGER_ICON}
                Danger Zone
            </h3>
            <p className="settings-danger-zone-text">
                Resetting the database will clear all cached information, including all banned shows and renamed titles. The application will rescan directories from scratch on the next launch.
            </p>
            
            <div className="settings-danger-buttons-container">
                {RESET_ACTIONS.map(action => (
                    <button 
                        key={action.id}
                        onClick={() => setActiveModalId(action.id)}
                        disabled={isAnyResetting}
                        className={`settings-button ${action.buttonClass}`}
                    >
                        {resettingId === action.id ? action.resettingLabel : action.buttonLabel}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>Individual Table Controls</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tables.map(table => (
                        <div key={table} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{table}</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    className="settings-button settings-button-blue"
                                    onClick={() => handleResyncTable(table)}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                >
                                    Resync Table
                                </button>
                                <button 
                                    className="settings-button settings-button-red"
                                    onClick={() => handleResetTable(table)}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                >
                                    Reset Table
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeConfig && (
                <ConfirmationModal 
                    isOpen={true}
                    title={activeConfig.modalTitle}
                    message={activeConfig.modalMessage}
                    onConfirm={() => executeReset(activeConfig)}
                    onCancel={() => setActiveModalId(null)}
                    confirmText={activeConfig.confirmText}
                    cancelText="Cancel"
                    isDanger={true}
                />
            )}
        </div>
    );
};
