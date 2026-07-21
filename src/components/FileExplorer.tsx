import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { ICONS } from '../constants/icon';
import { COLORS } from '../constants/color';
import { EXPLORER } from '../styles/fileExplorerStyles';
import { CMD_READ_DIR, CMD_OPEN_FILE } from '../constants/commands';
import { getFileIcon } from '../utility/fileExplorer/getFileIcon';
import { sortFiles } from '../utility/fileExplorer/sortFiles';
import { getExplorerTitle } from '../utility/fileExplorer/getExplorerTitle';
import { formatBytes } from '../utility/util';
import type { FileInfo } from "../types/media";

interface FileExplorerProps {
    initialPath?: string;
    files?: FileInfo[];
    currentPath?: string;
    title?: string;
    onBack?: () => void;
    onItemClick?: (file: FileInfo) => void;
    loading?: boolean;
    inline?: boolean;
}



export const FileExplorer: React.FC<FileExplorerProps> = ({ 
    initialPath, 
    files: controlledFiles,
    currentPath: controlledPath,
    title, 
    onBack,
    onItemClick: controlledItemClick,
    loading: controlledLoading,
    inline = false
}) => {
    const [pathHistory, setPathHistory] = useState<string[]>(initialPath ? [initialPath] : []);
    const [internalFiles, setInternalFiles] = useState<FileInfo[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const isControlled = controlledFiles !== undefined;
    const currentPath = controlledPath !== undefined 
        ? controlledPath 
        : (pathHistory.length > 0 ? pathHistory[pathHistory.length - 1] : '');
    
    const files = isControlled ? controlledFiles : internalFiles;
    const loading = controlledLoading !== undefined ? controlledLoading : internalLoading;

    useEffect(() => {
        if (isControlled || !currentPath) return;

        let cancelled = false;

        const loadDir = async () => {
            setInternalLoading(true);
            setSelectedFile(null);
            try {
                const dirFiles: FileInfo[] = await invoke(CMD_READ_DIR, { path: currentPath });
                if (!cancelled) {
                    const sorted = sortFiles(dirFiles);
                    setInternalFiles(sorted);
                }
            } catch (err) {
                console.error(`Error reading directory ${currentPath}:`, err);
                if (!cancelled) setInternalFiles([]);
            } finally {
                if (!cancelled) setInternalLoading(false);
            }
        };

        loadDir();

        return () => {
            cancelled = true;
        };
    }, [currentPath, isControlled]);

    const handleNavigateBack = () => {
        if (!isControlled && pathHistory.length > 1) {
            setPathHistory((prev) => prev.slice(0, -1));
        } else if (onBack) {
            onBack();
        }
    };

    const handleItemClick = async (file: FileInfo) => {
        if (controlledItemClick) {
            controlledItemClick(file);
            return;
        }

        if (file.is_dir) {
            setPathHistory((prev) => [...prev, file.path]);
        } else {
            if (selectedFile === file.path) {
                try {
                    await invoke(CMD_OPEN_FILE, { path: file.path });
                } catch (err) {
                    console.error(`Failed to open file ${file.path}:`, err);
                }
            } else {
                setSelectedFile(file.path);
            }
        }
    };

    return (
        <div className={inline ? "file-explorer-inline" : "detail-page"} style={inline ? { ...EXPLORER.CONTAINER, height: '100%', overflow: 'hidden' } : EXPLORER.CONTAINER}>
            {!inline && (
                <div className="detail-header">
                    {(!isControlled || onBack) && (
                        <button className="back-btn" onClick={handleNavigateBack} title="Go back">
                            {ICONS.GENERAL.ARROW_LEFT}
                        </button>
                    )}
                    <div style={EXPLORER.HEADER_INFO}>
                        <div className="detail-title" style={EXPLORER.TITLE}>
                            <span>{getExplorerTitle(title, pathHistory.length, currentPath)}</span>
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    invoke(CMD_OPEN_FILE, { path: currentPath }).catch(console.error); 
                                }}
                                style={EXPLORER.REVEAL_BTN}
                                title="Reveal in File Explorer"
                                className="reveal-btn"
                            >
                                {ICONS.GENERAL.EXTERNAL_LINK}
                            </button>
                        </div>
                        <div className="detail-subtitle" style={EXPLORER.SUBTITLE} title={currentPath}>
                            {currentPath}
                        </div>
                    </div>
                    {(!isControlled || onBack) && (
                        <button className="back-btn" onClick={onBack} title="Close Explorer" style={EXPLORER.CLOSE_BTN}>
                            {ICONS.GENERAL.X}
                        </button>
                    )}
                </div>
            )}

            <div className="list-container" style={EXPLORER.LIST_CONTAINER}>
                {loading ? (
                    <div className="loading">Loading directory...</div>
                ) : files.length === 0 ? (
                    <div style={EXPLORER.EMPTY_STATE}>
                        This folder is empty.
                    </div>
                ) : (
                    files.map((file, i) => (
                        <div
                            key={`${file.path}-${i}`}
                            className={`list-item ${selectedFile === file.path ? 'selected' : ''}`}
                            style={selectedFile === file.path ? { background: COLORS.TRANSPARENT.WHITE_08 } : {}}
                            onClick={() => handleItemClick(file)}
                        >
                            <div className="list-item-icon">
                                {getFileIcon(file.name, file.is_dir)}
                            </div>

                            <div className="list-item-content">
                                <div className="list-item-title">{file.name}</div>
                            </div>

                            <div className="list-item-meta">
                                {!file.is_dir && formatBytes(file.size)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
