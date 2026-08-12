import React, { useEffect, useState } from 'react';
import { getMetadata } from '../../personalities/introverts/filesystem/filesystem';
import type { FileMetadata } from '../../personalities/ambiverts/filesystem';
import { formatBytes } from '../../utility/util';

interface FilePropertiesModalProps {
    isOpen: boolean;
    filePath: string | null;
    fileName?: string;
    onClose: () => void;
}

export const FilePropertiesModal: React.FC<FilePropertiesModalProps> = ({
    isOpen,
    filePath,
    fileName,
    onClose,
}) => {
    const [metadata, setMetadata] = useState<FileMetadata | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !filePath) {
            setMetadata(null);
            return;
        }

        let isMounted = true;
        setLoading(true);

        getMetadata(filePath)
            .then((data) => {
                if (isMounted) {
                    setMetadata(data);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setMetadata(null);
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, filePath]);

    if (!isOpen || !filePath) return null;

    const displayName = fileName || filePath.split(/[/\\]/).pop() || filePath;
    const ext = displayName.includes('.') ? displayName.split('.').pop()?.toUpperCase() : '';
    const fileType = metadata?.is_dir
        ? 'Folder'
        : ext
        ? `${ext} File`
        : 'File';

    const formattedSize = metadata ? formatBytes(metadata.size) : 'Unknown';
    const modifiedTime = metadata?.modified
        ? new Date(metadata.modified * 1000).toLocaleString()
        : 'Unknown';
    const createdTime = metadata?.created
        ? new Date(metadata.created * 1000).toLocaleString()
        : null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content file-properties-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Properties</h3>

                {loading ? (
                    <p className="modal-message">Loading properties...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '0.9rem' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>File Name</span>
                            <span style={{ color: 'var(--text-primary, #fff)', wordBreak: 'break-all', fontWeight: 500 }}>{displayName}</span>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Full Path</span>
                            <span style={{ color: 'var(--text-secondary, #d4d4d8)', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem' }}>{filePath}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>File Type</span>
                                <span style={{ color: 'var(--text-primary, #fff)' }}>{fileType}</span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>File Size</span>
                                <span style={{ color: 'var(--text-primary, #fff)' }}>{formattedSize}</span>
                            </div>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Modified Time</span>
                            <span style={{ color: 'var(--text-primary, #fff)' }}>{modifiedTime}</span>
                        </div>
                        {createdTime && (
                            <div>
                                <span style={{ color: 'var(--text-muted, #a1a1aa)', display: 'block', fontSize: '0.8rem', marginBottom: '2px' }}>Created Time</span>
                                <span style={{ color: 'var(--text-primary, #fff)' }}>{createdTime}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-confirm primary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
