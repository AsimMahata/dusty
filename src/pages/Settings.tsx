import React, { useState } from 'react';
import { PageLayout } from '../components/layout/PageLayout';
import { invoke } from '@tauri-apps/api/core';
import { CMD_RESET_DATABASE, CMD_RESET_MEDIA_CACHE_TABLE, CMD_RESET_PROJECT_TABLE, CMD_RESET_SHOWS_TABLE } from '../constants/commands';
import { Database, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { logger } from '../utility/logger';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useSettings } from '../contexts/SettingsContext';
import { TYPE_GENERAL, TYPE_DATA, TITLE_GENERAL, TITLE_DATA } from '../constants/tabs';
import { COLORS } from '../constants/color';
import { PAGE_SECTION_PADDING, SETTINGS_SECTION_HEADER, DANGER_ZONE_CONTAINER, DANGER_ZONE_HEADER, DANGER_ZONE_TEXT, FLEX_COLUMN_GAP_24, SETTINGS_ITEM_CONTAINER, SETTINGS_ITEM_TITLE, SETTINGS_ITEM_DESC } from '../styles/layoutStyles';
import { getSettingsButtonStyle } from '../styles/buttonStyles';



export const Settings: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [activeTab, setActiveTab] = useState<typeof TYPE_GENERAL | typeof TYPE_DATA>(TYPE_GENERAL);
    const [isResetting, setIsResetting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isResettingProjects, setIsResettingProjects] = useState(false);
    const [showConfirmProjects, setShowConfirmProjects] = useState(false);
    const [showConfirmMedia, setShowConfirmMedia] = useState(false);
    const [isResettingShows, setIsResettingShows] = useState(false);
    const [isResettingMedia,setIsResettingMedia] = useState(false);
    const [showConfirmShows, setShowConfirmShows] = useState(false);

    const isAnyResetting = isResetting || isResettingProjects || isResettingShows;

    const executeResetData = async () => {
        setShowConfirm(false);
        setIsResetting(true);
        try {
            logger.info("requesting database reset");
            await invoke(CMD_RESET_DATABASE);
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
            await invoke(CMD_RESET_PROJECT_TABLE);
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
            await invoke(CMD_RESET_SHOWS_TABLE);
            alert("Shows table has been successfully reset. Please restart the app or refresh pages to see changes.");
        } catch (err) {
            logger.error(`Failed to reset shows table: ${String(err)}`);
            alert("Failed to reset shows table: " + String(err));
        } finally {
            setIsResettingShows(false);
        }
    };
    const executeResetMedia = async () => {
        setShowConfirmMedia(false);
        setIsResettingMedia(true);
        try {
            logger.info("requesting media_cache table reset");
            await invoke(CMD_RESET_MEDIA_CACHE_TABLE);
            alert("Media cache table has been successfully reset. Please restart the app or refresh pages to see changes.");
        } catch (err) {
            logger.error(`Failed to reset media_cache table: ${String(err)}`);
            alert("Failed to reset media_cache table: " + String(err));
        } finally {
            setIsResettingMedia(false);
        }
    };


    return (
        <PageLayout title="Settings" hideSearch showCloseButton>
            <div className="tabs-container">
                <button 
                    className={`tab-btn ${activeTab === TYPE_GENERAL ? 'active' : ''}`}
                    onClick={() => setActiveTab(TYPE_GENERAL)}
                >
                    {TITLE_GENERAL}
                </button>
                <button 
                    className={`tab-btn ${activeTab === TYPE_DATA ? 'active' : ''}`}
                    onClick={() => setActiveTab(TYPE_DATA)}
                >
                    {TITLE_DATA}
                </button>
            </div>

            <div className="tab-content">
                {activeTab === TYPE_DATA && (
                    <div style={PAGE_SECTION_PADDING}>
                        <h2 style={SETTINGS_SECTION_HEADER}>
                            <Database size={24} />
                            Data Management
                        </h2>
                        
                        <div style={DANGER_ZONE_CONTAINER}>
                            <h3 style={{ ...DANGER_ZONE_HEADER, color: COLORS.BASE.RED }}>
                                <AlertTriangle size={20} />
                                Danger Zone
                            </h3>
                            <p style={DANGER_ZONE_TEXT}>
                                Resetting the database will clear all cached information, including all banned shows and renamed titles. The application will rescan directories from scratch on the next launch.
                            </p>
                            
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <button 
                                    onClick={handleResetData}
                                    disabled={isAnyResetting}
                                    style={getSettingsButtonStyle(COLORS.BASE.RED, isAnyResetting)}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.RED_HOVER; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.RED; }}
                                >
                                    {isResetting ? 'Resetting...' : 'Reset All Data'}
                                </button>
                                
                                <button 
                                    onClick={() => setShowConfirmProjects(true)}
                                    disabled={isAnyResetting}
                                    style={getSettingsButtonStyle(COLORS.BASE.AMBER, isAnyResetting)}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.AMBER_HOVER; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.AMBER; }}
                                >
                                    {isResettingProjects ? 'Resetting...' : 'Reset Projects Only'}
                                </button>

                                <button 
                                    onClick={() => setShowConfirmShows(true)}
                                    disabled={isAnyResetting}
                                    style={getSettingsButtonStyle(COLORS.BASE.BLUE, isAnyResetting)}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.BLUE_HOVER; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.BLUE; }}
                                >
                                    {isResettingShows ? 'Resetting...' : 'Reset Shows Only'}
                                </button>
                                <button 
                                    onClick={() => setShowConfirmMedia(true)}
                                    disabled={isAnyResetting}
                                    style={getSettingsButtonStyle(COLORS.BASE.GREEN, isAnyResetting)}
                                    onMouseEnter={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.GREEN_HOVER; }}
                                    onMouseLeave={(e) => { if (!isAnyResetting) e.currentTarget.style.background = COLORS.BASE.GREEN; }}
                                >
                                    {isResettingMedia ? 'Resetting...' : 'Reset Media Cache Only'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === TYPE_GENERAL && (
                    <div style={PAGE_SECTION_PADDING}>
                        <h2 style={SETTINGS_SECTION_HEADER}>
                            <SettingsIcon size={24} />
                            General Preferences
                        </h2>

                        <div style={{ ...FLEX_COLUMN_GAP_24, maxWidth: '600px' }}>
                            <div style={SETTINGS_ITEM_CONTAINER}>
                                <div>
                                    <h4 style={SETTINGS_ITEM_TITLE}>Theme</h4>
                                    <p style={SETTINGS_ITEM_DESC}>Choose your preferred color scheme.</p>
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

                            <div style={SETTINGS_ITEM_CONTAINER}>
                                <div>
                                    <h4 style={SETTINGS_ITEM_TITLE}>Show Hidden Files</h4>
                                    <p style={SETTINGS_ITEM_DESC}>Display files and folders that start with a dot.</p>
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
            <ConfirmationModal 
                isOpen={showConfirmMedia}
                title="Reset Media Table"
                message="Are you sure you want to reset the media_cache table? This will erase all media metadata like pin states and ban statuses. This cannot be undone."
                onConfirm={executeResetMedia}
                onCancel={() => setShowConfirmMedia(false)}
                confirmText="Yes, reset Media"
                cancelText="Cancel"
                isDanger={true}
            />

        </PageLayout>
    );
};
