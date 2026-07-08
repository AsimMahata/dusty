import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { 
    ArrowLeft, 
    Folder as FolderIcon, 
    File as FileIcon, 
    ExternalLink,
    FileJson,
    FileCog,
    FileCode2,
    FileText,
    FileImage,
    FileAudio,
    FileVideo,
    FileArchive,
    Zap,
    X
} from 'lucide-react';
import type { FileInfo } from '../types/types';
import { formatSize } from '../utility/util';

interface FileExplorerProps {
    initialPath: string;
    title?: string;
    onBack: () => void;
}

const getFileIcon = (filename: string, is_dir: boolean) => {
    if (is_dir) {
        return <FolderIcon size={18} color="#dcb67a" className="folder-icon" />;
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    const lowerName = filename.toLowerCase();


    if (lowerName === 'package.json' || lowerName === 'package-lock.json' || ext === 'json') {
        return <FileJson size={18} color="#c1bd66" />;
    }
    if (lowerName === '.gitignore' || lowerName === '.env' || lowerName.includes('config')) {
        return <FileCog size={18} color="#8a8a8a" />;
    }
    if (lowerName.includes('readme') || ext === 'md') {
        return <FileText size={18} color="#4589b2" />;
    }
    if (lowerName.includes('vite')) {
        return <Zap size={18} color="#8176ff" />;
    }


    switch (ext) {
        case 'html': return <FileCode2 size={18} color="#e34c26" />;
        case 'css': return <FileCode2 size={18} color="#264de4" />;
        case 'js': 
        case 'jsx': return <FileCode2 size={18} color="#f0db4f" />;
        case 'ts': 
        case 'tsx': return <FileCode2 size={18} color="#007acc" />;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
        case 'gif': return <FileImage size={18} color="#42a5f5" />;
        case 'mp3':
        case 'wav': return <FileAudio size={18} color="#ef5350" />;
        case 'mp4':
        case 'mkv': return <FileVideo size={18} color="#ab47bc" />;
        case 'zip':
        case 'tar':
        case 'gz': return <FileArchive size={18} color="#ffb300" />;
        default: return <FileIcon size={18} color="#a0a0a0" />;
    }
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ initialPath, title, onBack }) => {
    const [pathHistory, setPathHistory] = useState<string[]>([initialPath]);
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const currentPath = pathHistory[pathHistory.length - 1];

    useEffect(() => {
        let cancelled = false;

        const loadDir = async () => {
            setLoading(true);
            setSelectedFile(null);
            try {
                const dirFiles: FileInfo[] = await invoke('read_dir', { path: currentPath });
                if (!cancelled) {
                    const sortedFiles = dirFiles.sort((a, b) => {
                        if (a.is_dir && !b.is_dir) return -1;
                        if (!a.is_dir && b.is_dir) return 1;
                        return a.name.localeCompare(b.name, undefined, { numeric: true });
                    });
                    setFiles(sortedFiles);
                }
            } catch (err) {
                console.error(`Error reading directory ${currentPath}:`, err);
                if (!cancelled) setFiles([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadDir();

        return () => {
            cancelled = true;
        };
    }, [currentPath]);

    const handleNavigateBack = () => {
        if (pathHistory.length > 1) {
            setPathHistory((prev) => prev.slice(0, -1));
        } else {
            onBack();
        }
    };

    const handleItemClick = async (file: FileInfo) => {
        if (file.is_dir) {
            setPathHistory((prev) => [...prev, file.path]);
        } else {
            if (selectedFile === file.path) {
                try {
                    await invoke('open_file', { path: file.path });
                } catch (err) {
                    console.error(`Failed to open file ${file.path}:`, err);
                }
            } else {
                setSelectedFile(file.path);
            }
        }
    };

    return (
        <div className="detail-page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="detail-header">
                <button className="back-btn" onClick={handleNavigateBack} title="Go back">
                    <ArrowLeft size={20} />
                </button>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div className="detail-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{title && pathHistory.length === 1 ? title : currentPath.split(/[/\\]/).filter(Boolean).pop() || 'File Explorer'}</span>
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                invoke('open_file', { path: currentPath }).catch(console.error); 
                            }}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                padding: '4px', 
                                display: 'flex', 
                                color: 'var(--text-secondary)' 
                            }}
                            title="Reveal in File Explorer"
                            className="reveal-btn"
                        >
                            <ExternalLink size={16} />
                        </button>
                    </div>
                    <div className="detail-subtitle" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={currentPath}>
                        {currentPath}
                    </div>
                </div>
                <button className="back-btn" onClick={onBack} title="Close Explorer" style={{ marginLeft: 'auto' }}>
                    <X size={20} />
                </button>
            </div>

            <div className="list-container" style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div className="loading">Loading directory...</div>
                ) : files.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        This folder is empty.
                    </div>
                ) : (
                    files.map((file, i) => (
                        <div
                            key={`${file.path}-${i}`}
                            className={`list-item ${selectedFile === file.path ? 'selected' : ''}`}
                            style={selectedFile === file.path ? { background: 'rgba(255, 255, 255, 0.08)' } : {}}
                            onClick={() => handleItemClick(file)}
                        >
                            <div className="list-item-icon">
                                {getFileIcon(file.name, file.is_dir)}
                            </div>

                            <div className="list-item-content">
                                <div className="list-item-title">{file.name}</div>
                            </div>

                            <div className="list-item-meta">
                                {!file.is_dir && formatSize(file.size)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
