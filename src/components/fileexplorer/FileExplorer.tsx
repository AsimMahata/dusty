import React, { useEffect, useState } from 'react';
import { ICONS } from '../../constants/icon';
import { COLORS } from '../../constants/color';
import './css/fileExplorer.css';
import { readDir, openFile } from '../../personalities/introverts/filesystem/filesystem';
import { getFileIcon } from './utility/getFileIcon';
import { sortFiles } from './utility/sortFiles';
import { getExplorerTitle } from './utility/getExplorerTitle';
import { formatBytes } from '../../utility/util';
import type { FileInfo } from "../../types/core";

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
                const dirFiles: FileInfo[] = await readDir(currentPath);
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
                    await openFile(file.path);
                } catch (err) {
                    console.error(`Failed to open file ${file.path}:`, err);
                }
            } else {
                setSelectedFile(file.path);
            }
        }
    };

    return (
        <div className={`${inline ? "file-explorer-inline" : "detail-page"} explorer-container ${inline ? "inline" : ""}`}>
            {!inline && (
                <div className="detail-header">
                    {(!isControlled || onBack) && (
                        <button className="back-btn" onClick={handleNavigateBack} title="Go back">
                            {ICONS.GENERAL.ARROW_LEFT}
                        </button>
                    )}
                    <div className="explorer-header-info">
                        <div className="detail-title explorer-title">
                            <span>{getExplorerTitle(title, pathHistory.length, currentPath)}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openFile(currentPath).catch(console.error);
                                }}
                                title="Reveal in File Explorer"
                                className="reveal-btn explorer-reveal-btn"
                            >
                                {ICONS.GENERAL.EXTERNAL_LINK}
                            </button>
                        </div>
                        <div className="detail-subtitle explorer-subtitle" title={currentPath}>
                            {currentPath}
                        </div>
                    </div>
                    {(!isControlled || onBack) && (
                        <button className="back-btn explorer-close-btn" onClick={onBack} title="Close Explorer">
                            {ICONS.GENERAL.X}
                        </button>
                    )}
                </div>
            )}

            <div className="list-container explorer-list-container">
                {loading ? (
                    <div className="loading">Loading directory...</div>
                ) : files.length === 0 ? (
                    <div className="explorer-empty-state">
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
