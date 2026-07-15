import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { Database, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { logger } from '../utility/logger';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useSettings } from '../contexts/SettingsContext';



export const Settings: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<'general' | 'data'>('general');
    const [isResetting, setIsResetting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isResettingProjects, setIsResettingProjects] = useState(false);
    const [showConfirmProjects, setShowConfirmProjects] = useState(false);
    const [isResettingShows, setIsResettingShows] = useState(false);
    const [showConfirmShows, setShowConfirmShows] = useState(false);

    const isAnyResetting = isResetting || isResettingProjects || isResettingShows;

    const executeResetData = async () => {
        setShowConfirm(false);
        setIsResetting(true);
        try {
            logger.info("requesting database reset");
            await invoke('reset_database');
            alert("Database has been successfully reset. Please restart the app or refresh pages to see changes.");
        } catch (err) {
            logger.error(`Failed to reset database: ${String(err)}`);
            alert("Failed to reset database: " + String(err));
        } finally {
            setIsResetting(false);
        }
    };

    const handleResetData = () => {
        setShowConfirm(true);
    };

    const executeResetProjects = async () => {
        setShowConfirmProjects(false);
        setIsResettingProjects(true);
        try {
            logger.info("requesting project table reset");
            await invoke('reset_project_table');
            alert("Project table has been successfully reset. Please restart the app or refresh pages to see changes.");
        } catch (err) {
            logger.error(`Failed to reset project table: ${String(err)}`);
            alert("Failed to reset project table: " + String(err));
        } finally {
            setIsResettingProjects(false);
        }
    };

    const executeResetShows = async () => {
        setShowConfirmShows(false);
        setIsResettingShows(true);
        try {
            logger.info("requesting shows table reset");
            await invoke('reset_shows_table');
            alert("Shows table has been successfully reset. Please restart the app or refresh pages to see changes.");
        } catch (err) {
            logger.error(`Failed to reset shows table: ${String(err)}`);
            alert("Failed to reset shows table: " + String(err));
        } finally {
            setIsResettingShows(false);
        }
    };

    return (
        <PageLayout title="Settings" hideSearch showCloseButton>
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    General
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                    onClick={() => setActiveTab('data')}
                >
                    Data
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'data' && (
                    <div style={{ padding: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            <Database size={24} />
                            Data Management
                        </h2>
                        
                        <div style={{ 
                            background: 'rgba(239, 68, 68, 0.05)', 
                            border: '1px solid rgba(239, 68, 68, 0.2)', 
                            borderRadius: '8px',
                            padding: '1.5rem',
                            maxWidth: '600px'
                        }}>
                            <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', fontWeight: 600 }}>
                                <AlertTriangle size={20} />
                                Danger Zone
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Resetting the database will clear all cached information, including all banned shows and renamed titles. The application will rescan directories from scratch on the next launch.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={handleResetData}
                                    disabled={isAnyResetting}
                                    style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '6px',
                                        fontWeight: 500,
                                        cursor: isAnyResetting ? 'not-allowed' : 'pointer',
                                        opacity: isAnyResetting ? 0.7 : 1,
                                        transition: 'background 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#dc2626'; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#ef4444'; }}
                                >
                                    {isResetting ? 'Resetting...' : 'Reset All Data'}
                                </button>
                                
                                <button 
                                    onClick={() => setShowConfirmProjects(true)}
                                    disabled={isAnyResetting}
                                    style={{
                                        background: '#f59e0b',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '6px',
                                        fontWeight: 500,
                                        cursor: isAnyResetting ? 'not-allowed' : 'pointer',
                                        opacity: isAnyResetting ? 0.7 : 1,
                                        transition: 'background 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#d97706'; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#f59e0b'; }}
                                >
                                    {isResettingProjects ? 'Resetting...' : 'Reset Projects Only'}
                                </button>

                                <button 
                                    onClick={() => setShowConfirmShows(true)}
                                    disabled={isAnyResetting}
                                    style={{
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '6px',
                                        fontWeight: 500,
                                        cursor: isAnyResetting ? 'not-allowed' : 'pointer',
                                        opacity: isAnyResetting ? 0.7 : 1,
                                        transition: 'background 0.2s',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#2563eb'; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = '#3b82f6'; }}
                                >
                                    {isResettingShows ? 'Resetting...' : 'Reset Shows Only'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'general' && (
                    <div style={{ padding: '1rem' }}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            <SettingsIcon size={24} />
                            General Preferences
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Theme</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose your preferred color scheme.</p>
                                </div>
                                <select 
                                    value={settings.theme}
                                    onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
                                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.5rem' }}
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Show Hidden Files</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Display files and folders that start with a dot.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={settings.showHiddenFiles}
                                    onChange={(e) => updateSettings({ showHiddenFiles: e.target.checked })}
                                    style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal 
                isOpen={showConfirm}
                title="Reset Database"
                message="Are you absolutely sure you want to reset the database? This will erase all shows, bans, and saved metadata. This cannot be undone."
                onConfirm={executeResetData}
                onCancel={() => setShowConfirm(false)}
                confirmText="Yes, reset all data"
                cancelText="Cancel"
                isDanger={true}
            />

            <ConfirmationModal 
                isOpen={showConfirmProjects}
                title="Reset Projects Table"
                message="Are you sure you want to reset the projects table? This will erase all project metadata like pin states and statuses. This cannot be undone."
                onConfirm={executeResetProjects}
                onCancel={() => setShowConfirmProjects(false)}
                confirmText="Yes, reset projects"
                cancelText="Cancel"
                isDanger={true}
            />

            <ConfirmationModal 
                isOpen={showConfirmShows}
                title="Reset Shows Table"
                message="Are you sure you want to reset the shows table? This will erase all show metadata like pin states and ban statuses. This cannot be undone."
                onConfirm={executeResetShows}
                onCancel={() => setShowConfirmShows(false)}
                confirmText="Yes, reset shows"
                cancelText="Cancel"
                isDanger={true}
            />
        </PageLayout>
    );
};
